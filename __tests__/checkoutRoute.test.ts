/** @jest-environment node */

import { createCheckoutHandler } from '@/lib/orders/checkout'

const shipping = {
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
}

function checkoutRequest(overrides: Record<string, unknown> = {}) {
  return new Request('https://alpewear.com/api/checkout', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'checkout-test',
      'x-forwarded-for': '203.0.113.10',
    },
    body: JSON.stringify({
      items: [{
        productId: 'ALPÉ-evening',
        variantId: 'ALPÉ-evening-bundle-1',
        quantity: 1,
        price: 0.01,
      }],
      email: 'test@example.com',
      shipping,
      paymentMethod: 'card',
      ...overrides,
    }),
  })
}

function makeDependencies(affiliateId: string | null = null) {
  const stripe = {
    coupons: {
      create: jest.fn().mockResolvedValue({ id: 'coupon-p2g' }),
    },
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({
          id: 'cs_test_1',
          url: 'https://checkout.stripe.test/session',
        }),
      },
    },
  }
  const saveOrder = jest.fn().mockResolvedValue({
    pageId: 'notion-page',
    orderId: 'ALPE-test-order',
  })

  return {
    stripe,
    saveOrder,
    dependencies: {
      getStripeClient: () => stripe,
      getAffiliateId: () => affiliateId,
      saveOrder,
      createOrderId: () => 'ALPE-test-order',
      now: () => '2026-07-30T12:00:00.000Z',
      siteUrl: 'https://alpewear.com',
    },
  }
}

describe('checkout API', () => {
  test('uses canonical catalog amounts instead of a browser price', async () => {
    const { stripe, dependencies } = makeDependencies()
    const response = await createCheckoutHandler(dependencies)(checkoutRequest())

    expect(response.status).toBe(200)
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [
          expect.objectContaining({
            price_data: expect.objectContaining({ unit_amount: 4499 }),
            quantity: 1,
          }),
          expect.objectContaining({
            price_data: expect.objectContaining({ unit_amount: 499 }),
            quantity: 1,
          }),
        ],
        metadata: expect.objectContaining({
          orderId: 'ALPE-test-order',
          subtotalCents: '4499',
          discountCents: '0',
          shippingCents: '499',
          totalCents: '4998',
        }),
      })
    )
  })

  test('preserves P2G attribution without changing the price', async () => {
    const { stripe, dependencies } = makeDependencies('partner-fixed-id')
    const response = await createCheckoutHandler(dependencies)(checkoutRequest())

    expect(response.status).toBe(200)
    expect(stripe.coupons.create).not.toHaveBeenCalled()
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({
          affiliateId: 'partner-fixed-id',
          discountCents: '0',
          totalCents: '4998',
        }),
      })
    )
    expect(stripe.checkout.sessions.create.mock.calls[0][0])
      .not.toHaveProperty('discounts')
  })

  test('creates COD in Notion as awaiting payment without calling Stripe', async () => {
    const { stripe, saveOrder, dependencies } = makeDependencies('partner-fixed-id')
    const response = await createCheckoutHandler(dependencies)(
      checkoutRequest({ paymentMethod: 'cod' })
    )
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({
      paymentMethod: 'cod',
      orderId: 'ALPE-test-order',
      url: '/checkout/success?order_id=ALPE-test-order&payment=cod',
    })
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled()
    expect(saveOrder).toHaveBeenCalledWith(expect.objectContaining({
      orderId: 'ALPE-test-order',
      paymentMethod: 'cod',
      paymentStatus: 'Awaiting payment',
      affiliateId: 'partner-fixed-id',
      quote: expect.objectContaining({
        discountCents: 0,
        totalCents: 4998,
      }),
    }))
  })

  test('rejects malformed quantities before calling external services', async () => {
    const { stripe, saveOrder, dependencies } = makeDependencies()
    const response = await createCheckoutHandler(dependencies)(
      checkoutRequest({
        items: [{
          productId: 'ALPÉ-evening',
          variantId: 'ALPÉ-evening-bundle-1',
          quantity: 0,
        }],
      })
    )

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: 'Invalid cart item' })
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled()
    expect(saveOrder).not.toHaveBeenCalled()
  })

  test('rejects unsupported payment methods', async () => {
    const { dependencies } = makeDependencies()
    const response = await createCheckoutHandler(dependencies)(
      checkoutRequest({ paymentMethod: 'bank-transfer' })
    )

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: 'Invalid payment method' })
  })
})
