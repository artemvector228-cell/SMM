'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  CalendarRange, Loader2, Zap, MessageCircle,
  Play, Camera, Sparkles, ChevronRight, Image, Upload, X, FileText,
} from 'lucide-react'
import { toast } from 'sonner'
import { useGeneratorStore } from '@/store/useGeneratorStore'
import { cn } from '@/lib/utils'

interface PlanDay {
  day: number
  format: 'instagram' | 'reels' | 'stories' | 'telegram'
  topic: string
  description: string
  hook: string
}

interface ContentPlan {
  month_theme: string
  week_themes: string[]
  days: PlanDay[]
}

const FORMAT_CONFIG = {
  instagram: { label: 'Instagram', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20', icon: Image },
  reels: { label: 'Reels', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: Play },
  stories: { label: 'Stories', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20', icon: Camera },
  telegram: { label: 'Telegram', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20', icon: MessageCircle },
}

const POPULAR_NICHES = [
  'Онлайн-коучинг', 'Фитнес', 'E-commerce', 'Недвижимость',
  'Финансы', 'Образование', 'SaaS', 'Маркетинг',
]

const cardStyle = {
  background: 'rgba(255,255,255,0.75)',
  border: '1px solid rgba(124,58,237,0.12)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 4px 20px rgba(109,40,217,0.07)',
  borderRadius: '1rem',
}

const dayCardStyle = {
  background: 'rgba(255,255,255,0.75)',
  border: '1px solid rgba(124,58,237,0.12)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 4px 16px rgba(109,40,217,0.07)',
  borderRadius: '1rem',
  transition: 'all 0.2s',
}

function DayCard({ day, onUse }: { day: PlanDay; onUse: (day: PlanDay) => void }) {
  const cfg = FORMAT_CONFIG[day.format] ?? FORMAT_CONFIG.instagram
  const Icon = cfg.icon

  return (
    <div
      className="p-4 space-y-3 group cursor-pointer"
      style={dayCardStyle}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(109,40,217,0.14)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.3)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(109,40,217,0.07)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.12)' }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black leading-none w-8" style={{ color: 'rgba(124,58,237,0.2)' }}>
            {String(day.day).padStart(2, '0')}
          </span>
          <Badge variant="outline" className={cn('text-xs gap-1 border', cfg.color)}>
            <Icon className="w-3 h-3" />
            {cfg.label}
          </Badge>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 cursor-pointer"
          onClick={() => onUse(day)}
          style={{ color: '#7c3aed' }}
        >
          <Zap className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="space-y-1.5 pl-10">
        <p className="text-sm font-bold leading-snug" style={{ color: '#1a1035' }}>{day.topic}</p>
        <p className="text-xs leading-relaxed" style={{ color: '#9d8ec4' }}>{day.description}</p>
      </div>

      <div className="pl-10">
        <div className="rounded-xl px-3 py-2" style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.1)' }}>
          <p className="text-xs mb-0.5 uppercase tracking-wide font-bold" style={{ color: '#7c3aed', fontSize: '0.65rem' }}>Хук</p>
          <p className="text-xs italic leading-relaxed" style={{ color: '#4c3d75' }}>«{day.hook}»</p>
        </div>
      </div>

      <div className="pl-10">
        <button
          className="text-xs w-full text-left flex items-center gap-1 cursor-pointer font-semibold"
          style={{ color: '#7c3aed' }}
          onClick={() => onUse(day)}
        >
          <Zap className="w-3 h-3" />
          Создать пост по этой теме
          <ChevronRight className="w-3 h-3 ml-auto" />
        </button>
      </div>
    </div>
  )
}

