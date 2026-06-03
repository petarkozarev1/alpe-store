import { countPairs, priceForPairs, naiveSubtotal } from '@/lib/pricing'

export interface CodProduct { name: string; variantLabel: string; price: number; quantity: number; image?: string; variantId?: string }

export const COD_FEE = 1.0
const DELIVERY_PRICE = 4.99

/** Naive sum at per-unit prices (used for display + computing the bundle saving). */
export function computeSubtotal(items: CodProduct[]): number {
  return naiveSubtotal(items)
}

/** Bundle-N variants count as N pairs. */
export function computeTotalPairs(items: CodProduct[]): number {
  return countPairs(items)
}

/** Cheapest bundle price for the total pairs in the cart — the authoritative product charge. */
export function computeBundlePrice(items: CodProduct[]): number {
  return priceForPairs(countPairs(items))
}

/** The automatic bundle saving vs buying singles (≥ 0). */
export function computeBundleSaving(items: CodProduct[]): number {
  return +Math.max(0, computeSubtotal(items) - computeBundlePrice(items)).toFixed(2)
}

/** Free shipping at 2+ pairs, else flat delivery price — matches the client. */
export function computeShipping(items: CodProduct[]): number {
  return computeTotalPairs(items) >= 2 ? 0 : DELIVERY_PRICE
}

/** COD is Bulgaria-only. Office/locker orders always carry country 'България' from the client. */
export function isBulgariaEligible(country?: string): boolean {
  const n = (country ?? '').trim().toLowerCase()
  return n === 'българия' || n === 'bulgaria' || n === 'bg'
}

/** Total charged for a COD order: bundle product price + shipping + COD fee. */
export function computeCodTotal(o: { items: CodProduct[]; shippingAmount: number; codFee: number }): number {
  return +(computeBundlePrice(o.items) + o.shippingAmount + o.codFee).toFixed(2)
}

export function makeCodOrderId(): string {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `cod-${Date.now()}-${rand}`
}
