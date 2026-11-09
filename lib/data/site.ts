import type { SiteConfig } from '@/lib/types'

export const siteConfig: SiteConfig = {
  brand: 'AMPÉ',
  tagline: 'Работи цял ден. Спи цяла нощ.',
  nav: [
    { label: 'Доказано', href: '/certifications' },
    { label: 'Стъкла', href: '/lenses' },
    { label: 'Как работи', href: '/science' },
    { label: 'Въпроси', href: '/faqs' },
  ],
  footer: {
    description: 'Очила за синя и зелена светлина за ежедневна употреба пред екран.',
    columns: [
      {
        title: 'ПРОДУКТ',
        links: [
          { label: 'Стъкла', href: '/lenses' },
          { label: 'Цени', href: '/pricing' },
        ],
      },
      {
        title: 'КОМПАНИЯ',
        links: [
          { label: 'Нашата история', href: '/about' },
          { label: 'За бизнеса', href: '/#business' },
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
    copyright: '© 2026 AMPÉ. Всички права запазени.',
  },
}
