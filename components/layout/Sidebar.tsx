'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Zap, Library, LayoutDashboard, Settings, TrendingUp, CalendarDays, CalendarRange, BarChart3, Brain, Star } from 'lucide-react'

const nav = [
  { href: '/dashboard', label: 'Главная', icon: LayoutDashboard },
  { href: '/generate', label: 'Генератор', icon: Zap },
  { href: '/knowledge', label: 'База знаний', icon: Brain },
  { href: '/content-plan', label: 'Контент-план', icon: CalendarRange },
  { href: '/library', label: 'Библиотека', icon: Library },
  { href: '/templates', label: 'Мои связки', icon: Star },
  { href: '/analytics', label: 'Аналитика', icon: BarChart3 },
  { href: '/schedule', label: 'Расписание', icon: CalendarDays },
  { href: '/settings', label: 'Настройки', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="hidden md:flex flex-col w-60 min-h-screen p-4 shrink-0 border-r"
      style={{
        background: 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(124,58,237,0.12)',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      <div className="flex items-center gap-2.5 mb-8 px-2">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 12px #7c3aed35' }}
        >
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-sm" style={{ color: '#1a1035' }}>Revenue OS</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer')}
              style={active ? {
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                color: 'white',
                boxShadow: '0 4px 12px #7c3aed30',
              } : {
                color: '#6b5b95',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.08)' }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto px-3 py-2 text-xs" style={{ color: '#9d8ec4' }}>
        AI Revenue Content OS
      </div>
    </aside>
  )
}
