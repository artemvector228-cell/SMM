'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function BillingButton() {
  const [loading, setLoading] = useState(false)

  async function openPortal() {
    setLoading(true)
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      toast.error('Не удалось открыть портал оплаты')
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" className="w-full" onClick={openPortal} disabled={loading}>
      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
      Управление подпиской
    </Button>
  )
}
