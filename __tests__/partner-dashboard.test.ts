import { getPartnerDashboardAccess, getPartnerDashboardData, parsePartnerOrder } from '@/lib/partner-dashboard'

const notionQuery = jest.fn().mockResolvedValue({ results: [] })

jest.mock('@notionhq/client', () => ({
  Client: jest.fn(() => ({
    dataSources: {
      query: notionQuery,
    },
  })),
}))

jest.mock('@/lib/stripe', () => ({ getRequiredEnv: (k: string) => `env-${k}` }))

describe('partner dashboard access', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      NODE_ENV: 'test',
      PARTNER_DASHBOARD_KEY_ILIYANA: 'secret-key',
      PARTNER_DASHBOARD_KEY_ALETEA: 'aletea-key',
    }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('allows the configured partner key', () => {
    expect(getPartnerDashboardAccess('iliyana', 'secret-key')).toBe(true)
    expect(getPartnerDashboardAccess('aletea', 'aletea-key')).toBe(true)
  })

  it('rejects missing and wrong keys', () => {
    expect(getPartnerDashboardAccess('iliyana', null)).toBe(false)
    expect(getPartnerDashboardAccess('iliyana', 'wrong')).toBe(false)
    expect(getPartnerDashboardAccess('aletea', 'wrong')).toBe(false)
  })
})

describe('partner dashboard data', () => {
  const originalEnv = process.env

  afterEach(() => {
    process.env = originalEnv
    notionQuery.mockReset()
    notionQuery.mockResolvedValue({ results: [] })
  })

  it('returns preview rows locally when no env key or notion database is present', async () => {
    process.env = { ...originalEnv, NODE_ENV: 'development' }
    delete process.env.PARTNER_DASHBOARD_KEY_ILIYANA
    delete process.env.NOTION_PROMO_DATABASE_ID_ILIYANA10

    const data = await getPartnerDashboardData('iliyana', '1234')

    expect(data.status).toBe('authorized')
    if (data.status === 'authorized') {
      expect(data.isPreview).toBe(true)
      expect(data.totalOrders).toBe(2)
      expect(data.totalRevenue).toBe(156.98)
      expect(data.averageOrderValue).toBe(78.49)
    }
  })

  it('uses ALETEA10 preview rows locally with password 1111', async () => {
    process.env = { ...originalEnv, NODE_ENV: 'development' }
    delete process.env.PARTNER_DASHBOARD_KEY_ALETEA
    delete process.env.NOTION_PROMO_DATABASE_ID

    const data = await getPartnerDashboardData('aletea', '1111')

    expect(data.status).toBe('authorized')
    if (data.status === 'authorized') {
      expect(data.partnerName).toBe('ALETEA')
      expect(data.promoCode).toBe('ALETEA10')
      expect(data.isPreview).toBe(true)
      expect(data.totalOrders).toBe(2)
      expect(data.totalRevenue).toBe(111.98)
    }
  })

  it('does not fail the dashboard when Notion cannot be read', async () => {
    process.env = {
      ...originalEnv,
      NODE_ENV: 'production',
      PARTNER_DASHBOARD_KEY_ALETEA: '1111',
      NOTION_PROMO_DATABASE_ID: 'notion-db',
    }
    notionQuery.mockRejectedValueOnce(new Error('notion is unavailable'))

    const data = await getPartnerDashboardData('aletea', '1111')

    expect(data.status).toBe('authorized')
    if (data.status === 'authorized') {
      expect(data.totalOrders).toBe(0)
      expect(data.orders).toEqual([])
    }
  })
})

describe('parsePartnerOrder', () => {
  it('parses the Notion promo database columns', () => {
    const order = parsePartnerOrder({
      properties: {
        Name: { title: [{ plain_text: 'cod-123' }] },
        '\u041f\u0440\u043e\u043c\u043e \u043a\u043e\u0434': { rich_text: [{ plain_text: 'ILIYANA10' }] },
        '\u0421\u0443\u043c\u0430': { number: 66.99 },
        '\u0410\u0440\u0442\u0438\u043a\u0443\u043b\u0438': { rich_text: [{ plain_text: 'ALPE Daily x1' }] },
        '\u0414\u0430\u0442\u0430': { date: { start: '2026-06-15T10:00:00.000Z' } },
      },
    }, 'ILIYANA10')

    expect(order).toEqual({
      orderRef: 'cod-123',
      promoCode: 'ILIYANA10',
      total: 66.99,
      items: 'ALPE Daily x1',
      date: '2026-06-15T10:00:00.000Z',
    })
  })
})
