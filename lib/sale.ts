/**
 * Sale windows, pair prices, and public promo codes.
 *
 * All clock comparisons use Europe/Sofia local time. Windows are
 * [start, end): `end` is the first instant the window is no longer active.
 *
 * Black November runs until Dec 1, 2026 00:00 Sofia.
 * Christmas runs from that instant through Dec 26, 2026 (ends Dec 27 00:00).
 * From Dec 27, 2026 the regular prices apply and BLACK15 / XMAS15 are invalid.
 *
 * Edit the dates or amounts in this file only.
 */

export const SALE_TIME_ZONE = 'Europe/Sofia'

export const SINGLE_PRICE = 59.99
/** Off-season double: two singles, no discount. 2 × 59.99. */
export const REGULAR_DOUBLE_PRICE = 119.98
/** In-season double: second pair at 50%. */
export const SALE_DOUBLE_PRICE = 89.99

export type SaleId = 'black-november' | 'christmas'

export interface SalePromo {
  code: string
  /** Percent off one pair. Ignored unless the order is exactly one pair. */
  percent: number
  singlePairOnly: true
}

export interface SaleWindow {
  id: SaleId
  /** Inclusive Sofia local timestamp, `YYYY-MM-DDTHH:mm:ss`. */
  start: string
  /** Exclusive Sofia local timestamp. */
  end: string
  doublePrice: number
  promo: SalePromo
}

export const SALE_WINDOWS: SaleWindow[] = [
  {
    id: 'black-november',
    start: '2026-11-01T00:00:00',
    end: '2026-12-01T00:00:00',
    doublePrice: SALE_DOUBLE_PRICE,
    promo: { code: 'BLACK15', percent: 15, singlePairOnly: true },
  },
  {
    id: 'christmas',
    start: '2026-12-01T00:00:00',
    end: '2026-12-27T00:00:00',
    doublePrice: SALE_DOUBLE_PRICE,
    promo: { code: 'XMAS15', percent: 15, singlePairOnly: true },
  },
]

/**
 * Influencer codes. Not shown on the storefront and not date-limited.
 * Each one is 10% off a single pair only (€59.99). They do not apply to 2+ pairs.
 */
export const INFLUENCER_PROMOS: Record<string, number> = {
  ALETEA10: 10,
  ILIYANA10: 10,
  KALOYAN10: 10,
}

export interface PricingSnapshot {
  single: number
  double: number
  regularDouble: number
  saleId: SaleId | null
  /** Public code for the active window. Null outside a sale. */
  promo: { code: string; percent: number; singlePairPrice: number } | null
}

