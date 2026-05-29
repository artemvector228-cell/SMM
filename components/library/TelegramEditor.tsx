'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Send, X, Smile, ImageIcon, Video, Trash2, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Generation } from '@/types'

// ── Emoji picker data ──────────────────────────────────────────────────────
const EMOJI_GROUPS = [
  { label: 'Огонь', emojis: ['🔥','⚡','💥','✨','💫','🌟','⭐','🏆','🎯','🎉'] },
  { label: 'Бизнес', emojis: ['📈','💰','💎','🚀','💡','📊','💼','🔑','📣','🎁'] },
  { label: 'Жесты', emojis: ['👇','👆','👉','💪','👍','🙌','🤝','✅','☑️','❤️'] },
  { label: 'Смайлы', emojis: ['😊','😎','🤔','😤','🥳','🤩','😍','🙏','😮','🤑'] },
  { label: 'Знаки', emojis: ['📌','🔔','⚠️','💬','📩','📱','🌐','🔗','📝','⏰'] },
]

// ── Helpers ────────────────────────────────────────────────────────────────
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

// ── Component ──────────────────────────────────────────────────────────────
export function TelegramEditorModal({ gen, onClose }: { gen: Generation; onClose: () => void }) {
  const [format, setFormat] = useState<'telegram' | 'instagram'>('telegram')
  const [text, setText] = useState(() => buildText(gen, 'telegram'))
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function switchFormat(f: 'telegram' | 'instagram') {
    setFormat(f)
    setText(buildText(gen, f))
  }

  const insertEmoji = useCallback((emoji: string) => {
    const el = textareaRef.current
    if (!el) { setText(t => t + emoji); return }
    const start = el.selectionStart
    const end = el.selectionEnd
    const newText = text.slice(0, start) + emoji + text.slice(end)
    setText(newText)
    // restore cursor after state update
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
      let ok = false
      if (mediaFile) {
        const isVideo = mediaFile.type.startsWith('video/')
        const method = isVideo ? 'sendVideo' : 'sendPhoto'
        const field = isVideo ? 'video' : 'photo'
        const fd = new FormData()
        fd.append('chat_id', chatId)
        fd.append(field, mediaFile)
        if (text.trim()) fd.append('caption', text.trim())
        const res = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, { method: 'POST', body: fd })
        const data = await res.json()
        ok = data.ok
        if (!ok) throw new Error(data.description ?? 'Ошибка Telegram')
      } else {
        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: text.trim() }),
        })
        const data = await res.json()
        ok = data.ok
        if (!ok) throw new Error(data.description ?? 'Ошибка Telegram')
      }
      toast.success('Отправлено в Telegram! ✈️')
      onClose()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Ошибка отправки')
    } finally {
      setSending(false)
    }
  }

  const isVideo = mediaFile?.type.startsWith('video/')

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
      />
      {/* Modal */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', pointerEvents: 'none' }}>
        <div
          onClick={e => e.stopPropagation()}
          style={{
            pointerEvents: 'auto', width: '100%', maxWidth: '36rem',
            borderRadius: '1.25rem', overflow: 'hidden',
            background: '#fff', boxShadow: '0 24px 60px rgba(109,40,217,0.25)',
            display: 'flex', flexDirection: 'column', maxHeight: '90vh',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '1.75rem', height: '1.75rem', borderRadius: '0.5rem', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send style={{ width: '0.9rem', height: '0.9rem', color: '#fff' }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1a1035' }}>Отправить в Telegram</span>
            </div>
            <button onClick={onClose} style={{ cursor: 'pointer', color: '#9d8ec4', background: 'none', border: 'none', padding: '0.25rem', display: 'flex' }}>
              <X style={{ width: '1.1rem', height: '1.1rem' }} />
            </button>
          </div>

          <div style={{ overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Format tabs */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['telegram', 'instagram'] as const).map(f => (
                <button key={f} onClick={() => switchFormat(f)}
                  style={{
                    flex: 1, padding: '0.4rem 0', borderRadius: '0.75rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', border: 'none',
                    background: format === f ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'rgba(124,58,237,0.07)',
                    color: format === f ? '#fff' : '#6b5b95',
                  }}
                >
                  {f === 'telegram' ? '📱 Telegram' : '📸 Instagram'}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <div style={{ position: 'relative' }}>
              <textarea
                ref={textareaRef}
                value={text}
                onChange={e => setText(e.target.value)}
                rows={10}
                placeholder="Текст поста..."
                style={{
                  width: '100%', borderRadius: '0.875rem', padding: '0.875rem', paddingBottom: '2.75rem',
                  fontSize: '0.875rem', lineHeight: 1.6, resize: 'vertical', outline: 'none',
                  border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.02)',
                  color: '#1a1035', fontFamily: 'inherit', boxSizing: 'border-box',
                }}
              />
              {/* Emoji trigger */}
              <button
                type="button"
                onClick={() => setEmojiOpen(o => !o)}
                style={{
                  position: 'absolute', bottom: '0.625rem', right: '0.625rem',
                  background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)',
                  borderRadius: '0.5rem', padding: '0.3rem 0.5rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#7c3aed', fontWeight: 600,
                }}
              >
                <Smile style={{ width: '0.9rem', height: '0.9rem' }} /> Эмодзи
              </button>

              {/* Emoji picker */}
              {emojiOpen && (
                <div style={{
                  position: 'absolute', bottom: '2.75rem', right: 0, zIndex: 10,
                  background: '#fff', borderRadius: '1rem', padding: '0.875rem',
                  border: '1px solid rgba(124,58,237,0.15)', boxShadow: '0 12px 40px rgba(109,40,217,0.18)',
                  width: '17rem',
                }}>
                  {EMOJI_GROUPS.map(group => (
                    <div key={group.label} style={{ marginBottom: '0.5rem' }}>
                      <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9d8ec4', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>{group.label}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.15rem' }}>
                        {group.emojis.map(emoji => (
                          <button key={emoji} onClick={() => insertEmoji(emoji)}
                            style={{
                              width: '2rem', height: '2rem', fontSize: '1.1rem', cursor: 'pointer',
                              background: 'none', border: 'none', borderRadius: '0.375rem',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'background 0.1s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.08)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                          >{emoji}</button>
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
                Прикрепить медиа <span style={{ fontWeight: 400, color: '#9d8ec4' }}>(фото до 5 МБ · видео до 50 МБ)</span>
              </p>

              {!mediaFile ? (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => { if (fileInputRef.current) { fileInputRef.current.accept = 'image/*'; fileInputRef.current.click() } }}
                    style={{
                      flex: 1, padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer',
                      border: '1.5px dashed rgba(124,58,237,0.25)', background: 'rgba(124,58,237,0.03)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                      fontSize: '0.8rem', fontWeight: 600, color: '#7c3aed',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.07)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.03)')}
                  >
                    <ImageIcon style={{ width: '1rem', height: '1rem' }} /> Фото
                  </button>
                  <button
                    onClick={() => { if (fileInputRef.current) { fileInputRef.current.accept = 'video/*'; fileInputRef.current.click() } }}
                    style={{
                      flex: 1, padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer',
                      border: '1.5px dashed rgba(124,58,237,0.25)', background: 'rgba(124,58,237,0.03)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                      fontSize: '0.8rem', fontWeight: 600, color: '#7c3aed',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.07)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.03)')}
                  >
                    <Video style={{ width: '1rem', height: '1rem' }} /> Видео
                  </button>
                  <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileChange} />
                </div>
              ) : (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem', borderRadius: '0.875rem',
                  background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.15)',
                }}>
                  {mediaPreview && !isVideo ? (
                    <img src={mediaPreview} alt="" style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.5rem', objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '0.5rem', background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Video style={{ width: '1.25rem', height: '1.25rem', color: '#7c3aed' }} />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1a1035', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mediaFile.name}</p>
                    <p style={{ fontSize: '0.72rem', color: '#9d8ec4' }}>{(mediaFile.size / 1024 / 1024).toFixed(1)} МБ</p>
                  </div>
                  <button onClick={removeMedia} style={{ cursor: 'pointer', color: '#ef4444', background: 'none', border: 'none', padding: '0.25rem', display: 'flex' }}>
                    <Trash2 style={{ width: '1rem', height: '1rem' }} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(124,58,237,0.1)', display: 'flex', gap: '0.75rem' }}>
            <Button
              onClick={onClose}
              variant="outline"
              className="cursor-pointer"
              style={{ borderColor: 'rgba(124,58,237,0.2)', color: '#6b5b95' }}
            >
              Отмена
            </Button>
            <Button
              onClick={send}
              disabled={sending}
              className="flex-1 cursor-pointer border-0 text-white font-bold gap-2"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}
            >
              {sending
                ? 'Отправляю...'
                : <><Send style={{ width: '1rem', height: '1rem' }} /> Отправить в Telegram</>
              }
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
