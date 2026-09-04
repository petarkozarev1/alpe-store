import { sendCAPIEvent } from '@/lib/meta-capi'
import { createOrUpdateOrder } from '@/lib/orders/notion'
import {
  createStripeWebhookHandler,
  type StripeWebhookEvent,
} from '@/lib/orders/stripeWebhook'
import { getRequiredEnv, getStripe } from '@/lib/stripe'

export const POST = createStripeWebhookHandler({
  constructEvent: (body, signature) => {
    const stripe = getStripe()
    return stripe.webhooks.constructEvent(
      body,
      signature,
      getRequiredEnv('STRIPE_WEBHOOK_SECRET')
    ) as unknown as StripeWebhookEvent
  },
  listLineItems: async sessionId => {
    const result = await getStripe().checkout.sessions.listLineItems(
      sessionId,
      { limit: 20 }
    )
    return result as unknown as {
      data: Array<{
        id: string
        description: string | null
        quantity: number | null
        amount_total: number
      }>
    }
  },
  saveOrder: createOrUpdateOrder,
  sendCapi: sendCAPIEvent,
  now: () => new Date().toISOString(),
})
