'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Send, CheckCircle, ExternalLink, Info } from 'lucide-react'
import { toast } from 'sonner'

const cardStyle = {
  background: 'rgba(255,255,255,0.75)',
  border: '1px solid rgba(124,58,237,0.12)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 4px 20px rgba(109,40,217,0.07)',
  borderRadius: '1rem',
}

export function TelegramSettings() {
  const [botToken, setBotToken] = useState('')
  const [chatId, setChatId] = useState('')
  const [saved, setSaved] = useState(false)
  const [testing, setTesting] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Load from localStorage first (fast), then sync from server
    setBotToken(localStorage.getItem('tg_bot_token') ?? '')
    setChatId(localStorage.getItem('tg_chat_id') ?? '')

    fetch('/api/settings/telegram')
      .then(r => r.json())
      .then(data => {
        if (data.bot_token) { setBotToken(data.bot_token); localStorage.setItem('tg_bot_token', data.bot_token) }
        if (data.chat_id) { setChatId(data.chat_id); localStorage.setItem('tg_chat_id', data.chat_id) }
      })
      .catch(() => { /* fallback to localStorage */ })
  }, [])

  async function save() {
    setSaving(true)
    try {
      // Save to localStorage (for immediate use)
      localStorage.setItem('tg_bot_token', botToken.trim())
      localStorage.setItem('tg_chat_id', chatId.trim())

      // Save to server (for scheduled auto-posting)
      const res = await fetch('/api/settings/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bot_token: botToken.trim(), chat_id: chatId.trim() }),
      })
      if (!res.ok) throw new Error()

      setSaved(true)
      toast.success('Настройки Telegram сохранены')
      setTimeout(() => setSaved(false), 2000)
    } catch {
      // Even if server save fails, localStorage is set
      toast.success('Настройки сохранены локально')
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  async function testConnection() {
    if (!botToken || !chatId) {
      toast.error('Введите токен и ID чата')
      return
    }
    setTesting(true)
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: '✅ Revenue OS подключён! Теперь можно публиковать контент прямо из библиотеки.' }),
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Тест успешен! Проверьте ваш Telegram')
      } else {
        toast.error(data.description ?? 'Ошибка подключения')
      }
    } catch {
      toast.error('Не удалось подключиться')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div style={cardStyle} className="p-5 space-y-5">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 10px rgba(99,102,241,0.3)' }}>
          <Send className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-sm" style={{ color: '#1a1035' }}>Публикация в Telegram</h2>
          <p className="text-xs" style={{ color: '#9d8ec4' }}>Отправляйте контент из библиотеки напрямую в канал</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium" style={{ color: '#1a1035' }}>Bot Token</Label>
          <Input
            placeholder="1234567890:ABCDEFghijklmnop..."
            value={botToken}
            onChange={e => setBotToken(e.target.value)}
            className="text-sm"
            style={{ borderColor: 'rgba(124,58,237,0.2)', background: 'rgba(255,255,255,0.8)' }}
          />
          <p className="text-xs" style={{ color: '#9d8ec4' }}>
            Получить у{' '}
            <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 underline" style={{ color: '#7c3aed' }}>
              @BotFather <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium" style={{ color: '#1a1035' }}>Chat ID / Username канала</Label>
          <Input
            placeholder="@mychannel или -1001234567890"
            value={chatId}
            onChange={e => setChatId(e.target.value)}
            className="text-sm"
            style={{ borderColor: 'rgba(124,58,237,0.2)', background: 'rgba(255,255,255,0.8)' }}
          />
          <p className="text-xs" style={{ color: '#9d8ec4' }}>Для канала: @username. Для чата: используйте @userinfobot</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={save}
          disabled={saving}
          size="sm"
          className="cursor-pointer border-0 text-white font-semibold flex items-center gap-2"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
        >
          {saved ? <CheckCircle className="w-3.5 h-3.5" /> : null}
          {saved ? 'Сохранено' : saving ? 'Сохраняю...' : 'Сохранить'}
        </Button>
        <Button
          onClick={testConnection}
          disabled={testing}
          variant="outline"
          size="sm"
          className="cursor-pointer font-semibold"
          style={{ borderColor: 'rgba(124,58,237,0.25)', color: '#7c3aed' }}
        >
          {testing ? 'Проверяю...' : 'Тест подключения'}
        </Button>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: '#6366f1' }} />
        <p className="text-xs leading-relaxed" style={{ color: '#4c3d75' }}>
          После сохранения запланированные посты будут отправляться автоматически.
          Бот должен быть администратором канала с правом публикации сообщений.
        </p>
      </div>
    </div>
  )
}
