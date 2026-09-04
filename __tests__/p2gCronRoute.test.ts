/** @jest-environment node */

import { createP2GCronHandler } from '@/lib/orders/p2gCron'
import type { OrderRecord } from '@/lib/orders/notion'

const eligibleOrder: OrderRecord = {
  pageId: 'notion-page-1',
  orderId: 'ALPE-order-1',
  paymentMethod: 'cod',
  paymentStatus: 'Paid',
  affiliateId: 'partner-fixed-id',
  paidAmountCents: 4998,
  currency: 'EUR',
  p2gReported: false,
  paidAt: '2026-07-15T13:00:00.000Z',
}

function cronRequest(secret = 'cron-secret') {
  return new Request('https://alpewear.com/api/cron/p2g', {
    headers: { authorization: `Bearer ${secret}` },
  })
}

function makeDependencies() {
  const listCandidates = jest.fn().mockResolvedValue([eligibleOrder])
  const getOrder = jest.fn().mockResolvedValue(eligibleOrder)
  const reportOrder = jest.fn().mockResolvedValue('sent')
  const logError = jest.fn()
  return {
    listCandidates,
    getOrder,
    reportOrder,
    logError,
    handler: createP2GCronHandler({
      cronSecret: 'cron-secret',
      affiliateId: 'partner-fixed-id',
      now: () => '2026-07-30T13:00:00.000Z',
      listCandidates,
      getOrder,
      reportOrder,
      logError,
    }),
  }
}

test('rejects a missing or incorrect cron secret', async () => {
  const setup = makeDependencies()

  expect((await setup.handler(new Request(
    'https://alpewear.com/api/cron/p2g'
  ))).status).toBe(401)
  expect((await setup.handler(cronRequest('wrong'))).status).toBe(401)
  expect(setup.listCandidates).not.toHaveBeenCalled()
})
test('queries the cutoff, re-reads candidates, and reports eligible orders', async () => {
  const setup = makeDependencies()

  const response = await setup.handler(cronRequest())

  expect(response.status).toBe(200)
  expect(setup.listCandidates).toHaveBeenCalledWith(
    '2026-07-15T13:00:00.000Z',
    'partner-fixed-id'
  )
  expect(setup.getOrder).toHaveBeenCalledWith('notion-page-1')
  expect(setup.reportOrder).toHaveBeenCalledWith(eligibleOrder)
  await expect(response.json()).resolves.toEqual({
    processed: 1,
    sent: 1,
    failed: 0,
    skipped: 0,
  })
})

test('skips a candidate cancelled after the query', async () => {
  const setup = makeDependencies()
  setup.getOrder.mockResolvedValueOnce({
    ...eligibleOrder,
    paymentStatus: 'Cancelled',
  })

  const response = await setup.handler(cronRequest())

  expect(setup.reportOrder).not.toHaveBeenCalled()
  await expect(response.json()).resolves.toMatchObject({ skipped: 1 })
})

test('continues after one order fails without exposing customer data', async () => {
  const setup = makeDependencies()
  const secondOrder = {
    ...eligibleOrder,
    pageId: 'notion-page-2',
    orderId: 'ALPE-order-2',
  }
  setup.listCandidates.mockResolvedValueOnce([eligibleOrder, secondOrder])
  setup.getOrder
    .mockRejectedValueOnce(new Error('Notion unavailable'))
    .mockResolvedValueOnce(secondOrder)

  const response = await setup.handler(cronRequest())

  await expect(response.json()).resolves.toEqual({
    processed: 2,
    sent: 1,
    failed: 1,
    skipped: 0,
  })
  expect(setup.logError).toHaveBeenCalledWith(
    'P2G cron order failed',
    expect.objectContaining({ pageId: 'notion-page-1' })
  )
  expect(JSON.stringify(setup.logError.mock.calls)).not.toContain('customer')
})
