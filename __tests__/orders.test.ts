import { writeOrderToNotion, writeOrderToNotionWithRetry, writePromoOrderToNotion, type OrderRecord } from '@/lib/orders'

jest.mock('@notionhq/client', () => {
  const create = jest.fn().mockResolvedValue({ id: 'page-1' })
  const update = jest.fn().mockResolvedValue({})
  const query = jest.fn().mockResolvedValue({ results: [] })
  const retrieveDataSource = jest.fn().mockRejectedValue(new Error('not a data source'))
  const retrieveDatabase = jest.fn().mockResolvedValue({ data_sources: [{ id: 'orders-data-source' }] })
  return {
    Client: jest.fn(() => ({
      pages: { create, update },
      dataSources: { query, retrieve: retrieveDataSource },
      databases: { retrieve: retrieveDatabase },
    })),
    __create: create,
    __query: query,
    __retrieveDatabase: retrieveDatabase,
  }
})
jest.mock('@/lib/stripe', () => ({ getRequiredEnv: (k: string) => `env-${k}` }))

const base: OrderRecord = {
  orderRef: 'cod-1-AX', paymentMethod: 'cod', name: 'Иван Иванов', email: 'i@x.bg',
  phone: '0888', city: 'София', address: 'ул. 1', postalCode: '1000',
  deliveryMethod: 'Спиди', courier: 'Спиди', officeLocation: 'офис 1', courierNote: '',
  itemsText: 'AMPÉ — 🟠 Вечер · 2 чифта x1', total: 61.29,
}

describe('writeOrderToNotion', () => {
  it('prefixes COD orders with [НАЛОЖЕН ПЛАТЕЖ] in Items', async () => {
    const notion = require('@notionhq/client')
    await writeOrderToNotion(base)
    const props = notion.__create.mock.calls[0][0].properties
    expect(props.Items.rich_text[0].text.content).toContain('[НАЛОЖЕН ПЛАТЕЖ]')
    expect(props.Total.number).toBe(61.29)
    expect(props['Stripe Session'].rich_text[0].text.content).toBe('cod-1-AX')
    expect(props['Payment Status'].status.name).toBe('Awaiting payment')
    expect(props['P2G Reported'].checkbox).toBe(false)
  })

  it('persists P2G attribution without applying a discount', async () => {
    const notion = require('@notionhq/client')
    notion.__create.mockClear()
    await writeOrderToNotion({ ...base, affiliateId: 'VPL5EQ42' })
    const props = notion.__create.mock.calls[0][0].properties
    expect(props['Affiliate ID'].rich_text[0].text.content).toBe('VPL5EQ42')
    expect(props['Referral Source'].select.name).toBe('p2g')
    expect(props.Total.number).toBe(base.total)
  })

  it('does NOT prefix card orders', async () => {
    const notion = require('@notionhq/client')
    notion.__create.mockClear()
    await writeOrderToNotion({ ...base, paymentMethod: 'card', orderRef: 'cs_test' })
    const props = notion.__create.mock.calls[0][0].properties
    expect(props.Items.rich_text[0].text.content).not.toContain('[НАЛОЖЕН ПЛАТЕЖ]')
  })
})

describe('writePromoOrderToNotion', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      NOTION_PROMO_DATABASE_ID: 'default-promo-db',
      NOTION_PROMO_DATABASE_ID_ILIYANA10: 'iliyana-promo-db',
    }
    const notion = require('@notionhq/client')
    notion.__create.mockClear()
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('routes ILIYANA10 promo orders to Iliyana’s dedicated promo database', async () => {
    const notion = require('@notionhq/client')

    await writePromoOrderToNotion({
      promoCode: 'ILIYANA10',
      total: 66.99,
      itemsText: 'AMPÉ Evening x1',
      orderRef: 'cod-iliyana',
    })

    expect(notion.__create.mock.calls[0][0].parent).toEqual({ database_id: 'iliyana-promo-db' })
    expect(notion.__create.mock.calls[0][0].properties['Промо код'].rich_text[0].text.content).toBe('ILIYANA10')
  })

  it('keeps existing promo orders on the default promo database', async () => {
    const notion = require('@notionhq/client')

    await writePromoOrderToNotion({
      promoCode: 'ALETEA10',
      total: 66.99,
      itemsText: 'AMPÉ Evening x1',
      orderRef: 'cod-aletea',
    })

    expect(notion.__create.mock.calls[0][0].parent).toEqual({ database_id: 'default-promo-db' })
  })
})

describe('writeOrderToNotionWithRetry', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    const notion = require('@notionhq/client')
    notion.__create.mockReset()
    notion.__query.mockReset()
    notion.__query.mockResolvedValue({ results: [] })
    notion.__retrieveDatabase.mockReset()
    notion.__retrieveDatabase.mockResolvedValue({ data_sources: [{ id: 'orders-data-source' }] })
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  it('retries a failed save against the same data source and properties', async () => {
    const notion = require('@notionhq/client')
    notion.__create
      .mockRejectedValueOnce(new Error('timeout talking to Notion'))
      .mockResolvedValueOnce({ id: 'page-2' })
    jest.spyOn(console, 'warn').mockImplementation(() => {})

    const pending = writeOrderToNotionWithRetry(base, 3)
    await jest.advanceTimersByTimeAsync(500)
    await pending

    expect(notion.__create).toHaveBeenCalledTimes(2)
    expect(notion.__create.mock.calls[0][0].parent).toEqual({ database_id: 'env-NOTION_DATABASE_ID' })
    expect(notion.__create.mock.calls[1][0].parent).toEqual(notion.__create.mock.calls[0][0].parent)
    const { Date: firstDate, ...firstProps } = notion.__create.mock.calls[0][0].properties
    const { Date: secondDate, ...secondProps } = notion.__create.mock.calls[1][0].properties
    expect(secondProps).toEqual(firstProps)
    expect(firstDate.date.start).toEqual(expect.any(String))
    expect(secondDate.date.start).toEqual(expect.any(String))
    expect(notion.__query).toHaveBeenCalledWith({
      data_source_id: 'orders-data-source',
      filter: { property: 'Stripe Session', rich_text: { equals: base.orderRef } },
      page_size: 1,
    })
    expect(notion.__retrieveDatabase).toHaveBeenCalledWith({ database_id: 'env-NOTION_DATABASE_ID' })
  })

  it('logs an error when every attempt fails', async () => {
    const notion = require('@notionhq/client')
    notion.__create.mockRejectedValue(new Error('503 service_unavailable'))
    const error = jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})

    const pending = writeOrderToNotionWithRetry(base, 2).then(
      () => { throw new Error('expected the Notion retry to fail') },
      (err: unknown) => err,
    )
    await jest.advanceTimersByTimeAsync(500)
    const err = await pending

    expect(err).toBeInstanceOf(Error)
    expect((err as Error).message).toContain('503')
    expect(notion.__create).toHaveBeenCalledTimes(2)
    expect(error).toHaveBeenCalledWith(expect.stringContaining(`[NOTION_RETRY] order not saved ref=${base.orderRef}`))
    expect(error).toHaveBeenCalledWith(expect.stringContaining('503 service_unavailable'))
  })
})