export function sofiaTimestamp(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: SALE_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find(part => part.type === type)?.value ?? '00'
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}`
}

export function isInSaleWindow(date: Date, window: Pick<SaleWindow, 'start' | 'end'>): boolean {
  const ts = sofiaTimestamp(date)
  return ts >= window.start && ts < window.end
}

export function activeSale(now: Date = new Date()): SaleWindow | null {
  return SALE_WINDOWS.find(window => isInSaleWindow(now, window)) ?? null
}

export function singlePairPromoPrice(percent = 15): number {
  const cents = Math.round(Math.round(SINGLE_PRICE * 100) * percent / 100)
  return +((Math.round(SINGLE_PRICE * 100) - cents) / 100).toFixed(2)
}

/** Top-bar copy. Prices and the public code come from the active sale window. */
export function saleBarMessage(snapshot: PricingSnapshot, locale: 'bg' | 'en'): string {
  if (!snapshot.promo) {
    return locale === 'en'
      ? 'Free delivery on 2 or more pairs'
      : 'Безплатна доставка за 2 или повече чифта'
  }
  const off = snapshot.promo.singlePairPrice.toFixed(2)
  const double = snapshot.double.toFixed(2)
  return locale === 'en'
    ? `Code ${snapshot.promo.code}: ${snapshot.promo.percent}% off one pair (€${off}). Two pairs €${double} · free delivery on 2+ pairs`
    : `Код ${snapshot.promo.code}: −${snapshot.promo.percent}% за 1 чифт (€${off}). Два чифта €${double} · безплатна доставка за 2+ чифта`
}

export function getPricingSnapshot(now: Date = new Date()): PricingSnapshot {
  const sale = activeSale(now)
  return {
    single: SINGLE_PRICE,
    double: sale ? sale.doublePrice : REGULAR_DOUBLE_PRICE,
    regularDouble: REGULAR_DOUBLE_PRICE,
    saleId: sale?.id ?? null,
    promo: sale
      ? {
          code: sale.promo.code,
          percent: sale.promo.percent,
          singlePairPrice: singlePairPromoPrice(sale.promo.percent),
        }
      : null,
  }
}

export function pairOfferCopy(snapshot: PricingSnapshot, locale: 'bg' | 'en') {
  const double = snapshot.double.toFixed(2)
  const single = snapshot.single.toFixed(2)
  const primary = locale === 'en' ? `Get 2 pairs for €${double}` : `Вземи 2 чифта за €${double}`
  if (!snapshot.promo) {
    return {
      eyebrow: locale === 'en' ? 'Two pairs' : 'Два чифта',
      primary,
      secondary: locale === 'en' ? `Just 1 pair · €${single}` : `Само 1 чифт · €${single}`,
      cartGap: locale === 'en'
        ? `Add 1 more pair for free delivery · 2 pairs €${double}`
        : `Добави още 1 чифт за безплатна доставка и цена €${double}`,
    }
  }
  const off = snapshot.promo.singlePairPrice.toFixed(2)
  const eyebrow = snapshot.saleId === 'christmas'
    ? (locale === 'en' ? 'Christmas' : 'Коледа')
    : 'Black November'
  return {
    eyebrow,
    primary,
    secondary: locale === 'en'
      ? `1 pair €${single} · code ${snapshot.promo.code} → €${off}`
      : `1 чифт €${single} · код ${snapshot.promo.code} → €${off}`,
    cartGap: locale === 'en'
      ? `Add 1 more pair for free delivery and the €${double} pair price`
      : `Добави още 1 чифт за безплатна доставка и цена €${double}`,
  }
}

/** Cheapest total for N pairs using only 1-pair and 2-pair packs. There is no 3-pair pack. */
export function priceFromPacks(pairs: number, single: number, double: number): number {
  if (pairs <= 0) return 0
  const singleCents = Math.round(single * 100)
  const doubleCents = Math.round(double * 100)
  const best = [0]
  for (let i = 1; i <= pairs; i++) {
    let next = best[i - 1] + singleCents
    if (i >= 2) next = Math.min(next, best[i - 2] + doubleCents)
    best[i] = next
  }
  return best[pairs] / 100
}

export function priceForPairs(pairs: number, now: Date = new Date()): number {
  const snapshot = getPricingSnapshot(now)
  return priceFromPacks(pairs, snapshot.single, snapshot.double)
}

/** What the pairs would cost bought separately, with no sale double. */
export function regularPriceForPairs(pairs: number): number {
  return priceFromPacks(pairs, SINGLE_PRICE, REGULAR_DOUBLE_PRICE)
}

export type PromoRejectReason = 'unknown' | 'inactive' | 'single-only'

export interface PromoApplication {
  code: string
  percent: number
  amount: number
  reason: PromoRejectReason | null
}

function emptyPromo(reason: PromoRejectReason | null): PromoApplication {
  return { code: '', percent: 0, amount: 0, reason }
}

/**
 * Server-side promo check. Sale codes are valid only inside their Sofia window
 * and only on exactly one pair. Influencer codes are also single-pair only,
 * but they stay valid all year.
 */
export function applyPromo(
  productTotal: number,
  code: string | null | undefined,
  options: { pairs: number; now?: Date; snapshot?: PricingSnapshot },
): PromoApplication {
  if (!code?.trim()) return emptyPromo(null)
  const key = code.trim().toUpperCase()
  const snapshot = options.snapshot ?? getPricingSnapshot(options.now ?? new Date())

  if (SALE_WINDOWS.some(window => window.promo.code === key)) {
    const owner = SALE_WINDOWS.find(window => window.promo.code === key)!
    if (snapshot.saleId !== owner.id) return emptyPromo('inactive')
    if (options.pairs !== 1) return emptyPromo('single-only')
    const discountCents = Math.round(Math.round(SINGLE_PRICE * 100) * owner.promo.percent / 100)
    return { code: key, percent: owner.promo.percent, amount: discountCents / 100, reason: null }
  }

  const influencer = INFLUENCER_PROMOS[key]
  if (!influencer) return emptyPromo('unknown')
  if (options.pairs !== 1) return emptyPromo('single-only')
  const discountCents = Math.round(Math.round(SINGLE_PRICE * 100) * influencer / 100)
  return { code: key, percent: influencer, amount: discountCents / 100, reason: null }
}

export function promoErrorMessage(reason: PromoRejectReason, locale: 'bg' | 'en'): string {
  if (reason === 'single-only') {
    return locale === 'en' ? 'This code is valid only on a single pair.' : 'Кодът важи само за 1 чифт.'
  }
  if (reason === 'inactive') {
    return locale === 'en' ? 'This code is not active.' : 'Кодът не е активен.'
  }
  return locale === 'en' ? 'Invalid code' : 'Невалиден код'
}
