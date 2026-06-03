'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ShieldCheck, Brain, Zap, CalendarDays, Send, TrendingUp } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

const FEATURES = [
  {
    icon: ShieldCheck,
    iconColor: '#15803D',
    iconBg: '#F0FDF4',
    tag: 'Уникально',
    tagColor: '#15803D',
    tagBg: '#F0FDF4',
    title: 'Quality Gate — каждый текст под проверкой',
    body: 'После генерации AI-редактор оценивает текст по 6 критериям: ясность, конкретика, конверсионность, оригинальность, доверие, соответствие платформе. Балл ниже 80 → находит проблемы, переписывает сам.',
    wide: true,
  },
  {
    icon: Brain,
    iconColor: '#7C3AED',
    iconBg: '#F5F3FF',
    tag: 'Growth+',
    tagColor: '#7C3AED',
    tagBg: '#F5F3FF',
    title: 'Brand Voice Engine',
    body: 'Опишите стиль один раз. Все генерации будут звучать как вы — не как шаблонный AI.',
    wide: false,
  },
  {
    icon: Zap,
    iconColor: '#1D4ED8',
    iconBg: '#EFF6FF',
    tag: 'Все тарифы',
    tagColor: '#1D4ED8',
    tagBg: '#EFF6FF',
    title: '6 форматов за 40 секунд',
    body: 'Instagram, Telegram, Stories, Reels, 10 хуков, CTA-стратегия — параллельная генерация в один запрос.',
    wide: false,
  },
  {
    icon: CalendarDays,
    iconColor: '#D97706',
    iconBg: '#FFFBEB',
    tag: 'Starter+',
    tagColor: '#D97706',
    tagBg: '#FFFBEB',
    title: 'Контент-план на 30 дней',
    body: 'Месячный план с воронкой прогрева: осведомлённость → доверие → конверсия. 30 дней расписания за 20 минут.',
    wide: false,
  },
  {
    icon: Send,
    iconColor: '#1D4ED8',
    iconBg: '#EFF6FF',
    tag: 'Все тарифы',
    tagColor: '#1D4ED8',
    tagBg: '#EFF6FF',
    title: 'Публикация в Telegram',
    body: 'Редактируйте пост, добавляйте фото, видео и эмодзи прямо в редакторе. Отправка в канал — один клик.',
    wide: false,
  },
  {
    icon: TrendingUp,
    iconColor: '#15803D',
    iconBg: '#F0FDF4',
    tag: 'Growth+',
    tagColor: '#15803D',
    tagBg: '#F0FDF4',
    title: 'Conversion Tracker',
    body: 'Отмечайте лиды, продажи и подписчиков с каждого поста. Видите ROI конкретного контента, а не просто охваты.',
    wide: false,
  },
]

export function Features() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="features" ref={ref} aria-label="Возможности Revenue OS" className="bg-white py-20 sm:py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease }}
          className="max-w-xl mb-16"
        >
          <p className="text-[0.8125rem] font-bold text-[#1D4ED8] uppercase tracking-[0.08em] mb-4">Возможности</p>
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
            Система, а не разовый генератор
          </h2>
          <p className="text-[#525252] text-lg leading-relaxed">
            Каждая функция решает конкретную задачу в цепочке контент → публикация → клиент.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07, ease }}
                className={`bg-[#FAFAF8] border border-[#E5E4E0] rounded-2xl p-6 sm:p-7
                  hover:border-[#D4D4CF] hover:shadow-[0_8px_28px_rgba(0,0,0,0.07)]
                  transition-all duration-200 cursor-default
                  ${f.wide ? 'md:col-span-2' : ''}`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: f.iconBg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: f.iconColor }} strokeWidth={2} />
                  </div>
                  {/* Tag */}
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ color: f.tagColor, background: f.tagBg }}
                  >
                    {f.tag}
                  </span>
                </div>
                <h3
                  className="text-[#141414] mb-2.5"
                  style={{
                    fontFamily: 'var(--font-space-grotesk)',
                    fontSize: f.wide ? 'clamp(1.125rem, 1.75vw, 1.3125rem)' : '1.0625rem',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    lineHeight: 1.3,
                  }}
                >
                  {f.title}
                </h3>
                <p className="text-[#525252] text-[0.9375rem] leading-[1.7]">{f.body}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
