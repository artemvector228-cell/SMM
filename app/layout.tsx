import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Space_Grotesk } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { QueryProvider } from '@/components/layout/QueryProvider'
import { ServiceWorkerRegistration } from '@/components/pwa/ServiceWorkerRegistration'
import { InstallPrompt } from '@/components/pwa/InstallPrompt'
import { Analytics } from '@vercel/analytics/react'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const spaceGrotesk = Space_Grotesk({ variable: '--font-space-grotesk', subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
}

export const metadata: Metadata = {
  title: 'Revenue OS — AI-контент для конверсий',
  description: 'Генерируй посты для Instagram, Telegram, Reels и Stories — все форматы заточены под продажи, а не охваты.',
  applicationName: 'Revenue OS',
  keywords: ['SMM', 'контент', 'AI', 'маркетинг', 'Instagram', 'Telegram', 'Reels', 'конверсия'],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Revenue OS',
    title: 'Revenue OS — AI-контент для конверсий',
    description: 'Генерируй посты для Instagram, Telegram, Reels и Stories — все форматы заточены под продажи, а не охваты.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Revenue OS — AI-контент для конверсий',
    description: 'Генерируй посты для Instagram, Telegram, Reels и Stories — все форматы заточены под продажи, а не охваты.',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Revenue OS',
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  manifest: '/manifest.webmanifest',
  other: {
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#7c3aed',
    'msapplication-tap-highlight': 'no',
    'telderi': '54df417abc9550861bd54807a7c178ff',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}
      style={{ colorScheme: 'light', background: '#f9f7ff' }}
    >
      <body className="min-h-screen bg-background text-foreground antialiased overscroll-none" style={{ background: '#f9f7ff' }}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <QueryProvider>
            {children}
            <Toaster richColors position="top-right" />
            <InstallPrompt />
          </QueryProvider>
        </ThemeProvider>
        <ServiceWorkerRegistration />
        <Analytics />
        <Script id="yandex-metrika" strategy="afterInteractive">{`
          (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=109466757', 'ym');
          ym(109466757, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
        `}</Script>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <noscript><div><img src="https://mc.yandex.ru/watch/109466757" style={{position:'absolute', left:'-9999px'}} alt="" /></div></noscript>
      </body>
    </html>
  )
}
