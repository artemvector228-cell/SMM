'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const METRICS = [
  { value: '2 400+', label: 'предпринимателей работают в системе' },
  { value: '84/100', label: 'средний Quality Score по системе' },
  { value: '40 с', label: 'шесть форматов за один запрос' },
]

export function ProofStrip() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <section
      ref={ref}
      aria-label="Ключевые метрики"
      className="bg-[#0F0F0E] border-t border-white/5 py-14 sm:py-16"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0 sm:divide-x sm:divide-white/8">
          {METRICS.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-2 sm:px-10 first:pl-0 last:pr-0"
            >
              <p
                className="text-white leading-none"
                style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  fontSize: 'clamp(2rem, 3.5vw, 2.875rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                }}
              >
                {m.value}
              </p>
              <p className="text-[rgba(255,255,255,0.38)] text-sm font-medium leading-snug">
                {m.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
