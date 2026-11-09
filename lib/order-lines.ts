/**
 * Pair counts for cart lines and checkout.
 *
 * A variant id encodes the lenses and the pack size (`AMPÉ-daily-bundle-1`,
 * `AMPÉ-daily-daily-bundle-2`). Quantity multiplies that pack. Checkout ignores
 * client labels and describes the order from this count.
 */
import type { CartItem } from '@/lib/types'
import { products } from '@/lib/data/products'
import { priceForPairs } from '@/lib/sale'

export const MAX_PAIRS = 10

const BARE_DAILY = new Set(['daily', 'alpe-daily', 'AMPÉ-daily'])

export function inStockLensIds(): Set<string> {
  return new Set(
    products.flatMap(product => product.variants.filter(variant => variant.inStock).map(variant => variant.id.toLowerCase())),
  )
}

/** Lenses in one unit of a variant. `null` when the id is not a real pack. */
export function parseLenses(variantId?: string): string[] | null {
  if (!variantId) return null
  if (BARE_DAILY.has(variantId)) return ['daily']

  const barePack = variantId.match(/^bundle-(\d+)$/)
  if (barePack) {
    const count = Number(barePack[1])
    if (!Number.isInteger(count) || count < 1) return null
    return Array(count).fill('unknown')
  }

  const match = variantId.match(/^(.*)-bundle-(\d+)$/)
  if (!match) return null
  const count = Number(match[2])
  if (!Number.isInteger(count) || count < 1) return null
  const body = match[1].replace(/^AMPÉ-/i, '').replace(/^ALPE-/i, '').replace(/^alpe-/i, '')
  if (!body || !/^[a-z]+(?:-[a-z]+)*$/i.test(body)) return null
  const parts = body.toLowerCase().split('-')
  if (parts.length === count) return parts
  if (parts.length === 1) return Array(count).fill(parts[0])
  return null
}

export function variantIdFor(lenses: string[]): string {
  return `AMPÉ-${lenses.join('-')}-bundle-${lenses.length}`
}

export function isInStockVariant(variantId?: string): boolean {
  const lenses = parseLenses(variantId)
  if (!lenses || lenses.some(lens => lens === 'unknown')) return false
  const allowed = inStockLensIds()
  return lenses.every(lens => allowed.has(lens))
}

export function linePairs(item: { variantId?: string; quantity: number }): number | null {
  if (typeof item.quantity !== 'number' || !Number.isInteger(item.quantity) || item.quantity < 1) return null
  const lenses = parseLenses(item.variantId)
  if (!lenses) return null
  return lenses.length * item.quantity
}

export function countPairs(items: Array<{ variantId?: string; quantity: number }>): number {
  return items.reduce((sum, item) => sum + (linePairs(item) ?? 0), 0)
}

/** Pairs a cart row represents, falling back to a plain quantity for non-pack lines. */
export function displayedPairs(item: { variantId?: string; quantity: number }): number {
  return linePairs(item) ?? (Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 0)
}

export function displayedPairTotal(items: Array<{ variantId?: string; quantity: number }>): number {
  return items.reduce((sum, item) => sum + displayedPairs(item), 0)
}

export function pairCountLabel(pairs: number, locale: 'bg' | 'en'): string {
  if (locale === 'en') return `${pairs} ${pairs === 1 ? 'pair' : 'pairs'}`
  return `${pairs} чифт${pairs === 1 ? '' : 'а'}`
}

export function withPairLabel(label: string, pairs: number): string {
  const stripped = label
    .replace(/\s*·\s*\d+\s*чифт(?:а)?\s*$/i, '')
    .replace(/\s*·\s*\d+\s*pairs?\s*$/i, '')
    .trim()
  const english = /\bpairs?\b/i.test(label) && !/чифт/.test(label)
  return `${stripped} · ${pairCountLabel(pairs, english ? 'en' : 'bg')}`
}

