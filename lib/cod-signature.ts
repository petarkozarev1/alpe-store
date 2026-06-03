import crypto from 'crypto'

/**
 * Stateless signature for COD success URLs. The COD order route signs the orderId + total with
 * a server-only secret; the success page verifies it before firing the Purchase pixel. This
 * prevents a forged /checkout/success?cod=1&order=…&value=… URL from injecting a fake Purchase.
 * (The CAPI Purchase already fires server-side from the COD route, so this only guards the browser pixel.)
 */
function secret(): string {
  // Any server-only secret works; STRIPE_WEBHOOK_SECRET is always set in this project.
  return process.env.STRIPE_WEBHOOK_SECRET || process.env.NOTION_API_KEY || ''
}

export function signCodOrder(orderId: string, valueStr: string): string {
  const s = secret()
  if (!s) return ''
  return crypto.createHmac('sha256', s).update(`${orderId}:${valueStr}`).digest('hex').slice(0, 32)
}

export function verifyCodOrder(orderId: string, valueStr: string, sig: string): boolean {
  if (!orderId || !valueStr || !sig) return false
  const expected = signCodOrder(orderId, valueStr)
  if (!expected || expected.length !== sig.length) return false
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
  } catch {
    return false
  }
}
