'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Quote } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

const TESTIMONIALS = [
  {
    name: 'Алексей Морозов',
    niche: 'Онлайн-коучинг',
    result: '3 лида за неделю',
    initials: 'АМ',
    color: '#1D4ED8',
    bg: '#EFF6FF',
    text: 'Опубликовал 5 постов с Telegram-хуками из Revenue OS. За неделю три человека написали в директ с ключевым словом из CTA — без платной рекламы. Впервые контент реально работает на продажи, а не просто греет охваты.',
    featured: true,
  },
  {
    name: 'Марина Соколова',
    niche: 'Beauty-мастер',
    result: 'Quality Score 91/100',
    initials: 'МС',
    color: '#7C3AED',
    bg: '#F5F3FF',
    text: 'Первый Reels-сценарий получил 91 балл. AI переписал один блок — стало точнее. Клиенты пишут: "откуда такой текст?" — публикую без правок.',
    featured: false,
  },
  {
    name: 'Дмитрий Каган',
    niche: 'B2B консалтинг',
    result: 'Экономия 15 000 ₽/мес',
    initials: 'ДК',
    color: '#15803D',
    bg: '#F0FDF4',
    text: 'Раньше платил копирайтеру 15 000₽ в месяц. Теперь Starter за 990₽ — и контент стал конкретнее. Меньше воды, больше болей клиента.',
    featured: false,
  },
  {
    name: 'Ольга Иванченко',
    niche: 'Доставка еды',
    result: '6 форматов за 40 секунд',
    initials: 'ОИ',
    color: '#D97706',
    bg: '#FFFBEB',
    text: 'Instagram, Telegram, сторис — всё в разных стилях, но узнаваемо моё. Раньше вечер на один пост. Теперь весь контент на неделю за час.',
    featured: false,
  },
  {
    name: 'Сергей Белов',
    niche: 'EdTech',
    result: 'Ни одного поста ниже 80',
    initials: 'СБ',
    color: '#1D4ED8',
    bg: '#EFF6FF',
    text: 'Система сама находит слабые места и переписывает. Я только финально проверяю детали. Это принципиально другой уровень, не ChatGPT.',
    featured: false,
  },
]

export function Testimonials() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      id="testimonials"
      ref={ref}
      aria-label="Отзывы клиентов"
      className="bg-[#FAFAF8] py-20 sm:py-28 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease }}
          className="max-w-xl mb-14"
        >
          <p className="text-[0.8125rem] font-bold text-[#1D4ED8] uppercase tracking-[0.08em] mb-4">
            Отзывы
          </p>
          <h2
            className="text-[#141414]"
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
            }}
          >
            Реальные предприниматели —<br className="hidden sm:block" /> реальные результаты
          </h2>
        </motion.div>

        {/* Bento grid — inspired by 21st.dev testimonials pattern */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
              aria-label={`Отзыв: ${t.name}`}
              className={`bg-white border border-[#E5E4E0] rounded-2xl p-6 sm:p-7 flex flex-col gap-5
                hover:border-[#D4D4CF] hover:shadow-[0_8px_28px_rgba(0,0,0,0.07)]
                transition-all duration-200
                ${t.featured ? 'md:col-span-2 lg:col-span-2' : ''}
              `}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                {/* Avatar */}
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-[0.75rem] font-bold flex-shrink-0"
                  style={{ background: t.bg, color: t.color }}
                >
                  {t.initials}
                </div>

                {/* Result badge */}
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{ color: t.color, background: t.bg }}
                >
                  {t.result}
                </span>
              </div>

              {/* Quote icon */}
              <Quote
                className="w-5 h-5 flex-shrink-0"
                style={{ color: t.color, opacity: 0.35 }}
                strokeWidth={2}
              />

              {/* Text */}
              <blockquote className="flex-1">
                <p
                  className="text-[#141414] leading-[1.68]"
                  style={{ fontSize: t.featured ? '1.0625rem' : '0.9375rem' }}
                >
                  {t.text}
                </p>
              </blockquote>

              {/* Author */}
              <footer className="flex items-center gap-2 pt-2 border-t border-[#F4F3F0]">
                <p
                  className="text-sm font-semibold text-[#141414]"
                  style={{ fontFamily: 'var(--font-space-grotesk)' }}
                >
                  {t.name}
                </p>
                <span className="text-[#D4D4CF]">·</span>
                <p className="text-sm text-[#8A8A8A]">{t.niche}</p>
              </footer>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
