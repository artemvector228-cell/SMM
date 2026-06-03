'use client'

import { GenerationOutput, QualityScore } from '@/types'
import { ContentCard, CopyField, CopyAllButton } from './ContentCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

function QualityBadge({ score }: { score: QualityScore }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    S: { bg: 'rgba(16,185,129,0.1)', text: '#059669', border: 'rgba(16,185,129,0.3)' },
    A: { bg: 'rgba(124,58,237,0.1)', text: '#7c3aed', border: 'rgba(124,58,237,0.3)' },
    B: { bg: 'rgba(245,158,11,0.1)', text: '#d97706', border: 'rgba(245,158,11,0.3)' },
    C: { bg: 'rgba(239,68,68,0.1)', text: '#dc2626', border: 'rgba(239,68,68,0.3)' },
  }
  const c = colors[score.grade] ?? colors.B
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-bold"
      style={{ background: c.bg, color: c.text, borderColor: c.border }}>
      <ShieldCheck className="w-3.5 h-3.5" />
      Quality {score.grade} · {score.total}/100
    </div>
  )
}

interface OutputCardsProps {
  output: GenerationOutput
}

export function OutputCards({ output }: OutputCardsProps) {
  const hashtags = output.instagram_post?.hashtags ?? []
  const levers = output.conversion_strategy?.psychological_levers ?? []
  const stories = output.stories ?? []
  const scenes = output.reels_script?.scenes ?? []
  const hooks = output.viral_hooks ?? []
  const structure = output.telegram_post?.structure ?? []
  const qs = output.quality_scores

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Quality Gate summary */}
      {qs && (
        <div className="flex items-center gap-3 p-3 rounded-xl mb-4 flex-wrap gap-y-2"
          style={{ background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.1)' }}>
          <span className="text-xs font-semibold" style={{ color: '#6b5b95' }}>Quality Gate:</span>
          <QualityBadge score={qs.instagram} />
          <QualityBadge score={qs.telegram} />
          <span className="text-xs ml-auto" style={{ color: '#9d8ec4' }}>
            Общий: {qs.overall}/100 {qs.overall >= 80 ? '✓ Прошёл' : '↻ Переписан'}
          </span>
        </div>
      )}

      <Tabs defaultValue="instagram" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="instagram">Instagram</TabsTrigger>
          <TabsTrigger value="telegram">Telegram</TabsTrigger>
          <TabsTrigger value="stories">Stories</TabsTrigger>
          <TabsTrigger value="reels">Reels</TabsTrigger>
          <TabsTrigger value="hooks">Хуки</TabsTrigger>
          <TabsTrigger value="strategy">Стратегия</TabsTrigger>
        </TabsList>

        <TabsContent value="instagram">
          <ContentCard title="Пост для Instagram" badge="Конверсия">
            <CopyField label="Хук" text={output.instagram_post?.hook ?? ''} />
            <CopyField label="Усиление боли" text={output.instagram_post?.pain_agitation ?? ''} />
            <CopyField label="Ценность" text={output.instagram_post?.value_body ?? ''} />
            <CopyField label="Призыв к действию" text={output.instagram_post?.cta ?? ''} />
            {hashtags.length > 0 && (
              <div className="rounded-xl p-3 space-y-1" style={{ background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.08)' }}>
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#7c3aed', fontSize: '0.65rem' }}>Хэштеги</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {hashtags.map((h, i) => (
                    <Badge key={i} variant="outline" className="text-xs" style={{ borderColor: 'rgba(124,58,237,0.2)', color: '#7c3aed' }}>
                      #{h.replace('#', '').replace(/\s+/g, '')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <CopyAllButton text={[
              output.instagram_post?.hook ?? '',
              '',
              output.instagram_post?.pain_agitation ?? '',
              '',
              output.instagram_post?.value_body ?? '',
              '',
              output.instagram_post?.cta ?? '',
              '',
              hashtags.map(h => `#${h.replace('#', '').replace(/\s+/g, '')}`).join(' '),
            ].join('\n')} />
          </ContentCard>
        </TabsContent>

        <TabsContent value="telegram">
          <ContentCard title="Пост для Telegram" badge="Авторитет">
            {structure.map((block, i) => (
              <CopyField
                key={i}
                label={(['Хук', 'Проблема', 'Глубокая ценность', 'Экспертность', 'Мягкий CTA'] as string[])[i] ?? `Блок ${i + 1}`}
                text={block}
              />
            ))}
            <CopyField label="Финальный призыв" text={output.telegram_post?.cta ?? ''} />
            <CopyAllButton text={[...structure, '', output.telegram_post?.cta ?? ''].join('\n\n')} />
          </ContentCard>
        </TabsContent>

        <TabsContent value="stories">
          <ContentCard title="Серия Stories" badge="5 слайдов">
            {stories.map((slide, i) => (
              <CopyField
                key={i}
                label={`Слайд ${i + 1} — ${(['Хук', 'Проблема', 'Инсайт', 'Решение', 'CTA'] as string[])[i] ?? ''}`}
                text={slide}
              />
            ))}
            <CopyAllButton text={stories.join('\n\n---\n\n')} />
          </ContentCard>
        </TabsContent>

        <TabsContent value="reels">
          <ContentCard title="Сценарий Reels" badge="30 секунд">
            <CopyField label="Открывающий хук (0–3 сек)" text={output.reels_script?.hook ?? ''} />
            {scenes.map((scene, i) => (
              <CopyField key={i} label={`Сцена ${i + 1}`} text={scene} />
            ))}
            <CopyField label="Призыв к действию" text={output.reels_script?.cta ?? ''} />
            <CopyAllButton text={[
              `ХУК: ${output.reels_script?.hook ?? ''}`,
              '',
              ...scenes.map((s, i) => `СЦЕНА ${i + 1}: ${s}`),
              '',
              `CTA: ${output.reels_script?.cta ?? ''}`,
            ].join('\n')} />
          </ContentCard>
        </TabsContent>

        <TabsContent value="hooks">
          <ContentCard title="10 вирусных хуков" badge="Останавливают скролл">
            {hooks.map((hook, i) => (
              <CopyField key={i} label={`Хук ${i + 1}`} text={hook} />
            ))}
            <CopyAllButton text={hooks.map((h, i) => `${i + 1}. ${h}`).join('\n\n')} />
          </ContentCard>
        </TabsContent>

        <TabsContent value="strategy">
          <ContentCard title="Стратегия конверсии" badge="Блюпринт">
            <CopyField label="Главный триггер" text={output.conversion_strategy?.primary_trigger ?? ''} />
            {levers.length > 0 && (
              <div className="rounded-xl p-3 space-y-2" style={{ background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.08)' }}>
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#7c3aed', fontSize: '0.65rem' }}>Психологические рычаги</span>
                <ul className="space-y-1 mt-1">
                  {levers.map((lever, i) => (
                    <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#1a1035' }}>
                      <span style={{ color: '#7c3aed' }} className="mt-0.5 shrink-0">•</span>
                      {lever}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <CopyField label="Механизм CTA" text={output.conversion_strategy?.cta_mechanism ?? ''} />
          </ContentCard>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
