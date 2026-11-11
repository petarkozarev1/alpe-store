/**
 * Evening stays out of stock on the production deployment.
 * Preview and any build that is not VERCEL_ENV=production can sell it.
 * The browser bundle can only see NEXT_PUBLIC_VERCEL_ENV, which Vercel inlines
 * per deployment. The server reads VERCEL_ENV at request time.
 */
export function isEveningPurchasable(): boolean {
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV || ''
  return env !== 'production'
}
