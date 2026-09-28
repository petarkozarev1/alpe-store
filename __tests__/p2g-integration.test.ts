import { getP2GAttribution, isConfiguredP2GSource } from '@/lib/p2g/attribution'
import { buildP2GPostbackUrl, isP2GEligible } from '@/lib/p2g/reporter'
import { verifyNotionSignature } from '@/lib/p2g/notion-webhook'
import { createHmac } from 'crypto'

const order = {
  pageId: 'page-1', orderId: 'order-1', paymentMethod: 'cod' as const,
  paymentStatus: 'Paid' as const, affiliateId: 'VPL5EQ42', paidAmountCents: 4499,
  p2gReported: false, paidAt: '2026-08-01T00:00:00.000Z',
}

describe('P2G attribution', () => {
  it('accepts only the configured affiliate identifier', () => {
    expect(isConfiguredP2GSource('VPL5EQ42', 'VPL5EQ42')).toBe(true)
    expect(isConfiguredP2GSource('attacker', 'VPL5EQ42')).toBe(false)
    expect(getP2GAttribution('VPL5EQ42', 'VPL5EQ42')).toBe('VPL5EQ42')
  })
})

describe('P2G delayed reporting', () => {
  it('waits a full 15 days and excludes cancelled or reported orders', () => {
    expect(isP2GEligible(order, 'VPL5EQ42', '2026-08-15T23:59:59.999Z')).toBe(false)
    expect(isP2GEligible(order, 'VPL5EQ42', '2026-08-16T00:00:00.000Z')).toBe(true)
    expect(isP2GEligible({ ...order, paymentStatus: 'Cancelled' }, 'VPL5EQ42', '2026-08-20T00:00:00.000Z')).toBe(false)
    expect(isP2GEligible({ ...order, p2gReported: true }, 'VPL5EQ42', '2026-08-20T00:00:00.000Z')).toBe(false)
  })

  it('sends the P2G product id, ftd status, paid payout and alpee brand', () => {
    const url = buildP2GPostbackUrl(order, 'https://example.test/postback')
    expect(url.searchParams.get('customer_id')).toBe('KI3VPAIN')
    expect(url.searchParams.get('status')).toBe('ftd')
    expect(url.searchParams.get('payout')).toBe('44.99')
    expect(url.searchParams.get('brand')).toBe('alpee')
    expect(url.toString()).not.toContain('email')
    expect(url.toString()).not.toContain('name')
  })
})

describe('Notion webhook authentication', () => {
  it('checks the HMAC signature against the raw request body', async () => {
    const body = '{"type":"page.properties_updated"}'
    const token = 'secret'
    const signature = `sha256=${createHmac('sha256', token).update(body).digest('hex')}`
    expect(await verifyNotionSignature({ body, signature, verificationToken: token })).toBe(true)
    expect(await verifyNotionSignature({ body: `${body}x`, signature, verificationToken: token })).toBe(false)
  })
})
