import { writeOrderToNotion, writePromoOrderToNotion, type OrderRecord } from '@/lib/orders'

jest.mock('@notionhq/client', () => {
  const create = jest.fn().mockResolvedValue({})
  return { Client: jest.fn(() => ({ pages: { create } })), __create: create }
})
jest.mock('@/lib/stripe', () => ({ getRequiredEnv: (k: string) => `env-${k}` }))

const base: OrderRecord = {
  orderRef: 'cod-1-AX', paymentMethod: 'cod', name: 'Иван Иванов', email: 'i@x.bg',
  phone: '0888', city: 'София', address: 'ул. 1', postalCode: '1000',
  deliveryMethod: 'Спиди', courier: 'Спиди', officeLocation: 'офис 1', courierNote: '',
  itemsText: 'ALPÉ — 🟠 Вечер · 2 чифта x1', total: 61.29,
}

describe('writeOrderToNotion', () => {
  it('prefixes COD orders with [НАЛОЖЕН ПЛАТЕЖ] in Items', async () => {
    const notion = require('@notionhq/client')
    await writeOrderToNotion(base)
    const props = notion.__create.mock.calls[0][0].properties
    expect(props.Items.rich_text[0].text.content).toContain('[НАЛОЖЕН ПЛАТЕЖ]')
    expect(props.Total.number).toBe(61.29)
    expect(props['Stripe Session'].rich_text[0].text.content).toBe('cod-1-AX')
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
      itemsText: 'ALPÉ Evening x1',
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
      itemsText: 'ALPÉ Evening x1',
      orderRef: 'cod-aletea',
    })

    expect(notion.__create.mock.calls[0][0].parent).toEqual({ database_id: 'default-promo-db' })
  })
})
