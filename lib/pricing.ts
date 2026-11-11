/**
 * Pair pricing. The charge depends on the total number of pairs, evaluated with
 * `lib/sale.ts` (Europe/Sofia). There is no 3-pair pack.
 *
 * A `…-bundle-N` variant counts as N pairs. Used by the client for display and
 * recomputed on both checkout routes — the server total is authoritative.
 */
import { priceForPairs as salePriceForPairs, SINGLE_PRICE } from '@/lib/sale'
import { countPairs } from '@/lib/order-lines'

export { SINGLE_PRICE }
export { countPairs }

interface PairItem { variantId?: string; quantity: number }

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
