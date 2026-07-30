import { quoteOrder } from '@/lib/orders/pricing'

describe('quoteOrder', () => {
  test('applies 20 percent to merchandise and adds one-pair shipping', () => {
    expect(quoteOrder([
      {
        productId: 'ALPÉ-evening',
        variantId: 'ALPÉ-evening-bundle-1',
        quantity: 1,
      },
    ], true)).toMatchObject({
      subtotalCents: 4499,
      discountCents: 900,
      shippingCents: 499,
      totalCents: 4098,
      totalPairs: 1,
    })
  })

  test('keeps shipping free for a multi-pair bundle', () => {
    expect(quoteOrder([
      {
        productId: 'ALPÉ-daily',
        variantId: 'ALPÉ-daily-bundle-2',
        quantity: 1,
      },
    ], true)).toMatchObject({
      subtotalCents: 6699,
      discountCents: 1340,
      shippingCents: 0,
      totalCents: 5359,
      totalPairs: 2,
    })
  })

  test('uses catalog prices instead of accepting a browser price', () => {
    const quote = quoteOrder([
      {
        productId: 'ALPÉ-evening',
        variantId: 'ALPÉ-evening-bundle-3',
        quantity: 2,
      },
    ], false)

    expect(quote.subtotalCents).toBe(17_998)
    expect(quote.totalPairs).toBe(6)
    expect(quote.shippingCents).toBe(0)
  })

  test.each([
    { items: [{ productId: 'unknown', variantId: 'fake', quantity: 1 }] },
    { items: [{ productId: 'ALPÉ-evening', variantId: 'ALPÉ-daily-bundle-1', quantity: 1 }] },
    { items: [{ productId: 'ALPÉ-evening', variantId: 'ALPÉ-evening-bundle-1', quantity: 0 }] },
    { items: [{ productId: 'ALPÉ-evening', variantId: 'ALPÉ-evening-bundle-1', quantity: 11 }] },
  ])('rejects an invalid cart item: $items', ({ items }) => {
    expect(() => quoteOrder(items, false)).toThrow('Invalid cart item')
  })

  test('rejects an empty order', () => {
    expect(() => quoteOrder([], false)).toThrow('Cart is empty')
  })
})
