import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

const LINKS = [
  { group: 'Продукт', items: [
    { label: 'Как работает', href: '#how' },
    { label: 'Тарифы', href: '/pricing' },
    { label: 'FAQ', href: '#faq' },
  ]},
  { group: 'Аккаунт', items: [
    { label: 'Войти', href: '/login' },
    { label: 'Регистрация', href: '/signup' },
  ]},
  { group: 'Правовое', items: [
    { label: 'Политика конфиденциальности', href: '/privacy' },
  ]},
]

export function LandingFooter() {
  return (
    <footer className="bg-[#FAFAF8] border-t border-[#E5E4E0]" role="contentinfo">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-14 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              aria-label="Revenue OS — на главную"
              className="inline-flex items-center gap-2.5 mb-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] rounded-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-sm text-[#141414] tracking-tight" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                Revenue OS
              </span>
            </Link>
            <p className="text-sm text-[#8A8A8A] leading-relaxed max-w-[16rem]">
              AI-контент под конверсии — Instagram, Telegram, Stories, Reels.
            </p>
          </div>

          {/* Nav groups */}
          {LINKS.map(({ group, items }) => (
            <div key={group}>
              <p className="text-xs font-bold text-[#525252] uppercase tracking-wider mb-4">{group}</p>
              <ul className="flex flex-col gap-3">
                {items.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-[#8A8A8A] hover:text-[#141414] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] rounded-sm"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-[#E5E4E0]">
          <p className="text-sm text-[#8A8A8A]">
            © {new Date().getFullYear()} Revenue OS. Все права защищены.
          </p>
          <p className="text-xs text-[#C0BDB8]">
            Сделано для предпринимателей, которые хотят результат
          </p>
        </div>
      </div>
    </footer>
  )
}
