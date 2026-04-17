import type { SiteConfig } from '@/lib/types'

export const siteConfig: SiteConfig = {
  brand: 'ALPE',
  tagline: 'Screen All Day. Sleep All Night.',
  nav: [
    { label: 'Benefits', href: '#benefits' },
    { label: 'Lenses', href: '#ingredients' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'FAQs', href: '#faqs' },
  ],
  footer: {
    tagline: 'Screen All Day. Sleep All Night.',
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
