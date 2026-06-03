'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

const FAQS = [
  {
    q: 'Чем Revenue OS отличается от ChatGPT?',
    a: 'ChatGPT — универсальный инструмент. Revenue OS специализирован: знает формулы конверсионных хуков, структуры постов под каждую платформу, психологические триггеры продаж. Главное отличие — Quality Gate: он оценивает результат и переписывает до нужного уровня. ChatGPT так не делает.',
  },
  {
    q: 'Нужно ли каждый раз вводить данные о продукте?',
    a: 'Нет. Заполняете базу знаний один раз: продукт, аудитория, боли, голос бренда. Данные сохраняются в облаке и автоматически подставляются в каждую генерацию — с любого устройства.',
  },
  {
    q: 'Что такое Quality Gate и как он работает?',
    a: 'После генерации встроенный AI-редактор оценивает каждый текст по 6 критериям: ясность (0-20), конкретика (0-20), конверсионная сила (0-25), оригинальность (0-15), доверие (0-10), соответствие платформе (0-10). Итог ниже 80 — находит конкретные проблемы и переписывает. Вы видите оценку и чип грейда (S/A/B/C).',
  },
  {
    q: 'Работает ли для моей ниши?',
    a: 'Система работает для любого оффера где есть продажа через контент: онлайн-курсы, коучинг, товары, услуги, SaaS, рестораны, B2B. 15 бесплатных генераций — достаточно чтобы проверить на вашей нише без риска.',
  },
  {
    q: 'Как работает публикация в Telegram?',
    a: 'В настройках вводите токен вашего бота и ID канала (бот создаётся бесплатно через @BotFather за 2 минуты). Из библиотеки контента открываете редактор, редактируете текст, добавляете фото/видео и эмодзи — нажимаете «Отправить». Пост идёт в канал напрямую.',
  },
  {
    q: 'Можно ли отменить подписку?',
    a: 'Да, в любой момент из раздела настроек. Никаких штрафов и скрытых условий. Доступ сохраняется до конца оплаченного периода.',
  },
]

function Item({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-[#E5E4E0] last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full flex items-start justify-between gap-4 py-5 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] rounded-sm"
      >
        <span
          className="text-[#141414] font-semibold leading-snug"
          style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(0.9375rem, 1.2vw, 1.0625rem)' }}
        >
          {q}
        </span>
        <span className="flex-shrink-0 mt-0.5 text-[#8A8A8A]">
          {open
            ? <Minus className="w-5 h-5" strokeWidth={2} />
            : <Plus className="w-5 h-5" strokeWidth={2} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="faq-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease }}
            style={{ overflow: 'hidden' }}
          >
            <p className="pb-5 text-[#525252] leading-[1.75] text-[0.9375rem]">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQ() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="faq" ref={ref} aria-label="Часто задаваемые вопросы" className="bg-white py-20 sm:py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease }}
            className="lg:sticky lg:top-24"
          >
            <p className="text-[0.8125rem] font-bold text-[#1D4ED8] uppercase tracking-[0.08em] mb-4">FAQ</p>
            <h2
              className="text-[#141414] mb-4"
              style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: 'clamp(1.875rem, 3.5vw, 2.625rem)',
                fontWeight: 800,
                lineHeight: 1.12,
                letterSpacing: '-0.035em',
              }}
            >
              Ответы на частые вопросы
            </h2>
            <p className="text-[#8A8A8A] text-[0.9375rem] leading-relaxed">
              Остались вопросы? Пишите через кнопку обратной связи — ответим в течение часа.
            </p>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1, ease }}
          >
            {FAQS.map((faq, i) => (
              <Item key={i} q={faq.q} a={faq.a} defaultOpen={i === 0} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
