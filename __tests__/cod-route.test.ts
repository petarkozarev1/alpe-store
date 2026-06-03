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

const single = (qty = 1): CodProduct => ({ name: 'ALPÉ', variantLabel: '🟠 Вечер', price: 44.99, quantity: qty, variantId: 'ALPÉ-evening-bundle-1' })

describe('bundle pricing — auto-applies by total pairs', () => {
  it('prices two separately-added singles as the 2-pack', () => {
    const items = [single(), single()] // 2 pairs added separately
    expect(computeBundlePrice(items)).toBeCloseTo(66.99, 2)
    expect(computeBundleSaving(items)).toBeCloseTo(89.98 - 66.99, 2) // 22.99 saved vs singles
  })
  it('prices three singles as the 3-pack', () => {
    const items = [single(), single(), single()]
    expect(computeBundlePrice(items)).toBeCloseTo(89.99, 2)
  })
  it('uses the cheapest mix for 4 pairs (2+2, not 3+1)', () => {
    expect(priceForPairs(4)).toBeCloseTo(133.98, 2) // 66.99 * 2
    expect(priceForPairs(5)).toBeCloseTo(156.98, 2) // 66.99 + 89.99
    expect(priceForPairs(6)).toBeCloseTo(179.98, 2) // 89.99 * 2
  })
})

describe('computeCodTotal', () => {
  it('charges bundle price + shipping + COD fee (2 singles → 2-pack + fee)', () => {
    const total = computeCodTotal({ items: [single(), single()], shippingAmount: 0, codFee: 1 })
    expect(total).toBeCloseTo(67.99, 2) // 66.99 + 0 + 1
  })
})

describe('computeShipping', () => {
  it('is free when a bundle variant covers 2+ pairs', () => {
    expect(computeShipping([{ name: 'ALPÉ', variantLabel: '', price: 66.99, quantity: 1, variantId: 'bundle-2' }])).toBe(0)
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
