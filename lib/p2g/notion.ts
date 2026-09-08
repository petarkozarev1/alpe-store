import { Client } from '@notionhq/client'
import { getRequiredEnv } from '@/lib/stripe'
import type { P2GOrder, P2GPaymentStatus } from './types'

type Props = Record<string, unknown>
const record = (value: unknown): Record<string, unknown> => value && typeof value === 'object' ? value as Record<string, unknown> : {}
const text = (p: Props, key: string) => {
  const values = record(p[key]).rich_text
  return Array.isArray(values) ? values.map(value => {
    const item = record(value)
    return typeof item.plain_text === 'string' ? item.plain_text : String(record(item.text).content ?? '')
  }).join('') : ''
}
const selected = (p: Props, key: string, type: 'select' | 'status') => String(record(record(p[key])[type]).name ?? '')

function parse(page: { id: string; properties?: unknown }): P2GOrder | null {
  const p = record(page.properties)
  const orderId = text(p, 'Order ID') || text(p, 'Stripe Session')
  const method = selected(p, 'Payment Method', 'select')
  const status = selected(p, 'Payment Status', 'status') as P2GPaymentStatus
  if (!orderId || !['Card', 'Cash on delivery'].includes(method) || !['Awaiting payment', 'Paid', 'Cancelled'].includes(status)) return null
  return {
    pageId: page.id, orderId, paymentMethod: method === 'Card' ? 'card' : 'cod',
    paymentStatus: status, affiliateId: text(p, 'Affiliate ID') || undefined,
    paidAmountCents: Math.round(Number(record(p['Paid Amount']).number ?? record(p.Total).number ?? 0) * 100),
    p2gReported: record(p['P2G Reported']).checkbox === true,
    paidAt: typeof record(record(p['Paid At']).date).start === 'string' ? record(record(p['Paid At']).date).start as string : undefined,
  }
}

function repo() {
  const client = new Client({ auth: getRequiredEnv('NOTION_API_KEY') })
  const dataSourceId = getRequiredEnv('NOTION_DATA_SOURCE_ID')
  return { client, dataSourceId }
}

export async function getOrderByPageId(pageId: string) {
  const { client } = repo()
  return parse(await client.pages.retrieve({ page_id: pageId }))
}

export async function setPaidAtIfMissing(pageId: string, paidAt: string) {
  const order = await getOrderByPageId(pageId)
  if (!order || order.paidAt) return order
  const { client } = repo()
  await client.pages.update({ page_id: pageId, properties: { 'Paid At': { date: { start: paidAt } } } })
  return { ...order, paidAt }
}

export async function listP2GCandidates(cutoff: string, affiliateId: string) {
  const { client, dataSourceId } = repo()
  const orders: P2GOrder[] = []
  let cursor: string | undefined
  do {
    const result = await client.dataSources.query({
      data_source_id: dataSourceId,
      filter: { and: [
        { property: 'Payment Status', status: { equals: 'Paid' } },
        { property: 'Affiliate ID', rich_text: { equals: affiliateId } },
        { property: 'P2G Reported', checkbox: { equals: false } },
        { property: 'Paid At', date: { on_or_before: cutoff } },
      ] }, page_size: 100, ...(cursor ? { start_cursor: cursor } : {}),
    })
    for (const item of result.results) { const order = parse(item); if (order) orders.push(order) }
    cursor = result.has_more ? result.next_cursor ?? undefined : undefined
  } while (cursor)
  return orders
}

export async function markP2GReported(pageId: string, reportedAt: string) {
  const { client } = repo()
  await client.pages.update({ page_id: pageId, properties: {
    'P2G Reported': { checkbox: true }, 'P2G Reported At': { date: { start: reportedAt } },
  } })
}
