/**
 * Pair pricing. The charge depends on the total number of pairs, evaluated with
 * `lib/sale.ts` (Europe/Sofia). There is no 3-pair pack.
 *
 * A `…-bundle-N` variant counts as N pairs. Used by the client for display and
 * recomputed on both checkout routes — the server total is authoritative.
 */
import { priceForPairs as salePriceForPairs, SINGLE_PRICE } from '@/lib/sale'

export { SINGLE_PRICE }

interface PairItem { variantId?: string; quantity: number }

/** Total pairs across the cart — a `…-bundle-N` variant counts as N pairs. */
export function countPairs(items: PairItem[]): number {
  return items.reduce((sum, item) => {
    const match = (item.variantId ?? '').match(/bundle-(\d+)/)
    const perUnit = match ? parseInt(match[1], 10) : 1
    return sum + perUnit * (item.quantity ?? 1)
  }, 0)
}

export function priceForPairs(pairs: number, now: Date = new Date()): number {
  return salePriceForPairs(pairs, now)
}

/** Naive sum of line items at their per-unit prices. */
export function naiveSubtotal(items: { price: number; quantity: number }[]): number {
  return +items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
}

/** Automatic saving versus the line prices stored on the cart items. */
export function bundleSavings(items: Array<PairItem & { price: number }>, now: Date = new Date()): number {
  const naive = naiveSubtotal(items)
  const priced = priceForPairs(countPairs(items), now)
  return +Math.max(0, naive - priced).toFixed(2)
}
