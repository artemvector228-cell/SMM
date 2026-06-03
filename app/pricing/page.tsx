'use client'

import { useState } from 'react'
import { PLAN_LIMITS, PlanLimit } from '@/types'
import { Button } from '@/components/ui/button'
import { Check, TrendingUp, Zap, Loader2, ShieldCheck, Star, Crown } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

const PLANS_ORDER = ['free', 'starter', 'growth', 'premium'] as const

function PlanCard({ plan, onUpgrade, loading, current }: {
  plan: PlanLimit
  onUpgrade: (p: string) => void
  loading: string | null
  current?: boolean
}) {
  const isFree = plan.plan === 'free'
  const isHighlight = !!plan.highlight
  const isLoading = loading === plan.plan

  const icon = {
    free: <Zap className="w-5 h-5" />,
    starter: <ShieldCheck className="w-5 h-5" />,
    growth: <TrendingUp className="w-5 h-5" />,
    premium: <Crown className="w-5 h-5" />,
    pro: <Star className="w-5 h-5" />,
  }[plan.plan] ?? <Zap className="w-5 h-5" />

  return (
    <div
      style={{
        background: isHighlight ? 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(99,102,241,0.05))' : 'rgba(255,255,255,0.82)',
        border: isHighlight ? '2px solid rgba(124,58,237,0.4)' : '1px solid rgba(124,58,237,0.12)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: isHighlight ? '0 8px 40px rgba(109,40,217,0.15)' : '0 4px 20px rgba(109,40,217,0.06)',
        borderRadius: '1.5rem',
        position: 'relative',
      }}
      className="p-6 flex flex-col"
    >
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 12px rgba(124,58,237,0.4)' }}>
            {plan.badge}
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
          style={{ background: isHighlight ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'rgba(124,58,237,0.12)', color: isHighlight ? undefined : '#7c3aed' }}>
          {icon}
        </div>
        <div>
          <p className="font-black text-sm" style={{ color: '#1a1035' }}>{plan.label}</p>
          {current && <span className="text-xs font-semibold" style={{ color: '#7c3aed' }}>Текущий тариф</span>}
        </div>
      </div>

      <div className="mb-5">
        <span className="text-3xl font-black" style={{ color: '#1a1035' }}>
          {plan.priceMonthly === 0 ? 'Бесплатно' : plan.price.replace('/мес', '')}
        </span>
        {(plan.priceMonthly ?? 0) > 0 && (
          <span className="text-sm ml-1" style={{ color: '#9d8ec4' }}>/мес</span>
        )}
      </div>

      <ul className="space-y-2.5 mb-6 flex-1">
        {plan.features.map(f => (
          <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: '#4c3d75' }}>
            <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#7c3aed' }} />
            {f}
          </li>
        ))}
      </ul>

      {isFree ? (
        <Link href="/signup">
          <Button variant="outline" className="w-full cursor-pointer font-bold"
            style={{ borderColor: 'rgba(124,58,237,0.25)', color: '#7c3aed' }}>
            Начать бесплатно
          </Button>
        </Link>
      ) : (
        <Button
          onClick={() => onUpgrade(plan.plan)}
          disabled={!!loading || current}
          className="w-full cursor-pointer border-0 text-white font-bold"
          style={isHighlight
            ? { background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }
            : { background: 'linear-gradient(135deg, #6d28d9, #4f46e5)' }
          }
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : current ? 'Текущий тариф' : 'Выбрать план'}
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
      const data = await res.json()
      if (data.confirmation_url) {
        window.location.href = data.confirmation_url
      } else {
        toast.error(data.error ?? 'Ошибка оплаты')
      }
    } catch {
      toast.error('Не удалось подключиться')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #f0f9ff 100%)' }}>
      <div className="max-w-6xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-sm" style={{ color: '#1a1035' }}>Revenue OS</span>
          </Link>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: '#1a1035' }}>
            Тарифы для роста
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#6b5b95' }}>
            От первых тестов до системного контент-маркетинга с предсказуемым результатом
          </p>
        </div>

        {/* Plan grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {PLANS_ORDER.map(key => (
            <PlanCard
              key={key}
              plan={PLAN_LIMITS[key]}
              onUpgrade={handleUpgrade}
              loading={loading}
            />
          ))}
        </div>

        {/* Trust signals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: '🔒', title: 'Безопасная оплата', desc: 'СБП, карты, ЮKassa — все платежи защищены' },
            { icon: '⚡', title: 'Мгновенный доступ', desc: 'Активация сразу после оплаты, без ожидания' },
            { icon: '↩️', title: 'Отмена в любой момент', desc: 'Без штрафов, без скрытых условий' },
          ].map(t => (
            <div key={t.title} className="flex items-start gap-3 p-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(124,58,237,0.1)' }}>
              <span className="text-xl shrink-0">{t.icon}</span>
              <div>
                <p className="font-bold text-sm" style={{ color: '#1a1035' }}>{t.title}</p>
                <p className="text-xs mt-0.5" style={{ color: '#9d8ec4' }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-black text-xl mb-5 text-center" style={{ color: '#1a1035' }}>Частые вопросы</h2>
          <div className="space-y-3">
            {[
              { q: 'Что такое Quality Gate?', a: 'После каждой генерации AI оценивает контент по 6 критериям (ясность, конкретика, конверсионность и др.) и автоматически переписывает если балл ниже 80/100.' },
              { q: 'Можно ли отменить подписку?', a: 'Да, в любой момент. Доступ сохраняется до конца оплаченного периода.' },
              { q: 'Чем Growth отличается от Starter?', a: 'Growth включает Brand Voice Engine (AI учится вашему стилю), A/B трекинг хуков и авто-перезапись при низком качестве.' },
              { q: 'Есть ли командная работа?', a: 'Да, на тарифе Premium — до 5 пользователей в одном аккаунте с общей библиотекой контента.' },
            ].map(item => (
              <div key={item.q} className="p-4 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(124,58,237,0.1)' }}>
                <p className="font-bold text-sm" style={{ color: '#1a1035' }}>{item.q}</p>
                <p className="text-sm mt-1.5" style={{ color: '#6b5b95' }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs mt-10" style={{ color: '#9d8ec4' }}>
          Есть вопросы? Напишите нам через кнопку обратной связи на сайте
        </p>
      </div>
    </div>
  )
}
