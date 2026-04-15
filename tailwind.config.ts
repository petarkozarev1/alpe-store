import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#000000',
          white: '#FFFFFF',
          'off-white': '#F5F5F0',
          muted: '#888888',
          'gray-light': '#E8E8E8',
          'dark-card': '#111111',
          charcoal: '#555555',
          footer: '#1A1A1A',
          border: '#E5E5E5',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'sans-serif'],
      },
      fontSize: {
        'display': ['72px', { lineHeight: '1.05', letterSpacing: '-2px', fontWeight: '800' }],
        'heading': ['56px', { lineHeight: '1.1', letterSpacing: '-1px', fontWeight: '700' }],
        'card-heading': ['40px', { lineHeight: '1.15', fontWeight: '700' }],
        'footer-giant': ['160px', { lineHeight: '0.9', letterSpacing: '-4px', fontWeight: '800' }],
      },
      maxWidth: {
        content: '1200px',
      },
      borderRadius: {
        card: '16px',
        xl: '12px',
      },
    },
  },
  plugins: [],
}

export default config
