import { NextResponse } from 'next/server'
import type { CAPIOptions } from '@/lib/meta-capi'
import type {
  OrderInput,
  OrderRecord,
} from './notion'

interface StripeSession {
  id: string
  payment_status: string
  amount_total: number | null
  customer_email: string | null
  metadata: Record<string, string> | null
}

export interface StripeWebhookEvent {
  type: string
  data: { object: StripeSession }
}

interface StripeLineItem {
  id: string
  description: string | null
  quantity: number | null
  amount_total: number
}

interface StripeWebhookDependencies {
  constructEvent: (body: string, signature: string) => StripeWebhookEvent
  listLineItems: (
    sessionId: string
  ) => Promise<{ data: StripeLineItem[] }>
  saveOrder: (order: OrderInput) => Promise<OrderRecord>
  sendCapi: (eventName: string, options: CAPIOptions) => Promise<void>
  now: () => string
}

function cents(value: string | undefined, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? Math.round(parsed) : fallback
}

export function createStripeWebhookHandler(
  dependencies: StripeWebhookDependencies
) {
  return async function stripeWebhookHandler(req: Request) {
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      )
    }

    let event: StripeWebhookEvent
    try {
      event = dependencies.constructEvent(await req.text(), signature)
    } catch {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    if (event.type !== 'checkout.session.completed') {
      return NextResponse.json({ received: true })
    }

    const session = event.data.object
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true })
    }

    try {
      const metadata = session.metadata ?? {}
      const lineItems = await dependencies.listLineItems(session.id)
      const productItems = lineItems.data.filter(
        item => item.description !== 'Доставка'
      )
      const totalCents = session.amount_total ?? cents(metadata.totalCents)
      const discountCents = cents(metadata.discountCents)
      const shippingCents = cents(metadata.shippingCents)
      const subtotalCents = cents(
        metadata.subtotalCents,
        totalCents + discountCents - shippingCents
      )
      const totalPairs = cents(metadata.totalPairs, productItems.reduce(
        (sum, item) => sum + (item.quantity ?? 1),
        0
      ))
      const orderId = metadata.orderId || session.id
      const affiliateId = metadata.affiliateId || undefined

      await dependencies.saveOrder({
        orderId,
        stripeSessionId: session.id,
        paymentMethod: 'card',
        paymentStatus: 'Paid',
        paidAt: dependencies.now(),
        affiliateId,
        quote: {
          items: productItems.map(item => ({
            productId: item.id,
            variantId: item.id,
            quantity: item.quantity ?? 1,
            name: item.description ?? 'ALPÉ',
            unitAmountCents: Math.round(
              item.amount_total / (item.quantity ?? 1)
            ),
            pairsPerUnit: 1,
          })),
          subtotalCents,
          discountCents,
          shippingCents,
          totalCents,
          totalPairs,
        },
        customer: {
          name: metadata.name ?? '',
          email: session.customer_email ?? '',
          phone: metadata.phone ?? '',
        },
        shipping: {
          city: metadata.city ?? '',
          address: metadata.address ?? '',
          postalCode: metadata.postalCode ?? '',
          country: metadata.country ?? '',
          deliveryMethod: metadata.deliveryMethod ?? '',
          courier: metadata.courier ?? '',
          officeLocation: metadata.officeLocation ?? '',
          courierNote: metadata.courierNote ?? '',
        },
        createdAt: metadata.createdAt,
      })

      const nameParts = (metadata.name ?? '').trim().split(/\s+/)
      const firstName = nameParts[0] ?? ''
      const lastName = nameParts.slice(1).join(' ') || firstName

      await dependencies.sendCapi('Purchase', {
        email: session.customer_email ?? undefined,
        phone: metadata.phone || undefined,
        firstName,
        lastName,
        city: metadata.city || undefined,
        country: metadata.country || undefined,
        zip: metadata.postalCode || undefined,
        fbp: metadata.fbp || undefined,
        fbc: metadata.fbc || undefined,
        clientIpAddress: metadata.clientIpAddress || undefined,
        clientUserAgent: metadata.clientUserAgent || undefined,
        value: totalCents / 100,
        currency: 'EUR',
        orderId,
        contentIds: productItems.map(item => item.description ?? 'ALPÉ'),
        numItems: productItems.reduce(
          (sum, item) => sum + (item.quantity ?? 1),
          0
        ),
        eventId: `purchase-${orderId}`,
        sourceUrl: 'https://alpewear.com/checkout/success',
      })

      return NextResponse.json({ received: true })
    } catch (error) {
      console.error('Stripe webhook processing error:', error)
      return NextResponse.json(
        { error: 'Order processing failed' },
        { status: 500 }
      )
    }
  }
}
