import { randomUUID } from 'crypto'
import { cookies } from 'next/headers'
import { getStripe } from '@/lib/stripe'
import {
  getP2GAttribution,
  P2G_COOKIE_NAME,
} from '@/lib/orders/attribution'
import {
  createCheckoutHandler,
  type CheckoutDependencies,
  type StripeClient,
} from '@/lib/orders/checkout'
import { createOrUpdateOrder } from '@/lib/orders/notion'

const dependencies: CheckoutDependencies = {
  getStripeClient: () => getStripe() as unknown as StripeClient,
  getAffiliateId: () => {
    const cookieValue = cookies().get(P2G_COOKIE_NAME)?.value
    return getP2GAttribution(cookieValue, process.env.P2G_AFFILIATE_ID)
  },
  saveOrder: createOrUpdateOrder,
  createOrderId: () => `ALPE-${randomUUID()}`,
  now: () => new Date().toISOString(),
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alpewear.com',
}

export const POST = createCheckoutHandler(dependencies)
