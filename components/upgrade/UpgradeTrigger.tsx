'use client'

import { useState, useEffect } from 'react'
import { Zap, X } from 'lucide-react'
import { UpgradeModal } from './UpgradeModal'

interface UsageData {
  plan: string
  generations_used: number
  max_generations: number | null
  remaining: number | null
}

export function UpgradeTrigger() {
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetch('/api/usage').then(r => r.json()).then(setUsage).catch(() => {})
  }, [])

  if (!usage || usage.plan !== 'free' || dismissed) return null
  if (usage.max_generations === null) return null

  const used = usage.generations_used
  const max = usage.max_generations
  const remaining = max - used

  // Show trigger when used >= 7 (out of 15 free)
  if (used < 7) return null

  const pct = Math.round((used / max) * 100)
  const isAlmostOut = remaining <= 3

  return (
    <>
      <div
        style={{
          background: isAlmostOut
            ? 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(220,38,38,0.05))'
            : 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(99,102,241,0.05))',
          border: isAlmostOut ? '1px solid rgba(239,68,68,0.25)' : '1px solid rgba(124,58,237,0.2)',
          borderRadius: '1rem',
          padding: '0.875rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem',
          flexWrap: 'wrap' as const,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <div style={{
            width: '2rem', height: '2rem', borderRadius: '0.625rem',
            background: isAlmostOut ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isAlmostOut ? '0 4px 10px rgba(239,68,68,0.3)' : '0 4px 10px rgba(124,58,237,0.3)',
          }}>
            <Zap style={{ width: '1rem', height: '1rem', color: '#fff' }} />
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '12rem' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1a1035', marginBottom: '0.2rem' }}>
            {isAlmostOut
              ? `⚠️ Осталось ${remaining} генерации — лимит почти исчерпан`
              : `Использовано ${used} из ${max} бесплатных генераций (${pct}%)`
            }
          </p>
          <p style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 600 }}>
            Один лид окупает Starter-подписку на 3 месяца — 990 ₽/мес
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: '#fff', border: 'none', borderRadius: '0.625rem',
              padding: '0.45rem 0.875rem', fontSize: '0.78rem', fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(124,58,237,0.35)',
              whiteSpace: 'nowrap' as const,
            }}
          >
            Улучшить тариф →
          </button>
          <button
            onClick={() => setDismissed(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9d8ec4', padding: '0.25rem', display: 'flex' }}
          >
            <X style={{ width: '1rem', height: '1rem' }} />
          </button>
        </div>
      </div>

      {showModal && <UpgradeModal onClose={() => setShowModal(false)} trigger="limit" />}
    </>
  )
}
