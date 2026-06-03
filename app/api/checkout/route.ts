import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { sendCAPIEvent } from '@/lib/meta-capi'
import { notifyAlert } from '@/lib/alerts'
import { countPairs, priceForPairs, naiveSubtotal } from '@/lib/pricing'
import { promoDiscount } from '@/lib/promo'

const DELIVERY_PRICE = 4.99

interface LineItem {
  name: string
  price: number
  quantity: number
  image?: string
  variantId?: string
}

export async function POST(req: Request) {
  try {
    const stripe = getStripe()
    const clientIpAddress =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      undefined
    const clientUserAgent = req.headers.get('user-agent') ?? undefined
    const {
      items,
      email,
      shipping,
      summary,
      promoCode,
    }: {
      items: LineItem[]
      email: string
      shipping: Record<string, string>
      summary?: { shippingLabel: string }
      promoCode?: string
    } = await req.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const productItems = items.filter(item => item.price > 0)
    if (!productItems.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Recompute money server-side — never trust client totals. Price depends on total pairs.
    const naiveSum = naiveSubtotal(productItems)
    const pairs = countPairs(productItems)
    const bundlePrice = priceForPairs(pairs)
    const bundleDiscount = +Math.max(0, naiveSum - bundlePrice).toFixed(2)
    // Validate the promo code server-side; 10% off the (bundle-discounted) product price.
    const promo = promoDiscount(bundlePrice, promoCode)
    // One coupon covers the whole product discount (bundle + promo) so the charge = product − all + shipping.
    const totalProductDiscount = +(bundleDiscount + promo.amount).toFixed(2)
    const shippingAmount = pairs >= 2 ? 0 : DELIVERY_PRICE
    const shippingLabel = summary?.shippingLabel || shipping.deliveryMethod || 'Доставка'

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alpewear.com'
    const coupon = totalProductDiscount > 0
      ? await stripe.coupons.create({
          amount_off: Math.round(totalProductDiscount * 100),
          currency: 'eur',
          duration: 'once',
          name: promo.code ? `ALPÉ отстъпка (${promo.code})` : 'ALPÉ комплектна отстъпка',
        })
      : null

    const session = await stripe.checkout.sessions.create({
      // 'elements' = in-page Payment Element flow (pairs with CheckoutElementsProvider on the
      // client). Still a Checkout Session, so checkout.session.completed fires as before.
      ui_mode: 'elements',
      mode: 'payment',
      locale: 'bg',
      customer_email: email,
      line_items: [
        ...productItems.map(item => ({
          price_data: {
            currency: 'eur' as const,
            product_data: {
              name: item.name,
              ...(item.image ? { images: [item.image] } : {}),
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        ...(shippingAmount > 0 ? [{
          price_data: {
            currency: 'eur' as const,
            product_data: { name: `Доставка — ${shippingLabel}` },
            unit_amount: Math.round(shippingAmount * 100),
          },
          quantity: 1,
        }] : []),
      ],
      ...(coupon ? { discounts: [{ coupon: coupon.id }] } : {}),
      metadata: {
        ...shipping,
        ...(clientIpAddress ? { clientIpAddress } : {}),
        ...(clientUserAgent ? { clientUserAgent } : {}),
        subtotal: String(naiveSum),
        discountCode: promo.code || (bundleDiscount > 0 ? 'Комплектна отстъпка' : ''),
        discountAmount: String(totalProductDiscount),
        promoCode: promo.code,
        shippingAmount: String(shippingAmount),
        shippingLabel,
      },
      // ui_mode: 'elements' uses return_url (cancel_url/success_url are not allowed).
      // Stripe redirects here after checkout.confirm() succeeds; success page reads session_id
      // and the checkout.session.completed webhook fires Notion + CAPI Purchase + email.
      return_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    })

    // Mirror InitiateCheckout server-side to Meta CAPI for higher EMQ + ad-blocker resilience.
    // Uses session.id in eventId so it dedupes with the browser-side InitiateCheckout pixel event.
    const nameParts = (shipping.name ?? '').trim().split(' ')
    const firstName = nameParts[0] ?? ''
    const lastName = nameParts.slice(1).join(' ') || firstName
    const cartValue = +(bundlePrice - promo.amount).toFixed(2)
    const numItems = productItems.reduce((sum, i) => sum + i.quantity, 0)

    // Await CAPI so the serverless function doesn't terminate before the request reaches Meta.
    // Adds ~200-400ms to the redirect but ensures the event is actually sent.
    // Wrapped in try/catch so a CAPI failure doesn't block the user reaching Stripe payment.
    try {
      await sendCAPIEvent('InitiateCheckout', {
        email,
        phone: shipping.phone || undefined,
        firstName,
        lastName,
        city: shipping.city || undefined,
        country: shipping.country || undefined,
        zip: shipping.postalCode || undefined,
        fbp: shipping.fbp || undefined,
        fbc: shipping.fbc || undefined,
        clientIpAddress,
        clientUserAgent,
        value: +cartValue.toFixed(2),
        currency: 'EUR',
        orderId: session.id,
        contentIds: productItems.map(i => i.name),
        numItems,
        eventId: `initiate_checkout-${session.id}`,
        sourceUrl: `${siteUrl}/checkout`,
      })
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : String(err)
      console.error(`[CHECKOUT_CAPI_FAIL] session=${session.id} email=${email} error=${errMessage}`)
      // Fire-and-forget alert; don't block the user's checkout redirect
      notifyAlert({
        severity: 'warn',
        title: 'CAPI InitiateCheckout failed',
        body: `Customer reached Stripe but Meta did not receive InitiateCheckout.\n\n**Session:** \`${session.id}\`\n**Email:** ${email}\n**Error:** \`${errMessage}\``,
      }).catch(() => { /* ignore */ })
    }

    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Payment could not be created' }, { status: 500 })
  }
}
