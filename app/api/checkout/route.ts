import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

interface LineItem {
  name: string
  price: number
  quantity: number
  image?: string
}

export async function POST(req: Request) {
  try {
    const { items, email, shipping }: { items: LineItem[]; email: string; shipping: Record<string, string> } = await req.json()

    if (!items?.length) {
      return NextResponse.json({ error: 'Количката е празна' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alpewear.com'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: items.map(item => ({
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
      shipping_address_collection: { allowed_countries: ['BG', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PL', 'RO', 'GR'] },
      metadata: { ...shipping },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    return NextResponse.json({ error: 'Грешка при създаване на плащане' }, { status: 500 })
  }
}
