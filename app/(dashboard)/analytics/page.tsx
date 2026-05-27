'use client'

import { useQuery } from '@tanstack/react-query'
import { BarChart3, TrendingUp, Zap, Target, Users } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

const cardStyle = {
  background: 'rgba(255,255,255,0.75)',
  border: '1px solid rgba(124,58,237,0.12)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 4px 20px rgba(109,40,217,0.07)',
  borderRadius: '1rem',
}

const GOAL_COLORS: Record<string, string> = {
  dm: '#7c3aed',
  telegram: '#6366f1',
  call: '#a855f7',
  landing: '#8b5cf6',
}

const TONE_COLORS: Record<string, string> = {
  aggressive: '#ef4444',
  authoritative: '#7c3aed',
  empathetic: '#06b6d4',
  bold: '#f59e0b',
  professional: '#10b981',
}

function BarChart({ data, colors, max }: { data: { key: string; label: string; count: number }[]; colors: Record<string, string>; max: number }) {
  return (
    <div className="space-y-3">
      {data.map(({ key, label, count }) => (
        <div key={key}>
          <div className="flex justify-between text-sm mb-1">
            <span style={{ color: '#1a1035', fontWeight: 500 }}>{label}</span>
            <span style={{ color: '#9d8ec4' }}>{count}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(124,58,237,0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${max > 0 ? (count / max) * 100 : 0}%`,
                background: colors[key] ?? 'linear-gradient(90deg, #7c3aed, #a855f7)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function MiniBarChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map(({ date, count }) => (
        <div key={date} className="flex-1 flex flex-col items-center gap-1 group relative">
          <div
            className="w-full rounded-t transition-all duration-500"
            style={{
              height: `${Math.max((count / max) * 100, count > 0 ? 8 : 0)}%`,
              minHeight: count > 0 ? 4 : 0,
              background: count > 0 ? 'linear-gradient(180deg, #7c3aed, #a855f7)' : 'rgba(124,58,237,0.1)',
              borderRadius: '3px 3px 0 0',
            }}
          />
          {count > 0 && (
            <span className="absolute -top-5 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#7c3aed', fontWeight: 600 }}>
              {count}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => fetch('/api/analytics').then(r => r.json()),
  })

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div><Skeleton className="h-7 w-48 mb-2" /><Skeleton className="h-4 w-64" /></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  if (data?.empty) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tight" style={{ color: '#1a1035' }}>Аналитика</h1>
          <p className="mt-1 text-sm" style={{ color: '#9d8ec4' }}>Статистика по генерациям</p>
        </div>
        <div style={cardStyle} className="p-16 text-center">
          <BarChart3 className="w-10 h-10 mx-auto mb-3" style={{ color: 'rgba(124,58,237,0.3)' }} />
          <p className="font-semibold" style={{ color: '#1a1035' }}>Нет данных</p>
          <p className="text-sm mt-1" style={{ color: '#9d8ec4' }}>Создайте первую генерацию, чтобы увидеть аналитику</p>
        </div>
      </div>
    )
  }

  const maxGoal = Math.max(...(data?.goals ?? []).map((g: { count: number }) => g.count), 1)
  const maxTone = Math.max(...(data?.tones ?? []).map((t: { count: number }) => t.count), 1)
  const totalDays = (data?.daily ?? []).reduce((s: number, d: { count: number }) => s + d.count, 0)
  const avgPerDay = totalDays > 0 ? (totalDays / 14).toFixed(1) : '0'

  return (
    <div className="max-w-4xl mx-auto space-y-6" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
      <div>
        <h1 className="text-2xl font-black tracking-tight" style={{ color: '#1a1035' }}>Аналитика</h1>
        <p className="mt-1 text-sm" style={{ color: '#9d8ec4' }}>Статистика по всем вашим генерациям</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Zap, gradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)', label: 'Всего генераций', value: data?.total ?? 0, sub: 'за всё время' },
          { icon: Target, gradient: 'linear-gradient(135deg, #6d28d9, #4f46e5)', label: 'За 14 дней', value: totalDays, sub: `≈ ${avgPerDay}/день` },
          { icon: Users, gradient: 'linear-gradient(135deg, #a855f7, #7c3aed)', label: 'Уникальных ниш', value: data?.topNiches?.length ?? 0, sub: 'топ показаны ниже' },
        ].map(({ icon: Icon, gradient, label, value, sub }) => (
          <div key={label} style={cardStyle} className="p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: gradient, boxShadow: '0 4px 10px rgba(109,40,217,0.25)' }}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold" style={{ color: '#1a1035' }}>{label}</span>
            </div>
            <p className="text-3xl font-black" style={{ color: '#1a1035' }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: '#9d8ec4' }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Activity chart */}
      <div style={cardStyle} className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4" style={{ color: '#7c3aed' }} />
          <h2 className="font-bold" style={{ color: '#1a1035' }}>Активность — последние 14 дней</h2>
        </div>
        <MiniBarChart data={data?.daily ?? []} />
        <div className="flex justify-between mt-2">
          <span className="text-xs" style={{ color: '#9d8ec4' }}>{data?.daily?.[0]?.date?.slice(5)}</span>
          <span className="text-xs" style={{ color: '#9d8ec4' }}>{data?.daily?.[13]?.date?.slice(5)}</span>
        </div>
      </div>

      {/* Goals + Tones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div style={cardStyle} className="p-6">
          <h2 className="font-bold mb-5" style={{ color: '#1a1035' }}>Цели конверсии</h2>
          <BarChart data={data?.goals ?? []} colors={GOAL_COLORS} max={maxGoal} />
        </div>

        <div style={cardStyle} className="p-6">
          <h2 className="font-bold mb-5" style={{ color: '#1a1035' }}>Тональность</h2>
          <BarChart data={data?.tones ?? []} colors={TONE_COLORS} max={maxTone} />
        </div>
      </div>

      {/* Top niches */}
      {data?.topNiches?.length > 0 && (
        <div style={cardStyle} className="p-6">
          <h2 className="font-bold mb-5" style={{ color: '#1a1035' }}>Топ ниш</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data.topNiches.map(({ name, count }: { name: string; count: number }, i: number) => (
              <div
                key={name}
                className="p-3 rounded-xl border"
                style={{
                  background: i === 0 ? 'rgba(124,58,237,0.08)' : 'rgba(124,58,237,0.03)',
                  borderColor: i === 0 ? 'rgba(124,58,237,0.25)' : 'rgba(124,58,237,0.1)',
                }}
              >
                <p className="text-xs font-semibold truncate" style={{ color: '#1a1035' }}>{name}</p>
                <p className="text-2xl font-black mt-1" style={{ color: i === 0 ? '#7c3aed' : '#1a1035' }}>{count}</p>
                <p className="text-xs" style={{ color: '#9d8ec4' }}>генераций</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
