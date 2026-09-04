import { NextResponse } from 'next/server'
import type { OrderInput } from './notion'
import { quoteOrder } from './pricing'
import type {
  CheckoutItemInput,
  PaymentMethod,
} from './types'

export interface StripeClient {
  checkout: {
    sessions: {
      create(args: unknown): Promise<{ id: string; url: string | null }>
    }
  }
}

export interface CheckoutDependencies {
  getStripeClient: () => StripeClient
  getAffiliateId: () => string | null
  saveOrder: (order: OrderInput) => Promise<unknown>
  createOrderId: () => string
  now: () => string
  siteUrl: string
}

interface CheckoutShipping {
  name: string
  phone: string
  city: string
  address: string
  postalCode: string
  country: string
  deliveryMethod: string
  courier: string
  officeLocation: string
  courierNote: string
  fbp?: string
  fbc?: string
}

interface CheckoutBody {
  items: CheckoutItemInput[]
  email: string
  shipping: CheckoutShipping
  paymentMethod: PaymentMethod
}

class CheckoutInputError extends Error {}

function requiredString(value: unknown, fieldName: string) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CheckoutInputError(`${fieldName} is required`)
  }
  return value.trim()
}

function optionalString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function parseCheckoutBody(value: unknown): CheckoutBody {
  if (!value || typeof value !== 'object') {
    throw new CheckoutInputError('Invalid checkout request')
  }

  const body = value as Record<string, unknown>
  if (body.paymentMethod !== 'card' && body.paymentMethod !== 'cod') {
    throw new CheckoutInputError('Invalid payment method')
  }
  if (!Array.isArray(body.items)) {
    throw new CheckoutInputError('Cart is empty')
  }
  if (!body.shipping || typeof body.shipping !== 'object') {
    throw new CheckoutInputError('Shipping is required')
  }

  const shipping = body.shipping as Record<string, unknown>

  return {
    items: body.items as CheckoutItemInput[],
    email: requiredString(body.email, 'Email'),
    paymentMethod: body.paymentMethod,
    shipping: {
      name: requiredString(shipping.name, 'Name'),
      phone: requiredString(shipping.phone, 'Phone'),
      city: requiredString(shipping.city, 'City'),
      address: requiredString(shipping.address, 'Address'),
      postalCode: optionalString(shipping.postalCode),
      country: requiredString(shipping.country, 'Country'),
      deliveryMethod: requiredString(
        shipping.deliveryMethod,
        'Delivery method'
      ),
      courier: optionalString(shipping.courier),
      officeLocation: optionalString(shipping.officeLocation),
      courierNote: optionalString(shipping.courierNote),
      fbp: optionalString(shipping.fbp) || undefined,
      fbc: optionalString(shipping.fbc) || undefined,
    },
  }
}

export function createCheckoutHandler(dependencies: CheckoutDependencies) {
  return async function checkoutHandler(req: Request) {
    try {
      const body = parseCheckoutBody(await req.json())
      const affiliateId = dependencies.getAffiliateId()
      const quote = quoteOrder(body.items)
      const orderId = dependencies.createOrderId()
      const createdAt = dependencies.now()
      const clientIpAddress =
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        req.headers.get('x-real-ip') ??
        undefined
      const clientUserAgent = req.headers.get('user-agent') ?? undefined

      const orderBase: Omit<OrderInput, 'paymentStatus'> = {
        orderId,
        paymentMethod: body.paymentMethod,
        affiliateId: affiliateId ?? undefined,
        quote,
        customer: {
          name: body.shipping.name,
          email: body.email,
          phone: body.shipping.phone,
        },
        shipping: {
          city: body.shipping.city,
          address: body.shipping.address,
          postalCode: body.shipping.postalCode,
          country: body.shipping.country,
          deliveryMethod: body.shipping.deliveryMethod,
          courier: body.shipping.courier,
          officeLocation: body.shipping.officeLocation,
          courierNote: body.shipping.courierNote,
        },
        createdAt,
      }

      if (body.paymentMethod === 'cod') {
        await dependencies.saveOrder({
          ...orderBase,
          paymentStatus: 'Awaiting payment',
        })

        return NextResponse.json({
          paymentMethod: 'cod',
          orderId,
          url: `/checkout/success?order_id=${encodeURIComponent(orderId)}&payment=cod`,
        })
      }

      const stripe = dependencies.getStripeClient()
      const lineItems = quote.items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: { name: item.name },
          unit_amount: item.unitAmountCents,
        },
        quantity: item.quantity,
      }))

      if (quote.shippingCents > 0) {
        lineItems.push({
          price_data: {
            currency: 'eur',
            product_data: { name: 'Доставка' },
            unit_amount: quote.shippingCents,
          },
          quantity: 1,
        })
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        customer_email: body.email,
        line_items: lineItems,
        shipping_address_collection: {
          allowed_countries: [
            'BG', 'DE', 'FR', 'IT', 'ES', 'NL',
            'BE', 'AT', 'PL', 'RO', 'GR',
          ],
        },
        metadata: {
          orderId,
          name: body.shipping.name,
          phone: body.shipping.phone,
          city: body.shipping.city,
          address: body.shipping.address,
          postalCode: body.shipping.postalCode,
          country: body.shipping.country,
          deliveryMethod: body.shipping.deliveryMethod,
          courier: body.shipping.courier,
          officeLocation: body.shipping.officeLocation,
          courierNote: body.shipping.courierNote,
          affiliateId: affiliateId ?? '',
          subtotalCents: String(quote.subtotalCents),
          discountCents: String(quote.discountCents),
          shippingCents: String(quote.shippingCents),
          totalCents: String(quote.totalCents),
          totalPairs: String(quote.totalPairs),
          createdAt,
          fbp: body.shipping.fbp ?? '',
          fbc: body.shipping.fbc ?? '',
          clientIpAddress: clientIpAddress ?? '',
          clientUserAgent: clientUserAgent ?? '',
        },
        success_url:
          `${dependencies.siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${dependencies.siteUrl}/checkout`,
      })

      return NextResponse.json({
        paymentMethod: 'card',
        orderId,
        url: session.url,
      })
    } catch (error) {
      if (
        error instanceof CheckoutInputError ||
        (error instanceof Error &&
          ['Cart is empty', 'Invalid cart item'].includes(error.message))
      ) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }

      console.error('Checkout error:', error)
      return NextResponse.json(
        { error: 'Payment could not be created' },
        { status: 500 }
      )
    }
  }
}
