import type { Product } from '@/lib/types'

export const products: Product[] = [
  {
    id: 'alpe-daily',
    slug: 'alpe-daily',
    name: 'ALPÉ Daily',
    subtitle: 'За целодневна работа пред екран.',
    description: 'ALPÉ Daily са очила за ежедневна работа пред екран с прозрачно-жълти стъкла, UV400 защита и антирефлексно покритие за по-комфортни дълги сесии.',
    facts: ['65% филтър на синята светлина', 'UV400 защита', 'CE сертифицирани стъкла'],
    details: [
      {
        title: 'За продължителна работа пред екран',
        body: 'Очилата ALPÉ Daily са създадени за продължителна работа пред екрана. Тяхната кехлибарено-жълта оцветка филтрира 65% от синята светлина.',
      },
      {
        title: 'За ежедневни задачи',
        body: 'Подходящи са за работа с дизайн, редактиране на снимки и видеоразговори, като запазват цветовете достатъчно точни. Леката рамка е предназначена за носене в продължение на 8+ часа.',
      },
    ],
    price: 44.99,
    images: [
      '/images/shop/shop-daily-1.png',
      '/images/shop/shop-daily-2.png',
      '/images/shop/shop-daily-3.png',
    ],
    variants: [
      { id: 'daily', label: 'За всеки ден', inStock: true },
    ],
    badge: 'За всеки ден',
  },
  {
    id: 'alpe-evening',
    slug: 'alpe-evening',
    name: 'ALPÉ Evening',
    subtitle: 'За вечерта и преди сън.',
    description: 'ALPÉ Evening са очила с оранжев филтър за вечерна употреба, създадени да блокират синя и зелена светлина преди лягане.',
    facts: ['98% блокиране на синята и зелената светлина', 'UV400 защита', 'CE сертифицирани стъкла'],
    details: [
      {
        title: 'За вечерна употреба',
        body: 'Лещите ALPÉ Evening са създадени с една цел: вечерна употреба. Техният наситено оранжев цвят блокира 98% от синята светлина в диапазона 415–455 nm.',
      },
      {
        title: 'Кога да ги носиш',
        body: 'Използвай ALPÉ Evening след залез слънце и поне 2 часа преди лягане. Оранжевите лещи са насочени към синята и зелената светлина от екраните.',
      },
    ],
    price: 44.99,
    images: [
      '/images/shop/shop-evening-1.png',
      '/images/shop/shop-evening-2.png',
      '/images/shop/shop-evening-3.png',
    ],
    variants: [
      { id: 'evening', label: 'Вечер', inStock: true },
    ],
    badge: 'Вечерен филтър',
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug)
}
