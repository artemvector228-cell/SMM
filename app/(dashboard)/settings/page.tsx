export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { PLAN_LIMITS } from '@/types'
import { BillingButton } from './BillingButton'
import { Settings, User, CreditCard, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TelegramSettings } from '@/components/layout/TelegramSettings'

const cardStyle = {
  background: 'rgba(255,255,255,0.75)',
  border: '1px solid rgba(124,58,237,0.12)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 4px 20px rgba(109,40,217,0.07)',
  borderRadius: '1rem',
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const plan = (profile?.plan && PLAN_LIMITS[profile.plan as keyof typeof PLAN_LIMITS]) ? profile.plan : 'free'
  const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS]
  const used = profile?.generations_used ?? 0
  const pct = limit.maxGenerations ? Math.round((used / limit.maxGenerations) * 100) : 0

  return (
    <div className="max-w-2xl mx-auto space-y-5" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
      <div>
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2" style={{ color: '#1a1035' }}>
          <Settings className="w-6 h-6" style={{ color: '#7c3aed' }} /> Настройки
        </h1>
        <p className="text-sm mt-1" style={{ color: '#9d8ec4' }}>Управление аккаунтом и подпиской</p>
      </div>

      {/* Account */}
      <div style={cardStyle} className="p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 10px rgba(109,40,217,0.25)' }}>
            <User className="w-4 h-4 text-white" />
          </div>
          <h2 className="font-bold text-sm" style={{ color: '#1a1035' }}>Аккаунт</h2>
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: '#9d8ec4' }}>Email</p>
          <p className="font-semibold text-sm" style={{ color: '#1a1035' }}>{user.email}</p>
        </div>
      </div>

      {/* Subscription */}
      <div style={cardStyle} className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6d28d9, #4f46e5)', boxShadow: '0 4px 10px rgba(109,40,217,0.25)' }}>
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-bold text-sm" style={{ color: '#1a1035' }}>Подписка</h2>
          </div>
          <Badge className="border font-semibold text-xs" style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed', borderColor: 'rgba(124,58,237,0.25)' }}>
            {limit.label}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span style={{ color: '#9d8ec4' }}>Использовано генераций</span>
            <span className="font-semibold" style={{ color: '#1a1035' }}>
              {used}{limit.maxGenerations ? ` / ${limit.maxGenerations}` : ' / ∞'}
            </span>
          </div>
          {limit.maxGenerations && (
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(124,58,237,0.1)' }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }}
              />
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          {limit.features.map(f => (
            <p key={f} className="text-sm flex items-center gap-2" style={{ color: '#4c3d75' }}>
              <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#7c3aed' }} /> {f}
            </p>
          ))}
        </div>

        {plan === 'free' && (
          <Link href="/pricing">
            <Button className="w-full cursor-pointer border-0 text-white font-semibold" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              Улучшить тариф
            </Button>
          </Link>
        )}
        {plan !== 'free' && profile?.stripe_customer_id && <BillingButton />}
      </div>

      {/* Telegram */}
      <TelegramSettings />
    </div>
  )
}
