/** @jest-environment node */
import { NextRequest } from 'next/server'
import { middleware } from '@/middleware'

describe('locale middleware composition', () => {
  const originalAffiliate = process.env.P2G_AFFILIATE_ID
  afterAll(() => { process.env.P2G_AFFILIATE_ID = originalAffiliate })

  it('captures P2G attribution before locale routing and preserves the destination', () => {
    process.env.P2G_AFFILIATE_ID = 'VPL5EQ42'
    const response = middleware(new NextRequest('https://www.alpewear.com/shop?source_id=VPL5EQ42'))
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('https://www.alpewear.com/shop')
    expect(response.cookies.get('alpe_p2g_source')?.value).toBe('VPL5EQ42')
  })

  it('internally serves Bulgarian at the existing unprefixed URLs', () => {
    const response = middleware(new NextRequest('https://www.alpewear.com/shop'))
    expect(response.headers.get('x-middleware-rewrite')).toBe('https://www.alpewear.com/bg/shop')
  })

  it('serves explicit English URLs without rewriting them', () => {
    const response = middleware(new NextRequest('https://www.alpewear.com/en/shop'))
    expect(response.headers.get('x-middleware-next')).toBe('1')
  })

  it('redirects an explicit Bulgarian prefix to the canonical unprefixed URL', () => {
    const response = middleware(new NextRequest('https://www.alpewear.com/bg/shop?x=1'))
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('https://www.alpewear.com/shop?x=1')
  })

  it('honours a remembered English preference on unprefixed navigation', () => {
    const request = new NextRequest('https://www.alpewear.com/shop', {
      headers: { cookie: 'alpe-locale=en' },
    })
    const response = middleware(request)
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('https://www.alpewear.com/en/shop')
  })
})
