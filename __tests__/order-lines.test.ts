import { describeOrder, normalizeCartItems, orderRejection } from '@/lib/order-lines'
import type { CartItem } from '@/lib/types'

const line = (variantId: string, quantity: number, label = '1 чифт'): CartItem => ({
  productId: 'AMPÉ-daily',
  variantId,
  name: 'AMPÉ',
  variantLabel: label,
  price: 59.99,
  quantity,
  image: '/img.png',
  slug: 'AMPÉ-glasses',
})

describe('order lines', () => {
  it('describes a doubled single pack from the server pair count', () => {
    const described = describeOrder([line('AMPÉ-daily-bundle-1', 2, '🟡 За всеки ден · 1 чифт')], 'bg')
    expect(described.pairs).toBe(2)
    expect(described.stripeName).toBe('AMPÉ очила — За всеки ден · 2 чифта')
    expect(described.itemsText).toBe('AMPÉ очила — За всеки ден · 2 чифта x1')
    expect(described.itemsText).not.toContain('1 чифт')
  })

  it('rejects a quantity of 0 or -1, bundle-0, and more than 10 pairs', () => {
    expect(orderRejection([line('AMPÉ-daily-bundle-1', 0)], 'bg')).toMatch(/поне 1/)
    expect(orderRejection([line('AMPÉ-daily-bundle-1', -1)], 'en')).toMatch(/at least 1/)
    expect(orderRejection([line('AMPÉ-daily-bundle-0', 1)], 'bg')).toMatch(/невалиден/)
    expect(orderRejection([line('bundle-0', 1)], 'bg')).toMatch(/невалиден/)
    expect(orderRejection([line('AMPÉ-daily-bundle-1', 1), line('AMPÉ-daily-bundle-1', -1)], 'bg')).toMatch(/поне 1/)
    expect(orderRejection([line('AMPÉ-daily-bundle-1', 11)], 'bg')).toMatch(/10/)
  })

  it('allows Daily packs and rejects Evening on production', () => {
    const previous = process.env.VERCEL_ENV
    const previousPublic = process.env.NEXT_PUBLIC_VERCEL_ENV
    process.env.VERCEL_ENV = 'production'
    process.env.NEXT_PUBLIC_VERCEL_ENV = 'production'
    expect(orderRejection([line('AMPÉ-daily-daily-bundle-2', 1)], 'bg')).toBeNull()
    expect(orderRejection([line('daily', 1)], 'bg')).toBeNull()
    expect(orderRejection([line('AMPÉ-evening-bundle-1', 1)], 'bg')).toMatch(/Evening|изчерпан/)
    expect(orderRejection([line('AMPÉ-daily-evening-bundle-2', 1)], 'en')).toMatch(/out of stock/)
    if (previous === undefined) delete process.env.VERCEL_ENV
    else process.env.VERCEL_ENV = previous
    if (previousPublic === undefined) delete process.env.NEXT_PUBLIC_VERCEL_ENV
    else process.env.NEXT_PUBLIC_VERCEL_ENV = previousPublic
  })

  it('allows Evening outside production', () => {
    const previous = process.env.VERCEL_ENV
    const previousPublic = process.env.NEXT_PUBLIC_VERCEL_ENV
    process.env.VERCEL_ENV = 'preview'
    process.env.NEXT_PUBLIC_VERCEL_ENV = 'preview'
    expect(orderRejection([line('AMPÉ-evening-bundle-1', 1)], 'bg')).toBeNull()
    expect(orderRejection([line('AMPÉ-daily-evening-bundle-2', 1)], 'en')).toBeNull()
    if (previous === undefined) delete process.env.VERCEL_ENV
    else process.env.VERCEL_ENV = previous
    if (previousPublic === undefined) delete process.env.NEXT_PUBLIC_VERCEL_ENV
    else process.env.NEXT_PUBLIC_VERCEL_ENV = previousPublic
  })

  it('rewrites a repeated pack so the label matches the pairs', () => {
    const items = normalizeCartItems([
      line('AMPÉ-daily-bundle-1', 1, '🟡 За всеки ден · 1 чифт'),
      line('AMPÉ-daily-bundle-1', 1, '🟡 За всеки ден · 1 чифт'),
    ])
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(1)
    expect(items[0].variantLabel).toBe('🟡 За всеки ден · 2 чифта')
  })
})
