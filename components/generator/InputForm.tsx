'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Zap, Brain, ArrowRight } from 'lucide-react'
import { GenerateInput } from '@/lib/validations'
import { toast } from 'sonner'
import { useGeneratorStore } from '@/store/useGeneratorStore'
import { KnowledgeBase } from '@/app/(dashboard)/knowledge/page'
import Link from 'next/link'

export function InputForm() {
  const { setOutput, setGenerating, isGenerating, input: storeInput } = useGeneratorStore()
  const [form, setForm] = useState<Partial<GenerateInput>>(() => ({
    tone: 'bold',
    conversion_goal: 'dm',
    ...storeInput,
  }))
  const [kb, setKb] = useState<KnowledgeBase | null>(null)
  const [kbLoaded, setKbLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('knowledge_base')
    if (stored) {
      try {
        const parsed: KnowledgeBase = JSON.parse(stored)
        setKb(parsed)
        // Auto-fill only if form is empty (no storeInput)
        if (!storeInput?.niche && !storeInput?.offer) {
          setForm(f => ({
            ...f,
            niche: parsed.product || f.niche,
            offer: parsed.usp || f.offer,
            audience: parsed.audience || f.audience,
            pain_points: parsed.pains || f.pain_points,
          }))
          setKbLoaded(true)
        }
      } catch { /* ignore */ }
    }
  }, [])

  function set(key: keyof GenerateInput, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function loadFromKb() {
    if (!kb) return
    setForm(f => ({
      ...f,
      niche: kb.product || f.niche,
      offer: kb.usp || f.offer,
      audience: kb.audience || f.audience,
      pain_points: kb.pains || f.pain_points,
    }))
    setKbLoaded(true)
    toast.success('Данные из базы знаний загружены')
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.niche || !form.offer || !form.audience || !form.pain_points) {
      toast.error('Заполните все обязательные поля')
      return
    }

    // Inject brand_voice into payload if available
    const payload = { ...form }
    if (kb?.brand_voice && !payload.tone) {
      payload.tone = 'bold' // fallback
    }

    setGenerating(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, brand_voice: kb?.brand_voice }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.upgrade) {
          toast.error('Лимит генераций исчерпан. Перейдите на Pro.')
        } else {
          toast.error(data.error ?? 'Ошибка генерации')
        }
        return
      }

      setOutput(data.generation)
      toast.success('Контент сгенерирован!')
    } catch {
      toast.error('Что-то пошло не так. Проверьте подключение.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">

      {/* Knowledge Base banner */}
      {kb && kb.product ? (
        <div
          className="flex items-center gap-3 p-3 rounded-xl border"
          style={{ background: 'rgba(124,58,237,0.06)', borderColor: 'rgba(124,58,237,0.2)' }}
        >
          <Brain className="w-4 h-4 shrink-0" style={{ color: '#7c3aed' }} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold" style={{ color: '#1a1035' }}>База знаний подключена</p>
            <p className="text-xs truncate" style={{ color: '#9d8ec4' }}>{kb.product}</p>
          </div>
          {!kbLoaded && (
            <Button type="button" size="sm" variant="outline" onClick={loadFromKb}
              className="text-xs h-7 cursor-pointer shrink-0 font-semibold"
              style={{ borderColor: 'rgba(124,58,237,0.3)', color: '#7c3aed' }}
            >
              Загрузить
            </Button>
          )}
          {kbLoaded && <span className="text-xs font-semibold" style={{ color: '#7c3aed' }}>✓ Загружено</span>}
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 rounded-xl border border-dashed" style={{ borderColor: 'rgba(124,58,237,0.2)' }}>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4" style={{ color: '#9d8ec4' }} />
            <p className="text-xs" style={{ color: '#9d8ec4' }}>База знаний не заполнена — вводите данные вручную</p>
          </div>
          <Link href="/knowledge">
            <Button type="button" size="sm" variant="ghost" className="text-xs h-7 gap-1 cursor-pointer" style={{ color: '#7c3aed' }}>
              Заполнить <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold" style={{ color: '#1a1035' }}>Ниша / Продукт *</Label>
          <Input
            placeholder="Онлайн-коучинг, фитнес, SaaS..."
            value={form.niche ?? ''}
            onChange={e => set('niche', e.target.value)}
            required
            style={{ borderColor: 'rgba(124,58,237,0.2)' }}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold" style={{ color: '#1a1035' }}>Оффер / УТП *</Label>
          <Input
            placeholder="Коучинг по продажам 1-на-1"
            value={form.offer ?? ''}
            onChange={e => set('offer', e.target.value)}
            required
            style={{ borderColor: 'rgba(124,58,237,0.2)' }}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-semibold" style={{ color: '#1a1035' }}>Целевая аудитория *</Label>
        <Input
          placeholder="Предприниматели с доходом 150к/мес, хотят выйти на 500к"
          value={form.audience ?? ''}
          onChange={e => set('audience', e.target.value)}
          required
          style={{ borderColor: 'rgba(124,58,237,0.2)' }}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-semibold" style={{ color: '#1a1035' }}>Ключевые боли *</Label>
        <Textarea
          placeholder="Нестабильный доход, нет системы продаж, боятся называть высокий чек..."
          value={form.pain_points ?? ''}
          onChange={e => set('pain_points', e.target.value)}
          rows={3}
          required
          className="resize-none"
          style={{ borderColor: 'rgba(124,58,237,0.2)' }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Brand voice if available, else tone dropdown */}
        {kb?.brand_voice ? (
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold" style={{ color: '#1a1035' }}>Голос бренда</Label>
            <div
              className="text-xs px-3 py-2 rounded-lg border h-9 flex items-center truncate"
              style={{ borderColor: 'rgba(124,58,237,0.2)', color: '#7c3aed', background: 'rgba(124,58,237,0.05)' }}
            >
              {kb.brand_voice.slice(0, 45)}{kb.brand_voice.length > 45 ? '...' : ''}
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold" style={{ color: '#1a1035' }}>Тон</Label>
            <Select value={form.tone ?? ''} onValueChange={(v) => v && set('tone', v)}>
              <SelectTrigger style={{ borderColor: 'rgba(124,58,237,0.2)' }}><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="aggressive">Агрессивный</SelectItem>
                <SelectItem value="authoritative">Авторитетный</SelectItem>
                <SelectItem value="empathetic">Эмпатичный</SelectItem>
                <SelectItem value="bold">Смелый</SelectItem>
                <SelectItem value="professional">Профессиональный</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-sm font-semibold" style={{ color: '#1a1035' }}>Цель конверсии</Label>
          <Select value={form.conversion_goal ?? ''} onValueChange={v => set('conversion_goal', v as GenerateInput['conversion_goal'])}>
            <SelectTrigger style={{ borderColor: 'rgba(124,58,237,0.2)' }}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="dm">DM / Директ</SelectItem>
              <SelectItem value="telegram">Подписка на Telegram</SelectItem>
              <SelectItem value="call">Запись на звонок</SelectItem>
              <SelectItem value="landing">Переход на лендинг</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full cursor-pointer border-0 text-white font-bold h-11 gap-2"
        size="lg"
        disabled={isGenerating}
        style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 16px rgba(109,40,217,0.25)' }}
      >
        {isGenerating ? (
          <><Loader2 className="w-4 h-4 animate-spin" />Генерирую контент...</>
        ) : (
          <><Zap className="w-4 h-4" />Сгенерировать контент</>
        )}
      </Button>
    </form>
  )
}