export function describeOrder(
  items: Array<{ variantId?: string; quantity: number }>,
  locale: 'bg' | 'en',
) {
  const lenses: string[] = []
  for (const item of items) {
    const parsed = parseLenses(item.variantId)
    if (!parsed || !Number.isInteger(item.quantity) || item.quantity < 1) continue
    for (let copy = 0; copy < item.quantity; copy++) lenses.push(...parsed)
  }
  const pairs = lenses.length
  const name = locale === 'en' ? 'AMPÉ glasses' : 'AMPÉ очила'
  const allDaily = pairs > 0 && lenses.every(lens => lens === 'daily')
  const lensLabel = allDaily ? (locale === 'en' ? 'Daily' : 'За всеки ден') : ''
  const count = pairCountLabel(pairs, locale)
  const sublabel = lensLabel ? `${lensLabel} · ${count}` : count
  const stripeName = `${name} — ${sublabel}`
  return { pairs, name, sublabel, stripeName, itemsText: `${stripeName} x1` }
}

export function orderRejection(
  items: Array<{ variantId?: string; quantity: number }> | null | undefined,
  locale: 'bg' | 'en',
): string | null {
  if (!items?.length) return locale === 'en' ? 'Cart is empty' : 'Количката е празна'
  for (const item of items) {
    if (typeof item.quantity !== 'number' || !Number.isInteger(item.quantity) || item.quantity < 1) {
      return locale === 'en' ? 'Each item needs a quantity of at least 1.' : 'Всяка бройка трябва да е поне 1.'
    }
    const lenses = parseLenses(item.variantId)
    if (!lenses) {
      return locale === 'en' ? 'This order contains an invalid pack.' : 'Поръчката съдържа невалиден комплект.'
    }
    if (!isInStockVariant(item.variantId)) {
      return locale === 'en'
        ? 'AMPÉ Evening is temporarily out of stock. Please choose Daily.'
        : 'AMPÉ Evening е временно изчерпан. Моля изберете Daily.'
    }
  }
  const pairs = countPairs(items)
  if (pairs < 1) return locale === 'en' ? 'Add at least one pair.' : 'Добавете поне един чифт.'
  if (pairs > MAX_PAIRS) return locale === 'en' ? 'You can order up to 10 pairs.' : 'Може да поръчате до 10 чифта.'
  return null
}

function presentLine(item: CartItem, lenses: string[]): CartItem {
  const pairs = lenses.length
  return {
    ...item,
    variantId: variantIdFor(lenses),
    quantity: 1,
    price: priceForPairs(pairs),
    variantLabel: withPairLabel(item.variantLabel, pairs),
    originalPrice: undefined,
    saving: undefined,
  }
}

function sameSingleLens(lenses: string[], lens: string) {
  return lenses.length > 0 && lenses.every(entry => entry === lens)
}

/** Collapse repeated packs into one line whose label and id match the pair count. */
export function normalizeCartItems(items: CartItem[]): CartItem[] {
  const out: CartItem[] = []
  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1) continue
    const lenses = parseLenses(item.variantId)
    if (!lenses || lenses.some(lens => lens === 'unknown')) {
      const existing = out.find(entry => entry.productId === item.productId && entry.variantId === item.variantId)
      if (existing) existing.quantity += item.quantity
      else out.push({ ...item, originalPrice: undefined, saving: undefined })
      continue
    }
    const expanded = Array.from({ length: item.quantity }, () => lenses).flat()
    const lens = expanded[0]
    const existing = sameSingleLens(expanded, lens)
      ? out.find(entry => {
          const current = parseLenses(entry.variantId)
          return entry.productId === item.productId && current != null && sameSingleLens(current, lens)
        })
      : undefined
    if (existing) {
      const current = parseLenses(existing.variantId) ?? []
      Object.assign(existing, presentLine(existing, [...current, ...expanded].slice(0, MAX_PAIRS)))
    } else {
      out.push(presentLine(item, expanded.slice(0, MAX_PAIRS)))
    }
  }
  return out
}
