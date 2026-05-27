"use client"

import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp, Zap, Target, MessageSquare,
  ArrowRight, Sparkles, CheckCircle, BarChart3, Copy, Check,
} from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const features = [
  {
    icon: Target,
    gradient: 'from-violet-500 to-purple-600',
    glow: '#7c3aed',
    tag: 'Конверсия',
    title: 'Конверсия прежде всего',
    desc: 'Каждый выход оптимизирован под конкретное действие: DM, звонок, подписка или клик на лендинг. Никакого пустого контента.',
    tags: ['Instagram', 'Telegram', 'Reels', 'Stories'],
    wide: true,
  },
  {
    icon: Zap,
    gradient: 'from-indigo-500 to-violet-600',
    glow: '#6d28d9',
    tag: 'Скорость',
    title: '6 форматов за раз',
    desc: 'Instagram, Telegram, Stories, Reels, вирусные хуки и полная стратегия — в один клик.',
    wide: false,
  },
  {
    icon: MessageSquare,
    gradient: 'from-purple-500 to-pink-600',
    glow: '#9333ea',
    tag: 'Продажи',
    title: 'Жёсткие CTA',
    desc: 'Никаких «напишите мне». Каждый материал заканчивается конкретным триггером действия.',
    wide: false,
  },
  {
    icon: TrendingUp,
    gradient: 'from-fuchsia-500 to-violet-600',
    glow: '#a21caf',
    tag: 'Система',
    title: 'Полная система под ваш бизнес',
    desc: 'База знаний о продукте, A/B-трекинг хуков, 30-дневный контент-план и публикация прямо в Telegram — всё в одном инструменте.',
    extras: ['База знаний о продукте', 'A/B-трекинг хуков', '30-дневный контент-план', 'Публикация в Telegram'],
    wide: true,
  },
]

const steps = [
  { num: '01', icon: Target, gradient: 'from-violet-500 to-purple-600', title: 'Опиши продукт', desc: 'Расскажи о продукте, нише и целевой аудитории. Займёт 2 минуты.' },
  { num: '02', icon: Sparkles, gradient: 'from-indigo-500 to-violet-600', title: 'AI генерирует контент', desc: 'Движок создаёт 6 форматов одновременно: посты, сторис, Reels, хуки, Telegram, CTA.' },
  { num: '03', icon: BarChart3, gradient: 'from-purple-500 to-fuchsia-600', title: 'Публикуй и продавай', desc: 'Копируй готовый контент и публикуй. Подписчики превращаются в клиентов.' },
]

const PREVIEW_TABS = [
  {
    id: 'instagram',
    label: 'Instagram',
    color: '#e1306c',
    fields: [
      { label: 'ХУК', text: '95% коучей никогда не выйдут на 300к/мес. Вот почему →' },
      { label: 'УСИЛЕНИЕ БОЛИ', text: 'Ты пишешь каждый день. Вкладываешь душу. Но в директ — тишина. Охват есть, денег нет.' },
      { label: 'ЦЕННОСТЬ', text: 'Проблема не в количестве постов. Дело в конверсионной структуре. Читатель должен чувствовать боль и видеть выход — в одном абзаце.' },
      { label: 'ПРИЗЫВ К ДЕЙСТВИЮ', text: 'Напишите мне слово ПЛАН — пришлю структуру поста, которая даёт заявки.' },
    ],
    hashtags: ['онлайнкоучинг', 'продажичерезинстаграм', 'контентмаркетинг', 'smm'],
  },
  {
    id: 'telegram',
    label: 'Telegram',
    color: '#2aabee',
    fields: [
      { label: 'ХУК', text: 'Я проанализировал 300 аккаунтов коучей. Все, кто зарабатывает 500к+, делают одно и то же.' },
      { label: 'ПРОБЛЕМА', text: 'Большинство экспертов пишут «про себя». Аудитория хочет читать про себя. Это и есть разрыв.' },
      { label: 'ГЛУБОКАЯ ЦЕННОСТЬ', text: 'Формула работающего поста: боль читателя → инсайт → доказательство → конкретный шаг. Не вдохновение — механика.' },
      { label: 'МЯГКИЙ CTA', text: 'Если хочешь разбор своего аккаунта — напишите «РАЗБОР» в личку. Отвечаю лично.' },
    ],
  },
  {
    id: 'hooks',
    label: 'Хуки',
    color: '#7c3aed',
    hooks: [
      'Почему я удалил 200 постов и стал зарабатывать больше',
      'Этот один абзац принёс мне 47 заявок за 3 дня',
      'Все говорят "создавай контент". Никто не говорит — какой именно',
      'Твой контент-план убивает продажи. Вот почему →',
      'Я потратил 2 года на охваты. Потом понял, что это была ловушка',
      'Формула поста на 1 млн охвата существует. Она не та, о которой ты думаешь',
    ],
  },
  {
    id: 'reels',
    label: 'Reels',
    color: '#f59e0b',
    scenes: [
      { label: 'ХУК (0–3 сек)', text: 'Стоп. Ты делаешь одну ошибку, которая убивает все твои продажи.' },
      { label: 'СЦЕНА 1 — Проблема', text: 'Ты пишешь каждый день. Красивый дизайн. Умные тексты. А заявок — ноль.' },
      { label: 'СЦЕНА 2 — Инсайт', text: 'Потому что читатель не понимает, что ты ему предлагаешь. Нет конкретного следующего шага.' },
      { label: 'CTA', text: 'Напиши мне слово ПЛАН — пришлю структуру, которая конвертирует.' },
    ],
  },
]

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded cursor-pointer"
      style={{ color: '#7c3aed' }}
    >
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
    </button>
  )
}

