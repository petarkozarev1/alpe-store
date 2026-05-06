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
      '/images/shop/shop-daily-1.png',
      '/images/shop/shop-daily-2.png',
      '/images/shop/shop-daily-3.png',
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
      '/images/shop/shop-evening-1.png',
      '/images/shop/shop-evening-2.png',
      '/images/shop/shop-evening-3.png',
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
