'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Calendar, Clock, CalendarDays } from 'lucide-react'
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  getDay, isSameDay, addMonths, subMonths, isToday,
} from 'date-fns'
import { ru } from 'date-fns/locale'

interface ScheduledPost {
  id: string
  scheduled_at: string
  input_json: { niche: string; offer: string; tone?: string }
}

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const cardStyle = {
  background: 'rgba(255,255,255,0.75)',
  border: '1px solid rgba(124,58,237,0.12)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 4px 20px rgba(109,40,217,0.07)',
  borderRadius: '1rem',
}

export default function SchedulePage() {
  const [month, setMonth] = useState(new Date())
  const [posts, setPosts] = useState<ScheduledPost[]>([])
  const [selected, setSelected] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [month])

  async function fetchPosts() {
    setLoading(true)
    try {
      const m = format(month, 'yyyy-MM')
      const res = await fetch(`/api/schedule?month=${m}`)
      const data = await res.json()
      setPosts(data.schedule ?? [])
    } finally {
      setLoading(false)
    }
  }

  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) })
  const firstOffset = (getDay(days[0]) + 6) % 7

  function postsFor(day: Date) {
    return posts.filter(p => isSameDay(new Date(p.scheduled_at), day))
  }

  const selectedPosts = selected ? postsFor(selected) : []

  return (
    <div className="max-w-5xl mx-auto space-y-6" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
      <div>
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2" style={{ color: '#1a1035' }}>
          <CalendarDays className="w-6 h-6" style={{ color: '#7c3aed' }} /> Расписание постов
        </h1>
        <p className="text-sm mt-1" style={{ color: '#9d8ec4' }}>
          Запланированные публикации по датам
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div style={cardStyle} className="p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold capitalize" style={{ color: '#1a1035' }}>
                {format(month, 'LLLL yyyy', { locale: ru })}
              </h2>
              <div className="flex gap-1 items-center">
                <Button
                  size="icon" variant="ghost"
                  className="h-8 w-8 cursor-pointer"
                  style={{ color: '#7c3aed' }}
                  onClick={() => setMonth(subMonths(month, 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="sm" variant="ghost"
                  className="h-8 px-2 text-xs cursor-pointer font-semibold"
                  style={{ color: '#7c3aed' }}
                  onClick={() => setMonth(new Date())}
                >
                  Сегодня
                </Button>
                <Button
                  size="icon" variant="ghost"
                  className="h-8 w-8 cursor-pointer"
                  style={{ color: '#7c3aed' }}
                  onClick={() => setMonth(addMonths(month, 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {WEEKDAYS.map(d => (
                <div key={d} className="text-center text-xs font-bold py-1" style={{ color: '#9d8ec4' }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstOffset }).map((_, i) => (
                <div key={`e-${i}`} />
              ))}
              {days.map(day => {
                const dp = postsFor(day)
                const isSel = selected ? isSameDay(day, selected) : false
                const today = isToday(day)
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelected(isSel ? null : day)}
                    className="relative p-2 text-sm rounded-xl transition-all text-center min-h-[36px] cursor-pointer"
                    style={isSel ? {
                      background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
                    } : today ? {
                      border: '1px solid rgba(124,58,237,0.4)',
                      color: '#7c3aed',
                      fontWeight: 700,
                      background: 'rgba(124,58,237,0.06)',
                    } : {
                      color: '#1a1035',
                    }}
                    onMouseEnter={e => { if (!isSel) (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.08)' }}
                    onMouseLeave={e => { if (!isSel && !today) (e.currentTarget as HTMLElement).style.background = 'transparent'; if (!isSel && today) (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.06)' }}
                  >
                    {format(day, 'd')}
                    {dp.length > 0 && (
                      <span
                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                        style={{ background: isSel ? 'white' : '#7c3aed' }}
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {loading && (
              <p className="text-xs text-center mt-4" style={{ color: '#9d8ec4' }}>Загрузка...</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div style={cardStyle} className="p-5">
            {selected ? (
              <>
                <h3 className="font-bold text-sm mb-3" style={{ color: '#1a1035' }}>
                  {format(selected, 'd MMMM yyyy', { locale: ru })}
                </h3>
                {selectedPosts.length === 0 ? (
                  <p className="text-sm" style={{ color: '#9d8ec4' }}>Нет запланированных постов</p>
                ) : (
                  <div className="space-y-3">
                    {selectedPosts.map(post => (
                      <div
                        key={post.id}
                        className="rounded-xl p-3 space-y-2"
                        style={{ background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.1)' }}
                      >
                        <div className="flex items-center gap-1 text-xs" style={{ color: '#9d8ec4' }}>
                          <Clock className="w-3 h-3" />
                          {format(new Date(post.scheduled_at), 'HH:mm')}
                        </div>
                        <p className="text-sm font-bold" style={{ color: '#1a1035' }}>{post.input_json.niche}</p>
                        <p className="text-xs line-clamp-2" style={{ color: '#9d8ec4' }}>
                          {post.input_json.offer}
                        </p>
                        <Badge
                          className="border text-xs font-semibold"
                          style={{ background: 'rgba(124,58,237,0.08)', color: '#7c3aed', borderColor: 'rgba(124,58,237,0.2)' }}
                        >
                          Запланировано
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6">
                <Calendar className="w-8 h-8 mx-auto mb-2" style={{ color: 'rgba(124,58,237,0.3)' }} />
                <p className="text-sm" style={{ color: '#9d8ec4' }}>
                  Выберите день для просмотра постов
                </p>
              </div>
            )}
          </div>

          <div className="rounded-xl p-4 space-y-2" style={{ background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.1)' }}>
            <p className="font-bold text-sm" style={{ color: '#1a1035' }}>Как запланировать пост?</p>
            {[
              'Сгенерируйте контент',
              'Нажмите кнопку «Запланировать»',
              'Выберите дату и время',
            ].map((text, i) => (
              <p key={i} className="text-xs flex items-start gap-2" style={{ color: '#6b5b95' }}>
                <span className="font-bold shrink-0" style={{ color: '#7c3aed' }}>{i + 1}.</span>
                {text}
              </p>
            ))}
            <p className="text-xs mt-2" style={{ color: '#9d8ec4' }}>
              Точки на календаре — запланированные посты.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
