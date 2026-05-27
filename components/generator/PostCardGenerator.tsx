'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Layers, Palette } from 'lucide-react'
import { toast } from 'sonner'
import { GenerationOutput } from '@/types'
import { GenerateInput } from '@/lib/validations'
import { cn } from '@/lib/utils'

interface Props {
  output: GenerationOutput
  input?: Partial<GenerateInput>
}

const STYLES = [
  {
    id: 'dark',
    label: 'Тёмный',
    preview: 'bg-gradient-to-br from-zinc-900 to-zinc-700',
    bg1: '#09090b',
    bg2: '#27272a',
    text: '#ffffff',
    accent: '#a855f7',
    accentFade: '#a855f730',
    sub: '#71717a',
  },
  {
    id: 'violet',
    label: 'Фиолет',
    preview: 'bg-gradient-to-br from-violet-900 to-indigo-800',
    bg1: '#1e1b4b',
    bg2: '#3730a3',
    text: '#ffffff',
    accent: '#c084fc',
    accentFade: '#c084fc30',
    sub: '#a5b4fc',
  },
  {
    id: 'ocean',
    label: 'Океан',
    preview: 'bg-gradient-to-br from-sky-900 to-cyan-800',
    bg1: '#0c1445',
    bg2: '#0e4a6e',
    text: '#ffffff',
    accent: '#38bdf8',
    accentFade: '#38bdf830',
    sub: '#7dd3fc',
  },
  {
    id: 'forest',
    label: 'Лес',
    preview: 'bg-gradient-to-br from-emerald-900 to-green-800',
    bg1: '#022c22',
    bg2: '#14532d',
    text: '#ffffff',
    accent: '#4ade80',
    accentFade: '#4ade8030',
    sub: '#86efac',
  },
]

