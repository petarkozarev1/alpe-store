/**
 * Influencer / promo codes. Single source of truth, validated server-side on every order so the
 * client can never invent a discount. Add new codes here (e.g. another influencer) as needed.
 * The percent comes off the (already bundle-discounted) product price.
 */
export const PROMO_CODES: Record<string, number> = {
  ALETEA10: 10,
}

export function getPromo(code?: string | null): { code: string; percent: number } | null {
  if (!code) return null
  const key = code.trim().toUpperCase()
  const percent = PROMO_CODES[key]
  return percent ? { code: key, percent } : null
}

/** Discount amount (≥ 0) for a code applied to `amount`. Returns zeros for unknown/missing codes. */
export function promoDiscount(amount: number, code?: string | null): { code: string; percent: number; amount: number } {
  const p = getPromo(code)
  if (!p) return { code: '', percent: 0, amount: 0 }
  return { code: p.code, percent: p.percent, amount: +(amount * p.percent / 100).toFixed(2) }
}
