'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, Menu, X } from 'lucide-react'

const NAV = [
  { label: 'Как работает', href: '#how' },
  { label: 'Результаты', href: '#results' },
  { label: 'Тарифы', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close mobile menu on route change / resize
  useEffect(() => {
    const fn = () => setOpen(false)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E5E4E0] shadow-[0_1px_12px_rgba(0,0,0,0.06)]'
          : 'bg-transparent border-b border-transparent'
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Revenue OS — на главную"
          className="flex items-center gap-2.5 flex-shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4ED8] rounded-md"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] flex items-center justify-center shadow-[0_4px_12px_rgba(124,58,237,0.3)]">
            <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-extrabold text-[0.9375rem] text-[#141414] tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            Revenue OS
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Основная навигация" className="hidden md:flex items-center gap-1">
          {NAV.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium text-[#525252] hover:text-[#141414] transition-colors duration-150 px-4 py-2 rounded-full hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold text-[#525252] hover:text-[#141414] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] rounded-md px-1"
          >
            Войти
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-sm font-bold rounded-full transition-all duration-150 shadow-[0_4px_14px_rgba(29,78,216,0.28)] hover:shadow-[0_6px_20px_rgba(29,78,216,0.36)] hover:-translate-y-px cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            Начать бесплатно
          </Link>
        </div>

        {/* Mobile toggle — min 44px touch target */}
        <button
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          className="md:hidden flex items-center justify-center w-11 h-11 rounded-full hover:bg-black/5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] transition-colors duration-150"
        >
          {open
            ? <X className="w-5 h-5 text-[#141414]" />
            : <Menu className="w-5 h-5 text-[#141414]" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-t border-[#E5E4E0] px-5 pt-3 pb-6 flex flex-col gap-1">
          {NAV.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-base font-medium text-[#525252] hover:text-[#141414] px-3 py-3 rounded-xl hover:bg-black/5 transition-colors cursor-pointer block"
            >
              {label}
            </a>
          ))}
          <div className="flex flex-col gap-2.5 mt-3 pt-3 border-t border-[#E5E4E0]">
            <Link href="/signup" className="w-full text-center py-3.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold rounded-2xl transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]">
              Начать бесплатно — 15 генераций
            </Link>
            <Link href="/login" className="w-full text-center py-3 text-sm font-semibold text-[#525252] hover:text-[#141414] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] rounded-md">
              Войти
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
