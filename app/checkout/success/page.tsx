import Link from 'next/link'
import { noIndexMetadata } from '@/lib/seo'
import PurchasePixelFire from '@/components/analytics/PurchasePixelFire'
import { getStripe } from '@/lib/stripe'
import { verifyCodOrder } from '@/lib/cod-signature'

export const metadata = noIndexMetadata('Поръчката е приета')

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
  searchParams: Promise<{ session_id?: string; cod?: string; order?: string; value?: string; sig?: string }>
}) {
  const { session_id, cod, order, value, sig } = await searchParams

  const isCod = cod === '1'
  let pixelValue = 0
  let pixelOrderId = isCod ? (order ?? '') : (session_id ?? '')

  if (isCod) {
    // Only fire the COD Purchase if the order+value carry a valid server signature — never trust
    // raw URL params. If the signature is missing/invalid, pixelValue stays 0 and the pixel won't fire.
    if (order && value && sig && verifyCodOrder(order, value, sig)) {
      pixelValue = Number(value)
      pixelOrderId = order
    }
  } else if (session_id) {
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
          {isCod
            ? 'Благодарим ти. Изпратихме ти имейл с потвърждение. Ще се свържем с теб за детайли по доставката — плащаш в брой при получаване.'
            : 'Благодарим ти. Ще получиш имейл с потвърждение и информация за доставката.'}
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
