'use client'

import { InputForm } from '@/components/generator/InputForm'
import { OutputCards } from '@/components/generator/OutputCards'
import { ScheduleButton } from '@/components/generator/ScheduleButton'
import { useGeneratorStore } from '@/store/useGeneratorStore'
import { Skeleton } from '@/components/ui/skeleton'
import { Zap, ArrowRight } from 'lucide-react'
import { UpgradeTrigger } from '@/components/upgrade/UpgradeTrigger'
import Link from 'next/link'

const cardStyle = {
  background: 'rgba(255,255,255,0.75)',
  border: '1px solid rgba(124,58,237,0.12)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 4px 20px rgba(109,40,217,0.07)',
  borderRadius: '1rem',
}

function OutputSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-20 rounded-xl" />
        ))}
      </div>
      <div style={cardStyle} className="p-5 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function GeneratePage() {
  const { output, isGenerating } = useGeneratorStore()

  return (
    <div className="max-w-5xl mx-auto space-y-6" style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
      <div>
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2" style={{ color: '#1a1035' }}>
          <Zap className="w-6 h-6" style={{ color: '#7c3aed' }} /> Генератор контента
        </h1>
        <p className="text-sm mt-1" style={{ color: '#9d8ec4' }}>
          Заполните данные и получите конверсионный контент для всех платформ
        </p>
      </div>

      <UpgradeTrigger />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div style={cardStyle} className="p-5">
          <InputForm />
        </div>

        <div className="space-y-4">
          {isGenerating && <OutputSkeleton />}
          {!isGenerating && output && (
            <>
              <div className="flex gap-2 flex-wrap">
                <ScheduleButton generationId={output.id} scheduledAt={output.scheduled_at} />
              </div>
              <OutputCards output={output.output_json} />
              {/* Next steps onboarding card */}
              <div className="rounded-2xl p-4 space-y-3"
                style={{ background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.12)' }}>
                <p className="text-sm font-bold" style={{ color: '#1a1035' }}>Что делать дальше?</p>
                <div className="space-y-2">
                  {[
                    { step: '1', text: 'Опубликуйте пост в Telegram или Instagram', href: null },
                    { step: '2', text: 'Отметьте результат в Библиотеке («Получил лид»)', href: '/library' },
                    { step: '3', text: 'Запланируйте следующий пост', href: '/schedule' },
                    { step: '4', text: 'Создайте контент-план на 30 дней', href: '/content-plan' },
                  ].map(({ step, text, href }) => (
                    <div key={step} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>{step}</span>
                      {href ? (
                        <Link href={href} className="text-xs font-medium flex items-center gap-1 group"
                          style={{ color: '#7c3aed' }}>
                          {text} <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      ) : (
                        <p className="text-xs" style={{ color: '#6b5b95' }}>{text}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {!isGenerating && !output && (
            <div
              className="flex flex-col items-center justify-center h-full min-h-64 rounded-2xl border-2 border-dashed text-center p-8"
              style={{ borderColor: 'rgba(124,58,237,0.15)' }}
            >
              <Zap className="w-8 h-8 mb-3" style={{ color: 'rgba(124,58,237,0.25)' }} />
              <p className="text-sm font-medium" style={{ color: '#9d8ec4' }}>Здесь появится сгенерированный контент</p>
              <p className="text-xs mt-1" style={{ color: '#c4b5fd' }}>Заполните форму слева и нажмите «Сгенерировать»</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
