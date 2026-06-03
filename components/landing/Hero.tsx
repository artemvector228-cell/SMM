'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

const STATS = [
  { value: '15', unit: '', label: 'генераций бесплатно', sub: 'карта не нужна' },
  { value: '40', unit: 'с', label: '6 форматов контента', sub: 'параллельная генерация' },
  { value: '80+', unit: '', label: 'Quality Score или перезапись', sub: 'AI проверяет каждый текст' },
]

const FORMATS = ['Instagram', 'Telegram', 'Stories', 'Reels', 'Хуки', 'CTA']

export function Hero() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section
      ref={ref}
      aria-label="Главный экран"
      className="bg-[#FAFAF8]"
      style={{ paddingTop: 'clamp(3.5rem, 9vw, 7rem)', paddingBottom: 'clamp(3.5rem, 9vw, 7rem)' }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="max-w-[54rem]">

          {/* Label pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold text-[#7C3AED] bg-[#F5F3FF] border border-[#DDD6FE] px-4 py-1.5 rounded-full">
              <Zap className="w-3.5 h-3.5" strokeWidth={2.5} />
              Quality Gate — AI проверяет каждый текст и переписывает если балл ниже 80
            </span>
          </motion.div>

          {/* Headline — oversized per editorial minimalism guideline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease, delay: 0.07 }}
            className="text-[#141414] mb-5"
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: 'clamp(2.5rem, 6vw, 4.25rem)',
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: '-0.04em',
            }}
          >
            Контент, который<br />
            <span className="text-[#1D4ED8]">приносит клиентов</span>,<br />
            а не просто лайки
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease, delay: 0.15 }}
            className="text-[#525252] mb-8 max-w-[40rem] leading-[1.7]"
            style={{ fontSize: 'clamp(1.0625rem, 1.8vw, 1.2rem)' }}
          >
            Описываете продукт один раз. AI генерирует 6 форматов контента под конверсию за 40 секунд. Каждый текст проходит Quality Gate — если балл ниже&nbsp;80, система переписывает сама.
          </motion.p>

          {/* Format pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, ease, delay: 0.22 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {FORMATS.map(f => (
              <span key={f} className="text-xs font-semibold text-[#525252] bg-white border border-[#E5E4E0] px-3 py-1 rounded-full">
                {f}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease, delay: 0.28 }}
            className="flex flex-wrap items-center gap-4 mb-12"
          >
            <Link
              href="/signup"
              aria-label="Начать бесплатно — 15 генераций, карта не нужна"
              className="inline-flex items-center gap-2 px-7 py-4 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold rounded-full transition-all duration-150 shadow-[0_6px_20px_rgba(29,78,216,0.3)] hover:shadow-[0_8px_28px_rgba(29,78,216,0.38)] hover:-translate-y-0.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#1D4ED8]"
              style={{ fontSize: '1rem' }}
            >
              Начать бесплатно
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 px-6 py-4 border-2 border-[#D4D4CF] hover:border-[#141414] text-[#525252] hover:text-[#141414] font-semibold rounded-full transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#1D4ED8]"
              style={{ fontSize: '1rem' }}
            >
              Как это работает
            </a>
            <span className="flex items-center gap-1.5 text-sm text-[#8A8A8A]">
              <ShieldCheck className="w-4 h-4 text-[#15803D]" />
              Без карты · Без обязательств
            </span>
          </motion.div>

          {/* Stats — editorial grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease, delay: 0.38 }}
            className="grid grid-cols-3 gap-0 pt-8 border-t border-[#E5E4E0]"
          >
            {STATS.map((s, i) => (
              <div
                key={i}
                className={`${i < 2 ? 'pr-6 mr-6 border-r border-[#E5E4E0] sm:pr-10 sm:mr-10' : ''}`}
              >
                <p
                  className="text-[#141414] leading-none mb-1"
                  style={{
                    fontFamily: 'var(--font-space-grotesk)',
                    fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.04em',
                  }}
                >
                  {s.value}
                  {s.unit && <span className="text-[1.25rem] text-[#8A8A8A] font-medium">{s.unit}</span>}
                </p>
                <p className="text-[0.8125rem] font-semibold text-[#525252] leading-snug mb-0.5">{s.label}</p>
                <p className="text-[0.75rem] text-[#8A8A8A] leading-snug hidden sm:block">{s.sub}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
