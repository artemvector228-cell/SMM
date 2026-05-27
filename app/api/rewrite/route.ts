import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateAllContent } from '@/lib/prompts/master-prompt'
import { GenerateInput } from '@/lib/validations'
import { Tone } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { generation_id, tone, cta_strength } = body

    const { data: original } = await supabase
      .from('generations')
      .select('*')
      .eq('id', generation_id)
      .eq('user_id', user.id)
      .single()

    if (!original) {
      return NextResponse.json({ error: 'Generation not found' }, { status: 404 })
    }

    const modifiedInput: GenerateInput = {
      ...original.input_json,
      tone: (tone as Tone) ?? original.input_json.tone,
    }

    const output = await generateAllContent(modifiedInput)

    const { data: newGeneration, error } = await supabase
      .from('generations')
      .insert({
        user_id: user.id,
        input_json: modifiedInput,
        output_json: output,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ generation: newGeneration })
  } catch (error) {
    console.error('[/api/rewrite]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
