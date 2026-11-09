/**
 * Promo codes. Sale windows and percents live in `lib/sale.ts`.
 * Checkout routes must call `applyPromo` with the pair count and the server clock.
 */
import { applyPromo, type PromoApplication } from '@/lib/sale'

export { applyPromo, promoErrorMessage } from '@/lib/sale'
export type { PromoApplication } from '@/lib/sale'

export function getPromo(
  code?: string | null,
  options?: { pairs?: number; now?: Date },
): { code: string; percent: number } | null {
  const result = applyPromo(0, code, { pairs: options?.pairs ?? 1, now: options?.now })
  if (!result.code) return null
  return { code: result.code, percent: result.percent }
}

/** Discount for a code. Sale codes ignore `amount` and use the configured single-pair price. */
export function promoDiscount(
  amount: number,
  code?: string | null,
  pairs = 1,
  now?: Date,
): Pick<PromoApplication, 'code' | 'percent' | 'amount'> {
  const result = applyPromo(amount, code, { pairs, now })
  return { code: result.code, percent: result.percent, amount: result.amount }
}
