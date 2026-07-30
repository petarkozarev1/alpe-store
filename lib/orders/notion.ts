import { Client } from '@notionhq/client'
import { getRequiredEnv } from '@/lib/stripe'
import type {
  OrderQuote,
  OrderStatus,
  PaymentMethod,
} from './types'

export interface OrderCustomer {
  name: string
  email: string
  phone: string
}

export interface OrderShipping {
  city: string
  address: string
  postalCode: string
  country: string
  deliveryMethod: string
  courier: string
  officeLocation: string
  courierNote: string
}

export interface OrderInput {
  orderId: string
  stripeSessionId?: string
  paymentMethod: PaymentMethod
  paymentStatus: OrderStatus
  affiliateId?: string
  quote: OrderQuote
  customer: OrderCustomer
  shipping: OrderShipping
  createdAt?: string
}

export interface OrderRecord {
  pageId: string
  orderId: string
  stripeSessionId?: string
  paymentMethod: PaymentMethod
  paymentStatus: OrderStatus
  affiliateId?: string
  paidAmountCents: number
  currency: 'EUR'
  p2gReported: boolean
}

interface QueryResponse {
  results: Array<{ id: string }>
}

interface PageResponse {
  id: string
  parent?: unknown
  properties?: unknown
}

export interface NotionOrderClient {
  dataSources: {
    query(args: unknown): Promise<QueryResponse>
  }
  pages: {
    create(args: unknown): Promise<{ id: string }>
    update(args: unknown): Promise<{ id: string }>
    retrieve(args: unknown): Promise<PageResponse>
  }
}

function euros(cents: number) {
  return Number((cents / 100).toFixed(2))
}

function paymentMethodName(method: PaymentMethod) {
  return method === 'card' ? 'Card' : 'Cash on delivery'
}

