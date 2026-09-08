import type { P2GOrder } from './types'

export const P2G_HOLD_DAYS = 15
const HOLD_MS = P2G_HOLD_DAYS * 24 * 60 * 60 * 1000

export function buildP2GPostbackUrl(order: P2GOrder, postbackUrl: string) {
  const url = new URL(postbackUrl)
  url.searchParams.set('customer_id', order.orderId)
  url.searchParams.set('deposit', (order.paidAmountCents / 100).toFixed(2))
  url.searchParams.set('brand', 'ALPE')
  return url
}

export function isP2GEligible(order: P2GOrder, affiliateId: string, now: string) {
  const paidAt = order.paidAt ? Date.parse(order.paidAt) : Number.NaN
  const currentTime = Date.parse(now)
  return order.paymentStatus === 'Paid' && order.affiliateId === affiliateId &&
    order.paidAmountCents > 0 && !order.p2gReported && Number.isFinite(paidAt) &&
    Number.isFinite(currentTime) && paidAt <= currentTime - HOLD_MS
}
