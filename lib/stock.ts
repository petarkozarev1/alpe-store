import { parseLenses } from '@/lib/order-lines'

export const STOCK_CODES = ['daily', 'evening'] as const
export type StockCode = (typeof STOCK_CODES)[number]
export type StockStatus = 'Очаква се' | 'В наличност' | 'Изчерпан'
export type OfferState = 'available' | 'coming_soon' | 'sold_out'

export interface StockRow {
  code: StockCode
  stock: number
  status: StockStatus
  pageId?: string
}

export type InventorySnapshot = Record<StockCode, StockRow>

export function fallbackInventory(): InventorySnapshot {
  return {
    daily: { code: 'daily', stock: 250, status: 'Очаква се' },
    evening: { code: 'evening', stock: 250, status: 'Очаква се' },
  }
}

export function inStockInventory(stock = 250): InventorySnapshot {
  return {
    daily: { code: 'daily', stock, status: 'В наличност' },
    evening: { code: 'evening', stock, status: 'В наличност' },
  }
}

export function countVariantLenses(items: Array<{ variantId?: string; quantity: number }> | null | undefined): Record<StockCode, number> {
  const counts: Record<StockCode, number> = { daily: 0, evening: 0 }
  for (const item of items ?? []) {
    const lenses = parseLenses(item.variantId)
    if (!lenses || !Number.isInteger(item.quantity) || item.quantity < 1) continue
    for (let copy = 0; copy < item.quantity; copy++) {
      for (const lens of lenses) {
        if (lens === 'daily' || lens === 'evening') counts[lens] += 1
      }
    }
  }
  return counts
}

export function offerState(snapshot: InventorySnapshot, counts: Record<StockCode, number>): OfferState {
  let blocked = false
  for (const code of STOCK_CODES) {
    if (counts[code] < 1) continue
    const row = snapshot[code]
    if (row.status === 'Очаква се') return 'coming_soon'
    if (row.status !== 'В наличност' || row.stock < counts[code]) blocked = true
  }
  return blocked ? 'sold_out' : 'available'
}

export function offerButtonText(state: OfferState, locale: 'bg' | 'en', availableLabel: string) {
  if (state === 'coming_soon') return locale === 'en' ? 'Coming soon' : 'Очаквайте скоро'
  if (state === 'sold_out') return locale === 'en' ? 'Sold out' : 'Изчерпан'
  return availableLabel
}

export function inventoryMessage(snapshot: InventorySnapshot, counts: Record<StockCode, number>, locale: 'bg' | 'en'): string | null {
  const names = { daily: 'AMPÉ Daily', evening: 'AMPÉ Evening' }
  for (const code of STOCK_CODES) {
    if (counts[code] < 1) continue
    const row = snapshot[code]
    if (row.status !== 'В наличност') {
      return locale === 'en'
        ? `${names[code]} is not available to order yet.`
        : `${names[code]} все още не е в наличност.`
    }
    if (row.stock < counts[code]) {
      return locale === 'en'
        ? `There is not enough stock of ${names[code]} for this order.`
        : `Няма достатъчна наличност от ${names[code]} за тази поръчка.`
    }
  }
  return null
}
