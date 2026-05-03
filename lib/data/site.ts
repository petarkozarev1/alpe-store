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
    tagline: 'Работи цял ден. Спи цяла нощ.',
    pages: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: '404', href: '/404' },
    ],
    social: [
      { label: 'X', href: '#' },
      { label: 'Instagram', href: '#' },
    ],
  },
}
