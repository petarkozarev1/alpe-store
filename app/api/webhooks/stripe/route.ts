import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { notifyAlert } from '@/lib/alerts'
import { getRequiredEnv, getStripe } from '@/lib/stripe'
import { writeOrderToNotion, writePromoOrderToNotion, firePurchase, type OrderRecord } from '@/lib/orders'
import { sendOrderConfirmation, type OrderEmailModel, type OrderEmailRow } from '@/lib/email'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 })
  }

  let stripe: Stripe
  let webhookSecret: string
  try {
    stripe = getStripe()
    webhookSecret = getRequiredEnv('STRIPE_WEBHOOK_SECRET')
  } catch (err) {
    console.error('Stripe webhook configuration error:', err)
    return NextResponse.json({ error: 'Webhook is not configured' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const meta = (session.metadata ?? {}) as Record<string, string>
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 20 })
  const items = lineItems.data.map(i => `${i.description} x${i.quantity}`).join(', ')
  const total = (session.amount_total ?? 0) / 100
  const customerEmail = session.customer_email ?? ''

  console.log(`[WEBHOOK] checkout.session.completed — session=${session.id} email=${customerEmail} total=${total}`)

  // Independent task #1 — Notion write. Failures must NOT block CAPI.
  const orderRecord: OrderRecord = {
    orderRef: session.id,
    paymentMethod: 'card',
    name: meta.name ?? '',
    email: customerEmail,
    phone: meta.phone ?? '',
    city: meta.city ?? '',
    address: meta.address ?? '',
    postalCode: meta.postalCode ?? '',
    deliveryMethod: meta.deliveryMethod ?? '',
    courier: meta.courier ?? '',
    officeLocation: meta.officeLocation ?? '',
    courierNote: meta.courierNote ?? '',
    itemsText: items,
    total,
    promoCode: meta.promoCode || '',
  }

  let notionOk = false
  try {
    await writeOrderToNotion(orderRecord)
    notionOk = true
    console.log(`[WEBHOOK] Notion row created — session=${session.id}`)
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : String(err)
    console.error(`[WEBHOOK_NOTION_FAIL] session=${session.id} email=${customerEmail} error=${errMessage}`)
    await notifyAlert({
      severity: 'error',
      title: 'Notion order write FAILED',
      body: `Customer paid but order not saved to Notion.\n\n**Session:** \`${session.id}\`\n**Email:** ${customerEmail}\n**Total:** €${total}\n**Items:** ${items}\n**Error:** \`${errMessage}\``,
    })
  }

  // Mirror to the promoter's separate (PII-free) Notion DB when a promo code was used.
  if (meta.promoCode) {
    await writePromoOrderToNotion({ promoCode: meta.promoCode, total, itemsText: items, orderRef: session.id })
  }

  // Independent task #2 — Meta CAPI Purchase. Always fires regardless of Notion outcome.
  const nameParts = (meta.name ?? '').trim().split(' ')
  const firstName = nameParts[0] ?? ''
  const lastName = nameParts.slice(1).join(' ') || firstName

  const capiOk = await firePurchase({
    email: customerEmail || undefined,
    phone: meta.phone ?? undefined,
    firstName,
    lastName,
    city: meta.city ?? undefined,
    country: meta.country ?? undefined,
    zip: meta.postalCode ?? undefined,
    fbp: meta.fbp ?? undefined,
    fbc: meta.fbc ?? undefined,
    clientIpAddress: meta.clientIpAddress ?? undefined,
    clientUserAgent: meta.clientUserAgent ?? undefined,
    value: total,
    currency: 'EUR',
    orderId: session.id,
    contentIds: lineItems.data.map(i => i.description ?? 'ALPÉ'),
    numItems: lineItems.data.reduce((sum, i) => sum + (i.quantity ?? 1), 0),
    eventId: `purchase-${session.id}`,
    sourceUrl: 'https://alpewear.com/checkout/success',
    eventTime: session.created,
  }, { orderRef: session.id, email: customerEmail, total })

  // Independent task #3 — confirmation email. Failures must NOT block the 200 response.
  const shippingAmount = Number(meta.shippingAmount ?? '0') || 0
  const subtotal = Number(meta.subtotal ?? '0') || (total - shippingAmount)
  const discountAmount = Number(meta.discountAmount ?? '0') || 0
  // Product rows = all Stripe line items except the trailing shipping line (only present when shippingAmount > 0).
  const productLineItems = shippingAmount > 0 ? lineItems.data.slice(0, -1) : lineItems.data
  const productRows: OrderEmailRow[] = productLineItems.map(li => {
    const [label, sublabel] = (li.description ?? 'ALPÉ').split(' — ')
    return { label, sublabel, amount: (li.amount_total ?? 0) / 100 }
  })
  const emailModel: OrderEmailModel = {
    orderRef: session.id,
    paymentMethod: 'card',
    customerFirstName: firstName || 'клиент',
    productRows,
    subtotal,
    discount: discountAmount > 0 ? { code: meta.discountCode || 'отстъпка', amount: discountAmount } : undefined,
    shippingLabel: meta.shippingLabel || meta.deliveryMethod || 'Доставка',
    shippingAmount,
    total,
    deliveryTo: {
      name: meta.name ?? '',
      line: meta.officeLocation || [meta.address, meta.city].filter(Boolean).join(', '),
      phone: meta.phone ?? '',
    },
  }
  let emailOk = false
  try {
    if (customerEmail) { await sendOrderConfirmation(customerEmail, emailModel); emailOk = true }
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : String(err)
    console.error(`[WEBHOOK_EMAIL_FAIL] session=${session.id} email=${customerEmail} error=${errMessage}`)
    await notifyAlert({
      severity: 'warn',
      title: 'Confirmation email FAILED (card)',
      body: `Order saved but confirmation email not sent.\n\n**Session:** \`${session.id}\`\n**Email:** ${customerEmail}\n**Error:** \`${errMessage}\``,
    })
  }

  // Always return 200 — webhook itself processed. Failures handled async via alerts.
  // (Returning 5xx would make Stripe retry every 10h for 3 days, flooding logs without fixing root cause.)
  console.log(`[WEBHOOK] Done — session=${session.id} notion=${notionOk} capi=${capiOk} email=${emailOk}`)
  return NextResponse.json({ received: true, notion: notionOk, capi: capiOk, email: emailOk })
}
