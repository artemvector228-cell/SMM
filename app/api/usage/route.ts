import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PLAN_LIMITS } from '@/types'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, generations_used')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const limit = PLAN_LIMITS[profile.plan as keyof typeof PLAN_LIMITS]

    return NextResponse.json({
      plan: profile.plan,
      generations_used: profile.generations_used,
      max_generations: limit.maxGenerations,
      remaining: limit.maxGenerations === null ? null : limit.maxGenerations - profile.generations_used,
    })
  } catch (error) {
    console.error('[/api/usage]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
