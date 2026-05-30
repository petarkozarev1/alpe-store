import {
  computeCodTotal,
  computeShipping,
  computeDiscount,
  isBulgariaEligible,
  makeCodOrderId,
} from '@/app/api/checkout/cod/helpers'

describe('computeCodTotal', () => {
  it('sums products − discount + shipping + COD fee', () => {
    const total = computeCodTotal({
      items: [{ name: 'ALPÉ', variantLabel: '🟠 Вечер · 2 чифта', price: 66.99, quantity: 1, image: '' }],
      discountAmount: 6.7, shippingAmount: 0, codFee: 1,
    })
    expect(total).toBeCloseTo(61.29, 2)
  })
})

describe('computeShipping', () => {
  it('is free when a bundle variant covers 2+ pairs', () => {
    expect(computeShipping([{ name: 'ALPÉ', variantLabel: '', price: 66.99, quantity: 1, variantId: 'bundle-2' }])).toBe(0)
  })
  it('is free when single pairs sum to 2+', () => {
    expect(computeShipping([{ name: 'ALPÉ', variantLabel: '', price: 39.99, quantity: 2, variantId: 'single' }])).toBe(0)
  })
  it('charges the flat fee for a single pair', () => {
    expect(computeShipping([{ name: 'ALPÉ', variantLabel: '', price: 39.99, quantity: 1, variantId: 'single' }])).toBe(4.99)
  })
})

describe('computeDiscount', () => {
  it('recomputes a valid code from subtotal, ignoring any client amount', () => {
    expect(computeDiscount(66.99, 'welcome10')).toEqual({ code: 'WELCOME10', amount: 6.7 })
  })
  it('returns zero for an unknown or missing code', () => {
    expect(computeDiscount(66.99, 'HACK99')).toEqual({ code: '', amount: 0 })
    expect(computeDiscount(66.99, undefined)).toEqual({ code: '', amount: 0 })
  })
})

describe('isBulgariaEligible', () => {
  it('accepts Bulgarian and English spellings', () => {
    expect(isBulgariaEligible('България')).toBe(true)
    expect(isBulgariaEligible('Bulgaria')).toBe(true)
    expect(isBulgariaEligible('bg')).toBe(true)
  })
  it('rejects other countries and empty values', () => {
    expect(isBulgariaEligible('Германия')).toBe(false)
    expect(isBulgariaEligible('')).toBe(false)
    expect(isBulgariaEligible(undefined)).toBe(false)
  })
})

describe('makeCodOrderId', () => {
  it('produces a cod- prefixed id', () => {
    expect(makeCodOrderId()).toMatch(/^cod-\d+-[A-Z0-9]{4}$/)
  })
})
