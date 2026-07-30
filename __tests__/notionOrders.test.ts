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

  test('parses a page from the configured data source', async () => {
    const client = makeClient()
    client.pages.retrieve.mockResolvedValueOnce({
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
        'Paid Amount': { id: 'amount', type: 'number', number: 40.98 },
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
      },
    })
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
      paidAmountCents: 4098,
      currency: 'EUR',
      p2gReported: false,
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
