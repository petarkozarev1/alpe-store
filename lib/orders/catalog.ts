import type { CheckoutItemInput, QuotedOrderItem } from './types'

export const BUNDLE_PRICES: Record<number, number> = {
  1: 4499,
  2: 6699,
  3: 8999,
}

export const BUNDLE_SAVINGS: Record<number, number> = {
  1: 0,
  2: 2300,
  3: 4500,
}

const LENSES = new Set(['evening', 'daily'])
const BUNDLE_PATTERN = /^ALPÉ-(evening|daily)-bundle-(1|2|3)$/

export function resolveCatalogItem(item: CheckoutItemInput): QuotedOrderItem {
  const productMatch = /^ALPÉ-(evening|daily)$/.exec(item.productId)
  const variantMatch = BUNDLE_PATTERN.exec(item.variantId)
  const quantityIsValid =
    Number.isInteger(item.quantity) && item.quantity >= 1 && item.quantity <= 10

  if (
    !productMatch ||
    !variantMatch ||
    !LENSES.has(productMatch[1]) ||
    productMatch[1] !== variantMatch[1] ||
    !quantityIsValid
  ) {
    throw new Error('Invalid cart item')
  }

  const bundle = Number(variantMatch[2])

  return {
    ...item,
    name: `ALPÉ ${productMatch[1] === 'evening' ? 'Evening' : 'Daily'} · ${bundle} ${bundle === 1 ? 'pair' : 'pairs'}`,
    unitAmountCents: BUNDLE_PRICES[bundle],
    pairsPerUnit: bundle,
  }
}
