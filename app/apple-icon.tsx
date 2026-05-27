import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '40px',
      }}
    >
      <div
        style={{
          color: '#ffffff',
          fontSize: '110px',
          fontWeight: 900,
          fontFamily: 'sans-serif',
          lineHeight: 1,
        }}
      >
        R
      </div>
    </div>,
    { ...size }
  )
}
