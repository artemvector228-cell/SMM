'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, X, Zap, TrendingUp, Crown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const PLANS = [
  {
    key: 'starter',
    label: 'Starter',
    price: '990 ₽',
    period: '/мес',
    icon: <Zap className="w-4 h-4" />,
    color: '#6d28d9',
    features: ['100 генераций', 'Quality Gate + авто-перезапись', 'База знаний в облаке', 'Контент-план 30 дней'],
    roi: '≈ 1 лид окупает 3 месяца',
  },
  {
    key: 'growth',
    label: 'Growth',
    price: '2 490 ₽',
    period: '/мес',
    icon: <TrendingUp className="w-4 h-4" />,
    color: '#7c3aed',
    highlight: true,
    badge: 'Популярный',
    features: ['500 генераций', 'Brand Voice Engine', 'A/B трекинг хуков', 'Аналитика конверсий', 'Conversion Tracker'],
    roi: '≈ 2 лида в неделю = окупаемость',
  },
  {
    key: 'premium',
    label: 'Premium',
    price: '4 990 ₽',
    period: '/мес',
    icon: <Crown className="w-4 h-4" />,
    color: '#4f46e5',
    features: ['Безлимит генераций', 'Команда до 5 человек', 'ROI Dashboard', 'API доступ', 'Персональная поддержка'],
    roi: '= системный контент-маркетинг',
  },
]

interface Props {
  onClose: () => void
  trigger?: 'limit' | 'manual' | 'feature'
}

export function UpgradeModal({ onClose, trigger = 'manual' }: Props) {
  const [loading, setLoading] = useState<string | null>(null)

  const triggerMessages = {
    limit: 'Лимит генераций почти исчерпан',
    feature: 'Эта функция доступна на платном тарифе',
    manual: 'Выберите тариф для роста',
  }

  async function upgrade(plan: string) {
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
      toast.error('Не удалось подключиться к оплате')
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      <div onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      />
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', pointerEvents: 'none' }}>
        <div
          onClick={e => e.stopPropagation()}
          style={{
            pointerEvents: 'auto', width: '100%', maxWidth: '52rem',
            background: '#fff', borderRadius: '1.5rem',
            boxShadow: '0 32px 80px rgba(109,40,217,0.25)',
            maxHeight: '92vh', overflowY: 'auto',
          }}
        >
          {/* Header */}
          <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: '1px solid rgba(124,58,237,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                {triggerMessages[trigger]}
              </p>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1a1035' }}>
                Один лид окупает подписку на 3 месяца
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#9d8ec4', marginTop: '0.25rem' }}>
                7 дней бесплатного доступа — отмена в любой момент
              </p>
            </div>
            <button onClick={onClose} style={{ cursor: 'pointer', color: '#9d8ec4', background: 'none', border: 'none', padding: '0.5rem', display: 'flex', borderRadius: '0.5rem', flexShrink: 0 }}>
              <X style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
          </div>

          {/* Plans */}
          <div style={{ padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))', gap: '1rem' }}>
            {PLANS.map(plan => (
              <div key={plan.key} style={{
                borderRadius: '1.25rem', padding: '1.25rem',
                border: plan.highlight ? '2px solid rgba(124,58,237,0.5)' : '1px solid rgba(124,58,237,0.15)',
                background: plan.highlight ? 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(99,102,241,0.04))' : 'rgba(255,255,255,0.8)',
                position: 'relative',
              }}>
                {plan.badge && (
                  <div style={{ position: 'absolute', top: '-0.875rem', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.75rem', borderRadius: '9999px', whiteSpace: 'nowrap' }}>
                    {plan.badge}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: plan.color }}>
                  {plan.icon}
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1a1035' }}>{plan.label}</span>
                </div>

                <div style={{ marginBottom: '0.875rem' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1a1035' }}>{plan.price}</span>
                  <span style={{ fontSize: '0.8rem', color: '#9d8ec4' }}>{plan.period}</span>
                </div>

                <p style={{ fontSize: '0.7rem', color: '#7c3aed', fontWeight: 600, marginBottom: '0.75rem', background: 'rgba(124,58,237,0.07)', padding: '0.3rem 0.6rem', borderRadius: '0.5rem', display: 'inline-block' }}>
                  {plan.roi}
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: '#4c3d75' }}>
                      <Check style={{ width: '0.875rem', height: '0.875rem', color: '#7c3aed', flexShrink: 0, marginTop: '0.1rem' }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => upgrade(plan.key)}
                  disabled={!!loading}
                  style={{
                    width: '100%', padding: '0.625rem', borderRadius: '0.875rem', cursor: 'pointer',
                    border: 'none', fontWeight: 700, fontSize: '0.875rem', color: '#fff',
                    background: plan.highlight ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'linear-gradient(135deg, #6d28d9, #4f46e5)',
                    boxShadow: plan.highlight ? '0 4px 16px rgba(124,58,237,0.35)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading === plan.key ? <Loader2 style={{ width: '1rem', height: '1rem' }} className="animate-spin" /> : null}
                  Начать 7 дней бесплатно
                </button>
              </div>
            ))}
          </div>

          <div style={{ padding: '0.875rem 1.5rem', borderTop: '1px solid rgba(124,58,237,0.08)', display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {['🔒 Безопасная оплата СБП', '↩️ Отмена в любой момент', '⚡ Мгновенная активация'].map(t => (
              <span key={t} style={{ fontSize: '0.72rem', color: '#9d8ec4' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