function ProductPreview() {
  const [active, setActive] = useState(0)
  const tab = PREVIEW_TABS[active]

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % PREVIEW_TABS.length), 3800)
    return () => clearInterval(t)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
      className="w-full max-w-3xl mx-auto mt-8 sm:mt-12"
    >
      <div>
        {/* Browser chrome */}
        <div
          className="rounded-t-2xl border border-b-0 px-4 py-3 flex items-center gap-3"
          style={{ background: 'rgba(255,255,255,0.9)', borderColor: 'rgba(124,58,237,0.15)' }}
        >
          <div className="flex gap-1.5">
            {['#f87171', '#fbbf24', '#34d399'].map(c => (
              <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <div
            className="flex-1 h-6 rounded-md flex items-center px-3 text-xs"
            style={{ background: 'rgba(124,58,237,0.06)', color: '#9d8ec4' }}
          >
            revenue-os.app/generate
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', color: '#059669' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            Генерирует...
          </div>
        </div>

        {/* App window */}
        <div
          className="rounded-b-2xl border overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.95)',
            borderColor: 'rgba(124,58,237,0.15)',
            boxShadow: '0 16px 48px rgba(109,40,217,0.14), 0 0 0 1px rgba(124,58,237,0.08)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          {/* Tab bar */}
          <div
            className="flex border-b overflow-x-auto"
            style={{ borderColor: 'rgba(124,58,237,0.1)', background: 'rgba(250,248,255,0.8)' }}
          >
            {PREVIEW_TABS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActive(i)}
                className="px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer relative"
                style={{
                  color: active === i ? t.color : '#9d8ec4',
                  background: active === i ? 'rgba(124,58,237,0.06)' : 'transparent',
                }}
              >
                {t.label}
                {active === i && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: t.color }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-5 min-h-[260px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-3"
              >
                {/* Instagram / Telegram / Reels */}
                {'fields' in tab && tab.fields?.map(({ label, text }) => (
                  <div
                    key={label}
                    className="group rounded-xl p-3 space-y-1"
                    style={{ background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.08)' }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#7c3aed' }}>{label}</span>
                      <CopyBtn text={text} />
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#1a1035' }}>{text}</p>
                  </div>
                ))}

                {'scenes' in tab && tab.scenes?.map(({ label, text }) => (
                  <div
                    key={label}
                    className="group rounded-xl p-3 space-y-1"
                    style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#f59e0b' }}>{label}</span>
                      <CopyBtn text={text} />
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#1a1035' }}>{text}</p>
                  </div>
                ))}

                {/* Hooks */}
                {'hooks' in tab && tab.hooks?.map((hook, i) => (
                  <div
                    key={i}
                    className="group flex items-start gap-3 rounded-xl p-3"
                    style={{ background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.08)' }}
                  >
                    <span className="text-xs font-black w-5 shrink-0 mt-0.5" style={{ color: 'rgba(124,58,237,0.3)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-sm leading-relaxed flex-1" style={{ color: '#1a1035' }}>{hook}</p>
                    <CopyBtn text={hook} />
                  </div>
                ))}

                {/* Instagram hashtags */}
                {'hashtags' in tab && tab.hashtags && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tab.hashtags.map(h => (
                      <span
                        key={h}
                        className="text-xs px-2 py-0.5 rounded-full border"
                        style={{ borderColor: 'rgba(225,48,108,0.2)', color: '#e1306c', background: 'rgba(225,48,108,0.05)' }}
                      >
                        #{h}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom bar */}
          <div
            className="px-5 py-3 flex items-center justify-between border-t"
            style={{ borderColor: 'rgba(124,58,237,0.08)', background: 'rgba(250,248,255,0.8)' }}
          >
            <div className="flex gap-1">
              {PREVIEW_TABS.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300 cursor-pointer"
                  style={{
                    width: active === i ? 16 : 6,
                    height: 6,
                    background: active === i ? '#7c3aed' : 'rgba(124,58,237,0.2)',
                  }}
                  onClick={() => setActive(i)}
                />
              ))}
            </div>
            <span className="text-xs font-semibold" style={{ color: '#9d8ec4' }}>
              {active + 1} / {PREVIEW_TABS.length} формата
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function LandingPage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background: 'linear-gradient(160deg, #faf8ff 0%, #f3f0ff 30%, #faf5ff 60%, #f8f9ff 100%)',
        fontFamily: 'var(--font-space-grotesk), var(--font-geist-sans), sans-serif',
        color: '#1a1035',
      }}
    >
      {/* Mesh gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-40 -left-20 w-[600px] h-[600px] rounded-full opacity-25" style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 65%)' }} />
        <div className="absolute top-[20%] -right-32 w-[500px] h-[500px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 65%)' }} />
        <div className="absolute bottom-[10%] left-[20%] w-[700px] h-[500px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #c084fc 0%, transparent 65%)' }} />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(#6d28d9 1px, transparent 1px), linear-gradient(90deg, #6d28d9 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      </div>

      {/* ── Floating Navbar ── */}
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease }}
        className="fixed top-4 left-0 right-0 z-50 px-4"
      >
        <nav
          className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3 rounded-2xl border"
          style={{
            background: 'rgba(250, 248, 255, 0.92)',
            borderColor: 'rgba(139, 92, 246, 0.18)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 4px 24px rgba(109,40,217,0.08)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 12px #7c3aed40' }}
            >
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-tight" style={{ color: '#1a1035' }}>Revenue OS</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button
                variant="ghost" size="sm"
                className="cursor-pointer font-medium transition-colors duration-200"
                style={{ color: '#5b21b6' }}
              >
                Войти
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="cursor-pointer border-0 text-white font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 14px #7c3aed35' }}
              >
                Начать бесплатно
              </Button>
            </Link>
          </div>
        </nav>
      </motion.header>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative px-5 sm:px-6 pt-24 sm:pt-32 pb-14 sm:pb-24 text-center">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-5xl mx-auto space-y-5 sm:space-y-7">

          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
          >
            <Badge
              className="border px-4 py-1.5 text-sm font-semibold inline-flex items-center gap-1.5"
              style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed', borderColor: 'rgba(124,58,237,0.3)' }}
            >
              <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                <Sparkles className="w-3.5 h-3.5" />
              </motion.span>
              AI-движок конверсий
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.07 }}
            className="text-4xl sm:text-5xl lg:text-[4.75rem] font-black tracking-tight leading-[1.08]"
            style={{ color: '#1a1035' }}
          >
            AI-контент, который
            <br />
            <span
              style={{
                backgroundImage: 'linear-gradient(90deg, #7c3aed, #a855f7, #6366f1, #7c3aed)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                backgroundSize: '300% auto',
                animation: 'shimmer 5s linear infinite',
              }}
            >
              конвертирует в продажи —
            </span>
            <br />а не в охваты
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease, delay: 0.14 }}
            className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto"
            style={{ color: '#6b5b95' }}
          >
            Генерируй посты для Instagram, Telegram, сценарии Reels и вирусные хуки —
            всё заточено под конверсии: DM, звонки, продажи. Не лайки.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.2 }}
            className="flex gap-3 justify-center flex-wrap pt-2"
          >
            <Link href="/signup">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="lg"
                  className="gap-2 cursor-pointer border-0 text-white h-13 px-9 text-base font-semibold"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 8px 32px #7c3aed45' }}
                >
                  <Zap className="w-4 h-4" />
                  Начать бесплатно
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/pricing">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="cursor-pointer h-13 px-9 text-base font-semibold transition-all duration-200"
                  style={{ borderColor: 'rgba(124,58,237,0.3)', color: '#7c3aed', background: 'rgba(124,58,237,0.05)' }}
                >
                  Посмотреть тарифы
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex items-center justify-center gap-2 pt-1"
            style={{ color: '#9d8ec4', fontSize: '0.875rem' }}
          >
            <CheckCircle className="w-4 h-4" style={{ color: '#7c3aed' }} />
            <span>10 генераций бесплатно — карта не нужна</span>
          </motion.div>

          {/* ── Product Preview ── */}
          <ProductPreview />

        </motion.div>
      </section>

      {/* ── Stats strip ── */}
      <FadeUp className="px-5 sm:px-6 pb-16 sm:pb-24">
        <div
          className="max-w-4xl mx-auto rounded-2xl overflow-hidden border"
          style={{
            background: 'rgba(255,255,255,0.7)',
            borderColor: 'rgba(124,58,237,0.15)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 40px rgba(109,40,217,0.1)',
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x" style={{ borderColor: 'rgba(124,58,237,0.1)' }}>
            {[
              { value: '6', label: 'форматов генерируется за раз' },
              { value: '<30с', label: 'до готового контент-пакета' },
              { value: '∞', label: 'контент под любую нишу' },
            ].map(({ value, label }, i) => (
              <FadeUp key={label} delay={i * 0.08}>
                <div className="px-8 py-9 text-center">
                  <div
                    className="text-4xl font-black mb-1"
                    style={{ backgroundImage: 'linear-gradient(135deg, #7c3aed, #a855f7)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}
                  >
                    {value}
                  </div>
                  <div className="text-sm" style={{ color: '#9d8ec4' }}>{label}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ── Features Bento ── */}
      <section className="px-5 sm:px-6 pb-20 sm:pb-28">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <Badge className="border mb-4 px-3 py-1 text-sm font-semibold" style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed', borderColor: 'rgba(124,58,237,0.2)' }}>
              Возможности
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: '#1a1035' }}>
              Всё для контента,{' '}
              <span style={{ backgroundImage: 'linear-gradient(90deg, #7c3aed, #a855f7)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                который продаёт
              </span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, gradient, glow, tag, title, desc, tags, extras, wide }, i) => (
              <FadeUp key={title} delay={i * 0.08} className={wide ? 'md:col-span-2' : ''}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: `0 20px 60px ${glow}22` }}
                  transition={{ duration: 0.25 }}
                  className="h-full rounded-2xl border p-7 cursor-pointer relative overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.75)',
                    borderColor: 'rgba(124,58,237,0.12)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 4px 20px rgba(109,40,217,0.07)',
                  }}
                >
                  {/* Gradient orb in corner */}
                  <div
                    className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-15"
                    style={{ background: `radial-gradient(circle, ${glow}, transparent)` }}
                  />
                  <div className="relative">
                    <div className="flex items-center gap-2.5 mb-5">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}
                        style={{ boxShadow: `0 4px 12px ${glow}40` }}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed' }}>{tag}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: '#1a1035' }}>{title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#6b5b95' }}>{desc}</p>
                    {tags && (
                      <div className="mt-5 flex gap-2 flex-wrap">
                        {tags.map(t => (
                          <span key={t} className="text-xs px-3 py-1 rounded-full border font-medium" style={{ borderColor: 'rgba(124,58,237,0.2)', color: '#7c3aed', background: 'rgba(124,58,237,0.06)' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    {extras && (
                      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {extras.map(f => (
                          <div key={f} className="flex items-center gap-2 text-sm" style={{ color: '#6b5b95' }}>
                            <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#7c3aed' }} />
                            {f}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-5 sm:px-6 pb-20 sm:pb-28">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-14">
            <Badge className="border mb-4 px-3 py-1 text-sm font-semibold" style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed', borderColor: 'rgba(124,58,237,0.2)' }}>
              Как это работает
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: '#1a1035' }}>
              Три шага до контента,{' '}
              <span style={{ backgroundImage: 'linear-gradient(90deg, #7c3aed, #a855f7)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                который продаёт
              </span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {steps.map(({ num, icon: Icon, gradient, title, desc }, i) => (
              <FadeUp key={num} delay={i * 0.09}>
                <motion.div
                  whileHover={{ y: -5, boxShadow: '0 16px 48px rgba(109,40,217,0.12)' }}
                  transition={{ duration: 0.22 }}
                  className="relative rounded-2xl border p-7 cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.75)',
                    borderColor: 'rgba(124,58,237,0.12)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 4px 20px rgba(109,40,217,0.06)',
                  }}
                >
                  <span
                    className="absolute top-5 right-5 text-5xl font-black select-none"
                    style={{ color: 'rgba(124,58,237,0.07)' }}
                  >
                    {num}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5`}
                    style={{ boxShadow: '0 4px 12px rgba(109,40,217,0.25)' }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: '#1a1035' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6b5b95' }}>{desc}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <FadeUp className="px-5 sm:px-6 pb-20 sm:pb-28">
        <div className="max-w-4xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-3xl overflow-hidden border text-center"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #4f46e5 100%)',
              borderColor: 'rgba(167,139,250,0.3)',
              boxShadow: '0 24px 80px rgba(109,40,217,0.35)',
            }}
          >
            {/* Orbs */}
            <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.25), transparent)' }} />
            <div className="absolute bottom-0 right-1/4 w-56 h-56 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.2), transparent)' }} />
            {/* Shimmer strip */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)', backgroundSize: '200% 100%', animation: 'shimmer-bg 4s linear infinite' }} />

            <div className="relative px-8 py-16 sm:px-14 sm:py-20">
              <Badge className="border mb-5 px-3 py-1 text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                Начни сегодня
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-white">
                Готов превратить подписчиков<br />в покупателей?
              </h2>
              <p className="text-lg mb-9 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Первые 10 генераций бесплатно. Кредитная карта не нужна.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link href="/signup">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      size="lg"
                      className="gap-2 cursor-pointer border-0 h-12 px-10 text-base font-bold"
                      style={{ background: 'white', color: '#7c3aed', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
                    >
                      <Zap className="w-4 h-4" />
                      Начать бесплатно
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/pricing">
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="cursor-pointer h-12 px-8 text-base font-semibold gap-2"
                      style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white', background: 'rgba(255,255,255,0.1)' }}
                    >
                      Смотреть тарифы
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </FadeUp>

      {/* ── Footer ── */}
      <footer className="px-6 pb-8 pt-6 border-t" style={{ borderColor: 'rgba(124,58,237,0.12)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
            >
              <TrendingUp className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm" style={{ color: '#1a1035' }}>Revenue OS</span>
          </div>
          <div className="text-sm text-center space-y-0.5" style={{ color: '#9d8ec4' }}>
            <p>© 2026 Revenue OS. AI-платформа для конверсионного контента.</p>
            <p>Самозанятый Ануфриев А.П. · ИНН 027722224358</p>
          </div>
          <div className="flex gap-5 text-sm" style={{ color: '#9d8ec4' }}>
            {[['Войти', '/login'], ['Регистрация', '/signup'], ['Тарифы', '/pricing']].map(([label, href]) => (
              <Link key={href} href={href} className="hover:text-violet-600 transition-colors cursor-pointer">{label}</Link>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 300% center; }
        }
        @keyframes shimmer-bg {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  )
}
