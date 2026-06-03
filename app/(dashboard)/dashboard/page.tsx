export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getPlanLimit } from '@/types'
import { Zap, Library, TrendingUp, ArrowRight, ShieldCheck, CalendarDays, Target, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const GOAL_LABELS: Record<string, string> = { dm: 'DM', telegram: 'Telegram', call: 'Звонок', landing: 'Лендинг' }
const GRADE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  S: { bg: 'rgba(16,185,129,0.1)', text: '#059669', border: 'rgba(16,185,129,0.25)' },
  A: { bg: 'rgba(124,58,237,0.1)', text: '#7c3aed', border: 'rgba(124,58,237,0.25)' },
  B: { bg: 'rgba(245,158,11,0.1)', text: '#d97706', border: 'rgba(245,158,11,0.25)' },
  C: { bg: 'rgba(239,68,68,0.1)', text: '#dc2626', border: 'rgba(239,68,68,0.25)' },
}

const card = {
  background: 'rgba(255,255,255,0.8)',
  border: '1px solid rgba(124,58,237,0.1)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  boxShadow: '0 4px 24px rgba(109,40,217,0.06)',
  borderRadius: '1.125rem',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: recentGenerations } = await supabase
    .from('generations')
    .select('id, input_json, output_json, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const { count: totalCount } = await supabase
    .from('generations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: scheduledCount } = await supabase
    .from('generations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .not('scheduled_at', 'is', null)

  const plan = profile?.plan ?? 'free'
  const limit = getPlanLimit(plan)
  const used = profile?.generations_used ?? 0
  const pct = limit.maxGenerations ? Math.min(100, Math.round((used / limit.maxGenerations) * 100)) : 0
  const firstName = user.email?.split('@')[0] ?? 'пользователь'

  // Compute avg quality score from recent gens
  const scored = (recentGenerations ?? []).filter(g => g.output_json?.quality_scores?.overall)
  const avgScore = scored.length
    ? Math.round(scored.reduce((sum, g) => sum + (g.output_json.quality_scores?.overall ?? 0), 0) / scored.length)
    : null

  return (
    <div className="max-w-5xl mx-auto space-y-6" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: '#1a1035' }}>
            Привет, {firstName} 👋
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#9d8ec4' }}>
            Ваша контентная система готова к работе
          </p>
        </div>
        <Link href="/generate">
          <Button className="cursor-pointer border-0 text-white font-bold gap-2 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}>
            <Zap className="w-4 h-4" /> Создать контент
          </Button>
        </Link>
      </div>

      {/* Upgrade banner for free users */}
      {plan === 'free' && used >= 7 && (
        <div className="p-4 rounded-2xl flex items-center gap-4 flex-wrap"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(99,102,241,0.06))', border: '1px solid rgba(124,58,237,0.2)' }}>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm" style={{ color: '#1a1035' }}>
              ⚡ Осталось {(limit.maxGenerations ?? 10) - used} из {limit.maxGenerations} генераций
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#7c3aed' }}>
              Перейдите на Starter — 100 генераций за 990 ₽/мес
            </p>
          </div>
          <Link href="/pricing">
            <Button size="sm" className="cursor-pointer border-0 text-white font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              Улучшить →
            </Button>
          </Link>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        {/* Generations */}
        <div style={card} className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 10px rgba(124,58,237,0.3)' }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold" style={{ color: '#6b5b95' }}>Генерации</span>
          </div>
          <p className="text-3xl font-black leading-none" style={{ color: '#1a1035' }}>{used}</p>
          <p className="text-xs mt-1" style={{ color: '#9d8ec4' }}>
            {limit.maxGenerations ? `из ${limit.maxGenerations} (${pct}%)` : 'безлимит'}
          </p>
          {limit.maxGenerations && (
            <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(124,58,237,0.1)' }}>
              <div className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: pct > 80 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #7c3aed, #a855f7)' }} />
            </div>
          )}
        </div>

        {/* Total content */}
        <div style={card} className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #6d28d9, #4f46e5)', boxShadow: '0 4px 10px rgba(99,102,241,0.3)' }}>
              <Library className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold" style={{ color: '#6b5b95' }}>Библиотека</span>
          </div>
          <p className="text-3xl font-black leading-none" style={{ color: '#1a1035' }}>{totalCount ?? 0}</p>
          <p className="text-xs mt-1" style={{ color: '#9d8ec4' }}>единиц контента</p>
        </div>

        {/* Quality score */}
        <div style={card} className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}>
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold" style={{ color: '#6b5b95' }}>Quality Gate</span>
          </div>
          <p className="text-3xl font-black leading-none" style={{ color: '#1a1035' }}>
            {avgScore !== null ? `${avgScore}` : '—'}
          </p>
          <p className="text-xs mt-1" style={{ color: '#9d8ec4' }}>
            {avgScore !== null ? `средний балл / 100` : 'нет данных'}
          </p>
        </div>

        {/* Scheduled */}
        <div style={card} className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 10px rgba(245,158,11,0.3)' }}>
              <CalendarDays className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold" style={{ color: '#6b5b95' }}>Запланировано</span>
          </div>
          <p className="text-3xl font-black leading-none" style={{ color: '#1a1035' }}>{scheduledCount ?? 0}</p>
          <p className="text-xs mt-1" style={{ color: '#9d8ec4' }}>постов в очереди</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { href: '/generate', icon: <Zap className="w-4 h-4" />, title: 'Создать контент', desc: 'AI-генерация с Quality Gate', color: '#7c3aed' },
          { href: '/content-plan', icon: <Target className="w-4 h-4" />, title: 'Контент-план', desc: '30 дней готового расписания', color: '#6d28d9' },
          { href: '/knowledge', icon: <Sparkles className="w-4 h-4" />, title: 'База знаний', desc: 'Настроить Brand Voice', color: '#4f46e5' },
        ].map(action => (
          <Link key={action.href} href={action.href} className="group">
            <div style={{ ...card, transition: 'all 0.2s' }}
              className="p-5 cursor-pointer hover:shadow-[0_8px_32px_rgba(109,40,217,0.12)] hover:-translate-y-0.5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ color: action.color }}>{action.icon}</span>
                  <span className="font-bold text-sm" style={{ color: '#1a1035' }}>{action.title}</span>
                </div>
                <p className="text-xs" style={{ color: '#9d8ec4' }}>{action.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0"
                style={{ color: '#c4b5fd' }} />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent generations with quality scores */}
      {recentGenerations && recentGenerations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm" style={{ color: '#1a1035' }}>Последние генерации</h2>
            <Link href="/library">
              <Button variant="ghost" size="sm" className="cursor-pointer text-xs font-semibold h-7"
                style={{ color: '#7c3aed' }}>
                Смотреть все →
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            {recentGenerations.map((g) => {
              const qs = g.output_json?.quality_scores
              const grade = qs?.instagram?.grade
              const gc = grade ? GRADE_COLORS[grade] : null
              return (
                <div key={g.id} style={{ ...card, padding: '0.875rem 1.125rem' }}
                  className="flex items-center gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#1a1035' }}>
                      {g.input_json.niche}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#9d8ec4' }}>
                      {new Date(g.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className="border text-xs font-semibold"
                      style={{ background: 'rgba(124,58,237,0.07)', color: '#7c3aed', borderColor: 'rgba(124,58,237,0.2)' }}>
                      {GOAL_LABELS[g.input_json.conversion_goal] ?? g.input_json.conversion_goal}
                    </Badge>
                    {gc && grade && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-lg border"
                        style={{ background: gc.bg, color: gc.text, borderColor: gc.border }}>
                        {grade}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Plan card */}
      <div style={{ ...card, padding: '1.25rem' }} className="flex items-center gap-4 flex-wrap">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-sm" style={{ color: '#1a1035' }}>Тариф: {limit.label}</p>
            <Badge className="border text-xs font-bold"
              style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed', borderColor: 'rgba(124,58,237,0.2)' }}>
              {limit.price}
            </Badge>
          </div>
          <p className="text-xs mt-0.5" style={{ color: '#9d8ec4' }}>
            {limit.maxGenerations ? `${used} из ${limit.maxGenerations} генераций использовано` : 'Безлимитные генерации'}
          </p>
        </div>
        {(plan === 'free' || plan === 'starter') && (
          <Link href="/pricing" className="shrink-0">
            <Button size="sm" className="cursor-pointer border-0 text-white font-bold"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              Улучшить план
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
