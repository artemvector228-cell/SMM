'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

const cardStyle = {
  background: 'rgba(255,255,255,0.75)',
  border: '1px solid rgba(124,58,237,0.12)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 4px 20px rgba(109,40,217,0.07)',
  borderRadius: '1rem',
}

interface ContentCardProps {
  title: string
  badge?: string
  children: React.ReactNode
}

export function ContentCard({ title, badge, children }: ContentCardProps) {
  return (
    <div style={cardStyle} className="p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm" style={{ color: '#1a1035' }}>{title}</h3>
        {badge && (
          <Badge className="border text-xs font-semibold" style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed', borderColor: 'rgba(124,58,237,0.2)' }}>
            {badge}
          </Badge>
        )}
      </div>
      {children}
    </div>
  )
}

interface CopyFieldProps {
  label: string
  text: string
}

export function CopyField({ label, text }: CopyFieldProps) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Скопировано!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative rounded-xl p-3 space-y-1" style={{ background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.08)' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#7c3aed', fontSize: '0.65rem' }}>{label}</span>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={copy}
          style={{ color: '#7c3aed' }}
        >
          {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
        </Button>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: '#1a1035' }}>{text}</p>
    </div>
  )
}

interface CopyAllButtonProps {
  text: string
}

export function CopyAllButton({ text }: CopyAllButtonProps) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Весь контент скопирован!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={copy}
      className="w-full mt-2 cursor-pointer font-semibold gap-2"
      style={{ borderColor: 'rgba(124,58,237,0.25)', color: '#7c3aed', background: 'rgba(124,58,237,0.04)' }}
    >
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
      Скопировать всё
    </Button>
  )
}
