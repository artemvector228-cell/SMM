'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

const STEPS = [
  {
    n: '01',
    color: '#1D4ED8',
    bg: '#EFF6FF',
    title: 'Опишите продукт один раз',
    body: 'Заполните базу знаний: продукт, цена, аудитория, ключевые боли, кейсы, голос бренда. Сохраняется в облаке — больше никогда не вводите заново. С любого устройства.',
    chip: '5 минут, один раз',
  },
  {
    n: '02',
    color: '#15803D',
    bg: '#F0FDF4',
    title: 'AI генерирует 6 форматов + Quality Gate',
    body: 'Instagram, Telegram, Stories, Reels, 10 вирусных хуков, стратегия CTA — параллельно за 40 секунд. Затем AI-редактор оценивает каждый текст по 6 критериям. Балл ниже 80 — переписывает, устраняя конкретные проблемы.',
    chip: '40 секунд, Quality Gate включён',
  },
  {
    n: '03',
    color: '#7C3AED',
    bg: '#F5F3FF',
    title: 'Публикуйте и отслеживайте результат',
    body: 'Отправляйте прямо в Telegram-канал с медиафайлами и эмодзи. Отмечайте лиды, продажи и подписчиков с конкретного поста — Conversion Tracker считает ROI каждого контента.',
    chip: 'Один клик → в канале',
  },
]

export function ProductWalkthrough() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      id="how"
      ref={ref}
      aria-label="Как работает Revenue OS"
      className="bg-white py-20 sm:py-28 lg:py-36"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Section label + heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease }}
          className="max-w-xl mb-16 sm:mb-20"
        >
          <p className="text-[0.8125rem] font-bold text-[#1D4ED8] uppercase tracking-[0.08em] mb-4">
            Как работает
          </p>
          <h2
            className="text-[#141414] mb-5"
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
            }}
          >
            От описания продукта до опубликованного поста — три шага
          </h2>
          <p className="text-[#525252] text-lg leading-relaxed">
            Не разовый генератор. Система, которая понимает ваш бизнес и производит контент под конверсию каждый день.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="flex flex-col gap-4 mb-14">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, ease, delay: i * 0.1 }}
              className="flex gap-5 sm:gap-7 p-6 sm:p-8 bg-[#FAFAF8] border border-[#E5E4E0] rounded-2xl hover:border-[#D4D4CF] hover:shadow-[0_8px_28px_rgba(0,0,0,0.07)] transition-all duration-200"
            >
              {/* Step number */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: step.bg }}
              >
                <span
                  className="font-extrabold text-sm"
                  style={{ color: step.color, fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {step.n}
                </span>
              </div>

              {/* Content */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2.5">
                  <h3
                    className="text-[#141414] leading-tight"
                    style={{
                      fontFamily: 'var(--font-space-grotesk)',
                      fontSize: 'clamp(1rem, 1.5vw, 1.1875rem)',
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {step.title}
                  </h3>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ color: step.color, background: step.bg }}
                  >
                    {step.chip}
                  </span>
                </div>
                <p className="text-[#525252] leading-[1.7] text-[0.9375rem]">{step.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.45 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-7 py-4 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold rounded-full transition-all duration-150 shadow-[0_6px_20px_rgba(29,78,216,0.28)] hover:-translate-y-px cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            Начать бесплатно
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
          <p className="text-sm text-[#8A8A8A]">
            15 генераций бесплатно · Карта не нужна
          </p>
        </motion.div>
      </div>
    </section>
  )
}
