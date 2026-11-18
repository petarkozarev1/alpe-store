import { Client } from '@notionhq/client'
import { getRequiredEnv } from '@/lib/stripe'
import {
  fallbackInventory,
  STOCK_CODES,
  type InventorySnapshot,
  type StockCode,
  type StockRow,
  type StockStatus,
} from '@/lib/stock'

const CACHE_MS = 60_000
const STATUSES = new Set<StockStatus>(['Очаква се', 'В наличност', 'Изчерпан'])

let cache: { expires: number; snapshot: InventorySnapshot } | null = null

export function clearInventoryCache() {
  cache = null
}

function warn(message: string) {
  console.warn(`[INVENTORY] ${message}`)
}

function notionError(err: unknown) {
  return err instanceof Error ? err.message : String(err)
}

async function resolveDataSourceId(notion: Client, notionId: string) {
  try {
    await notion.dataSources.retrieve({ data_source_id: notionId })
    return notionId
  } catch {
    const database = await notion.databases.retrieve({ database_id: notionId })
    if ('data_sources' in database && database.data_sources[0]?.id) return database.data_sources[0].id
    return notionId
  }
}

function textValue(property: unknown) {
  if (!property || typeof property !== 'object') return ''
  const record = property as { title?: Array<{ plain_text?: string }>; rich_text?: Array<{ plain_text?: string }> }
  const chunks = record.title ?? record.rich_text ?? []
  return chunks.map(chunk => chunk.plain_text ?? '').join('').trim()
}

function numberValue(property: unknown) {
  if (!property || typeof property !== 'object') return null
  const value = (property as { number?: unknown }).number
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function selectValue(property: unknown) {
  if (!property || typeof property !== 'object') return ''
  const name = (property as { select?: { name?: string } | null }).select?.name
  return typeof name === 'string' ? name.trim() : ''
}

function parseRow(page: { id?: string; properties?: Record<string, unknown> }): StockRow | null {
  const properties = page.properties ?? {}
  console.warn('[INVENTORY_DEBUG] properties:', JSON.stringify(properties, null, 2))
  // Find the code from any property that contains "daily" or "evening"
  let code: StockCode | null = null
  for (const prop of Object.values(properties)) {
    const text = textValue(prop).toLowerCase()
    if (text === 'daily' || text === 'evening') {
      code = text
      break
    }
  }
  if (!code) return null
  // Find status from any select property
  let statusName = ''
  for (const prop of Object.values(properties)) {
    const s = selectValue(prop)
    if (s && STATUSES.has(s as StockStatus)) {
      statusName = s
      break
    }
  }
  const status: StockStatus = STATUSES.has(statusName as StockStatus) ? statusName as StockStatus : 'Очаква се'
  // Find stock from any number property
  let stock: number | null = null
  for (const prop of Object.values(properties)) {
    const n = numberValue(prop)
    if (n !== null) {
      stock = n
      break
    }
  }
  return {
    code,
    stock: stock ?? 250,
    status,
    pageId: page.id,
  }
}

async function readInventory(): Promise<InventorySnapshot> {
  const databaseId = process.env.NOTION_INVENTORY_DATABASE_ID?.trim()
  if (!databaseId) {
    warn('NOTION_INVENTORY_DATABASE_ID is missing; treating Daily and Evening as coming soon with stock 250')
    return fallbackInventory()
  }

  try {
    const notion = new Client({ auth: getRequiredEnv('NOTION_API_KEY') })
    const dataSourceId = await resolveDataSourceId(notion, databaseId)
    const response = await notion.dataSources.query({ data_source_id: dataSourceId, page_size: 100 })
    const snapshot = fallbackInventory()
    for (const page of response.results) {
      const row = parseRow(page as { id?: string; properties?: Record<string, unknown> })
      if (row) snapshot[row.code] = row
    }
    for (const code of STOCK_CODES) {
      if (!snapshot[code].pageId) warn(`Notion inventory has no row with code "${code}"; using coming soon`)
    }
    return snapshot
  } catch (err) {
    warn(`Notion stock read failed; treating Daily and Evening as coming soon with stock 250: ${notionError(err)}`)
    return fallbackInventory()
  }
}

export async function getInventory(): Promise<InventorySnapshot> {
  if (cache && cache.expires > Date.now()) return cache.snapshot
  const snapshot = await readInventory()
  cache = { expires: Date.now() + CACHE_MS, snapshot }
  return snapshot
}

export async function decrementInventory(counts: Record<StockCode, number>): Promise<void> {
  try {
    if (counts.daily < 1 && counts.evening < 1) return
    const databaseId = process.env.NOTION_INVENTORY_DATABASE_ID?.trim()
    if (!databaseId) {
      warn('cannot decrement stock because NOTION_INVENTORY_DATABASE_ID is missing')
      return
    }
    clearInventoryCache()
    const snapshot = await getInventory()
    const notion = new Client({ auth: getRequiredEnv('NOTION_API_KEY') })
    for (const code of STOCK_CODES) {
      const pairs = counts[code]
      const row = snapshot[code]
      if (pairs < 1) continue
      if (!row.pageId) {
        warn(`no Notion page for ${code}; stock was not decremented`)
        continue
      }
      const next = Math.max(0, row.stock - pairs)
      await notion.pages.update({
        page_id: row.pageId,
        properties: {
          'Наличност': { number: next },
          ...(next === 0 ? { 'Статус': { select: { name: 'Изчерпан' } } } : {}),
        },
      })
    }
    clearInventoryCache()
  } catch (err) {
    console.error(`[INVENTORY] stock decrement failed: ${notionError(err)}`)
  }
}
