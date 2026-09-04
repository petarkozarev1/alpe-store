import { quoteOrder } from '@/lib/orders/pricing'

describe('quoteOrder', () => {
  test('uses the normal merchandise price and adds one-pair shipping', () => {
    expect(quoteOrder([
      {
        productId: 'ALPÉ-evening',
        variantId: 'ALPÉ-evening-bundle-1',
        quantity: 1,
      },
    ])).toMatchObject({
      subtotalCents: 4499,
      discountCents: 0,
      shippingCents: 499,
      totalCents: 4998,
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
    ])).toMatchObject({
      subtotalCents: 6699,
      discountCents: 0,
      shippingCents: 0,
      totalCents: 6699,
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
    ])

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
    expect(() => quoteOrder(items)).toThrow('Invalid cart item')
  })

  test('rejects an empty order', () => {
    expect(() => quoteOrder([])).toThrow('Cart is empty')
  })
})
