import Link from 'next/link'
import type { Metadata } from 'next'
import Stripe from 'stripe'
import { Client } from '@notionhq/client'

export const metadata: Metadata = {
  title: 'Поръчката е приета — ALPÉ',
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const notion = new Client({ auth: process.env.NOTION_API_KEY })
const DB = process.env.NOTION_DATABASE_ID!

async function saveToNotion(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    })

    if (session.payment_status !== 'paid') return

    // Idempotency: skip if already saved
    const existing = await notion.databases.query({
      database_id: DB,
      filter: { property: 'Stripe Session', rich_text: { equals: sessionId } },
    })
    if (existing.results.length > 0) return

    const meta = (session.metadata ?? {}) as Record<string, string>
    const items = (session.line_items?.data ?? [])
      .map(i => `${i.description} ×${i.quantity}`)
      .join(', ')
    const total = (session.amount_total ?? 0) / 100

    await notion.pages.create({
      parent: { database_id: DB },
      properties: {
        Name:             { title: [{ text: { content: meta.name ?? '' } }] },
        Email:            { email: session.customer_email ?? '' },
        Phone:            { phone_number: meta.phone ?? '' },
        City:             { rich_text: [{ text: { content: meta.city ?? '' } }] },
        Address:          { rich_text: [{ text: { content: meta.address ?? '' } }] },
        Delivery:         { rich_text: [{ text: { content: meta.deliveryMethod ?? '' } }] },
        Courier:          { rich_text: [{ text: { content: meta.deliveryMethod ?? '' } }] },
        Office:           { rich_text: [{ text: { content: meta.officeLocation ?? '' } }] },
        Items:            { rich_text: [{ text: { content: items } }] },
        Total:            { number: total },
        Date:             { date: { start: new Date().toISOString() } },
        'Stripe Session': { rich_text: [{ text: { content: sessionId } }] },
      },
    })
  } catch (err) {
    console.error('Notion save error:', err)
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  if (session_id) {
    await saveToNotion(session_id)
  }

  return (
    <main className="bg-parchment min-h-screen flex items-center justify-center px-6">
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
