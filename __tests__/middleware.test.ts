/** @jest-environment node */

import { NextRequest } from 'next/server'
import { middleware } from '@/middleware'

const originalAffiliateId = process.env.P2G_AFFILIATE_ID

afterEach(() => {
  if (originalAffiliateId === undefined) {
    delete process.env.P2G_AFFILIATE_ID
  } else {
    process.env.P2G_AFFILIATE_ID = originalAffiliateId
  }
})

test('stores a validated source_id in an HTTP-only 30-day cookie', () => {
  process.env.P2G_AFFILIATE_ID = 'partner-fixed-id'

  const response = middleware(
    new NextRequest('https://alpewear.com/shop?source_id=partner-fixed-id')
  )
  const setCookie = response.headers.get('set-cookie')

  expect(setCookie).toContain('alpe_p2g_source=partner-fixed-id')
  expect(setCookie).toContain('HttpOnly')
  expect(setCookie).toContain('SameSite=lax')
  expect(setCookie).toContain('Max-Age=2592000')
  expect(response.status).toBe(307)
  expect(response.headers.get('location')).toBe('https://alpewear.com/shop')
})

test('does not create a cookie for an unknown source_id', () => {
  process.env.P2G_AFFILIATE_ID = 'partner-fixed-id'

  const response = middleware(
    new NextRequest('https://alpewear.com/shop?source_id=forged-id')
  )

  expect(response.headers.get('set-cookie')).toBeNull()
})

test('does not erase an existing referral when source_id is absent', () => {
  process.env.P2G_AFFILIATE_ID = 'partner-fixed-id'
  const request = new NextRequest('https://alpewear.com/checkout', {
    headers: {
      cookie: 'alpe_p2g_source=partner-fixed-id',
    },
  })

  const response = middleware(request)

  expect(response.headers.get('set-cookie')).toBeNull()
})
