import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: generations, error } = await supabase
      .from('generations')
      .select('input_json, output_json, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) throw error

    if (!generations || generations.length === 0) {
      return NextResponse.json({ empty: true })
    }

    // Breakdown by conversion goal
    const goalCounts: Record<string, number> = {}
    const toneCounts: Record<string, number> = {}
    const nicheCounts: Record<string, number> = {}
    const dailyCounts: Record<string, number> = {}

    for (const g of generations) {
      const goal = g.input_json.conversion_goal ?? 'unknown'
      const tone = g.input_json.tone ?? 'unknown'
      const niche = g.input_json.niche ?? 'unknown'
      const day = new Date(g.created_at).toISOString().slice(0, 10)

      goalCounts[goal] = (goalCounts[goal] ?? 0) + 1
      toneCounts[tone] = (toneCounts[tone] ?? 0) + 1
      nicheCounts[niche] = (nicheCounts[niche] ?? 0) + 1
      dailyCounts[day] = (dailyCounts[day] ?? 0) + 1
    }

    // Top 6 niches
    const topNiches = Object.entries(nicheCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }))

    // Last 14 days activity
    const last14: { date: string; count: number }[] = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      last14.push({ date: key, count: dailyCounts[key] ?? 0 })
    }

    const goalLabels: Record<string, string> = { dm: 'DM', telegram: 'Telegram', call: 'Звонок', landing: 'Лендинг' }
    const toneLabels: Record<string, string> = { aggressive: 'Агрессивный', authoritative: 'Авторитетный', empathetic: 'Эмпатичный', bold: 'Смелый', professional: 'Профессиональный' }

    return NextResponse.json({
      total: generations.length,
      goals: Object.entries(goalCounts).map(([key, count]) => ({ key, label: goalLabels[key] ?? key, count })),
      tones: Object.entries(toneCounts).map(([key, count]) => ({ key, label: toneLabels[key] ?? key, count })),
      topNiches,
      daily: last14,
    })
  } catch (err) {
    console.error('[/api/analytics]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
