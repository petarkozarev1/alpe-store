import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { sendCAPIEvent } from '@/lib/meta-capi'
import { notifyAlert } from '@/lib/alerts'
import { countPairs, priceForPairs } from '@/lib/pricing'
import { applyPromo, promoErrorMessage } from '@/lib/promo'
import { checkoutSiteUrl } from '@/lib/brand'
import { cookies } from 'next/headers'
import { getP2GAttribution, P2G_COOKIE_NAME } from '@/lib/p2g/attribution'
import { isLocale } from '@/lib/i18n/config'
import { localizedPath } from '@/lib/i18n/routing'
import { deliveryAmount, internationalFee } from '@/lib/checkout-delivery'

interface LineItem {
  name: string
  price: number
  quantity: number
  image?: string
  variantId?: string
  productId?: string
  variantLabel?: string
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
      locale: localeValue,
    }: {
      items: LineItem[]
      email: string
      shipping: Record<string, string>
      summary?: { shippingLabel: string }
      promoCode?: string
      locale?: string
    } = await req.json()
    const locale = isLocale(localeValue) ? localeValue : 'bg'

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const productItems = items.filter(item => item.price > 0)
    if (!productItems.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Temporary: block AMPÉ Evening until restock
    const hasEvening = productItems.some(item => {
      const fields = [item.productId, item.variantId, item.name, item.variantLabel].filter(Boolean)
      return fields.some(f => String(f).toLowerCase().includes('evening'))
    })
    if (hasEvening) {
      return NextResponse.json(
        { error: locale === 'en' ? 'AMPÉ Evening is temporarily out of stock. Please choose Daily.' : 'AMPÉ Evening е временно изчерпан. Моля изберете Daily.' },
        { status: 400 }
      )
    }

    const pairs = countPairs(productItems)
    const bundlePrice = priceForPairs(pairs)
    const promo = applyPromo(bundlePrice, promoCode, { pairs })
    if (promoCode?.trim() && !promo.code) {
      return NextResponse.json({ error: promoErrorMessage(promo.reason ?? 'unknown', locale) }, { status: 400 })
    }
    const office = Boolean(shipping.courier)
    const shippingAmount = deliveryAmount(pairs)
    const intlFee = office ? 0 : internationalFee(shipping.country)
    const shippingLabel = summary?.shippingLabel || shipping.deliveryMethod || 'Доставка'
    const affiliateId = getP2GAttribution(cookies().get(P2G_COOKIE_NAME)?.value, process.env.P2G_AFFILIATE_ID)
    const chargedProducts = +(bundlePrice - promo.amount).toFixed(2)

    const siteUrl = checkoutSiteUrl()
    const coupon = promo.amount > 0
      ? await stripe.coupons.create({
          amount_off: Math.round(promo.amount * 100),
          currency: 'eur',
          duration: 'once',
          name: `AMPÉ отстъпка (${promo.code})`,
        })
      : null

    const productName = productItems
      .map(item => item.name)
      .filter(Boolean)
      .join(', ') || (locale === 'en' ? 'AMPÉ glasses' : 'AMPÉ очила')

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'elements',
      mode: 'payment',
      locale,
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'eur' as const,
            product_data: {
              name: productName,
              ...(productItems[0]?.image ? { images: [productItems[0].image] } : {}),
            },
            unit_amount: Math.round(bundlePrice * 100),
          },
          quantity: 1,
        },
        ...(shippingAmount > 0 ? [{
          price_data: {
            currency: 'eur' as const,
            product_data: { name: `Доставка — ${shippingLabel}` },
            unit_amount: Math.round(shippingAmount * 100),
          },
          quantity: 1,
        }] : []),
        ...(intlFee > 0 ? [{
          price_data: {
            currency: 'eur' as const,
            product_data: { name: 'Международна доставка' },
            unit_amount: Math.round(intlFee * 100),
          },
          quantity: 1,
        }] : []),
      ],
      ...(coupon ? { discounts: [{ coupon: coupon.id }] } : {}),
      metadata: {
        ...shipping,
        ...(clientIpAddress ? { clientIpAddress } : {}),
        ...(clientUserAgent ? { clientUserAgent } : {}),
        subtotal: String(bundlePrice),
        discountCode: promo.code,
        discountAmount: String(promo.amount),
        promoCode: promo.code,
        shippingAmount: String(shippingAmount),
        internationalFee: String(intlFee),
        shippingLabel,
        chargedProducts: String(chargedProducts),
        ...(affiliateId ? { affiliateId } : {}),
        locale,
      },
      return_url: `${siteUrl}${localizedPath('/checkout/success', locale)}?session_id={CHECKOUT_SESSION_ID}`,
    })

    const nameParts = (shipping.name ?? '').trim().split(' ')
    const firstName = nameParts[0] ?? ''
    const lastName = nameParts.slice(1).join(' ') || firstName
    const cartValue = +(bundlePrice - promo.amount).toFixed(2)
    const numItems = productItems.reduce((sum, i) => sum + i.quantity, 0)

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