type CardStyle = (typeof STYLES)[0]

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const test = current ? `${current} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  lines.forEach((line, i) => ctx.fillText(line, x, y + i * lineHeight))
  return lines.length
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function buildCard(hook: string, cta: string, niche: string, style: CardStyle): string {
  const S = 1080
  const canvas = document.createElement('canvas')
  canvas.width = S
  canvas.height = S
  const ctx = canvas.getContext('2d')!

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, S, S)
  grad.addColorStop(0, style.bg1)
  grad.addColorStop(1, style.bg2)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, S, S)

  // Decorative blobs
  const blob = (cx: number, cy: number, r: number, a: number) => {
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fillStyle = hexToRgba(style.accent, a)
    ctx.fill()
  }
  blob(S, 0, 420, 0.08)
  blob(0, S, 320, 0.06)
  blob(S / 2, S / 2, 550, 0.02)

  // Left accent bar
  ctx.fillStyle = style.accent
  ctx.fillRect(68, 96, 7, 88)

  // Niche label
  ctx.fillStyle = style.accent
  ctx.font = `600 28px "Segoe UI", Arial, sans-serif`
  ctx.fillText(niche.toUpperCase().slice(0, 32), 96, 140)

  // Thin divider under niche
  ctx.fillStyle = hexToRgba(style.accent, 0.2)
  ctx.fillRect(68, 210, S - 136, 1)

  // Hook — main text
  ctx.fillStyle = style.text
  ctx.font = `bold 66px "Segoe UI", Arial, sans-serif`
  const hookLines = wrapText(ctx, hook, 76, 298, S - 152, 86)

  // CTA box
  const ctaY = 320 + hookLines * 86 + 30
  const boxH = 92
  ctx.fillStyle = hexToRgba(style.accent, 0.12)
  ctx.strokeStyle = hexToRgba(style.accent, 0.5)
  ctx.lineWidth = 1.5
  ctx.beginPath()
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(68, ctaY, S - 136, boxH, 12)
  } else {
    ctx.rect(68, ctaY, S - 136, boxH)
  }
  ctx.fill()
  ctx.stroke()

  // CTA arrow icon
  ctx.fillStyle = style.accent
  ctx.font = `bold 38px "Segoe UI", Arial, sans-serif`
  ctx.fillText('→', S - 140, ctaY + 57)

  // CTA text inside box
  ctx.fillStyle = style.accent
  ctx.font = `600 32px "Segoe UI", Arial, sans-serif`
  let ctaShort = cta
  while (ctx.measureText(ctaShort).width > S - 240 && ctaShort.length > 8) {
    ctaShort = ctaShort.slice(0, -4) + '...'
  }
  ctx.fillText(ctaShort, 96, ctaY + 57)

  // Bottom branding
  ctx.fillStyle = hexToRgba(style.text, 0.22)
  ctx.font = `400 22px "Segoe UI", Arial, sans-serif`
  ctx.fillText('AI Revenue Content OS', 76, S - 46)

  // Corner accent dot
  ctx.beginPath()
  ctx.arc(S - 76, S - 58, 5, 0, Math.PI * 2)
  ctx.fillStyle = style.accent
  ctx.fill()

  return canvas.toDataURL('image/png')
}

export function PostCardGenerator({ output, input }: Props) {
  const [style, setStyle] = useState(STYLES[0])
  const [cardUrl, setCardUrl] = useState<string | null>(null)

  function generate(s: CardStyle = style) {
    const hook = output.instagram_post.hook
    const cta = output.instagram_post.cta
    const niche = input?.niche ?? 'Контент'
    setCardUrl(buildCard(hook, cta, niche, s))
    toast.success('Карточка создана!')
  }

  function switchStyle(s: CardStyle) {
    setStyle(s)
    if (cardUrl) generate(s)
  }

  function download() {
    if (!cardUrl) return
    const a = document.createElement('a')
    a.href = cardUrl
    a.download = `post-card-${Date.now()}.png`
    a.click()
    toast.success('PNG скачан!')
  }

  const cardStyle = {
    background: 'rgba(255,255,255,0.75)',
    border: '1px solid rgba(124,58,237,0.12)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 4px 20px rgba(109,40,217,0.07)',
    borderRadius: '1rem',
  }

  return (
    <div style={cardStyle} className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: '#1a1035' }}>
          <Layers className="w-4 h-4" />
          Визуальная карточка поста
        </h3>
        <div className="flex gap-2">
          {cardUrl && (
            <Button size="sm" variant="outline" onClick={download}>
              <Download className="w-3 h-3 mr-1" />
              PNG
            </Button>
          )}
          <Button size="sm" onClick={() => generate()}>
            <Palette className="w-3 h-3 mr-1" />
            {cardUrl ? 'Пересоздать' : 'Создать карточку'}
          </Button>
        </div>
      </div>

      {/* Style selector */}
      <div className="flex gap-2">
        {STYLES.map((s) => (
          <button
            key={s.id}
            onClick={() => switchStyle(s)}
            title={s.label}
            className={cn(
              'flex-1 h-9 rounded-lg transition-all border-2 text-white text-[11px] font-medium',
              s.preview,
              style.id === s.id ? 'border-primary shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {cardUrl ? (
        <div className="flex flex-col items-center gap-3">
          <img
            src={cardUrl}
            alt="Визуальная карточка поста"
            className="w-full max-w-xs rounded-xl shadow-lg border border-border"
          />
          <Button size="sm" className="w-full max-w-xs" onClick={download}>
            <Download className="w-3 h-3 mr-2" />
            Скачать 1080 × 1080 PNG
          </Button>
        </div>
      ) : (
        <div
          className="aspect-square w-full max-w-xs mx-auto rounded-xl border-2 border-dashed flex items-center justify-center"
          style={{ borderColor: 'rgba(124,58,237,0.15)', background: 'rgba(124,58,237,0.03)' }}
        >
          <div className="text-center space-y-3 p-6">
            <Layers className="w-10 h-10 mx-auto" style={{ color: 'rgba(124,58,237,0.3)' }} />
            <p className="text-xs leading-relaxed" style={{ color: '#9d8ec4' }}>
              Мгновенно создаёт визуальную карточку с хуком и CTA из твоего поста. Готово к публикации в Instagram.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
