'use client'

import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Star, Zap, ArrowRight, StarOff } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useGeneratorStore } from '@/store/useGeneratorStore'
import { Generation } from '@/types'
import { OutputCards } from '@/components/generator/OutputCards'

const cardStyle = {
  background: 'rgba(255,255,255,0.75)',
  border: '1px solid rgba(124,58,237,0.12)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 4px 20px rgba(109,40,217,0.07)',
  borderRadius: '1rem',
}

const GOAL_LABELS: Record<string, string> = { dm: 'DM', telegram: 'Telegram', call: 'Звонок', landing: 'Лендинг' }

function getStarred(): string[] {
  try { return JSON.parse(localStorage.getItem('starred_generations') ?? '[]') } catch { return [] }
}
function toggleStar(id: string) {
  const current = getStarred()
  const next = current.includes(id) ? current.filter(s => s !== id) : [...current, id]
  localStorage.setItem('starred_generations', JSON.stringify(next))
  return next
}

export function StarButton({ id, onToggle }: { id: string; onToggle?: (starred: string[]) => void }) {
  const [starred, setStarred] = useState(false)
  useEffect(() => { setStarred(getStarred().includes(id)) }, [id])

  function handle(e: React.MouseEvent) {
    e.stopPropagation()
    const next = toggleStar(id)
    setStarred(next.includes(id))
    onToggle?.(next)
    toast.success(next.includes(id) ? 'Добавлено в Мои связки' : 'Убрано из Мои связки')
  }

  return (
    <button
      onClick={handle}
      className="p-1.5 rounded-lg transition-colors cursor-pointer"
      title={starred ? 'Убрать из связок' : 'Добавить в связки'}
      style={{ color: starred ? '#f59e0b' : '#9d8ec4', background: starred ? 'rgba(245,158,11,0.1)' : 'transparent' }}
    >
      <Star className={`w-4 h-4 ${starred ? 'fill-amber-400' : ''}`} />
    </button>
  )
}

export default function TemplatesPage() {
  const [starredIds, setStarredIds] = useState<string[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const { setInput } = useGeneratorStore()
  const router = useRouter()

  useEffect(() => { setStarredIds(getStarred()) }, [])

  const { data, isLoading } = useQuery({
    queryKey: ['history', 1],
    queryFn: () => fetch('/api/history?page=1&limit=100').then(r => r.json()),
  })

  const starred = (data?.generations ?? []).filter((g: Generation) => starredIds.includes(g.id))

  function useAsTemplate(g: Generation) {
    setInput({
      niche: g.input_json.niche,
      offer: g.input_json.offer,
      audience: g.input_json.audience,
      pain_points: g.input_json.pain_points,
      tone: g.input_json.tone,
      conversion_goal: g.input_json.conversion_goal,
    })
    router.push('/generate')
    toast.success('Форма заполнена из связки — нажми «Сгенерировать»')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
      <div>
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2" style={{ color: '#1a1035' }}>
          <Star className="w-6 h-6" style={{ color: '#f59e0b' }} /> Мои связки
        </h1>
        <p className="text-sm mt-1" style={{ color: '#9d8ec4' }}>
          Сохранённые успешные генерации — нажми ⭐ в Библиотеке чтобы добавить
        </p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      )}

      {!isLoading && starred.length === 0 && (
        <div style={cardStyle} className="p-14 text-center">
          <StarOff className="w-10 h-10 mx-auto mb-3" style={{ color: 'rgba(124,58,237,0.25)' }} />
          <p className="font-bold" style={{ color: '#1a1035' }}>Связок пока нет</p>
          <p className="text-sm mt-1 mb-5" style={{ color: '#9d8ec4' }}>
            Зайди в Библиотеку и нажми ⭐ рядом с генерацией, которая сработала
          </p>
          <Button
            onClick={() => router.push('/library')}
            className="cursor-pointer border-0 text-white font-semibold gap-2"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
          >
            Открыть библиотеку <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {starred.map((g: Generation) => (
          <div
            key={g.id}
            style={cardStyle}
            className="p-4 space-y-3 transition-all hover:shadow-[0_8px_32px_rgba(109,40,217,0.12)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-sm" style={{ color: '#1a1035' }}>{g.input_json.niche}</p>
                  <Badge className="border text-xs font-semibold" style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed', borderColor: 'rgba(124,58,237,0.2)' }}>
                    {GOAL_LABELS[g.input_json.conversion_goal] ?? g.input_json.conversion_goal}
                  </Badge>
                </div>
                <p className="text-xs mt-1 truncate" style={{ color: '#9d8ec4' }}>{g.input_json.offer}</p>
                <p className="text-xs mt-0.5" style={{ color: '#9d8ec4' }}>{new Date(g.created_at).toLocaleDateString('ru-RU')}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button
                  size="sm"
                  onClick={() => useAsTemplate(g)}
                  className="cursor-pointer border-0 text-white text-xs font-semibold gap-1.5 h-8"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
                >
                  <Zap className="w-3.5 h-3.5" /> Использовать
                </Button>
                <StarButton id={g.id} onToggle={ids => setStarredIds(ids)} />
              </div>
            </div>

            <button
              className="text-xs w-full text-left cursor-pointer"
              style={{ color: '#9d8ec4' }}
              onClick={() => setExpanded(expanded === g.id ? null : g.id)}
            >
              {expanded === g.id ? '▲ Скрыть контент' : '▼ Показать контент'}
            </button>

            {expanded === g.id && (
              <div className="pt-2 border-t" style={{ borderColor: 'rgba(124,58,237,0.1)' }}>
                <OutputCards output={g.output_json} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
