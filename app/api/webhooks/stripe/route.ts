import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Client } from '@notionhq/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const notion = new Client({ auth: process.env.NOTION_API_KEY })
const DB = process.env.NOTION_DATABASE_ID!

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session

  const meta = (session.metadata ?? {}) as Record<string, string>
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 20 })
  const items = lineItems.data.map(i => `${i.description} ×${i.quantity}`).join(', ')
  const total = (session.amount_total ?? 0) / 100

  try {
    await notion.pages.create({
      parent: { database_id: DB },
      properties: {
        Name:           { title: [{ text: { content: meta.name ?? '' } }] },
        Email:          { email: session.customer_email ?? '' },
        Phone:          { phone_number: meta.phone ?? '' },
        City:           { rich_text: [{ text: { content: meta.city ?? '' } }] },
        Address:        { rich_text: [{ text: { content: meta.address ?? '' } }] },
        Delivery:       { rich_text: [{ text: { content: meta.deliveryMethod ?? '' } }] },
        Courier:        { rich_text: [{ text: { content: meta.deliveryMethod ?? '' } }] },
        Office:         { rich_text: [{ text: { content: meta.officeLocation ?? '' } }] },
        Items:          { rich_text: [{ text: { content: items } }] },
        Total:          { number: total },
        Date:           { date: { start: new Date().toISOString() } },
        'Stripe Session': { rich_text: [{ text: { content: session.id } }] },
      },
    })
  } catch (err) {
    console.error('Notion error:', err)
    return NextResponse.json({ error: 'Notion write failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
