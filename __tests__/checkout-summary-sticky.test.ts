import { summaryStickyTop } from '@/components/checkout/CheckoutSummary'

describe('summaryStickyTop', () => {
  it('offsets the card by the header height plus a 24px gap on desktop', () => {
    expect(summaryStickyTop({
      isDesktop: true,
      headerHeight: 94,
      cardHeight: 420,
      viewportHeight: 800,
    })).toBe(118)
  })

  it('stays in normal flow on mobile and when the card is taller than the viewport', () => {
    expect(summaryStickyTop({
      isDesktop: false,
      headerHeight: 94,
      cardHeight: 420,
      viewportHeight: 800,
    })).toBeNull()
    expect(summaryStickyTop({
      isDesktop: true,
      headerHeight: 94,
      cardHeight: 700,
      viewportHeight: 800,
    })).toBeNull()
  })
})
