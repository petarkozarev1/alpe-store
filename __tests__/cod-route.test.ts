import { computeCodTotal, makeCodOrderId } from '@/app/api/checkout/cod/helpers'

describe('computeCodTotal', () => {
  it('sums products − discount + shipping + COD fee', () => {
    const total = computeCodTotal({
      items: [{ name: 'ALPÉ', variantLabel: '🟠 Вечер · 2 чифта', price: 66.99, quantity: 1, image: '' }],
      discountAmount: 6.7, shippingAmount: 0, codFee: 1,
    })
    expect(total).toBeCloseTo(61.29, 2)
  })
})

describe('makeCodOrderId', () => {
  it('produces a cod- prefixed id', () => {
    expect(makeCodOrderId()).toMatch(/^cod-\d+-[A-Z0-9]{4}$/)
  })
})
