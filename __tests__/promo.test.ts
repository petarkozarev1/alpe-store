import { getPromo, promoDiscount } from '@/lib/promo'

describe('promo codes', () => {
  it('accepts ILIYANA10 as a 10 percent influencer code', () => {
    expect(getPromo('ILIYANA10')).toEqual({ code: 'ILIYANA10', percent: 10 })
    expect(promoDiscount(66.99, 'iliyana10')).toEqual({
      code: 'ILIYANA10',
      percent: 10,
      amount: 6.7,
    })
  })
})
