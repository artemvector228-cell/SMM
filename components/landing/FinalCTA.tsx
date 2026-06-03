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
      className="bg-[#0F0F0E] py-24 sm:py-32 lg:py-40"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="max-w-[44rem] mx-auto text-center">

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease }}
          >
            <p className="text-sm font-medium text-[rgba(255,255,255,0.3)] mb-6 tracking-wide">
              Revenue OS
            </p>

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
              Посмотрите как работает<br />
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>на вашем продукте.</span>
            </h2>

            <p
              className="text-[rgba(255,255,255,0.48)] mb-10 mx-auto leading-[1.72]"
              style={{ fontSize: 'clamp(1.0625rem, 1.8vw, 1.2rem)', maxWidth: '34rem' }}
            >
              15 генераций бесплатно — достаточно, чтобы увидеть систему в действии
              на реальных данных вашего бизнеса. Карта не нужна.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link
                href="/signup"
                aria-label="Начать бесплатно — 15 генераций, карта не нужна"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-white hover:bg-[#F5F4F0] text-[#111110] font-bold rounded-full transition-all duration-150 shadow-[0_4px_24px_rgba(255,255,255,0.1)] hover:shadow-[0_6px_32px_rgba(255,255,255,0.14)] hover:-translate-y-0.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
                style={{ fontSize: '1rem' }}
              >
                Начать бесплатно — 15 генераций
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
              <Link
                href="/pricing"
                className="text-[rgba(255,255,255,0.38)] hover:text-[rgba(255,255,255,0.7)] text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Посмотреть все тарифы →
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {GUARANTEES.map(g => (
                <span
                  key={g}
                  className="text-xs font-medium text-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] px-3.5 py-1.5 rounded-full"
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
