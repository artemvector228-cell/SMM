import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Revenue OS — AI-контент для конверсий'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #faf8ff 0%, #f3f0ff 40%, #faf5ff 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Orb top-left */}
        <div style={{
          position: 'absolute', top: -120, left: -80,
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.35) 0%, transparent 70%)',
        }} />
        {/* Orb bottom-right */}
        <div style={{
          position: 'absolute', bottom: -100, right: -60,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(129,140,248,0.3) 0%, transparent 70%)',
        }} />

        {/* Logo badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(124,58,237,0.4)',
          }}>
            <div style={{ color: 'white', fontSize: 26, fontWeight: 900 }}>⚡</div>
          </div>
          <span style={{ fontSize: 28, fontWeight: 800, color: '#1a1035', letterSpacing: -0.5 }}>Revenue OS</span>
        </div>

        {/* Headline */}
        <div style={{
          fontSize: 64, fontWeight: 900, color: '#1a1035',
          textAlign: 'center', lineHeight: 1.1, letterSpacing: -2,
          maxWidth: 900, display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <span>AI-контент, который</span>
          <span style={{
            background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
            backgroundClip: 'text',
            color: 'transparent',
          }}>
            конвертирует в продажи
          </span>
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: 22, color: '#6b5b95', textAlign: 'center',
          maxWidth: 680, marginTop: 20, lineHeight: 1.5,
        }}>
          Instagram · Telegram · Reels · Stories · Хуки · Стратегия
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
          {['6 форматов за раз', 'Без шаблонов', 'Бесплатно'].map((tag) => (
            <div key={tag} style={{
              padding: '8px 20px', borderRadius: 50,
              background: 'rgba(124,58,237,0.1)',
              border: '1px solid rgba(124,58,237,0.25)',
              color: '#7c3aed', fontSize: 16, fontWeight: 700,
            }}>
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
