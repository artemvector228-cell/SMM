'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, Check, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  generationId: string
  scheduledAt?: string | null
  onScheduled?: (date: string | null) => void
}

export function ScheduleButton({ generationId, scheduledAt, onScheduled }: Props) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('12:00')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scheduledAt) {
      const d = new Date(scheduledAt)
      setDate(d.toISOString().split('T')[0])
      setTime(d.toTimeString().substring(0, 5))
    }
  }, [scheduledAt])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function save() {
    if (!date) { toast.error('Выберите дату'); return }
    setLoading(true)
    try {
      const scheduled_at = new Date(`${date}T${time}:00`).toISOString()
      const res = await fetch(`/api/generations/${generationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduled_at }),
      })
      if (!res.ok) throw new Error()
      toast.success('Пост запланирован!')
      onScheduled?.(scheduled_at)
      setOpen(false)
    } catch {
      toast.error('Ошибка планирования')
    } finally {
      setLoading(false)
    }
  }

  async function unschedule() {
    setLoading(true)
    try {
      await fetch(`/api/generations/${generationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduled_at: null }),
      })
      toast.success('Расписание отменено')
      onScheduled?.(null)
      setDate('')
      setOpen(false)
    } catch {
      toast.error('Ошибка')
    } finally {
      setLoading(false)
    }
  }

  const label = scheduledAt
    ? `${new Date(scheduledAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}`
    : 'Запланировать'

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="cursor-pointer font-semibold gap-1.5 h-8 text-xs"
        style={{ borderColor: 'rgba(124,58,237,0.25)', color: '#7c3aed', background: 'rgba(124,58,237,0.04)' }}
      >
        <Calendar className="w-3.5 h-3.5" />
        {label}
      </Button>

      {open && (
        <div
          className="absolute left-0 top-9 z-50 rounded-xl border p-4 w-64"
          style={{
            background: 'rgba(255,255,255,0.97)',
            borderColor: 'rgba(124,58,237,0.15)',
            boxShadow: '0 8px 32px rgba(109,40,217,0.15)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold" style={{ color: '#1a1035' }}>Запланировать публикацию</p>
            <button onClick={() => setOpen(false)} className="cursor-pointer transition-colors" style={{ color: '#9d8ec4' }}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold" style={{ color: '#9d8ec4' }}>Дата</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full mt-1 px-3 py-1.5 text-sm rounded-lg"
                style={{ border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(255,255,255,0.8)', color: '#1a1035', outline: 'none' }}
              />
            </div>
            <div>
              <label className="text-xs font-semibold" style={{ color: '#9d8ec4' }}>Время</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 text-sm rounded-lg"
                style={{ border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(255,255,255,0.8)', color: '#1a1035', outline: 'none' }}
              />
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 cursor-pointer border-0 text-white font-semibold gap-1"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
                onClick={save}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                Сохранить
              </Button>
              {scheduledAt && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={unschedule}
                  disabled={loading}
                  className="cursor-pointer text-xs"
                  style={{ borderColor: 'rgba(239,68,68,0.25)', color: '#ef4444' }}
                >
                  Отменить
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