function orderProperties(order: OrderInput): Record<string, unknown> {
  const items = order.quote.items
    .map(item => `${item.name} x${item.quantity}`)
    .join(', ')

  return {
    Name: { title: [{ text: { content: order.customer.name } }] },
    Email: { email: order.customer.email },
    Phone: { phone_number: order.customer.phone },
    City: { rich_text: [{ text: { content: order.shipping.city } }] },
    Address: { rich_text: [{ text: { content: order.shipping.address } }] },
    'Postal Code': {
      rich_text: [{ text: { content: order.shipping.postalCode } }],
    },
    Delivery: {
      rich_text: [{ text: { content: order.shipping.deliveryMethod } }],
    },
    Courier: {
      rich_text: [{ text: { content: order.shipping.courier } }],
    },
    Office: {
      rich_text: [{ text: { content: order.shipping.officeLocation } }],
    },
    'Courier Note': {
      rich_text: [{ text: { content: order.shipping.courierNote } }],
    },
    Items: { rich_text: [{ text: { content: items } }] },
    Total: { number: euros(order.quote.totalCents) },
    Date: { date: { start: order.createdAt ?? new Date().toISOString() } },
    'Stripe Session': {
      rich_text: [{
        text: { content: order.stripeSessionId ?? '' },
      }],
    },
    'Order ID': { rich_text: [{ text: { content: order.orderId } }] },
    'Payment Method': {
      select: { name: paymentMethodName(order.paymentMethod) },
    },
    'Payment Status': { status: { name: order.paymentStatus } },
    'Referral Source': {
      select: order.affiliateId ? { name: 'p2g' } : null,
    },
    'Affiliate ID': {
      rich_text: [{ text: { content: order.affiliateId ?? '' } }],
    },
    Subtotal: { number: euros(order.quote.subtotalCents) },
    Discount: { number: euros(order.quote.discountCents) },
    Shipping: { number: euros(order.quote.shippingCents) },
    'Paid Amount': { number: euros(order.quote.totalCents) },
    Currency: { select: { name: 'EUR' } },
    'P2G Reported': { checkbox: false },
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object'
    ? value as Record<string, unknown>
    : null
}

function richText(properties: Record<string, unknown>, name: string) {
  const property = asRecord(properties[name])
  const values = property?.rich_text
  if (!Array.isArray(values)) return ''
  return values
    .map(value => asRecord(value)?.plain_text)
    .filter((value): value is string => typeof value === 'string')
    .join('')
}

function selectedName(
  properties: Record<string, unknown>,
  propertyName: string,
  type: 'select' | 'status'
) {
  const property = asRecord(properties[propertyName])
  const selected = asRecord(property?.[type])
  return typeof selected?.name === 'string' ? selected.name : ''
}

function numberValue(properties: Record<string, unknown>, name: string) {
  const property = asRecord(properties[name])
  return typeof property?.number === 'number' ? property.number : 0
}

function checkboxValue(properties: Record<string, unknown>, name: string) {
  const property = asRecord(properties[name])
  return property?.checkbox === true
}

function parseOrderPage(
  page: PageResponse,
  dataSourceId: string
): OrderRecord | null {
  const parent = asRecord(page.parent)
  if (
    parent?.type !== 'data_source_id' ||
    parent.data_source_id !== dataSourceId
  ) {
    return null
  }

  const properties = asRecord(page.properties)
  if (!properties) return null

  const orderId = richText(properties, 'Order ID')
  const paymentMethodNameValue = selectedName(
    properties,
    'Payment Method',
    'select'
  )
  const paymentStatus = selectedName(
    properties,
    'Payment Status',
    'status'
  ) as OrderStatus

  if (
    !orderId ||
    !['Card', 'Cash on delivery'].includes(paymentMethodNameValue) ||
    !['Awaiting payment', 'Paid', 'Cancelled'].includes(paymentStatus)
  ) {
    return null
  }

  const stripeSessionId = richText(properties, 'Stripe Session') || undefined
  const affiliateId = richText(properties, 'Affiliate ID') || undefined

  return {
    pageId: page.id,
    orderId,
    stripeSessionId,
    paymentMethod: paymentMethodNameValue === 'Card' ? 'card' : 'cod',
    paymentStatus,
    affiliateId,
    paidAmountCents: Math.round(numberValue(properties, 'Paid Amount') * 100),
    currency: 'EUR',
    p2gReported: checkboxValue(properties, 'P2G Reported'),
  }
}

function recordFromInput(pageId: string, order: OrderInput): OrderRecord {
  return {
    pageId,
    orderId: order.orderId,
    stripeSessionId: order.stripeSessionId,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    affiliateId: order.affiliateId,
    paidAmountCents: order.quote.totalCents,
    currency: 'EUR',
    p2gReported: false,
  }
}

export function createNotionOrderRepository(
  client: NotionOrderClient,
  dataSourceId: string
) {
  return {
    async upsertOrder(order: OrderInput): Promise<OrderRecord> {
      const properties = orderProperties(order)
      const existing = await client.dataSources.query({
        data_source_id: dataSourceId,
        filter: {
          property: 'Order ID',
          rich_text: { equals: order.orderId },
        },
        page_size: 1,
      })
      const existingPage = existing.results[0]

      if (existingPage) {
        await client.pages.update({
          page_id: existingPage.id,
          properties,
        })
        return recordFromInput(existingPage.id, order)
      }

      const page = await client.pages.create({
        parent: {
          type: 'data_source_id',
          data_source_id: dataSourceId,
        },
        properties,
      })
      return recordFromInput(page.id, order)
    },

    async getOrderByPageId(pageId: string): Promise<OrderRecord | null> {
      const page = await client.pages.retrieve({ page_id: pageId })
      return parseOrderPage(page, dataSourceId)
    },

    async markP2GReported(pageId: string, reportedAt: string): Promise<void> {
      await client.pages.update({
        page_id: pageId,
        properties: {
          'P2G Reported': { checkbox: true },
          'P2G Reported At': { date: { start: reportedAt } },
        },
      })
    },
  }
}

function getRepository() {
  const client = new Client({
    auth: getRequiredEnv('NOTION_API_KEY'),
  }) as unknown as NotionOrderClient
  return createNotionOrderRepository(
    client,
    getRequiredEnv('NOTION_DATA_SOURCE_ID')
  )
}

export function createOrUpdateOrder(order: OrderInput) {
  return getRepository().upsertOrder(order)
}

export function getOrderByPageId(pageId: string) {
  return getRepository().getOrderByPageId(pageId)
}

export function markP2GReported(pageId: string, reportedAt: string) {
  return getRepository().markP2GReported(pageId, reportedAt)
}
