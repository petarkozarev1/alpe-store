import { applyPromo, getPricingSnapshot, priceForPairs, saleBarMessage, singlePairPromoPrice, sofiaTimestamp } from '@/lib/sale'

/** Europe/Sofia is UTC+2 in November and December 2026 (EET). */
function sofia(wallClock: string) {
  const date = new Date(`${wallClock}+02:00`)
  if (sofiaTimestamp(date) !== wallClock) {
    throw new Error(`Expected ${wallClock} in Europe/Sofia, got ${sofiaTimestamp(date)}`)
  }
  return date
}

const nov15 = sofia('2026-11-15T12:00:00')
const dec1 = sofia('2026-12-01T00:00:00')
const dec26 = sofia('2026-12-26T23:59:59')
const dec27 = sofia('2026-12-27T00:00:00')

describe('Sofia sale windows', () => {
  it('treats 15 Nov 2026 as Black November', () => {
    const pricing = getPricingSnapshot(nov15)
    expect(pricing.saleId).toBe('black-november')
    expect(pricing.single).toBe(59.99)
    expect(pricing.double).toBe(89.99)
    expect(pricing.promo).toEqual({ code: 'BLACK15', percent: 15, singlePairPrice: 50.99 })
    expect(priceForPairs(1, nov15)).toBe(59.99)
    expect(priceForPairs(2, nov15)).toBe(89.99)
    expect(applyPromo(59.99, 'BLACK15', { pairs: 1, now: nov15 })).toMatchObject({ code: 'BLACK15', amount: 9, reason: null })
    expect(saleBarMessage(pricing, 'bg')).toBe('Код BLACK15: −15% за 1 чифт (€50.99). Два чифта €89.99 · безплатна доставка за 2+ чифта')
    expect(saleBarMessage(pricing, 'en')).toContain('Code BLACK15')
    expect(applyPromo(89.99, 'BLACK15', { pairs: 2, now: nov15 }).reason).toBe('single-only')
    expect(applyPromo(59.99, 'XMAS15', { pairs: 1, now: nov15 }).reason).toBe('inactive')
  })

  it('switches to Christmas at 1 Dec 2026 00:00 Sofia', () => {
    const pricing = getPricingSnapshot(dec1)
    expect(pricing.saleId).toBe('christmas')
    expect(pricing.double).toBe(89.99)
    expect(pricing.promo?.code).toBe('XMAS15')
    expect(saleBarMessage(pricing, 'bg')).toContain('XMAS15')
    expect(applyPromo(59.99, 'XMAS15', { pairs: 1, now: dec1 })).toMatchObject({ code: 'XMAS15', amount: 9, reason: null })
    expect(applyPromo(59.99, 'BLACK15', { pairs: 1, now: dec1 }).reason).toBe('inactive')
    expect(applyPromo(89.99, 'XMAS15', { pairs: 2, now: dec1 }).reason).toBe('single-only')
  })

  it('keeps Christmas through 26 Dec 2026 23:59 Sofia', () => {
    expect(getPricingSnapshot(dec26).saleId).toBe('christmas')
    expect(getPricingSnapshot(dec26).promo?.code).toBe('XMAS15')
    expect(priceForPairs(2, dec26)).toBe(89.99)
    expect(applyPromo(59.99, 'XMAS15', { pairs: 1, now: dec26 }).code).toBe('XMAS15')
  })

  it('returns to regular prices at 27 Dec 2026 00:00 Sofia', () => {
    const pricing = getPricingSnapshot(dec27)
    expect(pricing.saleId).toBeNull()
    expect(pricing.promo).toBeNull()
    expect(saleBarMessage(pricing, 'bg')).toBe('Безплатна доставка за 2 или повече чифта')
    expect(saleBarMessage(pricing, 'en')).toBe('Free delivery on 2 or more pairs')
    expect(pricing.single).toBe(59.99)
    expect(pricing.double).toBe(119.98)
    expect(priceForPairs(2, dec27)).toBe(119.98)
    expect(priceForPairs(3, dec27)).toBe(179.97)
    expect(applyPromo(59.99, 'BLACK15', { pairs: 1, now: dec27 }).reason).toBe('inactive')
    expect(applyPromo(59.99, 'XMAS15', { pairs: 1, now: dec27 }).reason).toBe('inactive')
    expect(applyPromo(59.99, 'XMAS15', { pairs: 2, now: dec27 }).reason).toBe('inactive')
  })

  it('prices a single pair with 15% off at €50.99', () => {
    expect(singlePairPromoPrice(15)).toBe(50.99)
  })

})

describe('influencer codes are single-pair and year-round', () => {
  const today = sofia('2026-11-09T12:00:00')

  it('takes 10% off one pair today', () => {
    for (const code of ['ALETEA10', 'ILIYANA10', 'KALOYAN10']) {
      expect(applyPromo(59.99, code, { pairs: 1, now: today })).toMatchObject({
        code,
        percent: 10,
        amount: 6,
        reason: null,
      })
    }
  })

  it('takes 10% off one pair after 27 Dec 2026', () => {
    expect(applyPromo(59.99, 'ALETEA10', { pairs: 1, now: dec27 })).toMatchObject({
      code: 'ALETEA10',
      percent: 10,
      amount: 6,
      reason: null,
    })
  })

  it('rejects a two-pair order during Black November', () => {
    for (const code of ['ALETEA10', 'ILIYANA10', 'KALOYAN10']) {
      expect(applyPromo(89.99, code, { pairs: 2, now: nov15 })).toMatchObject({
        code: '',
        amount: 0,
        reason: 'single-only',
      })
    }
  })

  it('rejects a two-pair order after 27 Dec 2026', () => {
    expect(applyPromo(119.98, 'ALETEA10', { pairs: 2, now: dec27 })).toMatchObject({
      code: '',
      amount: 0,
      reason: 'single-only',
    })
  })
})
