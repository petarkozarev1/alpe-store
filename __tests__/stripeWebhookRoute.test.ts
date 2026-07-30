/** @jest-environment node */

import { createStripeWebhookHandler } from '@/lib/orders/stripeWebhook'
import type { OrderRecord } from '@/lib/orders/notion'

const baseSession = {
  id: 'cs_test_1',
  payment_status: 'paid',
  amount_total: 4098,
  customer_email: 'test@example.com',
  metadata: {
    orderId: 'ALPE-order-1',
    name: 'Test Customer',
    phone: '+359881234567',
    city: 'Sofia',
    address: 'Test address 1',
    postalCode: '1000',
    country: 'BG',
    deliveryMethod: 'До адрес',
    courier: '',
    officeLocation: '',
    courierNote: '',
    affiliateId: 'partner-fixed-id',
    subtotalCents: '4499',
    discountCents: '900',
    shippingCents: '499',
    totalCents: '4098',
    totalPairs: '1',
    createdAt: '2026-07-30T12:00:00.000Z',
    fbp: '',
    fbc: '',
    clientIpAddress: '203.0.113.10',
    clientUserAgent: 'checkout-test',
  },
}

function makeDependencies(session = baseSession) {
  const savedOrder: OrderRecord = {
    pageId: 'notion-page-1',
    orderId: session.metadata.orderId,
    stripeSessionId: session.id,
    paymentMethod: 'card',
    paymentStatus: 'Paid',
    affiliateId: session.metadata.affiliateId || undefined,
    paidAmountCents: session.amount_total,
    currency: 'EUR',
    p2gReported: false,
  }
  const saveOrder = jest.fn().mockResolvedValue(savedOrder)
  const reportOrder = jest.fn().mockResolvedValue('sent')
  const sendCapi = jest.fn().mockResolvedValue(undefined)
  const listLineItems = jest.fn().mockResolvedValue({
    data: [{
      id: 'li_1',
      description: 'ALPÉ Evening · 1 pair',
      quantity: 1,
      amount_total: 4499,
    }],
  })

  return {
    saveOrder,
    reportOrder,
    sendCapi,
    listLineItems,
    handler: createStripeWebhookHandler({
      constructEvent: () => ({
        type: 'checkout.session.completed',
        data: { object: session },
      }),
      listLineItems,
      saveOrder,
      reportOrder,
      sendCapi,
    }),
  }
}

function stripeRequest() {
  return new Request('https://alpewear.com/api/webhooks/stripe', {
    method: 'POST',
    headers: { 'stripe-signature': 'valid-signature' },
    body: '{"stripe":"event"}',
  })
}

test('acknowledges a completed but unpaid session without side effects', async () => {
  const setup = makeDependencies({
    ...baseSession,
    payment_status: 'unpaid',
  })

  const response = await setup.handler(stripeRequest())

  expect(response.status).toBe(200)
  expect(setup.listLineItems).not.toHaveBeenCalled()
  expect(setup.saveOrder).not.toHaveBeenCalled()
  expect(setup.reportOrder).not.toHaveBeenCalled()
  expect(setup.sendCapi).not.toHaveBeenCalled()
})

test('upserts and reports a paid P2G card order', async () => {
  const setup = makeDependencies()

  const response = await setup.handler(stripeRequest())

  expect(response.status).toBe(200)
  expect(setup.saveOrder).toHaveBeenCalledWith(expect.objectContaining({
    orderId: 'ALPE-order-1',
    stripeSessionId: 'cs_test_1',
    paymentMethod: 'card',
    paymentStatus: 'Paid',
    affiliateId: 'partner-fixed-id',
    quote: expect.objectContaining({
      subtotalCents: 4499,
      discountCents: 900,
      shippingCents: 499,
      totalCents: 4098,
    }),
  }))
  expect(setup.reportOrder).toHaveBeenCalledWith(expect.objectContaining({
    orderId: 'ALPE-order-1',
    paymentStatus: 'Paid',
  }))
  expect(setup.sendCapi).toHaveBeenCalledTimes(1)
})

test('saves a direct paid order without invoking the P2G reporter', async () => {
  const setup = makeDependencies({
    ...baseSession,
    metadata: { ...baseSession.metadata, affiliateId: '' },
  })

  const response = await setup.handler(stripeRequest())

  expect(response.status).toBe(200)
  expect(setup.saveOrder).toHaveBeenCalledTimes(1)
  expect(setup.reportOrder).not.toHaveBeenCalled()
})

test('reuses the metadata ALPE order ID across Stripe retries', async () => {
  const setup = makeDependencies()

  await setup.handler(stripeRequest())
  await setup.handler(stripeRequest())

  expect(setup.saveOrder).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ orderId: 'ALPE-order-1' })
  )
  expect(setup.saveOrder).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ orderId: 'ALPE-order-1' })
  )
})

test('rejects an invalid Stripe signature', async () => {
  const setup = makeDependencies()
  const handler = createStripeWebhookHandler({
    constructEvent: () => {
      throw new Error('Invalid signature')
    },
    listLineItems: setup.listLineItems,
    saveOrder: setup.saveOrder,
    reportOrder: setup.reportOrder,
    sendCapi: setup.sendCapi,
  })

  const response = await handler(stripeRequest())

  expect(response.status).toBe(400)
  expect(await response.json()).toEqual({ error: 'Invalid signature' })
})
