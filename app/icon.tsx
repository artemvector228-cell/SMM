import { ImageResponse } from 'next/og'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '20%',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0px',
        }}
      >
        <div
          style={{
            color: '#ffffff',
            fontSize: '260px',
            fontWeight: 900,
            lineHeight: 1,
            fontFamily: 'sans-serif',
          }}
        >
          R
        </div>
        <div
          style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: '72px',
            fontWeight: 600,
            letterSpacing: '8px',
            fontFamily: 'sans-serif',
          }}
        >
          OS
        </div>
      </div>
    </div>,
    { ...size }
  )
}
