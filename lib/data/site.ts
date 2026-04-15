import type { SiteConfig } from '@/lib/types'

export const siteConfig: SiteConfig = {
  brand: 'Raydiant',
  tagline: 'Because Your Skin Deserves More.',
  nav: [
    { label: 'Benefits', href: '#benefits' },
    { label: 'Ingredients', href: '#ingredients' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'FAQs', href: '#faqs' },
  ],
  footer: {
    tagline: 'Because Your Skin Deserves More.',
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
