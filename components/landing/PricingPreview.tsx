'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, ArrowRight, Loader2, Lock } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

const ease = [0.22, 1, 0.36, 1] as const

const PLANS = [
  {
    key: 'free',
    label: 'Бесплатно',
    price: '0',
    desc: 'Убедитесь что работает для вашей ниши',
    roi: null,
    features: [
      '15 генераций',
      'Все 6 форматов контента',
      'Quality Gate (просмотр оценки)',
      'Telegram-публикация',
    ],
    cta: 'Начать бесплатно',
    href: '/signup',
    dark: false,
  },
  {
    key: 'starter',
    label: 'Starter',
    price: '990',
    period: '/мес',
    desc: 'Для регулярного контент-маркетинга',
    roi: '1 лид окупает 3 месяца',
    features: [
      '100 генераций в месяц',
      'Quality Gate + авто-перезапись',
      'База знаний в облаке',
      'Контент-план на 30 дней',
    ],
    cta: 'Выбрать Starter',
    dark: false,
  },
  {
    key: 'growth',
    label: 'Growth',
    price: '2 490',
    period: '/мес',
    badge: 'Популярный',
    desc: 'Для серьёзного роста и отслеживания ROI',
    roi: '2 лида в неделю = окупаемость',
    features: [
      '500 генераций в месяц',
      'Brand Voice Engine',
      'A/B трекинг хуков',
      'Conversion Tracker',
      'Аналитика конверсий',
    ],
    cta: 'Выбрать Growth',
    dark: true,
  },
]

export function PricingPreview() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [loading, setLoading] = useState<string | null>(null)

  async function upgrade(plan: string) {
    setLoading(plan)
    try {
      const res = await fetch('/api/yookassa/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.confirmation_url) window.location.href = data.confirmation_url
      else toast.error(data.error ?? 'Ошибка оплаты')
    } catch {
      toast.error('Не удалось подключиться')
    } finally {
      setLoading(null)
    }
  }

  return (
    <section id="pricing" ref={ref} aria-label="Тарифы" className="bg-white py-16 sm:py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease }}
          className="text-center max-w-xl mx-auto mb-16"
        >
          <p className="text-[0.8125rem] font-bold text-[#1D4ED8] uppercase tracking-[0.08em] mb-4">Тарифы</p>
          <h2
            className="text-[#141414] mb-4"
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
            }}
          >
            Начните бесплатно.<br />Платите когда видите результат
          </h2>
          <p className="text-[#525252] text-lg">
            Один лид окупает Starter-подписку на 3 месяца
          </p>
        </motion.div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto mb-8">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.09, ease }}
              className="relative flex flex-col"
              style={{
                background: plan.dark ? '#141414' : '#FFFFFF',
                border: plan.dark ? '2px solid #141414' : '1px solid #E5E4E0',
                borderRadius: '1.25rem',
                padding: '2rem 1.75rem',
                boxShadow: plan.dark ? '0 20px 60px rgba(0,0,0,0.18)' : '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-[#1D4ED8] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-[0_4px_14px_rgba(29,78,216,0.4)] whitespace-nowrap">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Label */}
              <p
                className="text-xs font-bold uppercase tracking-wider mb-3"
                style={{ color: plan.dark ? 'rgba(255,255,255,0.45)' : '#8A8A8A' }}
              >
                {plan.label}
              </p>

              {/* Price */}
              <div className="flex items-end gap-1 mb-2">
                <span
                  className="leading-none"
                  style={{
                    fontFamily: 'var(--font-space-grotesk)',
                    fontSize: 'clamp(2rem, 3.5vw, 2.625rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.04em',
                    color: plan.dark ? '#FFFFFF' : '#141414',
                  }}
                >
                  {plan.price === '0' ? 'Бесплатно' : `${plan.price} ₽`}
                </span>
                {plan.period && (
                  <span className="mb-1.5 text-sm" style={{ color: plan.dark ? 'rgba(255,255,255,0.4)' : '#8A8A8A' }}>
                    {plan.period}
                  </span>
                )}
              </div>

              {/* ROI chip */}
              {plan.roi && (
                <span
                  className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 self-start"
                  style={
                    plan.dark
                      ? { color: '#6EE7B7', background: 'rgba(110,231,183,0.12)' }
                      : { color: '#15803D', background: '#F0FDF4' }
                  }
                >
                  {plan.roi}
                </span>
              )}

              {!plan.roi && <div className="mb-6" />}

              {/* Features */}
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm leading-snug" style={{ color: plan.dark ? 'rgba(255,255,255,0.75)' : '#525252' }}>
                    <Check
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                      strokeWidth={2.5}
                      style={{ color: plan.dark ? '#6EE7B7' : '#15803D' }}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {plan.href ? (
                <Link
                  href={plan.href}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-sm transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] border border-[#E5E4E0] hover:border-[#D4D4CF] hover:bg-[#F4F3F0]"
                  style={{ color: '#141414' }}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </Link>
              ) : (
                <button
                  onClick={() => upgrade(plan.key)}
                  disabled={!!loading}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-sm transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] disabled:opacity-60"
                  style={
                    plan.dark
                      ? { background: '#1D4ED8', color: '#fff', boxShadow: '0 4px 14px rgba(29,78,216,0.3)' }
                      : { background: '#F4F3F0', color: '#141414', border: '1px solid #E5E4E0' }
                  }
                >
                  {plan.cta}
                  {loading === plan.key
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <ArrowRight className="w-4 h-4" strokeWidth={2.5} />}
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Trust */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-[#8A8A8A]"
        >
          <Lock className="w-3.5 h-3.5 inline-block mr-1.5 -mt-px" strokeWidth={2.5} />
          Безопасная оплата СБП и картой · Отмена в любой момент · Мгновенная активация
        </motion.p>
      </div>
    </section>
  )
}
