import { Client } from '@notionhq/client'
import { getRequiredEnv } from '@/lib/stripe'

export type PartnerDashboardStatus = 'authorized' | 'unauthorized'

export interface PartnerOrder {
  orderRef: string
  promoCode: string
  total: number
  items: string
  date: string
}

export interface PartnerDashboardData {
  status: 'authorized'
  partnerName: string
  promoCode: string
  orders: PartnerOrder[]
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  isPreview: boolean
  generatedAt: string
}

export interface PartnerDashboardDenied {
  status: 'unauthorized'
  partnerName: string
}

type PartnerDashboardResult = PartnerDashboardData | PartnerDashboardDenied

const PARTNERS = {
  iliyana: {
    name: 'ILIYANA',
    promoCode: 'ILIYANA10',
    keyEnv: 'PARTNER_DASHBOARD_KEY_ILIYANA',
    notionDbEnv: 'NOTION_PROMO_DATABASE_ID_ILIYANA10',
    localPassword: '1234',
  },
  aletea: {
    name: 'ALETEA',
    promoCode: 'ALETEA10',
    keyEnv: 'PARTNER_DASHBOARD_KEY_ALETEA',
    notionDbEnv: 'NOTION_PROMO_DATABASE_ID',
    localPassword: '1111',
  },
} as const

type PartnerSlug = keyof typeof PARTNERS

const PREVIEW_ORDERS: Record<PartnerSlug, PartnerOrder[]> = {
  iliyana: [
    {
      orderRef: 'preview-1001',
      promoCode: 'ILIYANA10',
      total: 66.99,
      items: 'ALPE Daily - 1 chift',
      date: '2026-06-15T09:20:00.000Z',
    },
    {
      orderRef: 'preview-1002',
      promoCode: 'ILIYANA10',
      total: 89.99,
      items: 'ALPE Evening - 3 chifta',
      date: '2026-06-14T18:45:00.000Z',
    },
  ],
  aletea: [
    {
      orderRef: 'preview-2001',
      promoCode: 'ALETEA10',
      total: 66.99,
      items: 'ALPE Daily - 1 chift',
      date: '2026-06-15T11:15:00.000Z',
    },
    {
      orderRef: 'preview-2002',
      promoCode: 'ALETEA10',
      total: 44.99,
      items: 'ALPE Evening - 1 chift',
      date: '2026-06-13T16:30:00.000Z',
    },
  ],
}

const dashboardCache = new Map<string, { expiresAt: number; orders: PartnerOrder[] }>()
const CACHE_TTL_MS = 5 * 60 * 1000

export function getPartnerDashboardAccess(slug: string, key: string | null): boolean {
  if (!isPartnerSlug(slug) || !key) return false
  const partner = PARTNERS[slug]
  const expectedKey = process.env[partner.keyEnv]

  if (!expectedKey && process.env.NODE_ENV !== 'production') {
    return key === partner.localPassword
  }

  return Boolean(expectedKey) && key === expectedKey
}

export async function getPartnerDashboardData(slug: string, key: string | null): Promise<PartnerDashboardResult> {
  if (!isPartnerSlug(slug)) return { status: 'unauthorized', partnerName: 'Partner' }
  const partner = PARTNERS[slug]

  if (!getPartnerDashboardAccess(slug, key)) {
    return { status: 'unauthorized', partnerName: partner.name }
  }

  const hasLocalPreviewAccess = !process.env[partner.keyEnv] && process.env.NODE_ENV !== 'production' && key === partner.localPassword
  const notionDbId = process.env[partner.notionDbEnv]
  const orders = hasLocalPreviewAccess && !notionDbId ? PREVIEW_ORDERS[slug] : await fetchCachedPartnerOrders(slug, notionDbId, partner.promoCode)

  const totalRevenue = roundMoney(orders.reduce((sum, order) => sum + order.total, 0))
  const totalOrders = orders.length

  return {
    status: 'authorized',
    partnerName: partner.name,
    promoCode: partner.promoCode,
    orders,
    totalOrders,
    totalRevenue,
    averageOrderValue: totalOrders ? roundMoney(totalRevenue / totalOrders) : 0,
    isPreview: hasLocalPreviewAccess && !notionDbId,
    generatedAt: new Date().toISOString(),
  }
}

