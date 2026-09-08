import { createHmac, timingSafeEqual } from 'crypto'

export async function verifyNotionSignature(args: { body: string; signature: string; verificationToken: string }) {
  const expected = `sha256=${createHmac('sha256', args.verificationToken).update(args.body).digest('hex')}`
  const a = Buffer.from(expected)
  const b = Buffer.from(args.signature)
  return a.length === b.length && timingSafeEqual(a, b)
}
