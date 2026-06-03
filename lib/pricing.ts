/**
 * Single source of truth for bundle pricing. The price depends on the TOTAL number of pairs in
 * the cart — not on whether they were added as a "bundle" or as separate singles. So 2 pairs
 * always cost the 2-pack price and 3 the 3-pack price, however they were added. Used by the
 * client AND both server routes so the charge is always recomputed server-side (never trusted).
 */
export const BUNDLE_PRICES: Record<number, number> = { 1: 44.99, 2: 66.99, 3: 89.99 }
const SINGLE_PRICE = BUNDLE_PRICES[1]

interface PairItem { variantId?: string; quantity: number }

/** Total pairs across the cart — a `…-bundle-N` variant counts as N pairs. */
export function countPairs(items: PairItem[]): number {
  return items.reduce((sum, i) => {
    const m = (i.variantId ?? '').match(/bundle-(\d+)/)
    return sum + (m ? parseInt(m[1], 10) : 1) * (i.quantity ?? 1)
  }, 0)
}

/**
 * Cheapest total price for N pairs, composed from 1/2/3-packs (DP). Always ≤ buying singles.
 * e.g. 2→66.99, 3→89.99, 4→133.98 (2+2), 5→156.98 (2+3), 6→179.98 (3+3).
 */
export function priceForPairs(n: number): number {
  if (n <= 0) return 0
  const best = [0, ...Array(n).fill(Infinity)]
  for (let i = 1; i <= n; i++) {
    for (const k of [1, 2, 3]) {
      if (i - k >= 0 && best[i - k] + BUNDLE_PRICES[k] < best[i]) {
        best[i] = best[i - k] + BUNDLE_PRICES[k]
      }
    }
  }
  return +best[n].toFixed(2)
}

/** Naive sum of line items at their per-unit prices (what it would cost with no bundle deal). */
export function naiveSubtotal(items: { price: number; quantity: number }[]): number {
  return +items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)
}

/** The automatic bundle saving = naive sum − cheapest bundle price (≥ 0). */
export function bundleSavings(items: Array<PairItem & { price: number }>): number {
  const naive = naiveSubtotal(items as { price: number; quantity: number }[])
  const bundled = priceForPairs(countPairs(items))
  return +Math.max(0, naive - bundled).toFixed(2)
}

export { SINGLE_PRICE }
