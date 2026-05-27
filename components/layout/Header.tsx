'use client'

import { ThemeToggle } from './ThemeToggle'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Sidebar } from './Sidebar'

export function Header() {
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header
      className="h-14 flex items-center justify-between px-4 shrink-0 border-b"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'rgba(124,58,237,0.12)',
      }}
    >
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger className="p-2 rounded-lg transition-colors cursor-pointer" style={{ color: '#6b5b95' }}>
            <Menu className="w-4 h-4" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-60">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <Button
          variant="ghost" size="icon"
          onClick={signOut}
          className="cursor-pointer transition-colors duration-200"
          style={{ color: '#6b5b95' }}
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  )
}
