import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')

    let query = supabase
      .from('generations')
      .select('id, created_at, input_json, scheduled_at')
      .eq('user_id', user.id)
      .not('scheduled_at', 'is', null)
      .order('scheduled_at', { ascending: true })

    if (month) {
      const [year, mon] = month.split('-').map(Number)
      const start = new Date(year, mon - 1, 1).toISOString()
      const end = new Date(year, mon, 0, 23, 59, 59).toISOString()
      query = query.gte('scheduled_at', start).lte('scheduled_at', end)
    }

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ schedule: data })
  } catch (error) {
    console.error('[/api/schedule]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
