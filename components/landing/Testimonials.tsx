'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const TESTIMONIALS = [
  {
    name: 'Алексей Морозов',
    niche: 'Онлайн-коучинг',
    initials: 'АМ',
    text: 'Опубликовал 5 постов с Telegram-хуками из Revenue OS. За неделю три человека написали в директ с ключевым словом из CTA — без платной рекламы. Впервые контент реально работает на продажи, а не просто греет охваты.',
    result: '3 лида за первую неделю',
    featured: true,
  },
  {
    name: 'Марина Соколова',
    niche: 'Beauty-мастер',
    initials: 'МС',
    text: 'Первый Reels-сценарий получил 91 балл. AI переписал один блок — стало точнее. Клиенты пишут: «откуда такой текст?» — публикую без правок.',
    result: 'Quality Score 91/100',
    featured: false,
  },
  {
    name: 'Дмитрий Каган',
    niche: 'B2B консалтинг',
    initials: 'ДК',
    text: 'Раньше платил копирайтеру 15 000₽ в месяц. Теперь Starter за 990₽ — и контент стал конкретнее. Меньше воды, больше болей клиента.',
    result: 'Экономия 15 000 ₽/мес',
    featured: false,
  },
  {
    name: 'Ольга Иванченко',
    niche: 'Доставка еды',
    initials: 'ОИ',
    text: 'Instagram, Telegram, сторис — всё в разных стилях, но узнаваемо моё. Раньше вечер на один пост. Теперь весь контент на неделю за час.',
    result: '6 форматов за 40 секунд',
    featured: false,
  },
  {
    name: 'Сергей Белов',
    niche: 'EdTech',
    initials: 'СБ',
    text: 'Система сама находит слабые места и переписывает. Я только финально проверяю детали. Это принципиально другой уровень, не ChatGPT.',
    result: 'Ни одного поста ниже 80',
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

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease }}
          className="max-w-xl mb-14"
        >
          <p className="text-sm font-medium text-[#8A8882] mb-5 tracking-wide">
            Клиенты внутри
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
            Предприниматели,<br className="hidden sm:block" /> которые уже внутри
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
              aria-label={`Отзыв: ${t.name}`}
              className={`bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-7 flex flex-col gap-4 relative
                ${t.featured ? 'md:col-span-2 lg:col-span-2' : ''}
              `}
            >
              {t.featured && (
                <span
                  aria-hidden="true"
                  className="absolute top-6 right-7 text-[4rem] leading-none text-[#E6E3DB] select-none"
                  style={{ fontFamily: 'Georgia, serif', lineHeight: 1 }}
                >
                  &ldquo;
                </span>
              )}

              <blockquote className="flex-1">
                <p
                  className="text-[#111110] leading-[1.7]"
                  style={{ fontSize: t.featured ? '1.0625rem' : '0.9375rem' }}
                >
                  {t.text}
                </p>
              </blockquote>

              <footer className="flex items-start justify-between gap-4 pt-4 border-t border-[#F0EEE9]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#EDF0FB] flex items-center justify-center text-[0.6875rem] font-bold text-[#1B40AE] flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111110]" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                      {t.name}
                    </p>
                    <p className="text-xs text-[#8A8882]">{t.niche}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-[#494743] bg-[#F5F4F0] border border-[#E6E3DB] px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5">
                  {t.result}
                </span>
              </footer>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
