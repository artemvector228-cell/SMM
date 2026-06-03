'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ArrowRight, ShieldCheck, Zap, Check,
  BookOpen, Layers, Settings, TrendingUp, Send,
} from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

function ProductMockup({ inView }: { inView: boolean }) {
  return (
    <div className="relative w-full select-none" aria-hidden="true">
      <div className="rounded-2xl overflow-hidden border border-[#E0DDD6] shadow-[0_8px_32px_rgba(0,0,0,0.07),0_1px_4px_rgba(0,0,0,0.04)]">
        {/* Chrome bar */}
        <div className="bg-[#F0EFE9] px-4 py-2.5 flex items-center gap-3 border-b border-[#E0DDD6]">
          <div className="flex gap-1.5 flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 bg-white/70 rounded-md px-3 py-1 text-[10px] text-[#8A8882] border border-[#E0DDD6] text-center font-mono truncate">
            app.revenue-os.ru/generate
          </div>
        </div>

        {/* App shell */}
        <div className="bg-white flex h-[320px] xl:h-[360px]">
          {/* Sidebar */}
          <div className="w-[52px] bg-[#F5F4F0] border-r border-[#E0DDD6] flex flex-col items-center py-4 gap-3 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-[#1B40AE] flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <div className="w-px h-3 bg-[#E0DDD6]" />
            {([
              { Icon: Layers, active: true },
              { Icon: BookOpen, active: false },
              { Icon: Settings, active: false },
            ] as const).map(({ Icon, active }, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${active ? 'bg-[#1B40AE]/10' : ''}`}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: active ? '#1B40AE' : '#8A8882' }} strokeWidth={2} />
              </div>
            ))}
          </div>

          {/* Main panel */}
          <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[#E0DDD6] flex items-center justify-between gap-3">
              <p className="text-[0.75rem] font-bold text-[#111110] truncate" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                Генерировать контент
              </p>
              <div className="flex items-center gap-1 bg-[#1B40AE] text-white px-2.5 py-1.5 rounded-full text-[0.625rem] font-bold flex-shrink-0 cursor-default">
                <Zap className="w-2.5 h-2.5" />
                Запустить
              </div>
            </div>

            <div className="flex-1 p-3 overflow-hidden flex flex-col gap-2.5">
              <div className="bg-[#F5F4F0] border border-[#E0DDD6] rounded-xl p-2.5">
                <p className="text-[0.5625rem] font-bold text-[#8A8882] uppercase tracking-widest mb-1.5">Описание продукта</p>
                <p className="text-[0.6875rem] text-[#494743] leading-relaxed line-clamp-2">
                  Онлайн-курс по SMM. Цена 14 900₽. Аудитория: предприниматели 25–45 лет. Боль: нет времени на контент...
                </p>
              </div>

              <div className="flex gap-1.5 overflow-hidden">
                {(['Telegram', 'Instagram', 'Stories'] as const).map((f, i) => (
                  <span key={f} className={`text-[0.5625rem] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${i === 0 ? 'bg-[#1B40AE] text-white' : 'bg-[#F0EFE9] text-[#494743]'}`}>
                    {f}
                  </span>
                ))}
              </div>

              <div className="bg-[#F5F4F0] border border-[#E0DDD6] rounded-xl p-3 flex-1 overflow-hidden relative">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-[0.5625rem] font-bold text-[#8A8882] uppercase tracking-widest">Telegram-пост</p>
                  <span className="text-[0.5625rem] font-bold text-[#186435] bg-[#EDF9F2] border border-[#B3E8CC] px-1.5 py-0.5 rounded-full leading-none">
                    87 / A
                  </span>
                </div>
                <p className="text-[0.6875rem] text-[#494743] leading-relaxed">
                  Ты тратишь 2 часа на один пост — а он набирает 3 просмотра и 0 заявок.<br /><br />
                  Вот что реально работает в Telegram прямо сейчас...
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#F5F4F0] to-transparent rounded-b-xl pointer-events-none" />
              </div>

              <div className="flex gap-2">
                <div className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-[#F0EFE9] border border-[#E0DDD6] rounded-lg text-[0.5625rem] font-semibold text-[#494743] cursor-default">
                  <Check className="w-2.5 h-2.5" />
                  Скопировать
                </div>
                <div className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-[#1B40AE] rounded-lg text-[0.5625rem] font-bold text-white cursor-default">
                  <Send className="w-2.5 h-2.5" />
                  В Telegram
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 6 }}
        animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.45, delay: 0.9, ease }}
        className="absolute -top-3.5 -right-3.5 flex items-center gap-1.5 bg-[#186435] text-white text-[0.6875rem] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-green-900/15"
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
      className="bg-[#F5F4F0]"
      style={{ paddingTop: 'clamp(2.5rem, 5vw, 4.5rem)', paddingBottom: 'clamp(3.5rem, 6vw, 5.5rem)' }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* Left — copy */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, ease }}
              className="flex items-center gap-2 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#186435] flex-shrink-0" />
              <p className="text-sm font-medium text-[#494743] tracking-wide">
                Контент-система для предпринимателей
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease, delay: 0.06 }}
              className="text-[#111110] mb-6"
              style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: 'clamp(2.625rem, 4.8vw, 4.25rem)',
                fontWeight: 800,
                lineHeight: 1.06,
                letterSpacing: '-0.04em',
              }}
            >
              Контент, который<br />
              работает<br />
              на продажи
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease, delay: 0.14 }}
              className="text-[#494743] mb-9 leading-[1.72]"
              style={{ fontSize: 'clamp(1.0625rem, 1.4vw, 1.175rem)' }}
            >
              Опишите продукт один раз — система запоминает голос бренда, аудиторию
              и боли клиентов. Шесть форматов за 40&nbsp;секунд, каждый проходит
              Quality Gate, публикуется напрямую в Telegram.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease, delay: 0.22 }}
              className="flex flex-wrap items-center gap-4 mb-5"
            >
              <Link
                href="/signup"
                aria-label="Начать бесплатно — 15 генераций, карта не нужна"
                className="inline-flex items-center gap-2 px-7 py-4 bg-[#1B40AE] hover:bg-[#163596] text-white font-bold rounded-full transition-all duration-150 shadow-[0_4px_16px_rgba(27,64,174,0.28)] hover:shadow-[0_6px_24px_rgba(27,64,174,0.36)] hover:-translate-y-0.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#1B40AE]"
                style={{ fontSize: '1rem' }}
              >
                Начать бесплатно
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Link>
              <a
                href="#how"
                className="inline-flex items-center gap-2 px-6 py-4 border border-[#D0CCC4] hover:border-[#111110] text-[#494743] hover:text-[#111110] font-semibold rounded-full transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#1B40AE]"
                style={{ fontSize: '1rem' }}
              >
                Как работает
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, ease, delay: 0.3 }}
              className="flex items-center gap-1.5 text-sm text-[#8A8882]"
            >
              <ShieldCheck className="w-4 h-4 text-[#186435] flex-shrink-0" />
              Без карты · 15 генераций бесплатно · Отмена в любой момент
            </motion.p>
          </div>

          {/* Right — product mockup */}
          <motion.div
            initial={{ opacity: 0, x: 28, y: 8 }}
            animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.32 }}
            className="hidden lg:block"
          >
            <ProductMockup inView={inView} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
