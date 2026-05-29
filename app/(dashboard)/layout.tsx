import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { PageTransition } from '@/components/layout/PageTransition'
import { FeedbackButton } from '@/components/layout/FeedbackButton'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(160deg, #faf8ff 0%, #f3f0ff 35%, #faf5ff 65%, #f8f9ff 100%)', fontFamily: 'var(--font-space-grotesk), var(--font-geist-sans), sans-serif' }}>
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-40 -left-20 w-[500px] h-[500px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #a78bfa, transparent 65%)' }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #818cf8, transparent 65%)' }} />
      </div>
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
