/** @jest-environment node */

import {
  buildP2GPostbackUrl,
  createP2GReporter,
} from '@/lib/orders/p2g'
import type { OrderRecord } from '@/lib/orders/notion'

const paidOrder: OrderRecord = {
  pageId: 'notion-page-1',
  orderId: 'ALPE order & 1',
  paymentMethod: 'cod',
  paymentStatus: 'Paid',
  affiliateId: 'partner-fixed-id',
  paidAmountCents: 4098,
  currency: 'EUR',
  p2gReported: false,
}

function makeReporter(overrides: Partial<{
  fetchPostback: jest.Mock
  markReported: jest.Mock
}> = {}) {
  const fetchPostback = overrides.fetchPostback ??
    jest.fn().mockResolvedValue({ ok: true, status: 200 })
  const markReported = overrides.markReported ??
    jest.fn().mockResolvedValue(undefined)

  return {
    fetchPostback,
    markReported,
    report: createP2GReporter({
      affiliateId: 'partner-fixed-id',
      postbackUrl:
        'https://p2g-uat.epixel.link/en/api/postback/player-deposit/',
      fetchPostback,
      markReported,
      now: () => '2026-07-30T13:00:00.000Z',
      logError: jest.fn(),
    }),
  }
}

test('builds an encoded postback URL with full amount and ALPE', () => {
  const url = buildP2GPostbackUrl(
    paidOrder,
    'https://p2g-uat.epixel.link/en/api/postback/player-deposit/'
  )

  expect(url.toString()).toBe(
    'https://p2g-uat.epixel.link/en/api/postback/player-deposit/' +
    '?customer_id=ALPE+order+%26+1&deposit=40.98&brand=ALPE'
  )
})

test.each([
  { paymentStatus: 'Awaiting payment' as const },
  { affiliateId: undefined },
  { affiliateId: 'another-partner' },
  { paidAmountCents: 0 },
  { p2gReported: true },
])('skips an ineligible order: %o', async (change) => {
  const { report, fetchPostback, markReported } = makeReporter()

  await expect(report({ ...paidOrder, ...change })).resolves.toBe('skipped')
  expect(fetchPostback).not.toHaveBeenCalled()
  expect(markReported).not.toHaveBeenCalled()
})

test('marks Notion reported only after a successful GET', async () => {
  const { report, fetchPostback, markReported } = makeReporter()

  await expect(report(paidOrder)).resolves.toBe('sent')
  expect(fetchPostback).toHaveBeenCalledWith(
    expect.any(URL),
    expect.objectContaining({
      method: 'GET',
      cache: 'no-store',
    })
  )
  expect(fetchPostback.mock.calls[0][1]).not.toHaveProperty('body')
  expect(markReported).toHaveBeenCalledWith(
    'notion-page-1',
    '2026-07-30T13:00:00.000Z'
  )
})

test('leaves a non-2xx request retryable', async () => {
  const fetchPostback = jest.fn().mockResolvedValue({
    ok: false,
    status: 503,
  })
  const { report, markReported } = makeReporter({ fetchPostback })

  await expect(report(paidOrder)).resolves.toBe('failed')
  expect(markReported).not.toHaveBeenCalled()
})

test('leaves a network failure retryable', async () => {
  const fetchPostback = jest.fn().mockRejectedValue(new Error('timeout'))
  const { report, markReported } = makeReporter({ fetchPostback })

  await expect(report(paidOrder)).resolves.toBe('failed')
  expect(markReported).not.toHaveBeenCalled()
})
