'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Zap, Library, LayoutDashboard, Settings,
  TrendingUp, CalendarDays, CalendarRange,
  BarChart3, Brain, Star,
} from 'lucide-react'

const nav = [
  { href: '/dashboard',    label: 'Главная',      icon: LayoutDashboard },
  { href: '/generate',     label: 'Генератор',    icon: Zap },
  { href: '/knowledge',    label: 'База знаний',  icon: Brain },
  { href: '/content-plan', label: 'Контент-план', icon: CalendarRange },
  { href: '/library',      label: 'Библиотека',   icon: Library },
  { href: '/templates',    label: 'Мои связки',   icon: Star },
  { href: '/analytics',    label: 'Аналитика',    icon: BarChart3 },
  { href: '/schedule',     label: 'Расписание',   icon: CalendarDays },
  { href: '/settings',     label: 'Настройки',    icon: Settings },
]

export function Sidebar({ forceVisible }: { forceVisible?: boolean } = {}) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'flex flex-col w-60 min-h-screen shrink-0 border-r',
        forceVisible ? 'flex' : 'hidden md:flex',
      )}
      style={{
        background: '#FFFFFF',
        borderColor: '#E6E3DB',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b shrink-0" style={{ borderColor: '#E6E3DB' }}>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: '#1B40AE' }}
        >
          <TrendingUp className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
        </div>
        <span
          className="font-bold text-sm tracking-tight"
          style={{ color: '#111110', fontFamily: 'var(--font-space-grotesk)' }}
        >
          Revenue OS
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1 px-3 py-4 overflow-y-auto">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer',
              )}
              style={
                active
                  ? { background: '#EDF0FB', color: '#1B40AE', fontWeight: 600 }
                  : { color: '#494743' }
              }
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLElement).style.background = '#F5F4F0'
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'
              }}
            >
              <Icon className="w-4 h-4 shrink-0" strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t shrink-0" style={{ borderColor: '#E6E3DB' }}>
        <p className="text-xs" style={{ color: '#C0BDB8' }}>Revenue OS · AI контент-система</p>
      </div>
    </aside>
  )
}
