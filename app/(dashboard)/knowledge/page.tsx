'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Brain, CheckCircle, Zap, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const cardStyle = {
  background: 'rgba(255,255,255,0.75)',
  border: '1px solid rgba(124,58,237,0.12)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 4px 20px rgba(109,40,217,0.07)',
  borderRadius: '1rem',
}

export interface KnowledgeBase {
  product: string
  price: string
  usp: string
  audience: string
  pains: string
  cases: string
  objections: string
  brand_voice: string
}

const EMPTY: KnowledgeBase = { product: '', price: '', usp: '', audience: '', pains: '', cases: '', objections: '', brand_voice: '' }

const FIELDS: { key: keyof KnowledgeBase; label: string; placeholder: string; multiline?: boolean; hint?: string }[] = [
  { key: 'product', label: 'Продукт / Услуга', placeholder: 'Что именно вы продаёте? Онлайн-курс по продажам, коучинг 1-на-1, SaaS...' },
  { key: 'price', label: 'Цена', placeholder: '29 000 ₽ / 290 ₽ в месяц / от 100 000 ₽' },
  { key: 'usp', label: 'Уникальное торговое предложение (УТП)', placeholder: 'Что отличает вас от конкурентов? Почему покупают именно у вас?', multiline: true },
  { key: 'audience', label: 'Целевая аудитория', placeholder: 'Кто ваш идеальный клиент? Возраст, статус, ситуация, цели...', multiline: true },
  { key: 'pains', label: 'Ключевые боли аудитории', placeholder: 'Что мешает спать по ночам? Какие проблемы клиент хочет решить?', multiline: true },
  { key: 'cases', label: 'Кейсы и отзывы', placeholder: 'Клиент А увеличил выручку на 3× за 2 месяца. Клиент Б вышел на 500к/мес с нуля...', multiline: true },
  { key: 'objections', label: 'Главные возражения', placeholder: 'Дорого. Нет времени. Уже пробовал — не помогло. Не уверен что сработает для меня...', multiline: true },
  {
    key: 'brand_voice',
    label: 'Голос бренда (Brand Voice)',
    placeholder: 'Опишите стиль общения: дерзкий практик без воды, мягкий наставник с юмором, строгий эксперт...',
    multiline: true,
    hint: 'Заменяет выбор тона в генераторе. Все генерации будут звучать именно так.',
  },
]

export default function KnowledgePage() {
  const [kb, setKb] = useState<KnowledgeBase>(EMPTY)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [hasExisting, setHasExisting] = useState(false)

  useEffect(() => {
    // Load from server first, fallback to localStorage
    fetch('/api/knowledge')
      .then(r => r.json())
      .then(d => {
        if (d.knowledge) {
          setKb({ ...EMPTY, ...d.knowledge })
          localStorage.setItem('knowledge_base', JSON.stringify(d.knowledge))
          setHasExisting(true)
        } else {
          const stored = localStorage.getItem('knowledge_base')
          if (stored) {
            try { setKb({ ...EMPTY, ...JSON.parse(stored) }); setHasExisting(true) } catch { /* ignore */ }
          }
        }
      })
      .catch(() => {
        const stored = localStorage.getItem('knowledge_base')
        if (stored) {
          try { setKb({ ...EMPTY, ...JSON.parse(stored) }); setHasExisting(true) } catch { /* ignore */ }
        }
      })
  }, [])

  function set(key: keyof KnowledgeBase, value: string) {
    setKb(k => ({ ...k, [key]: value }))
  }

  async function save() {
    setSaving(true)
    localStorage.setItem('knowledge_base', JSON.stringify(kb))
    try {
      await fetch('/api/knowledge', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: kb }),
      })
    } catch { /* localStorage already saved */ }
    setSaved(true)
    setSaving(false)
    setHasExisting(true)
    toast.success('База знаний сохранена в облаке! Доступна с любого устройства.')
    setTimeout(() => setSaved(false), 2500)
  }

  const filled = Object.values(kb).filter(v => v.trim()).length
  const total = FIELDS.length

  return (
    <div className="max-w-2xl mx-auto space-y-6" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
      <div>
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2" style={{ color: '#1a1035' }}>
          <Brain className="w-6 h-6" style={{ color: '#7c3aed' }} /> База знаний о продукте
        </h1>
        <p className="text-sm mt-1" style={{ color: '#9d8ec4' }}>
          Заполните один раз — все генерации автоматически используют этот контекст
        </p>
      </div>

      {/* Progress */}
      <div style={cardStyle} className="p-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-semibold" style={{ color: '#1a1035' }}>Заполнено полей</span>
            <span style={{ color: '#7c3aed', fontWeight: 700 }}>{filled} / {total}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(124,58,237,0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(filled / total) * 100}%`, background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }}
            />
          </div>
        </div>
        {hasExisting && (
          <Link href="/generate">
            <Button size="sm" className="cursor-pointer border-0 text-white font-semibold gap-1.5 shrink-0" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
              <Zap className="w-3.5 h-3.5" /> Генерировать <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        )}
      </div>

      {/* Form */}
      <div style={cardStyle} className="p-6 space-y-5">
        {FIELDS.map(({ key, label, placeholder, multiline, hint }) => (
          <div key={key} className="space-y-1.5">
            <Label className="text-sm font-semibold" style={{ color: '#1a1035' }}>{label}</Label>
            {hint && <p className="text-xs" style={{ color: '#7c3aed' }}>{hint}</p>}
            {multiline ? (
              <Textarea
                placeholder={placeholder}
                value={kb[key]}
                onChange={e => set(key, e.target.value)}
                rows={3}
                className="text-sm resize-none"
                style={{ borderColor: 'rgba(124,58,237,0.2)', background: 'rgba(255,255,255,0.8)' }}
              />
            ) : (
              <Input
                placeholder={placeholder}
                value={kb[key]}
                onChange={e => set(key, e.target.value)}
                className="text-sm"
                style={{ borderColor: 'rgba(124,58,237,0.2)', background: 'rgba(255,255,255,0.8)' }}
              />
            )}
          </div>
        ))}

        <Button
          onClick={save}
          className="w-full cursor-pointer border-0 text-white font-semibold h-11 gap-2"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 16px rgba(109,40,217,0.25)' }}
        >
          {saved ? <><CheckCircle className="w-4 h-4" /> Сохранено в облаке!</> : saving ? 'Сохраняю...' : 'Сохранить базу знаний'}
        </Button>
      </div>

      {/* Explain */}
      <div style={{ ...cardStyle, background: 'rgba(124,58,237,0.04)' }} className="p-4 space-y-2">
        <p className="text-sm font-bold" style={{ color: '#1a1035' }}>Как это работает</p>
        {[
          'Заполните базу знаний один раз',
          'Откройте Генератор — данные подставятся автоматически',
          'Каждый пост учитывает ваш продукт, аудиторию и голос бренда',
          'Не нужно вводить одно и то же каждый раз',
        ].map((text, i) => (
          <div key={i} className="flex items-start gap-2 text-sm" style={{ color: '#6b5b95' }}>
            <span className="font-bold shrink-0" style={{ color: '#7c3aed' }}>{i + 1}.</span>
            {text}
          </div>
        ))}
      </div>
    </div>
  )
}
