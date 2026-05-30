export interface CodProduct { name: string; variantLabel: string; price: number; quantity: number; image?: string; variantId?: string }

export const COD_FEE = 1.0
const DELIVERY_PRICE = 4.99
const DISCOUNT_CODES: Record<string, number> = { WELCOME10: 10, FAMILY40: 40 }

export function computeSubtotal(items: CodProduct[]): number {
  return +items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)
}

/** Mirror of the client's totalPairs logic — bundle-N variants count as N pairs. */
export function computeTotalPairs(items: CodProduct[]): number {
  return items.reduce((s, i) => {
    const m = (i.variantId ?? '').match(/bundle-(\d+)/)
    return s + (m ? parseInt(m[1]) : 1) * i.quantity
  }, 0)
}

/** Free shipping at 2+ pairs, else flat delivery price — matches the client. */
export function computeShipping(items: CodProduct[]): number {
  return computeTotalPairs(items) >= 2 ? 0 : DELIVERY_PRICE
}

/** Validates the code against the known map and recomputes the amount from subtotal. */
export function computeDiscount(subtotal: number, code?: string): { code: string; amount: number } {
  const percent = code ? DISCOUNT_CODES[code.toUpperCase()] : undefined
  if (!percent) return { code: '', amount: 0 }
  return { code: code!.toUpperCase(), amount: +(subtotal * percent / 100).toFixed(2) }
}

/** COD is Bulgaria-only. Office/locker orders always carry country 'България' from the client. */
export function isBulgariaEligible(country?: string): boolean {
  const n = (country ?? '').trim().toLowerCase()
  return n === 'българия' || n === 'bulgaria' || n === 'bg'
}

export function computeCodTotal(o: { items: CodProduct[]; discountAmount: number; shippingAmount: number; codFee: number }): number {
  const subtotal = o.items.reduce((s, i) => s + i.price * i.quantity, 0)
  return +(subtotal - o.discountAmount + o.shippingAmount + o.codFee).toFixed(2)
}

export function makeCodOrderId(): string {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `cod-${Date.now()}-${rand}`
}
