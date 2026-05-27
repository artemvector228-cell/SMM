'use client'

import { useState } from 'react'
import { PLAN_LIMITS } from '@/types'
import { Button } from '@/components/ui/button'
import { Check, TrendingUp, Loader2, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

const cardStyle = {
  background: 'rgba(255,255,255,0.8)',
  border: '1px solid rgba(124,58,237,0.12)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  boxShadow: '0 4px 24px rgba(109,40,217,0.08)',
  borderRadius: '1.25rem',
}

function PlanCard({ plan, onUpgrade, loading }: {
  plan: typeof PLAN_LIMITS['pro']
  onUpgrade: (plan: string) => void
  loading?: boolean
}) {
  const isPro = plan.plan === 'pro'

  return (
    <div
      className="p-6 space-y-5 relative"
      style={isPro ? {
        ...cardStyle,
        border: '1.5px solid rgba(124,58,237,0.35)',
        boxShadow: '0 8px 40px rgba(109,40,217,0.15)',
      } : cardStyle}
    >
      {isPro && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 12px rgba(124,58,237,0.4)' }}
        >
          Популярный
        </div>
      )}
      <div>
        <h3 className="font-bold text-lg" style={{ color: '#1a1035' }}>{plan.label}</h3>
        <p className="text-3xl font-black mt-1" style={{
          backgroundImage: isPro ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : undefined,
          backgroundClip: isPro ? 'text' : undefined,
          WebkitBackgroundClip: isPro ? 'text' : undefined,
          color: isPro ? 'transparent' : '#1a1035',
        }}>
          {plan.price}
        </p>
      </div>
      <ul className="space-y-2">
        {plan.features.map(f => (
          <li key={f} className="flex items-center gap-2 text-sm" style={{ color: '#4c3d75' }}>
            <Check className="w-4 h-4 shrink-0" style={{ color: '#7c3aed' }} />
            {f}
          </li>
        ))}
      </ul>
      {plan.plan === 'free' ? (
        <Link href="/signup">
          <Button
            variant="outline" className="w-full cursor-pointer font-semibold"
            style={{ borderColor: 'rgba(124,58,237,0.25)', color: '#7c3aed' }}
          >
            Начать бесплатно
          </Button>
        </Link>
      ) : (
        <Button
          className="w-full cursor-pointer border-0 text-white font-semibold flex items-center gap-2"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 14px rgba(124,58,237,0.35)', opacity: loading ? 0.7 : 1 }}
          disabled={loading}
          onClick={() => onUpgrade(plan.plan)}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? 'Переходим к оплате...' : `Перейти на ${plan.label}`}
        </Button>
      )}
    </div>
  )
}

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleUpgrade(plan: string) {
    setLoading(plan)
    try {
      const res = await fetch('/api/yookassa/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      if (res.status === 401) {
        toast.error('Авторизуйтесь, чтобы оплатить тариф')
        setTimeout(() => { window.location.href = `/login?redirect=/pricing` }, 1500)
        return
      }

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        const detail = data.details ?? data.error ?? 'Неизвестная ошибка'
        toast.error(`Ошибка: ${detail}`)
        console.error('[pricing] checkout error:', data)
      }
    } catch {
      toast.error('Ошибка соединения. Попробуйте ещё раз.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #faf8ff 0%, #f3f0ff 35%, #faf5ff 65%, #f8f9ff 100%)' }}>
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold" style={{ color: '#1a1035' }}>Revenue OS</span>
          </Link>
          <h1 className="text-4xl font-black tracking-tight" style={{ color: '#1a1035' }}>Простые и прозрачные тарифы</h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#6b5b95' }}>
            Начните бесплатно. Переходите на Pro когда будете готовы масштабировать конверсии.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start max-w-2xl mx-auto">
          {Object.values(PLAN_LIMITS).map(plan => (
            <PlanCard key={plan.plan} plan={plan} onUpgrade={handleUpgrade} loading={loading === plan.plan} />
          ))}
        </div>

        <div
          className="max-w-lg mx-auto rounded-2xl p-5 flex items-start gap-3"
          style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.15)' }}
        >
          <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#7c3aed' }} />
          <div className="text-sm" style={{ color: '#4c3d75' }}>
            <p className="font-semibold mb-1" style={{ color: '#1a1035' }}>Безопасная оплата через ЮKassa</p>
            <p>Карты и СБП — любой российский банк. Доступ открывается автоматически сразу после оплаты.</p>
          </div>
        </div>

        <div className="space-y-2 text-center">
          <p className="text-sm" style={{ color: '#9d8ec4' }}>
            Уже есть аккаунт?{' '}
            <Link href="/login" className="font-semibold hover:text-violet-600 transition-colors" style={{ color: '#7c3aed' }}>Войти</Link>
          </p>
          <p className="text-xs" style={{ color: '#c4b5fd' }}>
            Самозанятый Ануфриев А.П. · ИНН 027722224358
          </p>
        </div>
      </div>

    </div>
  )
}
