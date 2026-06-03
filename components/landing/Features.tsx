'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ShieldCheck, Brain, Zap, CalendarDays, Send, TrendingUp } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Quality Gate — встроенный редактор-контролёр',
    body: 'После генерации AI-редактор оценивает текст по 6 критериям: ясность, конкретика, конверсионность, оригинальность, доверие, соответствие платформе. Балл ниже 80 — находит проблемы и переписывает их автоматически. Вы получаете только проверенный результат.',
    wide: true,
  },
  {
    icon: Brain,
    title: 'Brand Voice Engine',
    body: 'Опишите стиль один раз. Все генерации звучат как вы — не как шаблонный AI.',
    wide: false,
  },
  {
    icon: Zap,
    title: '6 форматов за 40 секунд',
    body: 'Instagram, Telegram, Stories, Reels, 10 хуков, CTA-стратегия — параллельно в один запрос.',
    wide: false,
  },
  {
    icon: CalendarDays,
    title: 'Контент-план на 30 дней',
    body: 'Месячный план с воронкой прогрева: осведомлённость → доверие → конверсия. 30 дней за 20 минут.',
    wide: false,
  },
  {
    icon: Send,
    title: 'Публикация в Telegram',
    body: 'Редактируйте пост, добавляйте фото, видео и эмодзи прямо в редакторе. Отправка в канал — один клик.',
    wide: false,
  },
  {
    icon: TrendingUp,
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

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease }}
          className="max-w-xl mb-16"
        >
          <p className="text-sm font-medium text-[#8A8882] mb-5 tracking-wide">
            Что входит в систему
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
            Один инструмент —<br className="hidden sm:block" /> весь цикл контент-маркетинга
          </h2>
          <p className="text-[#494743] text-lg leading-relaxed">
            Создать, проверить качество, опубликовать, отследить результат — без переключений между сервисами.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07, ease }}
                className={`bg-[#FAFAF8] border border-[#E6E3DB] rounded-2xl p-6 sm:p-7 cursor-default
                  ${f.wide ? 'md:col-span-2' : ''}`}
              >
                <div className="mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#EDF0FB] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#1B40AE]" strokeWidth={2} />
                  </div>
                </div>
                <h3
                  className="text-[#111110] mb-2.5"
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
                <p className="text-[#494743] text-[0.9375rem] leading-[1.7]">{f.body}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
