'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Trash2, RefreshCw, Library, ChevronLeft, ChevronRight, Send, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, Star, Camera, Copy, Check, X } from 'lucide-react'
import { StarButton } from '@/app/(dashboard)/templates/page'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Generation } from '@/types'
import { OutputCards } from '@/components/generator/OutputCards'
import { TelegramEditorModal } from '@/components/library/TelegramEditor'

const cardStyle = {
  background: 'rgba(255,255,255,0.75)',
  border: '1px solid rgba(124,58,237,0.12)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 4px 20px rgba(109,40,217,0.07)',
  borderRadius: '1rem',
}

const GOAL_LABELS: Record<string, string> = { dm: 'DM', telegram: 'Telegram', call: 'Звонок', landing: 'Лендинг' }
const TONE_LABELS: Record<string, string> = { aggressive: 'Агрессивный', authoritative: 'Авторитетный', empathetic: 'Эмпатичный', bold: 'Смелый', professional: 'Профессиональный' }

type HookResult = 'worked' | 'failed' | null

function TelegramButton({ genId }: { genId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function getTgCredentials() {
    let botToken = localStorage.getItem('tg_bot_token')
    let chatId = localStorage.getItem('tg_chat_id')
    if (!botToken || !chatId) {
      try {
        const r = await fetch('/api/settings/telegram')
        const d = await r.json()
        if (d.bot_token) { botToken = d.bot_token; localStorage.setItem('tg_bot_token', d.bot_token) }
        if (d.chat_id) { chatId = d.chat_id; localStorage.setItem('tg_chat_id', d.chat_id) }
      } catch { /* ignore */ }
    }
    return { botToken, chatId }
  }

  async function publish(format: string) {
    const { botToken, chatId } = await getTgCredentials()
    if (!botToken || !chatId) {
      toast.error('Настройте Telegram в разделе Настройки')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/telegram/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generation_id: genId, bot_token: botToken, chat_id: chatId, format }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Отправлено в Telegram!')
        setOpen(false)
      } else {
        toast.error(data.error ?? 'Ошибка отправки')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      <Button
        variant="outline" size="sm"
        onClick={() => setOpen(o => !o)}
        className="cursor-pointer h-8 gap-1.5 font-semibold text-xs"
        style={{ borderColor: 'rgba(99,102,241,0.3)', color: '#6366f1', background: 'rgba(99,102,241,0.05)' }}
      >
        <Send className="w-3.5 h-3.5" /> Telegram
      </Button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-20 rounded-xl border py-1 min-w-44"
          style={{ background: 'rgba(255,255,255,0.95)', borderColor: 'rgba(124,58,237,0.15)', boxShadow: '0 8px 32px rgba(109,40,217,0.15)', backdropFilter: 'blur(16px)' }}
        >
          {[
            { format: 'telegram', label: 'Telegram-пост' },
            { format: 'instagram', label: 'Instagram-пост' },
            { format: 'hooks', label: 'Вирусные хуки' },
          ].map(({ format, label }) => (
            <button
              key={format}
              onClick={() => publish(format)}
              disabled={loading}
              className="w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer"
              style={{ color: '#1a1035' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {loading ? 'Отправка...' : label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function InstagramModal({ gen, onClose }: { gen: Generation; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const ig = gen.output_json?.instagram_post
  if (!ig) return null

  const text = [
    ig.hook,
    ig.pain_agitation,
    ig.value_body,
    ig.cta,
    ig.hashtags?.map((h: string) => `#${h}`).join(' '),
  ].filter(Boolean).join('\n\n')

  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />
      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          pointerEvents: 'none',
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            pointerEvents: 'auto',
            width: '100%',
            maxWidth: '32rem',
            borderRadius: '1.25rem',
            padding: '1.25rem',
            maxHeight: '80vh',
            overflowY: 'auto',
            background: '#fff',
            boxShadow: '0 24px 60px rgba(109,40,217,0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '1.75rem', height: '1.75rem', borderRadius: '0.5rem',
                background: 'linear-gradient(135deg, #f58529, #dd2a7b, #8134af, #515bd4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Camera style={{ width: '1rem', height: '1rem', color: '#fff' }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1a1035' }}>Instagram-пост</span>
            </div>
            <button onClick={onClose} style={{ cursor: 'pointer', color: '#9d8ec4', background: 'none', border: 'none', padding: '0.25rem' }}>
              <X style={{ width: '1rem', height: '1rem' }} />
            </button>
          </div>

          <div style={{
            borderRadius: '0.75rem', padding: '1rem',
            fontSize: '0.875rem', whiteSpace: 'pre-wrap', lineHeight: 1.6,
            background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.1)', color: '#1a1035',
            marginBottom: '1rem',
          }}>
            {text}
          </div>

          <Button
            onClick={copy}
            className="w-full cursor-pointer border-0 text-white font-semibold gap-2"
            style={{ background: 'linear-gradient(135deg, #f58529, #dd2a7b, #8134af)' }}
          >
            {copied ? <><Check className="w-4 h-4" /> Скопировано!</> : <><Copy className="w-4 h-4" /> Скопировать текст</>}
          </Button>
          <p style={{ fontSize: '0.75rem', textAlign: 'center', color: '#9d8ec4', marginTop: '0.75rem' }}>
            Скопируйте текст и вставьте в приложение Instagram при создании публикации
          </p>
        </div>
      </div>
    </>
  )
}

function HookTracker({ genId, hooks }: { genId: string; hooks: string[] }) {
  const [results, setResults] = useState<Record<number, HookResult>>({})

  useEffect(() => {
    const stored = localStorage.getItem(`hooks_${genId}`)
    if (stored) setResults(JSON.parse(stored))
  }, [genId])

  function markHook(idx: number, result: HookResult) {
    const updated = { ...results, [idx]: result }
    setResults(updated)
    localStorage.setItem(`hooks_${genId}`, JSON.stringify(updated))
    toast.success(result === 'worked' ? 'Хук отмечен как рабочий 👍' : 'Отмечено как не сработало')
  }

  const workedCount = Object.values(results).filter(v => v === 'worked').length

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold" style={{ color: '#1a1035' }}>Вирусные хуки — A/B трекинг</p>
        {workedCount > 0 && (
          <Badge className="text-xs border" style={{ background: 'rgba(16,185,129,0.1)', color: '#059669', borderColor: 'rgba(16,185,129,0.25)' }}>
            {workedCount} сработало
          </Badge>
        )}
      </div>
      {hooks.map((hook, i) => (
        <div
          key={i}
          className="flex items-start gap-2 p-3 rounded-xl"
          style={{
            background: results[i] === 'worked' ? 'rgba(16,185,129,0.07)' : results[i] === 'failed' ? 'rgba(239,68,68,0.05)' : 'rgba(124,58,237,0.04)',
            border: `1px solid ${results[i] === 'worked' ? 'rgba(16,185,129,0.2)' : results[i] === 'failed' ? 'rgba(239,68,68,0.15)' : 'rgba(124,58,237,0.1)'}`,
          }}
        >
          <p className="text-xs flex-1 leading-relaxed" style={{ color: '#4c3d75' }}>{hook}</p>
          <div className="flex gap-1 shrink-0 mt-0.5">
            <button
              onClick={() => markHook(i, results[i] === 'worked' ? null : 'worked')}
              className="p-1 rounded-lg transition-colors cursor-pointer"
              style={{ background: results[i] === 'worked' ? 'rgba(16,185,129,0.15)' : 'transparent', color: results[i] === 'worked' ? '#059669' : '#9d8ec4' }}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => markHook(i, results[i] === 'failed' ? null : 'failed')}
              className="p-1 rounded-lg transition-colors cursor-pointer"
              style={{ background: results[i] === 'failed' ? 'rgba(239,68,68,0.12)' : 'transparent', color: results[i] === 'failed' ? '#ef4444' : '#9d8ec4' }}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function GenerationCard({ gen, onDelete, onRewrite, onInstagram, onTelegram }: {
  gen: Generation
  onDelete: (id: string) => void
  onRewrite: (id: string) => void
  onInstagram: (gen: Generation) => void
  onTelegram: (gen: Generation) => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={cardStyle} className="p-4 space-y-3 transition-all duration-200 hover:shadow-[0_8px_32px_rgba(109,40,217,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-sm" style={{ color: '#1a1035' }}>{gen.input_json.niche}</p>
            <Badge className="border text-xs font-semibold" style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed', borderColor: 'rgba(124,58,237,0.2)' }}>
              {GOAL_LABELS[gen.input_json.conversion_goal] ?? gen.input_json.conversion_goal}
            </Badge>
            <Badge className="border text-xs" style={{ background: 'rgba(124,58,237,0.04)', color: '#9d8ec4', borderColor: 'rgba(124,58,237,0.12)' }}>
              {TONE_LABELS[gen.input_json.tone] ?? gen.input_json.tone}
            </Badge>
          </div>
          <p className="text-xs mt-1 truncate" style={{ color: '#9d8ec4' }}>{gen.input_json.offer}</p>
          <p className="text-xs mt-0.5" style={{ color: '#9d8ec4' }}>{new Date(gen.created_at).toLocaleDateString('ru-RU')}</p>
        </div>
        <div className="flex gap-1 shrink-0 flex-wrap justify-end">
          <Button
            variant="outline" size="sm"
            onClick={() => onTelegram(gen)}
            className="cursor-pointer h-8 gap-1.5 font-semibold text-xs"
            style={{ borderColor: 'rgba(99,102,241,0.3)', color: '#6366f1', background: 'rgba(99,102,241,0.05)' }}
          >
            <Send className="w-3.5 h-3.5" /> Telegram
          </Button>
          {gen.output_json?.instagram_post && (
            <Button
              variant="outline" size="sm"
              onClick={() => onInstagram(gen)}
              className="cursor-pointer h-8 gap-1.5 font-semibold text-xs"
              style={{ borderColor: 'rgba(221,42,123,0.3)', color: '#dd2a7b', background: 'rgba(221,42,123,0.05)' }}
            >
              <Camera className="w-3.5 h-3.5" /> Instagram
            </Button>
          )}
          <StarButton id={gen.id} />
          <Button
            variant="ghost" size="icon"
            className="h-8 w-8 cursor-pointer"
            style={{ color: '#9d8ec4' }}
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </Button>
          <Button
            variant="ghost" size="icon"
            className="h-8 w-8 cursor-pointer"
            style={{ color: '#ef4444' }}
            onClick={() => onDelete(gen.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="pt-3 border-t" style={{ borderColor: 'rgba(124,58,237,0.1)' }}>
          <OutputCards output={gen.output_json} />
          {gen.output_json.viral_hooks?.length > 0 && (
            <HookTracker genId={gen.id} hooks={gen.output_json.viral_hooks} />
          )}
          <Button
            variant="outline" size="sm"
            className="mt-4 w-full cursor-pointer font-semibold gap-2"
            style={{ borderColor: 'rgba(124,58,237,0.25)', color: '#7c3aed', background: 'rgba(124,58,237,0.04)' }}
            onClick={() => onRewrite(gen.id)}
          >
            <RefreshCw className="w-3.5 h-3.5" /> Переписать
          </Button>
        </div>
      )}
    </div>
  )
}

export default function LibraryPage() {
  const [page, setPage] = useState(1)
  const [instagramGen, setInstagramGen] = useState<Generation | null>(null)
  const [telegramGen, setTelegramGen] = useState<Generation | null>(null)
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['history', page],
    queryFn: () => fetch(`/api/history?page=${page}`).then(r => r.json()),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/history?id=${id}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['history'] }); toast.success('Удалено') },
  })

  const rewriteMutation = useMutation({
    mutationFn: async (id: string) => {
      const r = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generation_id: id }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error ?? 'Ошибка перезаписи')
      return data
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['history'] }); toast.success('Переписано!') },
    onError: (e: Error) => toast.error(e.message),
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
      <div>
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2" style={{ color: '#1a1035' }}>
          <Library className="w-6 h-6" style={{ color: '#7c3aed' }} /> Библиотека контента
        </h1>
        <p className="text-sm mt-1" style={{ color: '#9d8ec4' }}>Все ваши сохранённые генерации</p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ ...cardStyle, padding: '1rem' }} className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-28 rounded" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-48 rounded" />
                  <Skeleton className="h-3 w-24 rounded" />
                </div>
                <div className="flex gap-1">
                  <Skeleton className="h-8 w-20 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && data?.generations?.length === 0 && (
        <div style={cardStyle} className="p-16 text-center">
          <Library className="w-8 h-8 mx-auto mb-3" style={{ color: 'rgba(124,58,237,0.3)' }} />
          <p className="font-semibold" style={{ color: '#1a1035' }}>Генераций пока нет</p>
          <p className="text-sm mt-1" style={{ color: '#9d8ec4' }}>Создайте первый контент в Генераторе</p>
        </div>
      )}

      <div className="space-y-3">
        {data?.generations?.map((gen: Generation) => (
          <GenerationCard
            key={gen.id}
            gen={gen}
            onDelete={id => deleteMutation.mutate(id)}
            onRewrite={id => rewriteMutation.mutate(id)}
            onInstagram={setInstagramGen}
            onTelegram={setTelegramGen}
          />
        ))}
      </div>

      {instagramGen && (
        <InstagramModal gen={instagramGen} onClose={() => setInstagramGen(null)} />
      )}

      {telegramGen && (
        <TelegramEditorModal gen={telegramGen} onClose={() => setTelegramGen(null)} />
      )}

      {data?.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline" size="icon"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="cursor-pointer"
            style={{ borderColor: 'rgba(124,58,237,0.2)', color: '#7c3aed' }}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm" style={{ color: '#9d8ec4' }}>Страница {page} из {data.totalPages}</span>
          <Button
            variant="outline" size="icon"
            disabled={page === data.totalPages}
            onClick={() => setPage(p => p + 1)}
            className="cursor-pointer"
            style={{ borderColor: 'rgba(124,58,237,0.2)', color: '#7c3aed' }}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
