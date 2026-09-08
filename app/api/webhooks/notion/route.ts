import { NextResponse } from 'next/server'
import { verifyNotionSignature } from '@/lib/p2g/notion-webhook'
import { getOrderByPageId, setPaidAtIfMissing } from '@/lib/p2g/notion'

export async function POST(req: Request) {
  const body = await req.text()
  let event: { type?: string; entity?: { type?: string; id?: string } }
  try { event = JSON.parse(body) as typeof event } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  const token = process.env.NOTION_WEBHOOK_VERIFICATION_TOKEN ?? ''
  if (!token) return NextResponse.json({ error: 'Webhook is not configured' }, { status: 500 })
  const signature = req.headers.get('x-notion-signature') ?? ''
  if (!signature || !(await verifyNotionSignature({ body, signature, verificationToken: token }))) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }
  if (event.type !== 'page.properties_updated' || event.entity?.type !== 'page' || !event.entity.id) return NextResponse.json({ received: true })
  try {
    let order = await getOrderByPageId(event.entity.id)
    if (order?.paymentMethod === 'cod' && order.paymentStatus === 'Awaiting payment') {
      await new Promise(resolve => setTimeout(resolve, 750))
      order = await getOrderByPageId(event.entity.id)
    }
    if (order?.paymentMethod === 'cod' && order.paymentStatus === 'Paid' && order.affiliateId === process.env.P2G_AFFILIATE_ID) {
      await setPaidAtIfMissing(order.pageId, new Date().toISOString())
    }
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[Notion webhook] order processing failed', { pageId: event.entity.id, error: error instanceof Error ? error.message : 'Unknown error' })
    return NextResponse.json({ error: 'Order processing failed' }, { status: 500 })
  }
}
