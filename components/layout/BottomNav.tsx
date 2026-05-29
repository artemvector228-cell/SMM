'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Zap, Library, CalendarDays, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/dashboard', label: 'Главная', icon: LayoutDashboard },
  { href: '/generate', label: 'Генератор', icon: Zap },
  { href: '/schedule', label: 'Календарь', icon: CalendarDays },
  { href: '/library', label: 'Библиотека', icon: Library },
  { href: '/settings', label: 'Настройки', icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t pb-safe"
      style={{
        background: 'rgba(250,248,255,0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'rgba(124,58,237,0.12)',
      }}
    >
      <div className="flex items-stretch h-14">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn('flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer')}
              style={{ color: active ? '#7c3aed' : '#9d8ec4' }}
            >
              <Icon className={cn('w-5 h-5', active && 'stroke-[2.5]')} />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
