import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateSchema } from '@/lib/validations'
import { generateAllContent } from '@/lib/prompts/master-prompt'
import { PLAN_LIMITS } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Auto-create profile if missing (user registered before trigger was set up)
    if (!profile) {
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({ id: user.id, email: user.email!, plan: 'free', generations_used: 0 })
        .select()
        .single()

      if (createError) {
        return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
      }
      profile = newProfile
    }

    const isOwner = user.email === 'artemvector228@gmail.com'
    if (!isOwner) {
      const planKey = (profile.plan && PLAN_LIMITS[profile.plan as keyof typeof PLAN_LIMITS]) ? profile.plan : 'free'
      const limit = PLAN_LIMITS[planKey as keyof typeof PLAN_LIMITS]
      if (limit.maxGenerations !== null && profile.generations_used >= limit.maxGenerations) {
        return NextResponse.json(
          { error: 'Лимит генераций исчерпан', upgrade: true },
          { status: 403 }
        )
      }
    }

    const body = await request.json()
    const validation = generateSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Неверный формат данных', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    const output = await generateAllContent(validation.data)

    const { data: generation, error: genError } = await supabase
      .from('generations')
      .insert({
        user_id: user.id,
        input_json: validation.data,
        output_json: output,
      })
      .select()
      .single()

    if (genError) throw genError

    await supabase
      .from('profiles')
      .update({ generations_used: profile.generations_used + 1 })
      .eq('id', user.id)

    return NextResponse.json({ generation })
  } catch (error) {
    console.error('[/api/generate]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
