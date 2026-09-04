import {
  createNotionOrderRepository,
  type NotionOrderClient,
  type OrderInput,
} from '@/lib/orders/notion'

function makeClient() {
  return {
    dataSources: {
      query: jest.fn().mockResolvedValue({
        object: 'list',
        results: [],
        has_more: false,
        next_cursor: null,
        type: 'page_or_data_source',
        page_or_data_source: {},
      }),
    },
    pages: {
      create: jest.fn().mockResolvedValue({ id: 'page-1' }),
      update: jest.fn().mockResolvedValue({ id: 'page-1' }),
      retrieve: jest.fn(),
    },
  }
}

const order: OrderInput = {
  orderId: 'ALPE-order-1',
  paymentMethod: 'cod',
  paymentStatus: 'Awaiting payment',
  affiliateId: 'partner-fixed-id',
  quote: {
    items: [{
      productId: 'ALPÉ-evening',
      variantId: 'ALPÉ-evening-bundle-1',
      quantity: 1,
      name: 'ALPÉ Evening · 1 pair',
      unitAmountCents: 4499,
      pairsPerUnit: 1,
    }],
    subtotalCents: 4499,
    discountCents: 900,
    shippingCents: 499,
    totalCents: 4098,
    totalPairs: 1,
  },
  customer: {
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '+359881234567',
  },
  shipping: {
    city: 'Sofia',
    address: 'Test address 1',
    postalCode: '1000',
    country: 'BG',
    deliveryMethod: 'До адрес',
    courier: '',
    officeLocation: '',
    courierNote: '',
  },
  createdAt: '2026-07-30T12:00:00.000Z',
}

function notionPage(overrides: Record<string, unknown> = {}) {
  return {
    object: 'page',
    id: 'page-1',
    parent: {
      type: 'data_source_id',
      data_source_id: 'orders-data-source',
      database_id: 'orders-database',
    },
    properties: {
      'Order ID': {
        id: 'order',
        type: 'rich_text',
        rich_text: [{ plain_text: 'ALPE-order-1' }],
      },
      'Stripe Session': { id: 'stripe', type: 'rich_text', rich_text: [] },
      'Payment Method': {
        id: 'method',
        type: 'select',
        select: { name: 'Cash on delivery' },
      },
      'Payment Status': {
        id: 'status',
        type: 'status',
        status: { name: 'Paid' },
      },
      'Affiliate ID': {
        id: 'affiliate',
        type: 'rich_text',
        rich_text: [{ plain_text: 'partner-fixed-id' }],
      },
      'Paid Amount': { id: 'amount', type: 'number', number: 49.98 },
      Currency: {
        id: 'currency',
        type: 'select',
        select: { name: 'EUR' },
      },
      'P2G Reported': {
        id: 'reported',
        type: 'checkbox',
        checkbox: false,
      },
      'Paid At': {
        id: 'paid-at',
        type: 'date',
        date: { start: '2026-07-30T13:00:00.000Z' },
      },
      ...overrides,
    },
  }
}

