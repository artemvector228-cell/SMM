export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getPlanLimit } from '@/types'
import {
  Zap, Library, TrendingUp, ArrowRight,
  ShieldCheck, CalendarDays, Target, Sparkles, Trophy,
} from 'lucide-react'
import Link from 'next/link'

const GOAL_LABELS: Record<string, string> = {
  dm: 'DM',
  telegram: 'Telegram',
  call: 'Звонок',
  landing: 'Лендинг',
}

const GRADE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  S: { bg: '#EDF9F2', text: '#186435', border: '#B3E8CC' },
  A: { bg: '#EDF0FB', text: '#1B40AE', border: '#C7D4F5' },
  B: { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
  C: { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' },
}

const card = {
  background: '#FFFFFF',
  border: '1px solid #E6E3DB',
  borderRadius: '1.25rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
} as const

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

  const { count: conversionsCount } = await supabase
    .from('conversions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const plan = profile?.plan ?? 'free'
  const limit = getPlanLimit(plan)
  const used = profile?.generations_used ?? 0
  const pct = limit.maxGenerations ? Math.min(100, Math.round((used / limit.maxGenerations) * 100)) : 0
  const firstName = user.email?.split('@')[0] ?? 'пользователь'

  const scored = (recentGenerations ?? []).filter(g => g.output_json?.quality_scores?.overall)
  const avgScore = scored.length
    ? Math.round(scored.reduce((sum, g) => sum + (g.output_json.quality_scores?.overall ?? 0), 0) / scored.length)
    : null

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: '#111110', fontFamily: 'var(--font-space-grotesk)' }}
          >
            Привет, {firstName}
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#8A8882' }}>
            Контент-система готова к работе
          </p>
        </div>
        <Link
          href="/generate"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm text-white transition-all duration-150 hover:-translate-y-px cursor-pointer"
          style={{ background: '#1B40AE', boxShadow: '0 4px 14px rgba(27,64,174,0.28)' }}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
            (e.currentTarget as HTMLElement).style.background = '#163596'
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
            (e.currentTarget as HTMLElement).style.background = '#1B40AE'
          }}
        >
          <Zap className="w-4 h-4" />
          Создать контент
        </Link>
      </div>

      {/* Upgrade banner */}
      {plan === 'free' && used >= 7 && (
        <div
          className="p-4 rounded-2xl flex items-center gap-4 flex-wrap"
          style={{ background: '#EDF0FB', border: '1px solid #C7D4F5' }}
        >
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm" style={{ color: '#111110' }}>
              Осталось {(limit.maxGenerations ?? 10) - used} из {limit.maxGenerations} генераций
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#1B40AE' }}>
              Starter — 100 генераций за 990 ₽/мес
            </p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-sm text-white shrink-0 cursor-pointer"
            style={{ background: '#1B40AE' }}
          >
            Улучшить <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        {/* Generations */}
        <div style={card} className="p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: '#EDF0FB' }}>
              <Zap className="w-4 h-4" style={{ color: '#1B40AE' }} />
            </div>
            <span className="text-xs font-semibold" style={{ color: '#8A8882' }}>Генерации</span>
          </div>
          <p className="text-3xl font-bold leading-none" style={{ color: '#111110', fontFamily: 'var(--font-space-grotesk)' }}>
            {used}
          </p>
          <p className="text-xs mt-1.5" style={{ color: '#8A8882' }}>
            {limit.maxGenerations ? `из ${limit.maxGenerations} (${pct}%)` : 'безлимит'}
          </p>
          {limit.maxGenerations && (
            <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: '#F0EFE9' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  background: pct > 80 ? '#DC2626' : '#1B40AE',
                }}
              />
            </div>
          )}
        </div>

        {/* Library */}
        <div style={card} className="p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: '#EDF0FB' }}>
              <Library className="w-4 h-4" style={{ color: '#1B40AE' }} />
            </div>
            <span className="text-xs font-semibold" style={{ color: '#8A8882' }}>Библиотека</span>
          </div>
          <p className="text-3xl font-bold leading-none" style={{ color: '#111110', fontFamily: 'var(--font-space-grotesk)' }}>
            {totalCount ?? 0}
          </p>
          <p className="text-xs mt-1.5" style={{ color: '#8A8882' }}>единиц контента</p>
        </div>

        {/* Quality Gate */}
        <div style={card} className="p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: '#EDF9F2' }}>
              <ShieldCheck className="w-4 h-4" style={{ color: '#186435' }} />
            </div>
            <span className="text-xs font-semibold" style={{ color: '#8A8882' }}>Quality Gate</span>
          </div>
          <p className="text-3xl font-bold leading-none" style={{ color: '#111110', fontFamily: 'var(--font-space-grotesk)' }}>
            {avgScore !== null ? `${avgScore}` : '—'}
          </p>
          <p className="text-xs mt-1.5" style={{ color: '#8A8882' }}>
            {avgScore !== null ? 'средний балл / 100' : 'нет данных'}
          </p>
        </div>

        {/* Scheduled */}
        <div style={card} className="p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: '#FEF3C7' }}>
              <CalendarDays className="w-4 h-4" style={{ color: '#92400E' }} />
            </div>
            <span className="text-xs font-semibold" style={{ color: '#8A8882' }}>Запланировано</span>
          </div>
          <p className="text-3xl font-bold leading-none" style={{ color: '#111110', fontFamily: 'var(--font-space-grotesk)' }}>
            {scheduledCount ?? 0}
          </p>
          <p className="text-xs mt-1.5" style={{ color: '#8A8882' }}>постов в очереди</p>
        </div>
      </div>

      {/* Conversion hero */}
      {(conversionsCount ?? 0) > 0 && (
        <div style={{ ...card, background: '#EDF9F2', border: '1px solid #B3E8CC' }}
          className="p-5 flex items-center gap-4 flex-wrap">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: '#186435' }}>
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xl font-bold" style={{ color: '#111110', fontFamily: 'var(--font-space-grotesk)' }}>
              {conversionsCount} {(conversionsCount ?? 0) === 1 ? 'результат' : (conversionsCount ?? 0) < 5 ? 'результата' : 'результатов'}
            </p>
            <p className="text-sm font-medium mt-0.5" style={{ color: '#186435' }}>
              получено через контент — лиды, продажи, подписчики
            </p>
          </div>
          <p className="text-xs shrink-0" style={{ color: '#8A8882' }}>Отмечайте в Библиотеке</p>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { href: '/generate',     icon: Zap,      title: 'Создать контент',   desc: 'AI-генерация с Quality Gate' },
          { href: '/content-plan', icon: Target,   title: 'Контент-план',      desc: '30 дней готового расписания' },
          { href: '/knowledge',    icon: Sparkles, title: 'База знаний',       desc: 'Настроить Brand Voice' },
        ].map(({ href, icon: Icon, title, desc }) => (
          <Link key={href} href={href} className="group block">
            <div
              style={{ ...card, transition: 'all 0.15s cubic-bezier(0.22,1,0.36,1)' }}
              className="p-5 cursor-pointer group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] group-hover:-translate-y-0.5 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 shrink-0" style={{ color: '#1B40AE' }} />
                  <span className="font-semibold text-sm" style={{ color: '#111110', fontFamily: 'var(--font-space-grotesk)' }}>
                    {title}
                  </span>
                </div>
                <p className="text-xs" style={{ color: '#8A8882' }}>{desc}</p>
              </div>
              <ArrowRight
                className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform"
                style={{ color: '#D0CCC4' }}
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent generations */}
      {recentGenerations && recentGenerations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2
              className="font-semibold text-sm"
              style={{ color: '#111110', fontFamily: 'var(--font-space-grotesk)' }}
            >
              Последние генерации
            </h2>
            <Link
              href="/library"
              className="text-xs font-medium transition-colors"
              style={{ color: '#1B40AE' }}
            >
              Смотреть все →
            </Link>
          </div>
          <div className="space-y-2">
            {recentGenerations.map((g) => {
              const qs = g.output_json?.quality_scores
              const grade = qs?.instagram?.grade
              const gc = grade ? GRADE_COLORS[grade] : null
              return (
                <div
                  key={g.id}
                  style={{ ...card, padding: '0.875rem 1.125rem' }}
                  className="flex items-center gap-3 flex-wrap"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#111110' }}>
                      {g.input_json.niche}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#8A8882' }}>
                      {new Date(g.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full border"
                      style={{ background: '#EDF0FB', color: '#1B40AE', borderColor: '#C7D4F5' }}
                    >
                      {GOAL_LABELS[g.input_json.conversion_goal] ?? g.input_json.conversion_goal}
                    </span>
                    {gc && grade && (
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-lg border"
                        style={{ background: gc.bg, color: gc.text, borderColor: gc.border }}
                      >
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
      <div style={card} className="p-5 flex items-center gap-4 flex-wrap">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: '#EDF0FB' }}
        >
          <TrendingUp className="w-5 h-5" style={{ color: '#1B40AE' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-sm" style={{ color: '#111110', fontFamily: 'var(--font-space-grotesk)' }}>
              Тариф: {limit.label}
            </p>
            <span
              className="text-xs font-medium px-2.5 py-0.5 rounded-full border"
              style={{ background: '#EDF0FB', color: '#1B40AE', borderColor: '#C7D4F5' }}
            >
              {limit.price}
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: '#8A8882' }}>
            {limit.maxGenerations
              ? `${used} из ${limit.maxGenerations} генераций использовано`
              : 'Безлимитные генерации'}
          </p>
        </div>
        {(plan === 'free' || plan === 'starter') && (
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-sm text-white shrink-0 cursor-pointer"
            style={{ background: '#1B40AE' }}
          >
            Улучшить план
          </Link>
        )}
      </div>
    </div>
  )
}
