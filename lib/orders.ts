import { Client } from '@notionhq/client'
import { sendCAPIEvent, type CAPIOptions } from '@/lib/meta-capi'
import { notifyAlert } from '@/lib/alerts'
import { getRequiredEnv } from '@/lib/stripe'

export interface OrderRecord {
  orderRef: string
  paymentMethod: 'card' | 'cod'
  name: string
  email: string
  phone: string
  city: string
  address: string
  postalCode: string
  deliveryMethod: string
  courier: string
  officeLocation: string
  courierNote: string
  itemsText: string
  total: number
  promoCode?: string
}

export async function writeOrderToNotion(order: OrderRecord): Promise<void> {
  const notion = new Client({ auth: getRequiredEnv('NOTION_API_KEY') })
  const databaseId = getRequiredEnv('NOTION_DATABASE_ID')
  const items = order.paymentMethod === 'cod' ? `[НАЛОЖЕН ПЛАТЕЖ] ${order.itemsText}` : order.itemsText

  const page = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: { title: [{ text: { content: order.name } }] },
      Email: { email: order.email },
      Phone: { phone_number: order.phone },
      City: { rich_text: [{ text: { content: order.city } }] },
      Address: { rich_text: [{ text: { content: order.address } }] },
      'Postal Code': { rich_text: [{ text: { content: order.postalCode } }] },
      Delivery: { rich_text: [{ text: { content: order.deliveryMethod } }] },
      Courier: { rich_text: [{ text: { content: order.courier || order.deliveryMethod } }] },
      Office: { rich_text: [{ text: { content: order.officeLocation } }] },
      'Courier Note': { rich_text: [{ text: { content: order.courierNote } }] },
      Items: { rich_text: [{ text: { content: items } }] },
      Total: { number: order.total },
      Date: { date: { start: new Date().toISOString() } },
      'Stripe Session': { rich_text: [{ text: { content: order.orderRef } }] },
    },
  })

  // Best-effort: stamp the promo code in a separate update so a missing 'Промо код' column can
  // never block the order from saving. Once the column exists, this populates automatically.
  if (order.promoCode) {
    try {
      await notion.pages.update({
        page_id: page.id,
        properties: { 'Промо код': { rich_text: [{ text: { content: order.promoCode } }] } },
      })
    } catch (err) {
      console.warn(`[NOTION] could not set 'Промо код' (add a Text column named "Промо код"): ${err instanceof Error ? err.message : err}`)
    }
  }
}

/**
 * Mirror a promo-code order into a SEPARATE Notion database (NOTION_PROMO_DATABASE_ID) that you
 * can share read-only with the influencer. Contains NO customer PII — only code, total, items,
 * date — so the promoter sees just her sales. No-ops if the env var isn't set; best-effort so it
 * can never block the real order. Database must have columns: Name (title), Промо код (Text),
 * Сума (Number), Артикули (Text), Дата (Date), and the integration must be connected to it.
 */
export async function writePromoOrderToNotion(o: { promoCode: string; total: number; itemsText: string; orderRef: string }): Promise<void> {
  if (!o.promoCode) return
  const promoKey = o.promoCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_')
  const promoDbId = process.env[`NOTION_PROMO_DATABASE_ID_${promoKey}`] || process.env.NOTION_PROMO_DATABASE_ID
  if (!promoDbId) return
  try {
    const notion = new Client({ auth: getRequiredEnv('NOTION_API_KEY') })
    await notion.pages.create({
      parent: { database_id: promoDbId },
      properties: {
        Name: { title: [{ text: { content: o.orderRef } }] },
        'Промо код': { rich_text: [{ text: { content: o.promoCode } }] },
        'Сума': { number: o.total },
        'Артикули': { rich_text: [{ text: { content: o.itemsText } }] },
        'Дата': { date: { start: new Date().toISOString() } },
      },
    })
  } catch (err) {
    console.warn(`[NOTION_PROMO] could not write promo order (check DB columns + integration access): ${err instanceof Error ? err.message : err}`)
  }
}

/** Fires CAPI Purchase with try/catch + alert. Returns true on success. */
export async function firePurchase(opts: CAPIOptions, alertContext: { orderRef: string; email: string; total: number }): Promise<boolean> {
  try {
    await sendCAPIEvent('Purchase', opts)
    return true
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : String(err)
    console.error(`[ORDER_CAPI_FAIL] ref=${alertContext.orderRef} email=${alertContext.email} error=${errMessage}`)
    await notifyAlert({
      severity: 'error',
      title: 'Meta CAPI Purchase FAILED',
      body: `Order succeeded but Meta did not receive Purchase (ad attribution lost).\n\n**Ref:** \`${alertContext.orderRef}\`\n**Email:** ${alertContext.email}\n**Total:** €${alertContext.total}\n**Error:** \`${errMessage}\``,
    })
    return false
  }
}
