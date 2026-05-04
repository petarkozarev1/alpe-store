import type { Product } from '@/lib/types'

export const products: Product[] = [
  {
    id: 'ALPÉ-classic',
    slug: 'ALPÉ-classic',
    name: 'ALPÉ Classic',
    subtitle: 'Един чифт. Безкраен комфорт.',
    description: 'ALPÉ Classic пази очите ти при дълги сесии пред екрана — с премиум филтър за синя светлина, антирефлексно покритие и ултралека рамка, създадена за целодневно носене.',
    price: 49,
    images: [
      'https://via.placeholder.com/600x600/F5F5F0/000000?text=ALPÉ+Classic',
      'https://via.placeholder.com/600x600/E8E8E8/000000?text=ALPÉ+Classic+Side',
    ],
    variants: [
      { id: 'black', label: 'Black', inStock: true },
      { id: 'tortoise', label: 'Tortoise', inStock: true },
    ],
    badge: 'Най-продаван',
  },
  {
    id: 'ALPÉ-pro',
    slug: 'ALPÉ-pro',
    name: 'ALPÉ Pro',
    subtitle: 'Максимална защита. Минималистичен вид.',
    description: 'ALPÉ Pro предлага най-мощния ни филтър за синя светлина и устойчиви на надраскване лещи — създадени за power users, разработчици и всички, чийто живот се върти около екрани.',
    price: 79,
    images: [
      'https://via.placeholder.com/600x600/F5F5F0/000000?text=ALPÉ+Pro',
      'https://via.placeholder.com/600x600/E8E8E8/000000?text=ALPÉ+Pro+Side',
    ],
    variants: [
      { id: 'black', label: 'Black', inStock: true },
      { id: 'matte-black', label: 'Matte Black', inStock: false },
    ],
    badge: 'Ново',
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug)
}
