export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PLAN_LIMITS } from '@/types'
import { Zap, Library, TrendingUp, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

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
    .select('id, input_json, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const plan = (profile?.plan && PLAN_LIMITS[profile.plan as keyof typeof PLAN_LIMITS]) ? profile.plan : 'free'
  const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS]
  const used = profile?.generations_used ?? 0
  const pct = limit.maxGenerations ? Math.round((used / limit.maxGenerations) * 100) : 0

  const cardStyle = {
    background: 'rgba(255,255,255,0.75)',
    border: '1px solid rgba(124,58,237,0.12)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 4px 20px rgba(109,40,217,0.07)',
    borderRadius: '1rem',
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
      <div>
        <h1 className="text-2xl font-black tracking-tight" style={{ color: '#1a1035' }}>Главная</h1>
        <p className="mt-1 text-sm" style={{ color: '#9d8ec4' }}>Добро пожаловать, {user.email?.split('@')[0]}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div style={cardStyle} className="p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 10px #7c3aed30' }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold" style={{ color: '#1a1035' }}>Генерации</span>
          </div>
          <p className="text-3xl font-black" style={{ color: '#1a1035' }}>{used}</p>
          <p className="text-xs mt-1" style={{ color: '#9d8ec4' }}>
            {limit.maxGenerations ? `из ${limit.maxGenerations} (${pct}%)` : 'Безлимит'}
          </p>
        </div>

        <div style={cardStyle} className="p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6d28d9, #4f46e5)', boxShadow: '0 4px 10px #6d28d930' }}>
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold" style={{ color: '#1a1035' }}>Тариф</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-3xl font-black capitalize" style={{ color: '#1a1035' }}>{plan}</p>
            <Badge className="border font-semibold text-xs" style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed', borderColor: 'rgba(124,58,237,0.25)' }}>{limit.price}</Badge>
          </div>
          {plan === 'free' && (
            <Link href="/pricing">
              <Button size="sm" className="h-7 text-xs cursor-pointer border-0 text-white font-semibold" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
                Улучшить
              </Button>
            </Link>
          )}
        </div>

        <div style={cardStyle} className="p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', boxShadow: '0 4px 10px #a855f730' }}>
              <Library className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold" style={{ color: '#1a1035' }}>Сохранено</span>
          </div>
          <p className="text-3xl font-black" style={{ color: '#1a1035' }}>{recentGenerations?.length ?? 0}</p>
          <p className="text-xs mt-1" style={{ color: '#9d8ec4' }}>последних генераций</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/generate" className="flex-1 group">
          <div style={{ ...cardStyle, transition: 'all 0.2s' }} className="p-6 cursor-pointer hover:shadow-[0_8px_32px_rgba(109,40,217,0.15)] hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold flex items-center gap-2" style={{ color: '#1a1035' }}>
                  <Zap className="w-4 h-4" style={{ color: '#7c3aed' }} /> Создать контент
                </h3>
                <p className="text-sm mt-1" style={{ color: '#9d8ec4' }}>Генерировать AI-контент для конверсий</p>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: '#7c3aed' }} />
            </div>
          </div>
        </Link>

        <Link href="/library" className="flex-1 group">
          <div style={{ ...cardStyle, transition: 'all 0.2s' }} className="p-6 cursor-pointer hover:shadow-[0_8px_32px_rgba(109,40,217,0.15)] hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold flex items-center gap-2" style={{ color: '#1a1035' }}>
                  <Library className="w-4 h-4" style={{ color: '#7c3aed' }} /> Библиотека
                </h3>
                <p className="text-sm mt-1" style={{ color: '#9d8ec4' }}>Просматривать и переиспользовать генерации</p>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: '#7c3aed' }} />
            </div>
          </div>
        </Link>
      </div>

      {/* Recent generations */}
      {recentGenerations && recentGenerations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold" style={{ color: '#1a1035' }}>Последние генерации</h2>
            <Link href="/library">
              <Button variant="ghost" size="sm" className="cursor-pointer text-sm font-semibold" style={{ color: '#7c3aed' }}>Все</Button>
            </Link>
          </div>
          <div className="space-y-2">
            {recentGenerations.map((g) => (
              <div key={g.id} style={{ ...cardStyle, padding: '0.875rem 1.25rem' }} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold capitalize" style={{ color: '#1a1035' }}>{g.input_json.niche}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#9d8ec4' }}>
                    {new Date(g.created_at).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <Badge className="border text-xs font-semibold" style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed', borderColor: 'rgba(124,58,237,0.2)' }}>
                  {({ dm: 'DM', telegram: 'Telegram', call: 'Звонок', landing: 'Лендинг' } as Record<string, string>)[g.input_json.conversion_goal] ?? g.input_json.conversion_goal}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
