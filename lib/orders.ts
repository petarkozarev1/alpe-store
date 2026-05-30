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
}

export async function writeOrderToNotion(order: OrderRecord): Promise<void> {
  const notion = new Client({ auth: getRequiredEnv('NOTION_API_KEY') })
  const databaseId = getRequiredEnv('NOTION_DATABASE_ID')
  const items = order.paymentMethod === 'cod' ? `[НАЛОЖЕН ПЛАТЕЖ] ${order.itemsText}` : order.itemsText

  await notion.pages.create({
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
