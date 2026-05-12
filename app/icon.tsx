import { ImageResponse } from 'next/og'

export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 64,
          height: 64,
          background: '#2D0E04',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 18,
            fontWeight: 400,
            color: '#EDE4D6',
            lineHeight: 1,
            letterSpacing: '2px',
          }}
        >
          ALPÉ
        </span>
      </div>
    ),
    { ...size }
  )
}
