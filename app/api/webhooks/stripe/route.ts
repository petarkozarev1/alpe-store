import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Client } from '@notionhq/client'
import { sendCAPIEvent } from '@/lib/meta-capi'
import { getRequiredEnv, getStripe } from '@/lib/stripe'

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

  try {
    const notion = new Client({ auth: getRequiredEnv('NOTION_API_KEY') })
    const databaseId = getRequiredEnv('NOTION_DATABASE_ID')

    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: { title: [{ text: { content: meta.name ?? '' } }] },
        Email: { email: session.customer_email ?? '' },
        Phone: { phone_number: meta.phone ?? '' },
        City: { rich_text: [{ text: { content: meta.city ?? '' } }] },
        Address: { rich_text: [{ text: { content: meta.address ?? '' } }] },
        'Postal Code': { rich_text: [{ text: { content: meta.postalCode ?? '' } }] },
        Delivery: { rich_text: [{ text: { content: meta.deliveryMethod ?? '' } }] },
        Courier: { rich_text: [{ text: { content: meta.courier || meta.deliveryMethod || '' } }] },
        Office: { rich_text: [{ text: { content: meta.officeLocation ?? '' } }] },
        'Courier Note': { rich_text: [{ text: { content: meta.courierNote ?? '' } }] },
        Items: { rich_text: [{ text: { content: items } }] },
        Total: { number: total },
        Date: { date: { start: new Date().toISOString() } },
        'Stripe Session': { rich_text: [{ text: { content: session.id } }] },
      },
    })
  } catch (err) {
    console.error('Notion order write error:', err)
    return NextResponse.json({ error: 'Notion write failed' }, { status: 500 })
  }

  const nameParts = (meta.name ?? '').trim().split(' ')
  const firstName = nameParts[0] ?? ''
  const lastName = nameParts.slice(1).join(' ') || firstName

  await sendCAPIEvent('Purchase', {
    email: session.customer_email ?? undefined,
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
  })

  return NextResponse.json({ received: true })
}
