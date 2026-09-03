/** @jest-environment node */

import { createHmac } from 'crypto'
import {
  createNotionWebhookHandler,
  verifyNotionSignature,
} from '@/lib/orders/notionWebhook'
import type { OrderRecord } from '@/lib/orders/notion'

const originalVerificationToken = process.env.NOTION_WEBHOOK_VERIFICATION_TOKEN
const originalAffiliateId = process.env.P2G_AFFILIATE_ID

afterEach(() => {
  if (originalVerificationToken === undefined) {
    delete process.env.NOTION_WEBHOOK_VERIFICATION_TOKEN
  } else {
    process.env.NOTION_WEBHOOK_VERIFICATION_TOKEN = originalVerificationToken
  }
  if (originalAffiliateId === undefined) {
    delete process.env.P2G_AFFILIATE_ID
  } else {
    process.env.P2G_AFFILIATE_ID = originalAffiliateId
  }
})

const paidP2GOrder: OrderRecord = {
  pageId: 'notion-page-1',
  orderId: 'ALPE-order-1',
  paymentMethod: 'cod',
  paymentStatus: 'Paid',
  affiliateId: 'partner-fixed-id',
  paidAmountCents: 4098,
  currency: 'EUR',
  p2gReported: false,
}

function notionRequest(
  payload: unknown,
  signature: string | null = 'valid-signature'
) {
  const headers = new Headers({ 'content-type': 'application/json' })
  if (signature) headers.set('x-notion-signature', signature)

  return new Request('https://alpewear.com/api/webhooks/notion', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })
}

function makeDependencies(order: OrderRecord | null = paidP2GOrder) {
  const verifySignature = jest.fn().mockResolvedValue(true)
  const getOrder = jest.fn().mockResolvedValue(order)
  const reportOrder = jest.fn().mockResolvedValue('sent')
  const recordVerificationToken = jest.fn()

  return {
    verifySignature,
    getOrder,
    reportOrder,
    recordVerificationToken,
    handler: createNotionWebhookHandler({
      verificationToken: 'notion-verification-token',
      affiliateId: 'partner-fixed-id',
      verifySignature,
      getOrder,
      reportOrder,
      recordVerificationToken,
    }),
  }
}

const propertyEvent = {
  type: 'page.properties_updated',
  entity: { id: 'notion-page-1', type: 'page' },
}

test('verifies Notion HMAC-SHA256 signatures against the raw body', async () => {
  const body = '{"type":"page.properties_updated"}'
  const verificationToken = 'notion-verification-token'
  const signature = `sha256=${createHmac('sha256', verificationToken)
    .update(body)
    .digest('hex')}`

  await expect(verifyNotionSignature({
    body,
    signature,
    verificationToken,
  })).resolves.toBe(true)
  await expect(verifyNotionSignature({
    body,
    signature: 'sha256=invalid',
    verificationToken,
  })).resolves.toBe(false)
})

test('does not log a verification payload after the webhook is configured', async () => {
  const setup = makeDependencies()

  const response = await setup.handler(notionRequest(
    { verification_token: 'one-time-token' },
    null
  ))

  expect(response.status).toBe(200)
  expect(setup.verifySignature).not.toHaveBeenCalled()
  expect(setup.recordVerificationToken).not.toHaveBeenCalled()
  expect(setup.getOrder).not.toHaveBeenCalled()
  expect(setup.reportOrder).not.toHaveBeenCalled()
})

test('records the initial verification token during webhook bootstrap', async () => {
  const setup = makeDependencies()
  const handler = createNotionWebhookHandler({
    verificationToken: '',
    affiliateId: 'partner-fixed-id',
    verifySignature: setup.verifySignature,
    getOrder: setup.getOrder,
    reportOrder: setup.reportOrder,
    recordVerificationToken: setup.recordVerificationToken,
  })

  const response = await handler(notionRequest(
    { verification_token: 'one-time-token' },
    null
  ))

  expect(response.status).toBe(200)
  expect(setup.recordVerificationToken).toHaveBeenCalledWith('one-time-token')
})

test('route accepts initial verification before the verification token is configured', async () => {
  delete process.env.NOTION_WEBHOOK_VERIFICATION_TOKEN
  delete process.env.P2G_AFFILIATE_ID
  const { POST } = await import('@/app/api/webhooks/notion/route')

  const response = await POST(notionRequest(
    { verification_token: 'one-time-token' },
    null
  ))

  expect(response.status).toBe(200)
  await expect(response.json()).resolves.toEqual({ received: true })
})

test('rejects order events when the verification token is not configured', async () => {
  const verifySignature = jest.fn().mockResolvedValue(true)
  const getOrder = jest.fn().mockResolvedValue(paidP2GOrder)
  const reportOrder = jest.fn().mockResolvedValue('sent')
  const handler = createNotionWebhookHandler({
    verificationToken: '',
    affiliateId: 'partner-fixed-id',
    verifySignature,
    getOrder,
    reportOrder,
    recordVerificationToken: jest.fn(),
  })

  const response = await handler(notionRequest(propertyEvent))

  expect(response.status).toBe(500)
  expect(verifySignature).not.toHaveBeenCalled()
  expect(getOrder).not.toHaveBeenCalled()
  expect(reportOrder).not.toHaveBeenCalled()
})

test('rejects a missing or invalid Notion signature', async () => {
  const setup = makeDependencies()
  setup.verifySignature.mockResolvedValue(false)

  const response = await setup.handler(notionRequest(propertyEvent))

  expect(response.status).toBe(401)
  expect(setup.getOrder).not.toHaveBeenCalled()
})

test('ignores unrelated Notion event types', async () => {
  const setup = makeDependencies()

  const response = await setup.handler(notionRequest({
    type: 'page.created',
    entity: { id: 'notion-page-1', type: 'page' },
  }))

  expect(response.status).toBe(200)
  expect(setup.getOrder).not.toHaveBeenCalled()
})

test('retrieves and reports a paid P2G COD order', async () => {
  const setup = makeDependencies()

  const response = await setup.handler(notionRequest(propertyEvent))

  expect(response.status).toBe(200)
  expect(setup.getOrder).toHaveBeenCalledWith('notion-page-1')
  expect(setup.reportOrder).toHaveBeenCalledWith(paidP2GOrder)
})

test('retries when Notion briefly returns the pre-payment order state', async () => {
  jest.useFakeTimers()
  const setup = makeDependencies()
  setup.getOrder
    .mockResolvedValueOnce({
      ...paidP2GOrder,
      paymentStatus: 'Awaiting payment',
    })
    .mockResolvedValueOnce(paidP2GOrder)

  try {
    const responsePromise = setup.handler(notionRequest(propertyEvent))
    await jest.runAllTimersAsync()
    const response = await responsePromise

    expect(response.status).toBe(200)
    expect(setup.reportOrder).toHaveBeenCalledWith(paidP2GOrder)
  } finally {
    jest.useRealTimers()
  }
})

test.each([
  { paymentStatus: 'Awaiting payment' as const },
  { paymentMethod: 'card' as const },
  { affiliateId: undefined },
  { affiliateId: 'another-partner' },
])('does not report an ineligible Notion order: %o', async change => {
  const setup = makeDependencies({ ...paidP2GOrder, ...change })

  const response = await setup.handler(notionRequest(propertyEvent))

  expect(response.status).toBe(200)
  expect(setup.reportOrder).not.toHaveBeenCalled()
})
