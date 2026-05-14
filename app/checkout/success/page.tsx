import Link from 'next/link'
import type { Metadata } from 'next'
import PurchasePixelFire from '@/components/analytics/PurchasePixelFire'
import { getStripe } from '@/lib/stripe'

export const metadata: Metadata = {
  title: 'Поръчката е приета — ALPÉ',
}

async function getPaidSession(sessionId: string) {
  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return session.payment_status === 'paid' ? session : null
  } catch (err) {
    console.error('Stripe success lookup error:', err)
    return null
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  let pixelValue = 0
  let pixelOrderId = session_id ?? ''

  if (session_id) {
    const session = await getPaidSession(session_id)
    if (session) {
      pixelValue = (session.amount_total ?? 0) / 100
      pixelOrderId = session.id ?? session_id
    }
  }

  return (
    <main className="bg-parchment min-h-screen flex items-center justify-center px-6">
      <PurchasePixelFire value={pixelValue} currency="EUR" orderId={pixelOrderId} />
      <div className="flex flex-col items-center text-center gap-6 max-w-md">
        <div className="w-20 h-20 rounded-full bg-linen flex items-center justify-center">
          <span className="text-gold text-4xl">✓</span>
        </div>
        <h1 className="font-serif text-4xl font-bold text-onyx">Поръчката е приета!</h1>
        <p className="font-sans text-base text-stone leading-relaxed">
          Благодарим ти. Ще получиш имейл с потвърждение и информация за доставката.
        </p>
        <Link
          href="/shop"
          className="mt-4 bg-onyx text-linen px-8 py-4 rounded-xl font-sans font-semibold hover:bg-iron transition-colors"
        >
          Обратно към магазина
        </Link>
      </div>
    </main>
  )
}
