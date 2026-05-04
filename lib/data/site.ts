import type { SiteConfig } from '@/lib/types'

export const siteConfig: SiteConfig = {
  brand: 'ALPÉ',
  tagline: 'Работи цял ден. Спи цяла нощ.',
  nav: [
    { label: 'Ползи', href: '#benefits' },
    { label: 'Стъкла', href: '#ingredients' },
    { label: 'Как работи', href: '#how-it-works' },
    { label: 'Въпроси', href: '#faqs' },
  ],
  footer: {
    description: 'Очила за синя и зелена светлина за ежедневна употреба пред екран.',
    columns: [
      {
        title: 'ПРОДУКТ',
        links: [
          { label: 'Стъкла', href: '/lenses' },
          { label: 'Рамки', href: '/frames' },
          { label: 'Цени', href: '/pricing' },
        ],
      },
      {
        title: 'КОМПАНИЯ',
        links: [
          { label: 'Нашата история', href: '/about' },
          { label: 'Науката', href: '/science' },
          { label: 'Сертификати', href: '/certifications' },
        ],
      },
      {
        title: 'ПОДДРЪЖКА',
        links: [
          { label: 'Въпроси', href: '/faqs' },
          { label: 'Връщане', href: '/returns' },
          { label: 'Контакт', href: '/contact' },
        ],
      },
    ],
    legal: [
      { label: 'Политика за поверителност', href: '/privacy' },
      { label: 'Общи условия', href: '/terms' },
    ],
    copyright: '© 2026 ALPÉ. Всички права запазени.',
  },
}
