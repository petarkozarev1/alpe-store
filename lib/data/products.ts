import type { Product } from '@/lib/types'

export const products: Product[] = [
  {
    id: 'raydiant-serum-30ml',
    slug: 'raydiant-serum-30ml',
    name: 'Raydiant Glow Serum',
    subtitle: 'Just One Drop. Endless Glow.',
    description: 'Raydiant keeps your skin soft, smooth, and naturally radiant. With just one drop, it hydrates and nourishes your skin so you can glow all day.',
    price: 49,
    images: [
      'https://via.placeholder.com/600x600/F5F5F0/000000?text=Raydiant+Serum',
      'https://via.placeholder.com/600x600/E8E8E8/000000?text=Raydiant+Serum+2',
    ],
    variants: [
      { id: '30ml', label: '30ml', inStock: true },
      { id: '50ml', label: '50ml', inStock: true },
    ],
    badge: 'Best Seller',
  },
  {
    id: 'raydiant-serum-50ml',
    slug: 'raydiant-serum-50ml',
    name: 'Raydiant Glow Serum Pro',
    subtitle: 'Reveal Radiant and Youthful Skin.',
    description: 'The professional-strength formula for deeper hydration and visible results from day one.',
    price: 79,
    images: [
      'https://via.placeholder.com/600x600/F5F5F0/000000?text=Raydiant+Serum+Pro',
      'https://via.placeholder.com/600x600/E8E8E8/000000?text=Raydiant+Serum+Pro+2',
    ],
    variants: [
      { id: '50ml', label: '50ml', inStock: true },
      { id: '100ml', label: '100ml', inStock: false },
    ],
    badge: 'New',
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug)
}