describe('Notion order repository', () => {
  test('creates a COD order with payment and attribution fields', async () => {
    const client = makeClient()
    const repository = createNotionOrderRepository(
      client as unknown as NotionOrderClient,
      'orders-data-source'
    )

    const result = await repository.upsertOrder(order)

    expect(result).toMatchObject({
      pageId: 'page-1',
      orderId: 'ALPE-order-1',
      paymentMethod: 'cod',
      paymentStatus: 'Awaiting payment',
      affiliateId: 'partner-fixed-id',
      paidAmountCents: 4098,
      p2gReported: false,
    })
    expect(client.pages.create).toHaveBeenCalledWith(expect.objectContaining({
      parent: {
        type: 'data_source_id',
        data_source_id: 'orders-data-source',
      },
      properties: expect.objectContaining({
        'Order ID': { rich_text: [{ text: { content: 'ALPE-order-1' } }] },
        'Payment Method': { select: { name: 'Cash on delivery' } },
        'Payment Status': { status: { name: 'Awaiting payment' } },
        'Affiliate ID': {
          rich_text: [{ text: { content: 'partner-fixed-id' } }],
        },
        'Paid Amount': { number: 40.98 },
        'P2G Reported': { checkbox: false },
      }),
    }))
  })

  test('updates an existing order instead of creating a duplicate', async () => {
    const client = makeClient()
    client.dataSources.query.mockResolvedValueOnce({
      object: 'list',
      results: [{ id: 'existing-page' }],
      has_more: false,
      next_cursor: null,
      type: 'page_or_data_source',
      page_or_data_source: {},
    })
    const repository = createNotionOrderRepository(
      client as unknown as NotionOrderClient,
      'orders-data-source'
    )

    await repository.upsertOrder({ ...order, paymentStatus: 'Paid' })

    expect(client.pages.create).not.toHaveBeenCalled()
    expect(client.pages.update).toHaveBeenCalledWith(expect.objectContaining({
      page_id: 'existing-page',
      properties: expect.objectContaining({
        'Payment Status': { status: { name: 'Paid' } },
      }),
    }))
  })

  test('stores Paid At when a paid card order is first created', async () => {
    const client = makeClient()
    const repository = createNotionOrderRepository(
      client as unknown as NotionOrderClient,
      'orders-data-source'
    )

    await repository.upsertOrder({
      ...order,
      paymentMethod: 'card',
      paymentStatus: 'Paid',
      paidAt: '2026-07-30T13:00:00.000Z',
    })

    expect(client.pages.create).toHaveBeenCalledWith(expect.objectContaining({
      properties: expect.objectContaining({
        'Paid At': { date: { start: '2026-07-30T13:00:00.000Z' } },
      }),
    }))
  })

  test('parses a page from the configured data source', async () => {
    const client = makeClient()
    client.pages.retrieve.mockResolvedValueOnce(notionPage())
    const repository = createNotionOrderRepository(
      client as unknown as NotionOrderClient,
      'orders-data-source'
    )

    await expect(repository.getOrderByPageId('page-1')).resolves.toEqual({
      pageId: 'page-1',
      orderId: 'ALPE-order-1',
      stripeSessionId: undefined,
      paymentMethod: 'cod',
      paymentStatus: 'Paid',
      affiliateId: 'partner-fixed-id',
      paidAmountCents: 4998,
      currency: 'EUR',
      p2gReported: false,
      paidAt: '2026-07-30T13:00:00.000Z',
    })
  })

  test('sets Paid At once when the field is missing', async () => {
    const client = makeClient()
    client.pages.retrieve.mockResolvedValueOnce(notionPage({
      'Paid At': { id: 'paid-at', type: 'date', date: null },
    }))
    const repository = createNotionOrderRepository(
      client as unknown as NotionOrderClient,
      'orders-data-source'
    )

    const result = await repository.setPaidAtIfMissing(
      'page-1',
      '2026-08-01T09:00:00.000Z'
    )

    expect(client.pages.update).toHaveBeenCalledWith({
      page_id: 'page-1',
      properties: {
        'Paid At': { date: { start: '2026-08-01T09:00:00.000Z' } },
      },
    })
    expect(result?.paidAt).toBe('2026-08-01T09:00:00.000Z')
  })

  test('does not move an existing Paid At timestamp', async () => {
    const client = makeClient()
    client.pages.retrieve.mockResolvedValueOnce(notionPage())
    const repository = createNotionOrderRepository(
      client as unknown as NotionOrderClient,
      'orders-data-source'
    )

    const result = await repository.setPaidAtIfMissing(
      'page-1',
      '2026-08-02T09:00:00.000Z'
    )

    expect(client.pages.update).not.toHaveBeenCalled()
    expect(result?.paidAt).toBe('2026-07-30T13:00:00.000Z')
  })

  test('queries and parses eligible P2G candidates', async () => {
    const client = makeClient()
    client.dataSources.query.mockResolvedValueOnce({
      object: 'list',
      results: [{ id: 'page-1' }],
      has_more: false,
      next_cursor: null,
      type: 'page_or_data_source',
      page_or_data_source: {},
    })
    client.pages.retrieve.mockResolvedValueOnce(notionPage())
    const repository = createNotionOrderRepository(
      client as unknown as NotionOrderClient,
      'orders-data-source'
    )

    await expect(repository.listP2GCandidates(
      '2026-08-14T13:00:00.000Z',
      'partner-fixed-id'
    )).resolves.toEqual([expect.objectContaining({ pageId: 'page-1' })])
    expect(client.dataSources.query).toHaveBeenCalledWith({
      data_source_id: 'orders-data-source',
      filter: {
        and: [
          { property: 'Payment Status', status: { equals: 'Paid' } },
          { property: 'Affiliate ID', rich_text: { equals: 'partner-fixed-id' } },
          { property: 'P2G Reported', checkbox: { equals: false } },
          { property: 'Paid At', date: { on_or_before: '2026-08-14T13:00:00.000Z' } },
        ],
      },
      page_size: 100,
    })
  })

  test('rejects a page outside the configured data source', async () => {
    const client = makeClient()
    client.pages.retrieve.mockResolvedValueOnce({
      object: 'page',
      id: 'foreign-page',
      parent: {
        type: 'data_source_id',
        data_source_id: 'foreign-data-source',
        database_id: 'foreign-database',
      },
      properties: {},
    })
    const repository = createNotionOrderRepository(
      client as unknown as NotionOrderClient,
      'orders-data-source'
    )

    await expect(repository.getOrderByPageId('foreign-page')).resolves.toBeNull()
  })

  test('marks a successful P2G report with its timestamp', async () => {
    const client = makeClient()
    const repository = createNotionOrderRepository(
      client as unknown as NotionOrderClient,
      'orders-data-source'
    )

    await repository.markP2GReported('page-1', '2026-07-30T13:00:00.000Z')

    expect(client.pages.update).toHaveBeenCalledWith({
      page_id: 'page-1',
      properties: {
        'P2G Reported': { checkbox: true },
        'P2G Reported At': {
          date: { start: '2026-07-30T13:00:00.000Z' },
        },
      },
    })
  })
})
