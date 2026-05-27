'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, X, Smartphone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [show, setShow] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    if (standalone) return

    const dismissed = localStorage.getItem('pwa-dismissed')
    if (dismissed) return

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window)
    if (ios) {
      setIsIOS(true)
      setTimeout(() => setShow(true), 3000)
      return
    }

    function onBeforeInstall(e: Event) {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setTimeout(() => setShow(true), 3000)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall)
  }, [])

  async function install() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShow(false)
    setDeferredPrompt(null)
  }

  function dismiss() {
    setShow(false)
    localStorage.setItem('pwa-dismissed', '1')
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-6 md:w-80"
        >
          <div className="bg-card border border-border rounded-2xl shadow-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">Установить приложение</p>
                {isIOS ? (
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Нажмите{' '}
                    <span className="font-medium text-foreground">
                      Поделиться
                    </span>{' '}
                    →{' '}
                    <span className="font-medium text-foreground">
                      На экран «Домой»
                    </span>
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Добавьте Revenue OS на экран для мгновенного доступа
                  </p>
                )}
              </div>
              <button
                onClick={dismiss}
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!isIOS && (
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="flex-1" onClick={install}>
                  <Download className="w-3 h-3 mr-1.5" />
                  Установить
                </Button>
                <Button size="sm" variant="outline" onClick={dismiss} className="flex-1">
                  Не сейчас
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
