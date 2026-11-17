import { clearInventoryCache, decrementInventory, getInventory } from '@/lib/inventory'
import { inventoryMessage, offerButtonText, offerState, type InventorySnapshot } from '@/lib/stock'

const mockQuery = jest.fn()
const mockUpdate = jest.fn()

jest.mock('@notionhq/client', () => ({
  Client: jest.fn(() => ({
    pages: { update: (...args: unknown[]) => mockUpdate(...args) },
    dataSources: {
      query: (...args: unknown[]) => mockQuery(...args),
      retrieve: jest.fn().mockResolvedValue({ id: 'inventory-data-source' }),
    },
    databases: { retrieve: jest.fn() },
  })),
}))
jest.mock('@/lib/stripe', () => ({ getRequiredEnv: (key: string) => `env-${key}` }))

function row(code: 'daily' | 'evening', stock: number, status: string) {
  return {
    id: `page-${code}`,
    properties: {
      Продукт: { title: [{ plain_text: code }] },
      Код: { rich_text: [{ plain_text: code }] },
      Наличност: { number: stock },
      Статус: { select: { name: status } },
    },
  }
}

const comingSoon: InventorySnapshot = {
  daily: { code: 'daily', stock: 250, status: 'Очаква се' },
  evening: { code: 'evening', stock: 250, status: 'Очаква се' },
}

describe('inventory status and button labels', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
    clearInventoryCache()
    mockQuery.mockReset().mockResolvedValue({ results: [] })
    mockUpdate.mockReset().mockResolvedValue({})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    process.env = originalEnv
    jest.restoreAllMocks()
  })

  it('falls back to coming soon with stock 250 when the database id is missing', async () => {
    delete process.env.NOTION_INVENTORY_DATABASE_ID
    await expect(getInventory()).resolves.toEqual(comingSoon)
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('NOTION_INVENTORY_DATABASE_ID is missing'))
  })

  it('falls back when Notion fails and caches the read for 60 seconds', async () => {
    process.env.NOTION_INVENTORY_DATABASE_ID = 'inventory-db'
    mockQuery.mockRejectedValueOnce(new Error('notion down'))
    await expect(getInventory()).resolves.toEqual(comingSoon)
    await getInventory()
    expect(mockQuery).toHaveBeenCalledTimes(1)
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Notion stock read failed'))
  })

  it('reads daily and evening rows from Notion', async () => {
    process.env.NOTION_INVENTORY_DATABASE_ID = 'inventory-db'
    mockQuery.mockResolvedValue({
      results: [row('daily', 12, 'В наличност'), row('evening', 0, 'Изчерпан')],
    })
    const snapshot = await getInventory()
    expect(snapshot.daily).toMatchObject({ stock: 12, status: 'В наличност', pageId: 'page-daily' })
    expect(snapshot.evening).toMatchObject({ stock: 0, status: 'Изчерпан', pageId: 'page-evening' })
  })

  it('labels a single pair and a bundle from the statuses', () => {
    const available: InventorySnapshot = {
      daily: { code: 'daily', stock: 1, status: 'В наличност' },
      evening: { code: 'evening', stock: 4, status: 'В наличност' },
    }
    expect(offerState(available, { daily: 1, evening: 0 })).toBe('available')
    expect(offerButtonText('available', 'bg', 'Добави в количката')).toBe('Добави в количката')
    expect(offerState(available, { daily: 2, evening: 0 })).toBe('sold_out')
    expect(offerButtonText('sold_out', 'en', 'Add')).toBe('Sold out')
    expect(offerButtonText('sold_out', 'bg', 'Add')).toBe('Изчерпан')
    expect(offerState(comingSoon, { daily: 1, evening: 1 })).toBe('coming_soon')
    expect(offerButtonText('coming_soon', 'en', 'Add')).toBe('Coming soon')
    expect(offerButtonText('coming_soon', 'bg', 'Add')).toBe('Очаквайте скоро')
    expect(inventoryMessage(comingSoon, { daily: 1, evening: 0 }, 'bg')).toBe('AMPÉ Daily все още не е в наличност.')
    expect(inventoryMessage(available, { daily: 2, evening: 0 }, 'en')).toBe('There is not enough stock of AMPÉ Daily for this order.')
    expect(inventoryMessage(available, { daily: 1, evening: 1 }, 'bg')).toBeNull()
  })

  it('decrements each pair type and marks a row sold out at zero', async () => {
    process.env.NOTION_INVENTORY_DATABASE_ID = 'inventory-db'
    mockQuery.mockResolvedValue({
      results: [row('daily', 2, 'В наличност'), row('evening', 1, 'В наличност')],
    })
    await decrementInventory({ daily: 2, evening: 1 })
    expect(mockUpdate).toHaveBeenCalledWith({
      page_id: 'page-daily',
      properties: { Наличност: { number: 0 }, Статус: { select: { name: 'Изчерпан' } } },
    })
    expect(mockUpdate).toHaveBeenCalledWith({
      page_id: 'page-evening',
      properties: { Наличност: { number: 0 }, Статус: { select: { name: 'Изчерпан' } } },
    })
  })

  it('logs and does not throw when the stock update fails', async () => {
    process.env.NOTION_INVENTORY_DATABASE_ID = 'inventory-db'
    mockQuery.mockResolvedValue({ results: [row('daily', 4, 'В наличност')] })
    mockUpdate.mockRejectedValue(new Error('write failed'))
    await expect(decrementInventory({ daily: 1, evening: 0 })).resolves.toBeUndefined()
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('stock decrement failed'))
  })
})
