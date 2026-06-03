'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ArrowRight, ShieldCheck, Zap, Check,
  BookOpen, Layers, Settings, TrendingUp, Send,
} from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

const STATS = [
  { value: '15', unit: '', label: 'генераций бесплатно', sub: 'карта не нужна' },
  { value: '40', unit: 'с', label: '6 форматов контента', sub: 'параллельная генерация' },
  { value: '80+', unit: '', label: 'Quality Score или перезапись', sub: 'AI проверяет каждый текст' },
]

const FORMATS = ['Instagram', 'Telegram', 'Stories', 'Reels', 'Хуки', 'CTA']

function ProductMockup({ inView }: { inView: boolean }) {
  return (
    <div className="relative w-full select-none" aria-hidden="true">
      {/* Ambient glow */}
      <div className="absolute -inset-8 bg-gradient-to-br from-[#EFF6FF] via-[#F5F3FF] to-[#F0FDF4] rounded-[3rem] blur-3xl opacity-70 -z-10" />

      {/* Browser window */}
      <div className="rounded-2xl overflow-hidden border border-[#E5E4E0] shadow-[0_24px_64px_rgba(0,0,0,0.11)]">
        {/* Chrome */}
        <div className="bg-[#F4F3F0] px-4 py-2.5 flex items-center gap-3 border-b border-[#E5E4E0]">
          <div className="flex gap-1.5 flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 bg-white/80 rounded-md px-3 py-1 text-[10px] text-[#8A8A8A] border border-[#E5E4E0] text-center font-mono truncate">
            app.revenue-os.ru/generate
          </div>
        </div>

        {/* App body */}
        <div className="bg-white flex h-[320px] xl:h-[360px]">
          {/* Sidebar */}
          <div className="w-[52px] bg-[#FAFAF8] border-r border-[#E5E4E0] flex flex-col items-center py-4 gap-3 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <div className="w-px h-3 bg-[#E5E4E0]" />
            {([
              { Icon: Layers, active: true },
              { Icon: BookOpen, active: false },
              { Icon: Settings, active: false },
            ] as const).map(({ Icon, active }, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${active ? 'bg-[#1D4ED8]/10' : ''}`}
              >
                <Icon
                  className="w-3.5 h-3.5"
                  style={{ color: active ? '#1D4ED8' : '#8A8A8A' }}
                  strokeWidth={2}
                />
              </div>
            ))}
          </div>

          {/* Main */}
          <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
            {/* Topbar */}
            <div className="px-4 py-2.5 border-b border-[#E5E4E0] flex items-center justify-between gap-3">
              <p
                className="text-[0.75rem] font-bold text-[#141414] truncate"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                Генерировать контент
              </p>
              <div className="flex items-center gap-1 bg-[#1D4ED8] text-white px-2.5 py-1.5 rounded-full text-[0.625rem] font-bold flex-shrink-0 cursor-default">
                <Zap className="w-2.5 h-2.5" />
                Запустить
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 p-3 overflow-hidden flex flex-col gap-2.5">
              {/* Input */}
              <div className="bg-[#FAFAF8] border border-[#E5E4E0] rounded-xl p-2.5">
                <p className="text-[0.5625rem] font-bold text-[#8A8A8A] uppercase tracking-widest mb-1.5">
                  Описание продукта
                </p>
                <p className="text-[0.6875rem] text-[#525252] leading-relaxed line-clamp-2">
                  Онлайн-курс по SMM. Цена 14 900₽. Аудитория: предприниматели 25–45 лет. Боль: нет
                  времени на контент...
                </p>
              </div>

              {/* Format tabs */}
              <div className="flex gap-1.5 overflow-hidden">
                {(['Telegram', 'Instagram', 'Stories'] as const).map((f, i) => (
                  <span
                    key={f}
                    className={`text-[0.5625rem] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      i === 0 ? 'bg-[#1D4ED8] text-white' : 'bg-[#F4F3F0] text-[#525252]'
                    }`}
                  >
                    {f}
                  </span>
                ))}
              </div>

              {/* Output */}
              <div className="bg-[#FAFAF8] border border-[#E5E4E0] rounded-xl p-3 flex-1 overflow-hidden relative">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-[0.5625rem] font-bold text-[#8A8A8A] uppercase tracking-widest">
                    Telegram-пост
                  </p>
                  <span className="text-[0.5625rem] font-bold text-[#15803D] bg-[#F0FDF4] border border-[#BBF7D0] px-1.5 py-0.5 rounded-full leading-none">
                    87 / A
                  </span>
                </div>
                <p className="text-[0.6875rem] text-[#525252] leading-relaxed">
                  Ты тратишь 2 часа на один пост — а он набирает 3 просмотра и 0 заявок.
                  <br />
                  <br />
                  Вот что реально работает в Telegram прямо сейчас...
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#FAFAF8] to-transparent rounded-b-xl pointer-events-none" />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <div className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-[#F4F3F0] border border-[#E5E4E0] rounded-lg text-[0.5625rem] font-semibold text-[#525252] cursor-default">
                  <Check className="w-2.5 h-2.5" />
                  Скопировать
                </div>
                <div className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-[#1D4ED8] rounded-lg text-[0.5625rem] font-bold text-white cursor-default">
                  <Send className="w-2.5 h-2.5" />
                  В Telegram
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Quality Gate badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 6 }}
        animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.45, delay: 0.85, ease }}
        className="absolute -top-3.5 -right-3.5 flex items-center gap-1.5 bg-[#15803D] text-white text-[0.6875rem] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-green-600/20"
      >
        <Check className="w-3 h-3" strokeWidth={2.5} />
        Quality Gate: 87/100
      </motion.div>
    </div>
  )
}

export function Hero() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section
      ref={ref}
      aria-label="Главный экран"
      className="bg-[#FAFAF8]"
      style={{
        paddingTop: 'clamp(2.25rem, 4.5vw, 4rem)',
        paddingBottom: 'clamp(3rem, 6vw, 5rem)',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* ── Left column ── */}
          <div>
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

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, ease, delay: 0.07 }}
              className="text-[#141414] mb-5"
              style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
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
              className="text-[#525252] mb-8 leading-[1.7]"
              style={{ fontSize: 'clamp(1.0625rem, 1.4vw, 1.175rem)' }}
            >
              Описываете продукт один раз. AI генерирует 6 форматов контента под конверсию за
              40&nbsp;секунд. Каждый текст проходит Quality Gate — если балл ниже&nbsp;80, система
              переписывает сама.
            </motion.p>

            {/* Format pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, ease, delay: 0.22 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {FORMATS.map(f => (
                <span
                  key={f}
                  className="text-xs font-semibold text-[#525252] bg-white border border-[#E5E4E0] px-3 py-1 rounded-full"
                >
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

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease, delay: 0.38 }}
              className="grid grid-cols-3 gap-0 pt-8 border-t border-[#E5E4E0]"
            >
              {STATS.map((s, i) => (
                <div
                  key={i}
                  className={`${i < 2 ? 'pr-5 mr-5 border-r border-[#E5E4E0] sm:pr-8 sm:mr-8' : ''}`}
                >
                  <p
                    className="text-[#141414] leading-none mb-1"
                    style={{
                      fontFamily: 'var(--font-space-grotesk)',
                      fontSize: 'clamp(1.625rem, 3vw, 2.375rem)',
                      fontWeight: 800,
                      letterSpacing: '-0.04em',
                    }}
                  >
                    {s.value}
                    {s.unit && (
                      <span className="text-[1rem] text-[#8A8A8A] font-medium">{s.unit}</span>
                    )}
                  </p>
                  <p className="text-[0.8125rem] font-semibold text-[#525252] leading-snug mb-0.5">
                    {s.label}
                  </p>
                  <p className="text-[0.75rem] text-[#8A8A8A] leading-snug hidden sm:block">
                    {s.sub}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right column — product mockup ── */}
          <motion.div
            initial={{ opacity: 0, x: 28, y: 10 }}
            animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.75, ease, delay: 0.35 }}
            className="hidden lg:block"
          >
            <ProductMockup inView={inView} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
