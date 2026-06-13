import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { PageTransition } from '@/components/layout/PageTransition'
import { FeedbackButton } from '@/components/layout/FeedbackButton'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: '#F5F4F0', fontFamily: 'var(--font-geist-sans), sans-serif' }}>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="flex-1 p-4 md:p-6 overflow-auto pb-28 md:pb-6">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
      <BottomNav />
      <FeedbackButton />
    </div>
  )
}
