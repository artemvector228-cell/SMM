'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Send, X, Smile, ImageIcon, Video, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Generation } from '@/types'

const EMOJI_GROUPS = [
  { label: 'Огонь',   emojis: ['🔥','⚡','💥','✨','💫','🌟','⭐','🏆','🎯','🎉'] },
  { label: 'Бизнес',  emojis: ['📈','💰','💎','🚀','💡','📊','💼','🔑','📣','🎁'] },
  { label: 'Жесты',   emojis: ['👇','👆','👉','💪','👍','🙌','🤝','✅','☑️','❤️'] },
  { label: 'Смайлы',  emojis: ['😊','😎','🤔','😤','🥳','🤩','😍','🙏','😮','🤑'] },
  { label: 'Знаки',   emojis: ['📌','🔔','⚠️','💬','📩','📱','🌐','🔗','📝','⏰'] },
]

function buildText(gen: Generation, format: 'telegram' | 'instagram'): string {
  if (format === 'telegram') {
    const tg = gen.output_json?.telegram_post
    if (!tg) return ''
    return [...(tg.structure ?? []), '', tg.cta ?? ''].join('\n\n').trim()
  }
  const ig = gen.output_json?.instagram_post
  if (!ig) return ''
  const parts = [ig.hook, ig.pain_agitation, ig.value_body, ig.cta]
  if (ig.hashtags?.length) parts.push(ig.hashtags.map((h: string) => `#${h}`).join(' '))
  return parts.filter(Boolean).join('\n\n')
}

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

