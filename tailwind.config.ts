import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ALPÉ design tokens — full warm palette
        onyx:     '#2D0E04',  // deep warm espresso (was cool black)
        gold:     '#C4A266',  // warm gold — unchanged
        iron:     '#7C3018',  // warm sienna (was dark cool brown)
        stone:    '#9B7B68',  // warm muted taupe (was cool gray-brown)
        linen:    '#EDE4D6',  // warm cream — unchanged
        white:    '#FFFFFF',
        // Warm background scale — light → medium
        cream:    '#FFFBF5',
        ivory:    '#FFF6EC',
        parchment:'#FFF0E0',
        peach:    '#FFE4CC',
        sand:     '#F5DFC5',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans:  ['var(--font-raleway)', 'sans-serif'],
      },
      fontSize: {
        'display':      ['72px', { lineHeight: '1.05', letterSpacing: '-1px',  fontWeight: '400' }],
        'heading':      ['48px', { lineHeight: '1.1',  letterSpacing: '0px',   fontWeight: '400' }],
        'card-heading': ['32px', { lineHeight: '1.2',  fontWeight: '400' }],
        'label':        ['11px', { lineHeight: '1',    letterSpacing: '0.18em', fontWeight: '500' }],
      },
      maxWidth: {
        content: '1200px',
      },
      borderRadius: {
        card: '3px',
      },
    },
  },
  plugins: [],
}

export default config
