import { NextResponse } from 'next/server'
import { writeOrderToNotion, firePurchase, type OrderRecord } from '@/lib/orders'
import { sendOrderConfirmation, type OrderEmailModel, type OrderEmailRow } from '@/lib/email'
import { notifyAlert } from '@/lib/alerts'
import { signCodOrder } from '@/lib/cod-signature'
import {
  computeCodTotal,
  computeSubtotal,
  computeBundleSaving,
  computeShipping,
  isBulgariaEligible,
  makeCodOrderId,
  COD_FEE,
  type CodProduct,
} from './helpers'

interface CodPayload {
  email: string
  items: CodProduct[]
  shipping: Record<string, string>
  shippingLabel: string
}

export async function POST(req: Request) {
  try {
    const clientIpAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip') ?? undefined
    const clientUserAgent = req.headers.get('user-agent') ?? undefined
    const body = (await req.json()) as CodPayload
    const { email, items, shipping } = body

    if (!items?.length) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    if (!email?.trim() || !shipping?.name?.trim() || !shipping?.phone?.trim() || !shipping?.city?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    // COD is Bulgaria-only — enforced server-side, not just in the UI.
    if (!isBulgariaEligible(shipping.country)) {
      return NextResponse.json({ error: 'Наложен платеж е достъпен само за България' }, { status: 400 })
    }

    // Recompute all money server-side — never trust client-sent prices/fees.
    const subtotal = computeSubtotal(items)            // naive sum (for display)
    const bundleSaving = computeBundleSaving(items)    // automatic multi-pair discount
    const shippingAmount = computeShipping(items)
    const codFee = COD_FEE
    const total = computeCodTotal({ items, shippingAmount, codFee })
    const orderId = makeCodOrderId()

    const itemsText = items.map(i => `${i.name} — ${i.variantLabel} x${i.quantity}`).join(', ')
    const nameParts = (shipping.name ?? '').trim().split(' ')
    const firstName = nameParts[0] ?? ''
    const lastName = nameParts.slice(1).join(' ') || firstName

    const orderRecord: OrderRecord = {
      orderRef: orderId, paymentMethod: 'cod', name: shipping.name ?? '', email,
      phone: shipping.phone ?? '', city: shipping.city ?? '', address: shipping.address ?? '',
      postalCode: shipping.postalCode ?? '', deliveryMethod: shipping.deliveryMethod ?? '',
      courier: shipping.courier ?? '', officeLocation: shipping.officeLocation ?? '',
      courierNote: shipping.courierNote ?? '', itemsText, total,
    }

    // Independent task #1 — Notion
    try {
      await writeOrderToNotion(orderRecord)
    } catch (err) {
      const m = err instanceof Error ? err.message : String(err)
      console.error(`[COD_NOTION_FAIL] ref=${orderId} email=${email} error=${m}`)
      await notifyAlert({ severity: 'error', title: 'COD order Notion write FAILED', body: `COD order placed but not saved to Notion.\n\n**Ref:** \`${orderId}\`\n**Email:** ${email}\n**Total:** €${total}\n**Items:** ${itemsText}\n**Error:** \`${m}\`` })
    }

    // Independent task #2 — confirmation email
    const productRows: OrderEmailRow[] = items.map(i => ({ label: i.name, sublabel: i.variantLabel, amount: +(i.price * i.quantity).toFixed(2) }))
    const emailModel: OrderEmailModel = {
      orderRef: orderId, paymentMethod: 'cod', customerFirstName: firstName || 'клиент',
      productRows, subtotal,
      discount: bundleSaving > 0 ? { code: 'Комплектна отстъпка', amount: bundleSaving } : undefined,
      shippingLabel: body.shippingLabel, shippingAmount, codFee, total,
      deliveryTo: { name: shipping.name ?? '', line: shipping.officeLocation || [shipping.address, shipping.city].filter(Boolean).join(', '), phone: shipping.phone ?? '' },
    }
    try {
      await sendOrderConfirmation(email, emailModel)
    } catch (err) {
      const m = err instanceof Error ? err.message : String(err)
      console.error(`[COD_EMAIL_FAIL] ref=${orderId} email=${email} error=${m}`)
      await notifyAlert({ severity: 'warn', title: 'COD confirmation email FAILED', body: `COD order placed but email not sent.\n\n**Ref:** \`${orderId}\`\n**Email:** ${email}\n**Error:** \`${m}\`` })
    }

    // Independent task #3 — CAPI Purchase (dedupes with browser purchase-cod-{id})
    await firePurchase({
      email, phone: shipping.phone || undefined, firstName, lastName,
      city: shipping.city || undefined, country: shipping.country || undefined, zip: shipping.postalCode || undefined,
      fbp: shipping.fbp || undefined, fbc: shipping.fbc || undefined, clientIpAddress, clientUserAgent,
      value: total, currency: 'EUR', orderId,
      contentIds: items.map(i => i.name), numItems: items.reduce((s, i) => s + i.quantity, 0),
      eventId: `purchase-${orderId}`, sourceUrl: 'https://alpewear.com/checkout/success',
    }, { orderRef: orderId, email, total })

    // Signed so the success page can verify the Purchase wasn't forged via a crafted URL.
    return NextResponse.json({ orderId, value: total, sig: signCodOrder(orderId, String(total)) })
  } catch (err) {
    console.error('COD checkout error:', err)
    return NextResponse.json({ error: 'Order could not be created' }, { status: 500 })
  }
}