async function fetchCachedPartnerOrders(slug: PartnerSlug, databaseId: string | undefined, promoCode: string): Promise<PartnerOrder[]> {
  const cacheKey = `${slug}:${databaseId || 'missing'}`
  const cached = dashboardCache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) return cached.orders

  const orders = await fetchPartnerOrders(databaseId, promoCode)
  dashboardCache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, orders })
  return orders
}

async function fetchPartnerOrders(databaseId: string | undefined, promoCode: string): Promise<PartnerOrder[]> {
  if (!databaseId) return []

  try {
    const notion = new Client({ auth: getRequiredEnv('NOTION_API_KEY') })
    const dataSourceId = await resolveDataSourceId(notion, databaseId)
    if (!dataSourceId) return []

    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      sorts: [{ property: '\u0414\u0430\u0442\u0430', direction: 'descending' }],
      page_size: 100,
    })

    return response.results
      .map((page) => parsePartnerOrder(page, promoCode))
      .filter((order): order is PartnerOrder => Boolean(order))
  } catch (err) {
    console.warn(`[PARTNER_DASHBOARD] could not read Notion orders for ${promoCode}: ${err instanceof Error ? err.message : err}`)
    return []
  }
}

async function resolveDataSourceId(notion: Client, notionId: string): Promise<string | null> {
  try {
    await notion.dataSources.retrieve({ data_source_id: notionId })
    return notionId
  } catch {
    // The env vars historically store Notion database IDs. New Notion API versions query
    // data sources, so resolve a database container to its first data source.
  }

  const database = await notion.databases.retrieve({ database_id: notionId })
  if ('data_sources' in database && database.data_sources[0]?.id) {
    return database.data_sources[0].id
  }
  return null
}

export function parsePartnerOrder(page: unknown, fallbackPromoCode: string): PartnerOrder | null {
  const properties = getProperties(page)
  if (!properties) return null

  const orderRef = readTitle(properties.Name) || readText(properties['Order Ref']) || 'order'
  const promoCode = readText(properties['\u041f\u0440\u043e\u043c\u043e \u043a\u043e\u0434']) || readText(properties['Promo Code']) || fallbackPromoCode
  const total = readNumber(properties['\u0421\u0443\u043c\u0430']) ?? readNumber(properties.Total) ?? 0
  const items = readText(properties['\u0410\u0440\u0442\u0438\u043a\u0443\u043b\u0438']) || readText(properties.Items) || ''
  const date = readDate(properties['\u0414\u0430\u0442\u0430']) || readDate(properties.Date) || ''

  return { orderRef, promoCode, total, items, date }
}

function getProperties(page: unknown): Record<string, unknown> | null {
  if (!page || typeof page !== 'object' || !('properties' in page)) return null
  const properties = (page as { properties?: unknown }).properties
  return properties && typeof properties === 'object' ? properties as Record<string, unknown> : null
}

function readTitle(property: unknown): string {
  const title = readPropertyArray(property, 'title')
  return title.map(readPlainText).join('').trim()
}

function readText(property: unknown): string {
  const richText = readPropertyArray(property, 'rich_text')
  return richText.map(readPlainText).join('').trim()
}

function readNumber(property: unknown): number | null {
  if (!property || typeof property !== 'object' || !('number' in property)) return null
  const value = (property as { number?: unknown }).number
  return typeof value === 'number' ? value : null
}

function readDate(property: unknown): string {
  if (!property || typeof property !== 'object' || !('date' in property)) return ''
  const date = (property as { date?: { start?: unknown } | null }).date
  return typeof date?.start === 'string' ? date.start : ''
}

function readPropertyArray(property: unknown, key: 'title' | 'rich_text'): unknown[] {
  if (!property || typeof property !== 'object' || !(key in property)) return []
  const value = (property as Record<typeof key, unknown>)[key]
  return Array.isArray(value) ? value : []
}

function readPlainText(value: unknown): string {
  if (!value || typeof value !== 'object' || !('plain_text' in value)) return ''
  const text = (value as { plain_text?: unknown }).plain_text
  return typeof text === 'string' ? text : ''
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}

function isPartnerSlug(slug: string): slug is PartnerSlug {
  return slug in PARTNERS
}
