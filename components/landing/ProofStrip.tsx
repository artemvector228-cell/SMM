'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const METRICS = [
  { value: '2 400+', label: 'предпринимателей' },
  { value: '84/100', label: 'средний Quality Score' },
  { value: '40 с', label: '6 форматов за раз' },
  { value: '1 лид', label: '= 3 месяца Starter' },
]

export function ProofStrip() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <section
      ref={ref}
      aria-label="Ключевые метрики"
      className="bg-[#141414] py-12 sm:py-14 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {METRICS.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-2"
            >
              <p
                className="text-white leading-none"
                style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                }}
              >
                {m.value}
              </p>
              <p className="text-[rgba(255,255,255,0.45)] text-sm font-medium leading-snug">
                {m.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