export function TelegramEditorModal({ gen, onClose }: { gen: Generation; onClose: () => void }) {
  const [format, setFormat] = useState<'telegram' | 'instagram'>('telegram')
  const [text, setText] = useState(() => buildText(gen, 'telegram'))
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Close emoji picker on outside click
  useEffect(() => {
    if (!emojiOpen) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-emoji-picker]')) setEmojiOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [emojiOpen])

  function switchFormat(f: 'telegram' | 'instagram') {
    setFormat(f)
    setText(buildText(gen, f))
  }

  const insertEmoji = useCallback((emoji: string) => {
    const el = textareaRef.current
    if (!el) { setText(t => t + emoji); setEmojiOpen(false); return }
    const start = el.selectionStart
    const end = el.selectionEnd
    const newText = text.slice(0, start) + emoji + text.slice(end)
    setText(newText)
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + emoji.length
      el.focus()
    })
    setEmojiOpen(false)
  }, [text])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    if (!isImage && !isVideo) { toast.error('Только фото или видео'); return }
    if (isImage && file.size > 5 * 1024 * 1024) { toast.error('Фото не более 5 МБ'); return }
    if (isVideo && file.size > 50 * 1024 * 1024) { toast.error('Видео не более 50 МБ'); return }
    setMediaFile(file)
    if (isImage) setMediaPreview(URL.createObjectURL(file))
    else setMediaPreview(null)
  }

  function removeMedia() {
    setMediaFile(null)
    setMediaPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function send() {
    const { botToken, chatId } = await getTgCredentials()
    if (!botToken || !chatId) { toast.error('Настройте Telegram в разделе Настройки'); return }
    if (!text.trim() && !mediaFile) { toast.error('Добавьте текст или медиафайл'); return }
    setSending(true)
    try {
      if (mediaFile) {
        const isVid = mediaFile.type.startsWith('video/')
        const fd = new FormData()
        fd.append('chat_id', chatId)
        fd.append(isVid ? 'video' : 'photo', mediaFile)
        if (text.trim()) fd.append('caption', text.trim())
        const res = await fetch(`https://api.telegram.org/bot${botToken}/${isVid ? 'sendVideo' : 'sendPhoto'}`, { method: 'POST', body: fd })
        const data = await res.json()
        if (!data.ok) throw new Error(data.description ?? 'Ошибка Telegram')
      } else {
        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: text.trim() }),
        })
        const data = await res.json()
        if (!data.ok) throw new Error(data.description ?? 'Ошибка Telegram')
      }
      toast.success('Отправлено в Telegram! ✈️')
      onClose()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Ошибка отправки')
    } finally {
      setSending(false)
    }
  }

  const isVideoFile = mediaFile?.type.startsWith('video/')

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
      />

      {/* Centering shell */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', pointerEvents: 'none' }}
        className="sm:items-center"
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            pointerEvents: 'auto',
            width: '100%',
            background: '#fff',
            boxShadow: '0 -8px 40px rgba(109,40,217,0.2)',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '92vh',
          }}
          className="sm:max-w-xl sm:rounded-2xl sm:shadow-2xl sm:mb-0"
          // On mobile: full-width sheet from bottom. On sm+: centered card
        >
          {/* Drag handle (mobile only) */}
          <div className="sm:hidden flex justify-center pt-2.5 pb-1">
            <div style={{ width: '2.5rem', height: '0.25rem', borderRadius: '9999px', background: 'rgba(0,0,0,0.15)' }} />
          </div>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.25rem', borderBottom: '1px solid rgba(124,58,237,0.1)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '1.75rem', height: '1.75rem', borderRadius: '0.5rem', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send style={{ width: '0.875rem', height: '0.875rem', color: '#fff' }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1035' }}>Отправить в Telegram</span>
            </div>
            <button onClick={onClose} style={{ cursor: 'pointer', color: '#9d8ec4', background: 'none', border: 'none', padding: '0.25rem', display: 'flex', touchAction: 'manipulation' }}>
              <X style={{ width: '1.1rem', height: '1.1rem' }} />
            </button>
          </div>

          {/* Scrollable body */}
          <div style={{ overflowY: 'auto', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem', flex: 1 }}>

            {/* Format tabs */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['telegram', 'instagram'] as const).map(f => (
                <button key={f} onClick={() => switchFormat(f)}
                  style={{
                    flex: 1, padding: '0.5rem 0', borderRadius: '0.75rem',
                    fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', border: 'none',
                    background: format === f ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'rgba(124,58,237,0.07)',
                    color: format === f ? '#fff' : '#6b5b95',
                    touchAction: 'manipulation',
                  }}
                >
                  {f === 'telegram' ? '📱 Telegram' : '📸 Instagram'}
                </button>
              ))}
            </div>

            {/* Textarea + emoji */}
            <div style={{ position: 'relative' }} data-emoji-picker>
              <textarea
                ref={textareaRef}
                value={text}
                onChange={e => setText(e.target.value)}
                rows={7}
                placeholder="Текст поста..."
                style={{
                  width: '100%', borderRadius: '0.875rem',
                  padding: '0.875rem', paddingBottom: '3rem',
                  fontSize: '0.875rem', lineHeight: 1.6,
                  resize: 'none', outline: 'none',
                  border: '1px solid rgba(124,58,237,0.2)',
                  background: 'rgba(124,58,237,0.02)',
                  color: '#1a1035', fontFamily: 'inherit',
                  boxSizing: 'border-box', WebkitAppearance: 'none',
                }}
              />

              {/* Emoji toggle button */}
              <button
                type="button"
                data-emoji-picker
                onClick={() => setEmojiOpen(o => !o)}
                style={{
                  position: 'absolute', bottom: '0.625rem', left: '0.625rem',
                  background: emojiOpen ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.08)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  borderRadius: '0.5rem', padding: '0.35rem 0.6rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  fontSize: '0.75rem', color: '#7c3aed', fontWeight: 600,
                  touchAction: 'manipulation',
                }}
              >
                <Smile style={{ width: '0.875rem', height: '0.875rem' }} /> Эмодзи
              </button>

              {/* Char count */}
              <span style={{
                position: 'absolute', bottom: '0.75rem', right: '0.75rem',
                fontSize: '0.7rem', color: text.length > 4000 ? '#ef4444' : '#9d8ec4',
              }}>
                {text.length}
              </span>

              {/* Emoji picker — opens ABOVE button, left-aligned */}
              {emojiOpen && (
                <div
                  data-emoji-picker
                  style={{
                    position: 'absolute', bottom: '2.75rem', left: 0, zIndex: 20,
                    background: '#fff', borderRadius: '1rem', padding: '0.875rem',
                    border: '1px solid rgba(124,58,237,0.15)',
                    boxShadow: '0 12px 40px rgba(109,40,217,0.18)',
                    width: 'min(17rem, calc(100% - 0px))',
                  }}
                >
                  {EMOJI_GROUPS.map(group => (
                    <div key={group.label} style={{ marginBottom: '0.5rem' }}>
                      <p style={{ fontSize: '0.62rem', fontWeight: 700, color: '#9d8ec4', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
                        {group.label}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.1rem' }}>
                        {group.emojis.map(emoji => (
                          <button
                            key={emoji}
                            data-emoji-picker
                            onClick={() => insertEmoji(emoji)}
                            style={{
                              width: '2.25rem', height: '2.25rem', fontSize: '1.2rem',
                              cursor: 'pointer', background: 'none', border: 'none',
                              borderRadius: '0.375rem', display: 'flex',
                              alignItems: 'center', justifyContent: 'center',
                              touchAction: 'manipulation',
                            }}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Media upload */}
            <div>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#6b5b95', marginBottom: '0.5rem' }}>
                Медиафайл{' '}
                <span style={{ fontWeight: 400, color: '#9d8ec4' }}>фото до 5 МБ · видео до 50 МБ</span>
              </p>

              {!mediaFile ? (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[
                    { accept: 'image/*', icon: <ImageIcon style={{ width: '1rem', height: '1rem' }} />, label: 'Фото' },
                    { accept: 'video/*', icon: <Video style={{ width: '1rem', height: '1rem' }} />, label: 'Видео' },
                  ].map(({ accept, icon, label }) => (
                    <button
                      key={label}
                      onClick={() => {
                        if (!fileInputRef.current) return
                        fileInputRef.current.accept = accept
                        fileInputRef.current.click()
                      }}
                      style={{
                        flex: 1, padding: '0.75rem 0.5rem', borderRadius: '0.875rem', cursor: 'pointer',
                        border: '1.5px dashed rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.03)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
                        fontSize: '0.8rem', fontWeight: 600, color: '#7c3aed', touchAction: 'manipulation',
                      }}
                    >
                      {icon}{label}
                    </button>
                  ))}
                  <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileChange} />
                </div>
              ) : (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem', borderRadius: '0.875rem',
                  background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.15)',
                }}>
                  {mediaPreview && !isVideoFile ? (
                    <img src={mediaPreview} alt="" style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.5rem', objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.5rem', background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Video style={{ width: '1.25rem', height: '1.25rem', color: '#7c3aed' }} />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a1035', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {mediaFile.name}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: '#9d8ec4' }}>
                      {(mediaFile.size / 1024 / 1024).toFixed(1)} МБ
                    </p>
                  </div>
                  <button onClick={removeMedia} style={{ cursor: 'pointer', color: '#ef4444', background: 'none', border: 'none', padding: '0.25rem', display: 'flex', touchAction: 'manipulation' }}>
                    <Trash2 style={{ width: '1rem', height: '1rem' }} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid rgba(124,58,237,0.1)', display: 'flex', gap: '0.625rem', flexShrink: 0 }}
            className="pb-safe"
          >
            <Button
              onClick={onClose}
              variant="outline"
              className="cursor-pointer"
              style={{ borderColor: 'rgba(124,58,237,0.2)', color: '#6b5b95', touchAction: 'manipulation' }}
            >
              Отмена
            </Button>
            <Button
              onClick={send}
              disabled={sending}
              className="flex-1 cursor-pointer border-0 text-white font-bold gap-2"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 16px rgba(99,102,241,0.25)', touchAction: 'manipulation' }}
            >
              <Send style={{ width: '1rem', height: '1rem' }} />
              {sending ? 'Отправляю...' : 'Отправить'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
