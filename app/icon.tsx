export const size = { width: 64, height: 64 }
export const contentType = 'image/svg+xml'

export default function Icon() {
  const svg = `
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#2D0E04"/>
      <text x="32" y="37" text-anchor="middle" fill="#EDE4D6" font-family="Georgia, 'Times New Roman', serif" font-size="16" letter-spacing="2">ALPE</text>
    </svg>
  `

  return new Response(svg, {
    headers: {
      'Content-Type': contentType,
    },
  })
}
