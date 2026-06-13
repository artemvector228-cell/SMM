'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { LogOut, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Sidebar } from './Sidebar'

const PAGE_LABELS: Record<string, string> = {
  '/dashboard':    'Главная',
  '/generate':     'Генератор',
  '/knowledge':    'База знаний',
  '/content-plan': 'Контент-план',
  '/library':      'Библиотека',
  '/templates':    'Мои связки',
  '/analytics':    'Аналитика',
  '/schedule':     'Расписание',
  '/settings':     'Настройки',
}

export function Header() {
  const router = useRouter()
  const pathname = usePathname()

  const pageLabel = PAGE_LABELS[pathname] ?? 'Revenue OS'

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header
      className="h-14 flex items-center justify-between px-4 shrink-0 border-b"
      style={{ background: '#FFFFFF', borderColor: '#E6E3DB' }}
    >
      {/* Mobile: hamburger */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger
            className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors cursor-pointer"
            style={{ color: '#494743' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F5F4F0' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <Menu className="w-4 h-4" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-60">
            <Sidebar forceVisible />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: page label */}
      <p
        className="hidden md:block text-sm font-semibold"
        style={{ color: '#111110', fontFamily: 'var(--font-space-grotesk)' }}
      >
        {pageLabel}
      </p>

      {/* Right actions */}
      <div className="flex items-center gap-1 ml-auto">
        <button
          onClick={signOut}
          className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors cursor-pointer"
          style={{ color: '#8A8882' }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.background = '#F5F4F0'
            el.style.color = '#111110'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.background = 'transparent'
            el.style.color = '#8A8882'
          }}
          aria-label="Выйти из аккаунта"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
