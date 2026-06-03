'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

const STEPS = [
  {
    n: '01',
    title: 'Опишите продукт один раз',
    body: 'Заполните базу знаний: продукт, цена, аудитория, ключевые боли, кейсы, голос бренда. Сохраняется в облаке — больше никогда не вводите заново. Доступно с любого устройства.',
    aside: '5 мин однократно',
  },
  {
    n: '02',
    title: 'Система генерирует и проверяет качество',
    body: 'Instagram, Telegram, Stories, Reels, 10 вирусных хуков, CTA-стратегия — параллельно за 40 секунд. Quality Gate оценивает каждый текст по 6 критериям. Балл ниже 80 — переписывает, устраняя конкретные слабые места.',
    aside: '40 с · Quality Gate',
  },
  {
    n: '03',
    title: 'Публикуйте и отслеживайте результат',
    body: 'Отправляйте напрямую в Telegram-канал с медиафайлами и эмодзи. Отмечайте лиды, продажи и подписчиков с конкретного поста — Conversion Tracker показывает ROI каждого контента.',
    aside: 'Один клик → в канале',
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

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease }}
          className="max-w-xl mb-16 sm:mb-20"
        >
          <p className="text-sm font-medium text-[#8A8882] mb-5 tracking-wide">
            Рабочий процесс
          </p>
          <h2
            className="text-[#111110] mb-5"
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
            }}
          >
            Три шага — от описания<br className="hidden sm:block" /> продукта до первых заявок
          </h2>
          <p className="text-[#494743] text-lg leading-relaxed">
            Не разовый генератор. Система, которая понимает ваш бизнес и производит контент под конверсию каждый день.
          </p>
        </motion.div>

        <div className="flex flex-col gap-3 mb-14">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, ease, delay: i * 0.1 }}
              className="flex gap-5 sm:gap-8 p-6 sm:p-8 bg-[#FAFAF8] border border-[#E6E3DB] rounded-2xl"
            >
              {/* Step number */}
              <div className="flex-shrink-0 pt-0.5">
                <span
                  className="font-extrabold text-[0.8125rem] text-[#1B40AE]"
                  style={{ fontFamily: 'var(--font-space-grotesk)', letterSpacing: '0.02em' }}
                >
                  {step.n}
                </span>
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2.5">
                  <h3
                    className="text-[#111110] leading-tight"
                    style={{
                      fontFamily: 'var(--font-space-grotesk)',
                      fontSize: 'clamp(1rem, 1.5vw, 1.1875rem)',
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {step.title}
                  </h3>
                  <span className="text-[0.8125rem] text-[#8A8882] font-medium flex-shrink-0">
                    {step.aside}
                  </span>
                </div>
                <p className="text-[#494743] leading-[1.7] text-[0.9375rem]">{step.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.45 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-7 py-4 bg-[#1B40AE] hover:bg-[#163596] text-white font-bold rounded-full transition-all duration-150 shadow-[0_4px_16px_rgba(27,64,174,0.28)] hover:-translate-y-px cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B40AE]"
          >
            Начать бесплатно
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
          <p className="text-sm text-[#8A8882]">
            15 генераций бесплатно · Карта не нужна
          </p>
        </motion.div>
      </div>
    </section>
  )
}
