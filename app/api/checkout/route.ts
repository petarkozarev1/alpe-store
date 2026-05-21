import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { sendCAPIEvent } from '@/lib/meta-capi'
import { notifyAlert } from '@/lib/alerts'

interface LineItem {
  name: string
  price: number
  quantity: number
  image?: string
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
    }: { items: LineItem[]; email: string; shipping: Record<string, string> } = await req.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const productItems = items.filter(item => item.price > 0)
    if (!productItems.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const discountTotal = Math.abs(
      items
        .filter(item => item.price < 0)
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
    )

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alpewear.com'
    const coupon = discountTotal > 0
      ? await stripe.coupons.create({
          amount_off: Math.round(discountTotal * 100),
          currency: 'eur',
          duration: 'once',
          name: 'ALPÉ discount',
        })
      : null

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      locale: 'bg',
      customer_email: email,
      line_items: productItems.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            ...(item.image ? { images: [item.image] } : {}),
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      ...(coupon ? { discounts: [{ coupon: coupon.id }] } : {}),
      metadata: {
        ...shipping,
        ...(clientIpAddress ? { clientIpAddress } : {}),
        ...(clientUserAgent ? { clientUserAgent } : {}),
      },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
    })

    // Mirror InitiateCheckout server-side to Meta CAPI for higher EMQ + ad-blocker resilience.
    // Uses session.id in eventId so it dedupes with the browser-side InitiateCheckout pixel event.
    const nameParts = (shipping.name ?? '').trim().split(' ')
    const firstName = nameParts[0] ?? ''
    const lastName = nameParts.slice(1).join(' ') || firstName
    const cartValue = productItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
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

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Payment could not be created' }, { status: 500 })
  }
}
