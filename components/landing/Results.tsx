'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const CASES = [
  {
    niche: 'Онлайн-коучинг',
    metric: '3',
    metricUnit: 'лида',
    period: 'в первую неделю',
    story: 'Опубликовал 5 постов с Telegram-хуками из Revenue OS. Три написали в директ с ключевым словом из CTA — без платной рекламы.',
  },
  {
    niche: 'Доставка еды',
    metric: '91',
    metricUnit: '/100',
    period: 'Quality Score',
    story: 'Первая генерация — 87 баллов. AI переписал два блока, устранив расплывчатый CTA. Итог 91. Опубликовали без единой правки.',
  },
  {
    niche: 'Услуги B2B',
    metric: '30',
    metricUnit: 'мин',
    period: 'контент-план на месяц',
    story: 'Один бриф → 6 форматов × 30 дней контент-план. Месяц публикаций закрыт за полчаса. Раньше уходило 2 дня копирайтеру.',
  },
]

const QG_CRITERIA = [
  { label: 'Ясность и читаемость', score: 18, max: 20 },
  { label: 'Конкретика vs вода', score: 17, max: 20 },
  { label: 'Конверсионная сила', score: 22, max: 25 },
  { label: 'Оригинальность', score: 13, max: 15 },
  { label: 'Доверие и логика', score: 8, max: 10 },
  { label: 'Соответствие платформе', score: 9, max: 10 },
]

export function Results() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="results" ref={ref} aria-label="Результаты" className="bg-[#FAFAF8] py-20 sm:py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease }}
          className="max-w-xl mb-16"
        >
          <p className="text-sm font-medium text-[#8A8882] mb-5 tracking-wide">
            Измеримые результаты
          </p>
          <h2
            className="text-[#111110]"
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
            }}
          >
            Что происходит<br className="hidden sm:block" /> в первые две недели
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
          {CASES.map((c, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.09, ease }}
              aria-label={`Кейс: ${c.niche}`}
              className="bg-white border border-[#E6E3DB] rounded-2xl p-6 flex flex-col gap-4"
            >
              <span className="text-xs font-semibold text-[#8A8882] uppercase tracking-wider">{c.niche}</span>

              <div className="flex items-end gap-1.5">
                <span
                  className="text-[#111110] leading-none"
                  style={{
                    fontFamily: 'var(--font-space-grotesk)',
                    fontSize: 'clamp(2.75rem, 5vw, 3.5rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.05em',
                  }}
                >
                  {c.metric}
                </span>
                <div className="flex flex-col mb-1">
                  <span className="text-base font-bold text-[#111110] leading-none">{c.metricUnit}</span>
                  <span className="text-xs text-[#8A8882] leading-none mt-0.5">{c.period}</span>
                </div>
              </div>

              <p className="text-sm text-[#494743] leading-[1.7] flex-1">{c.story}</p>
            </motion.article>
          ))}
        </div>

        {/* Quality Gate visualizer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.35, ease }}
          className="bg-white border border-[#E6E3DB] rounded-2xl p-7 sm:p-9 max-w-xl"
        >
          <div className="flex items-start justify-between mb-7">
            <div>
              <p className="text-sm font-medium text-[#8A8882] mb-1 tracking-wide">Quality Gate</p>
              <h3
                className="text-[#111110]"
                style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '1.1875rem', fontWeight: 700, letterSpacing: '-0.015em' }}
              >
                Как система оценивает каждый текст
              </h3>
            </div>
            <div className="flex flex-col items-end">
              <span
                className="text-[#186435] leading-none"
                style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.04em' }}
              >
                87
              </span>
              <span className="text-xs text-[#8A8882]">из 100</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {QG_CRITERIA.map((cr, i) => {
              const pct = (cr.score / cr.max) * 100
              const isGreen = pct >= 85
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-[#494743] font-medium">{cr.label}</span>
                    <span className="text-sm font-bold text-[#111110]">
                      {cr.score}
                      <span className="text-[#8A8882] font-normal">/{cr.max}</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#F0EEE9] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${pct}%` } : {}}
                      transition={{ duration: 0.9, delay: 0.45 + i * 0.06, ease }}
                      className="h-full rounded-full"
                      style={{ background: isGreen ? '#186435' : '#1B40AE' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <p className="text-sm text-[#8A8882] mt-5 leading-relaxed">
            Итог ниже 80 — AI находит конкретные проблемы и переписывает их. Вы получаете только проверенный текст.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
