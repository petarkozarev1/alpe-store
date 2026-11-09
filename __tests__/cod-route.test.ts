import {
  computeCodTotal,
  computeBundlePrice,
  computeBundleSaving,
  computeShipping,
  isBulgariaEligible,
  makeCodOrderId,
  type CodProduct,
} from '@/app/api/checkout/cod/helpers'
import { priceForPairs } from '@/lib/pricing'

const saleNow = new Date('2026-11-15T10:00:00.000Z')
const regularNow = new Date('2026-12-26T22:00:00.000Z')
const single = (qty = 1): CodProduct => ({ name: 'AMPÉ', variantLabel: '🟠 Вечер', price: 59.99, quantity: qty, variantId: 'AMPÉ-evening-bundle-1' })

describe('pair pricing — 1 and 2 packs only', () => {
  it('prices two singles as the sale double during Black November', () => {
    expect(priceForPairs(2, saleNow)).toBe(89.99)
    expect(priceForPairs(3, saleNow)).toBe(149.98)
    expect(priceForPairs(4, saleNow)).toBe(179.98)
  })
  it('prices pairs at the regular rate from 27 Dec 2026 Sofia', () => {
    expect(priceForPairs(1, regularNow)).toBe(59.99)
    expect(priceForPairs(2, regularNow)).toBe(119.98)
    expect(priceForPairs(3, regularNow)).toBe(179.97)
  })
})

describe('computeCodTotal', () => {
  it('charges the current pair price + shipping + COD fee', () => {
    const items = [single(), single()]
    const total = computeCodTotal({ items, shippingAmount: 0, codFee: 1 })
    expect(total).toBeCloseTo(computeBundlePrice(items) + 1, 2)
  })
})

describe('computeShipping', () => {
  it('is free when a bundle variant covers 2+ pairs', () => {
    expect(computeShipping([{ name: 'AMPÉ', variantLabel: '', price: 66.99, quantity: 1, variantId: 'bundle-2' }])).toBe(0)
  })
  it('is free when single pairs sum to 2+', () => {
    expect(computeShipping([single(2)])).toBe(0)
  })
  it('charges the flat fee for a single pair', () => {
    expect(computeShipping([single(1)])).toBe(4.99)
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