function WeekStats({ days }: { days: PlanDay[] }) {
  const counts = days.reduce((acc, d) => {
    acc[d.format] = (acc[d.format] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="flex gap-2 flex-wrap">
      {Object.entries(counts).map(([fmt, count]) => {
        const cfg = FORMAT_CONFIG[fmt as keyof typeof FORMAT_CONFIG]
        if (!cfg) return null
        return (
          <Badge key={fmt} variant="outline" className={cn('text-xs border', cfg.color)}>
            {count}× {cfg.label}
          </Badge>
        )
      })}
    </div>
  )
}

const STORAGE_KEY = 'content_plan_state'

export default function ContentPlanPage() {
  const [niche, setNiche] = useState('')
  const [audience, setAudience] = useState('')
  const [goal, setGoal] = useState('dm')
  const [previousPlan, setPreviousPlan] = useState('')
  const [previousFileName, setPreviousFileName] = useState('')
  const [fileLoading, setFileLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<ContentPlan | null>(null)
  const [activeWeek, setActiveWeek] = useState(0)

  // Restore state when navigating back
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const s = JSON.parse(saved)
        if (s.niche) setNiche(s.niche)
        if (s.audience) setAudience(s.audience)
        if (s.goal) setGoal(s.goal)
        if (s.plan) setPlan(s.plan)
        if (s.activeWeek != null) setActiveWeek(s.activeWeek)
      }
    } catch {}
  }, [])

  // Save state to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ niche, audience, goal, plan, activeWeek }))
    } catch {}
  }, [niche, audience, goal, plan, activeWeek])

  const { setInput } = useGeneratorStore()
  const router = useRouter()

  async function generate() {
    if (!niche.trim()) { toast.error('Введите нишу'); return }
    setLoading(true)
    setPlan(null)
    try {
      const res = await fetch('/api/content-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, audience, goal, previousPlan: previousPlan.trim() || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      if (!data.plan?.days?.length) throw new Error('Пустой ответ')
      setPlan(data.plan)
      setActiveWeek(0)
      toast.success('Контент-план готов!')
    } catch (e: any) {
      toast.error(e.message ?? 'Ошибка генерации')
    } finally {
      setLoading(false)
    }
  }

  function useDay(day: PlanDay) {
    setInput({
      niche,
      offer: day.topic,
      audience: audience || undefined,
      pain_points: day.description,
      tone: 'bold',
      conversion_goal: goal as any,
    })
    router.push('/generate')
    toast.success('Форма заполнена — нажми «Сгенерировать»')
  }

  const weeks = plan
    ? [0, 1, 2, 3].map((w) => ({
        theme: plan.week_themes[w] ?? `Неделя ${w + 1}`,
        days: plan.days.filter((d) => d.day >= w * 7 + 1 && d.day <= (w + 1) * 7),
      }))
    : []

  return (
    <div className="max-w-5xl mx-auto space-y-6" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
      <div>
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2" style={{ color: '#1a1035' }}>
          <CalendarRange className="w-6 h-6" style={{ color: '#7c3aed' }} /> Контент-план
        </h1>
        <p className="text-sm mt-1" style={{ color: '#9d8ec4' }}>
          30-дневный план публикаций под твою нишу — каждую тему можно сразу открыть в генераторе
        </p>
      </div>

      {/* Input card */}
      <div style={cardStyle} className="p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label style={{ color: '#1a1035', fontWeight: 600 }}>Ниша *</Label>
            <Input
              placeholder="Например: Онлайн-коучинг"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generate()}
              style={{ borderColor: 'rgba(124,58,237,0.2)' }}
            />
            <div className="flex gap-1 flex-wrap">
              {POPULAR_NICHES.map((n) => (
                <button
                  key={n}
                  onClick={() => setNiche(n)}
                  className="text-xs px-2 py-0.5 rounded-full border transition-all cursor-pointer"
                  style={niche === n ? {
                    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                    color: 'white',
                    borderColor: 'transparent',
                  } : {
                    borderColor: 'rgba(124,58,237,0.2)',
                    color: '#9d8ec4',
                    background: 'transparent',
                  }}
                  onMouseEnter={e => { if (niche !== n) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.4)' }}
                  onMouseLeave={e => { if (niche !== n) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.2)' }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label style={{ color: '#1a1035', fontWeight: 600 }}>Аудитория</Label>
            <Input
              placeholder="Например: Предприниматели 25–40 лет"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              style={{ borderColor: 'rgba(124,58,237,0.2)' }}
            />
          </div>

          <div className="space-y-2">
            <Label style={{ color: '#1a1035', fontWeight: 600 }}>Цель конверсии</Label>
            <Select value={goal} onValueChange={(v) => v && setGoal(v)}>
              <SelectTrigger style={{ borderColor: 'rgba(124,58,237,0.2)' }}><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dm">DM / Директ</SelectItem>
                <SelectItem value="telegram">Telegram</SelectItem>
                <SelectItem value="call">Звонок</SelectItem>
                <SelectItem value="landing">Лендинг</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Previous plan upload */}
        <div className="space-y-2">
          <Label style={{ color: '#1a1035', fontWeight: 600 }}>
            Предыдущий контент-план{' '}
            <span style={{ color: '#9d8ec4', fontWeight: 400 }}>(необязательно)</span>
          </Label>
          <p className="text-xs" style={{ color: '#9d8ec4' }}>
            Загрузи прошлый план — AI создаст новый без повторов, с более сильными идеями и глубже
          </p>

          {!previousPlan ? (
            <label
              className={cn(
                'flex flex-col items-center justify-center gap-2 w-full h-24 rounded-xl border-2 border-dashed cursor-pointer transition-all',
                fileLoading ? 'opacity-50 pointer-events-none' : '',
              )}
              style={{ borderColor: 'rgba(124,58,237,0.2)' }}
              onMouseEnter={e => { if (!fileLoading) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.4)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.2)' }}
            >
              <input
                type="file"
                accept=".txt,.docx,.doc"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  setFileLoading(true)
                  try {
                    if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
                      const text = await file.text()
                      setPreviousPlan(text)
                      setPreviousFileName(file.name)
                    } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
                      const mammoth = await import('mammoth')
                      const buffer = await file.arrayBuffer()
                      const result = await mammoth.extractRawText({ arrayBuffer: buffer })
                      setPreviousPlan(result.value)
                      setPreviousFileName(file.name)
                    } else {
                      toast.error('Поддерживаются файлы: .docx (Google Docs), .txt')
                    }
                  } catch {
                    toast.error('Не удалось прочитать файл')
                  }
                  setFileLoading(false)
                  e.target.value = ''
                }}
              />
              {fileLoading
                ? <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#9d8ec4' }} />
                : <>
                    <Upload className="w-5 h-5" style={{ color: '#9d8ec4' }} />
                    <div className="text-center">
                      <p className="text-sm" style={{ color: '#9d8ec4' }}>Нажми чтобы загрузить файл</p>
                      <p className="text-xs" style={{ color: '#c4b5fd' }}>Google Docs (.docx) или текстовый (.txt)</p>
                    </div>
                  </>
              }
            </label>
          ) : (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ border: '1px solid rgba(124,58,237,0.25)', background: 'rgba(124,58,237,0.04)' }}
            >
              <FileText className="w-4 h-4 shrink-0" style={{ color: '#7c3aed' }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: '#1a1035' }}>{previousFileName || 'Файл загружен'}</p>
                <p className="text-xs" style={{ color: '#9d8ec4' }}>{previousPlan.length} символов — план проанализирован</p>
              </div>
              <button
                type="button"
                onClick={() => { setPreviousPlan(''); setPreviousFileName('') }}
                className="transition-colors cursor-pointer"
                style={{ color: '#9d8ec4' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#1a1035'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#9d8ec4'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <Button
          className="w-full sm:w-auto border-0 text-white font-semibold gap-2 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}
          onClick={generate}
          disabled={loading}
        >
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" />Генерирую план...</>
            : <><Sparkles className="w-4 h-4" />{previousPlan ? 'Создать улучшенный план на 30 дней' : 'Создать контент-план на 30 дней'}</>}
        </Button>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full rounded-xl" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-9 rounded-lg" />)}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
          </div>
        </div>
      )}

      {/* Plan output */}
      {plan && !loading && (
        <div className="space-y-5">
          {/* Month theme banner */}
          <div
            className="p-4 flex items-center gap-3 rounded-xl"
            style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.15)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}
            >
              <CalendarRange className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#7c3aed', fontSize: '0.65rem' }}>Тема месяца</p>
              <p className="font-bold text-sm mt-0.5" style={{ color: '#1a1035' }}>{plan.month_theme}</p>
            </div>
            <div className="ml-auto text-right hidden sm:block">
              <p className="text-xs" style={{ color: '#9d8ec4' }}>Всего постов</p>
              <p className="text-2xl font-black" style={{ color: '#1a1035' }}>{plan.days.length}</p>
            </div>
          </div>

          {/* Week tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {weeks.map((week, i) => (
              <button
                key={i}
                onClick={() => setActiveWeek(i)}
                className="p-3 rounded-xl border text-left transition-all space-y-1 cursor-pointer"
                style={activeWeek === i ? {
                  background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                  borderColor: 'transparent',
                  boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
                } : {
                  background: 'rgba(255,255,255,0.6)',
                  borderColor: 'rgba(124,58,237,0.15)',
                }}
                onMouseEnter={e => { if (activeWeek !== i) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.35)' }}
                onMouseLeave={e => { if (activeWeek !== i) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.15)' }}
              >
                <p
                  className="text-xs font-bold"
                  style={{ color: activeWeek === i ? 'rgba(255,255,255,0.7)' : '#9d8ec4' }}
                >
                  Неделя {i + 1}
                </p>
                <p
                  className="text-xs font-medium leading-tight"
                  style={{ color: activeWeek === i ? 'white' : '#1a1035' }}
                >
                  {week.theme}
                </p>
              </button>
            ))}
          </div>

          {/* Week stats */}
          <div className="flex items-center gap-3">
            <p className="text-sm font-bold" style={{ color: '#1a1035' }}>{weeks[activeWeek]?.theme}</p>
            <WeekStats days={weeks[activeWeek]?.days ?? []} />
          </div>

          {/* Day cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {weeks[activeWeek]?.days.map((day) => (
              <DayCard key={day.day} day={day} onUse={useDay} />
            ))}
          </div>

          <div className="text-center">
            <p className="text-xs" style={{ color: '#9d8ec4' }}>
              Нажми <Zap className="w-3 h-3 inline" style={{ color: '#7c3aed' }} /> на любой день — форма генератора заполнится автоматически
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
