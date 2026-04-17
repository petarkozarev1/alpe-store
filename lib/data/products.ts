import type { Product } from '@/lib/types'

export const products: Product[] = [
  {
    id: 'alpe-classic',
    slug: 'alpe-classic',
    name: 'ALPE Classic',
    subtitle: 'Just One Pair. Endless Clarity.',
    description: 'ALPE Classic protects your eyes during long screen sessions with premium blue light filtering, anti-glare coating, and an ultra-lightweight frame built for all-day wear.',
    price: 49,
    images: [
      'https://via.placeholder.com/600x600/F5F5F0/000000?text=ALPE+Classic',
      'https://via.placeholder.com/600x600/E8E8E8/000000?text=ALPE+Classic+Side',
    ],
    variants: [
      { id: 'black', label: 'Black', inStock: true },
      { id: 'tortoise', label: 'Tortoise', inStock: true },
    ],
    badge: 'Best Seller',
  },
  {
    id: 'alpe-pro',
    slug: 'alpe-pro',
    name: 'ALPE Pro',
    subtitle: 'Maximum Protection. Minimal Look.',
    description: 'The ALPE Pro features our strongest blue light filter and premium scratch-resistant lenses — engineered for power users, developers, and anyone living on screens.',
    price: 79,
    images: [
      'https://via.placeholder.com/600x600/F5F5F0/000000?text=ALPE+Pro',
      'https://via.placeholder.com/600x600/E8E8E8/000000?text=ALPE+Pro+Side',
    ],
    variants: [
      { id: 'black', label: 'Black', inStock: true },
      { id: 'matte-black', label: 'Matte Black', inStock: false },
    ],
    badge: 'New',
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug)
}
