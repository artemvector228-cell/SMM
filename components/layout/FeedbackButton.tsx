'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageSquarePlus, X, Send, Check } from 'lucide-react'
import { toast } from 'sonner'

const TYPES = [
  { value: 'bug', label: '🐛 Нашёл баг' },
  { value: 'feature', label: '✨ Предложение' },
  { value: 'general', label: '💬 Общее' },
]

export function FeedbackButton() {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState('general')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  async function submit() {
    if (!message.trim()) return
    setSending(true)
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, type }),
      })
      setDone(true)
      setMessage('')
      setTimeout(() => { setDone(false); setOpen(false) }, 2000)
    } catch {
      toast.error('Не удалось отправить. Попробуйте ещё раз.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-20 right-4 md:bottom-6 z-40 w-11 h-11 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-transform active:scale-95"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}
        title="Оставить отзыв или предложение"
      >
        {open ? <X className="w-5 h-5 text-white" /> : <MessageSquarePlus className="w-5 h-5 text-white" />}
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed bottom-36 right-4 md:bottom-20 z-40 w-80 rounded-2xl shadow-2xl p-4 space-y-3"
          style={{
            background: 'rgba(255,255,255,0.98)',
            border: '1px solid rgba(124,58,237,0.15)',
            boxShadow: '0 20px 60px rgba(109,40,217,0.2)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center justify-between">
            <p className="font-bold text-sm" style={{ color: '#1a1035' }}>Обратная связь</p>
            <button onClick={() => setOpen(false)} className="cursor-pointer p-0.5 rounded" style={{ color: '#9d8ec4' }}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {done ? (
            <div className="py-4 text-center space-y-2">
              <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center"
                style={{ background: 'rgba(16,185,129,0.1)' }}>
                <Check className="w-5 h-5" style={{ color: '#059669' }} />
              </div>
              <p className="font-semibold text-sm" style={{ color: '#1a1035' }}>Спасибо!</p>
              <p className="text-xs" style={{ color: '#9d8ec4' }}>Мы обязательно рассмотрим ваше сообщение</p>
            </div>
          ) : (
            <>
              <div className="flex gap-1.5 flex-wrap">
                {TYPES.map(t => (
                  <button
                    key={t.value}
                    onClick={() => setType(t.value)}
                    className="text-xs px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-all"
                    style={type === t.value
                      ? { background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: 'white' }
                      : { background: 'rgba(124,58,237,0.07)', color: '#6b5b95', border: '1px solid rgba(124,58,237,0.15)' }
                    }
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Опишите проблему или предложение..."
                rows={4}
                className="w-full text-sm rounded-xl px-3 py-2 resize-none outline-none"
                style={{
                  border: '1px solid rgba(124,58,237,0.2)',
                  background: 'rgba(255,255,255,0.8)',
                  color: '#1a1035',
                }}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit() }}
              />

              <Button
                onClick={submit}
                disabled={sending || !message.trim()}
                size="sm"
                className="w-full cursor-pointer border-0 text-white font-semibold gap-2"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
              >
                <Send className="w-3.5 h-3.5" />
                {sending ? 'Отправляю...' : 'Отправить'}
              </Button>
              <p className="text-xs text-center" style={{ color: '#9d8ec4' }}>Cmd+Enter для быстрой отправки</p>
            </>
          )}
        </div>
      )}
    </>
  )
}
