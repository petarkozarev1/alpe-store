import { resolveCatalogItem } from './catalog'
import type { CheckoutItemInput, OrderQuote } from './types'

export const SHIPPING_CENTS = 499

export function quoteOrder(items: CheckoutItemInput[]): OrderQuote {
  if (!items.length) {
    throw new Error('Cart is empty')
  }

  const resolved = items.map(resolveCatalogItem)
  const subtotalCents = resolved.reduce(
    (sum, item) => sum + item.unitAmountCents * item.quantity,
    0
  )
  const totalPairs = resolved.reduce(
    (sum, item) => sum + item.pairsPerUnit * item.quantity,
    0
  )
  const discountCents = 0
  const shippingCents = totalPairs >= 2 ? 0 : SHIPPING_CENTS

  return {
    items: resolved,
    subtotalCents,
    discountCents,
    shippingCents,
    totalCents: subtotalCents - discountCents + shippingCents,
    totalPairs,
  }
}
