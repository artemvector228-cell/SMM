'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

const GUARANTEES = [
  'Карта не нужна',
  '15 генераций бесплатно',
  'Отмена в любой момент',
  'Мгновенная активация',
]

export function FinalCTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      ref={ref}
      aria-label="Призыв к действию"
      className="bg-[#141414] py-24 sm:py-32 lg:py-40"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="max-w-[44rem] mx-auto text-center">

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease }}
          >
            {/* Label */}
            <p className="text-[0.8125rem] font-bold text-[#6EE7B7] uppercase tracking-[0.08em] mb-5">
              Начните сегодня
            </p>

            {/* Headline — maximum impact */}
            <h2
              className="text-white mb-6"
              style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: 'clamp(2.5rem, 5.5vw, 4rem)',
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: '-0.04em',
              }}
            >
              Один лид окупает<br />подписку на 3&nbsp;месяца
            </h2>

            {/* Subheadline */}
            <p
              className="text-[rgba(255,255,255,0.55)] mb-10 mx-auto leading-[1.7]"
              style={{ fontSize: 'clamp(1.0625rem, 1.8vw, 1.2rem)', maxWidth: '34rem' }}
            >
              15 генераций бесплатно. Карта не нужна. Убедитесь что Revenue OS работает для вашего продукта — потом решайте.
            </p>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link
                href="/signup"
                aria-label="Начать бесплатно — 15 генераций, карта не нужна"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-white hover:bg-[#F4F3F0] text-[#141414] font-bold rounded-full transition-all duration-150 shadow-[0_4px_24px_rgba(255,255,255,0.12)] hover:shadow-[0_6px_32px_rgba(255,255,255,0.16)] hover:-translate-y-0.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
                style={{ fontSize: '1rem' }}
              >
                Начать бесплатно — 15 генераций
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
              <Link
                href="/pricing"
                className="text-[rgba(255,255,255,0.5)] hover:text-white text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Посмотреть все тарифы →
              </Link>
            </div>

            {/* Guarantee chips */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {GUARANTEES.map(g => (
                <span
                  key={g}
                  className="text-xs font-medium text-[rgba(255,255,255,0.45)] bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.1)] px-3.5 py-1.5 rounded-full"
                >
                  {g}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
