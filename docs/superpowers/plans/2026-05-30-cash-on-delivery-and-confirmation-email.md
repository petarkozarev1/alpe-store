# Cash on Delivery + Order Confirmation Email — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Cash on Delivery (наложен платеж) as a second checkout payment method alongside Stripe card, with a Stripe-free order path, and send one branded Resend confirmation email for BOTH flows — all while preserving Meta Pixel + CAPI Purchase tracking and dedup.

**Architecture:** A new `/api/checkout/cod` route mirrors what the Stripe webhook does (Notion write, CAPI Purchase, confirmation email) but without Stripe, using a `cod-{ts}-{rand}` order id for browser/CAPI dedup (`purchase-cod-{id}`). Shared fulfillment logic (Notion + CAPI + email) is extracted into `lib/orders.ts` so the webhook and COD route do not duplicate it. A unified email template in `lib/email.ts` serves both flows.

**Tech Stack:** Next.js 14 App Router, TypeScript, Stripe, Notion SDK, Meta CAPI (`lib/meta-capi.ts`), Resend, Jest + React Testing Library.

**Verified facts (do not re-derive):**
- Real product data is hardcoded in `components/shop/ProductPage.tsx` (`lensData`): products are `ALPÉ Evening` / `ALPÉ Daily`; bundle pricing `{1: 44.99, 2: 66.99, 3: 89.99}`. `lib/data/products.ts` is DEAD CODE — do not use it.
- Cart item shape (`ProductPage.tsx:101`): `name: "ALPÉ"`, `variantLabel: "🟠 Вечер · N чифт(а)"` or `"🟡 За всеки ден · ..."`, `price: bundlePrices[bundle]`, `variantId: "ALPÉ-{lens}-bundle-{n}"`.
- Cart store `lib/store/cartStore.ts` is in-memory (no persistence). Full-page navigation clears it.
- Existing dedup pattern: browser `PurchasePixelFire` fires `purchase-${orderId}`; webhook CAPI uses `eventId: purchase-${session.id}`.
- Resend domain `alpewear.com` is verified (region eu-west-1). Sender: `ALPÉ <hello@alpewear.com>`. `RESEND_API_KEY` must be set in Vercel (code no-ops without it).
- COD constants: fee €1.00, Bulgaria only, card stays default, no order-value limits.
- Free shipping rule (existing): `totalPairs >= 2 ? 0 : 4.99`.

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `package.json` | add `resend` dependency | Modify |
| `lib/email.ts` | Resend client + `OrderEmailModel` + `buildOrderEmailHtml` + `sendOrderConfirmation` | Create |
| `public/images/logo.png` | ALPÉ Cormorant wordmark for email header | Create (generated) |
| `lib/orders.ts` | shared fulfillment: `writeOrderToNotion`, `firePurchase` (Notion + CAPI, each alerted) | Create |
| `app/api/checkout/route.ts` | card flow — add price-breakdown to Stripe metadata | Modify |
| `app/api/webhooks/stripe/route.ts` | use `lib/orders.ts`; send card confirmation email | Modify |
| `app/api/checkout/cod/route.ts` | COD order path (validate, recompute total, Notion, email, CAPI) | Create |
| `components/checkout/CheckoutPageClient.tsx` | payment-method UI, COD fee, BG gating, branch submit | Modify |
| `app/checkout/success/page.tsx` | COD branch (skip Stripe lookup, fire pixel from query) | Modify |
| `app/terms/page.tsx` | COD legal clause | Modify |

**Shared type (defined in `lib/email.ts`, imported by both routes):**

```typescript
export interface OrderEmailRow {
  label: string        // e.g. "ALPÉ"
  sublabel?: string    // e.g. "🟠 Вечер · 2 чифта"
  amount: number       // line total in EUR
}

export interface OrderEmailModel {
  orderRef: string                      // cod-... or Stripe cs_...
  paymentMethod: 'card' | 'cod'
  customerFirstName: string
  productRows: OrderEmailRow[]
  subtotal: number
  discount?: { code: string; amount: number }
  shippingLabel: string                 // "Спиди" / "До адрес"
  shippingAmount: number                // 0 = free
  codFee?: number                       // present only for COD
  total: number
  deliveryTo: { name: string; line: string; phone: string }
}
```

---

## Task 1: Add Resend + email template

**Files:**
- Modify: `package.json` (add dependency)
- Create: `lib/email.ts`
- Test: `__tests__/email.test.ts`

- [ ] **Step 1: Install resend**

Run: `npm install resend`
Expected: `resend` appears in `package.json` dependencies, no peer-dep errors.

- [ ] **Step 2: Write the failing test**

```typescript
// __tests__/email.test.ts
import { buildOrderEmailHtml, type OrderEmailModel } from '@/lib/email'

const codModel: OrderEmailModel = {
  orderRef: 'cod-1748567640-AX72',
  paymentMethod: 'cod',
  customerFirstName: 'Иван',
  productRows: [{ label: 'ALPÉ', sublabel: '🟠 Вечер · 2 чифта', amount: 66.99 }],
  subtotal: 66.99,
  discount: { code: 'WELCOME10', amount: 6.7 },
  shippingLabel: 'Спиди',
  shippingAmount: 0,
  codFee: 1,
  total: 61.29,
  deliveryTo: { name: 'Иван Иванов', line: 'Спиди офис Сердика, София', phone: '+359 88 123 4567' },
}

describe('buildOrderEmailHtml', () => {
  it('renders product rows, discount, COD fee and total', () => {
    const html = buildOrderEmailHtml(codModel)
    expect(html).toContain('ALPÉ')
    expect(html).toContain('🟠 Вечер · 2 чифта')
    expect(html).toContain('WELCOME10')
    expect(html).toContain('−€6.70')
    expect(html).toContain('Наложен платеж')
    expect(html).toContain('€61.29')
    expect(html).toContain('119.88 лв.')              // total in BGN
    expect(html).toContain('cod-1748567640-AX72')
    expect(html).toContain('Иван Иванов')
  })

  it('omits the COD-fee row for card orders and shows free shipping', () => {
    const html = buildOrderEmailHtml({ ...codModel, paymentMethod: 'card', codFee: undefined })
    expect(html).not.toContain('Наложен платеж')
    expect(html).toContain('Безплатна')
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- email.test.ts`
Expected: FAIL — `buildOrderEmailHtml` not exported.

- [ ] **Step 4: Implement `lib/email.ts`**

```typescript
import { Resend } from 'resend'

const BGN_RATE = 1.95583
const fmtEUR = (n: number) => `€${n.toFixed(2)}`
const fmtBGN = (n: number) => `${(n * BGN_RATE).toFixed(2)} лв.`
const LOGO_URL = 'https://www.alpewear.com/images/logo.png'

export interface OrderEmailRow { label: string; sublabel?: string; amount: number }
export interface OrderEmailModel {
  orderRef: string
  paymentMethod: 'card' | 'cod'
  customerFirstName: string
  productRows: OrderEmailRow[]
  subtotal: number
  discount?: { code: string; amount: number }
  shippingLabel: string
  shippingAmount: number
  codFee?: number
  total: number
  deliveryTo: { name: string; line: string; phone: string }
}

export function buildOrderEmailHtml(m: OrderEmailModel): string {
  const productRows = m.productRows.map(r => `
    <tr>
      <td style="padding:8px 0; border-bottom:1px solid rgba(155,123,104,0.15);">
        <span style="font-family:Georgia,serif; font-size:15px; color:#2D0E04;">${r.label}</span><br/>
        ${r.sublabel ? `<span style="font-size:12px; color:#9B7B68;">${r.sublabel}</span>` : ''}
      </td>
      <td style="padding:8px 0; border-bottom:1px solid rgba(155,123,104,0.15); text-align:right; font-family:Georgia,serif; font-size:15px; color:#2D0E04; white-space:nowrap;">${fmtEUR(r.amount)}</td>
    </tr>`).join('')

  const summaryRow = (label: string, value: string, color = '#9B7B68', italic = false) => `
    <tr>
      <td style="padding:4px 0; color:${color};">${label}</td>
      <td style="padding:4px 0; text-align:right; color:${color}; ${italic ? 'font-style:italic;' : ''}">${value}</td>
    </tr>`

  const shippingValue = m.shippingAmount === 0 ? 'Безплатна' : fmtEUR(m.shippingAmount)
  const paymentLabel = m.paymentMethod === 'cod'
    ? 'Наложен платеж <span style="font-weight:normal; color:#9B7B68;">— плащаш в брой при доставка</span>'
    : 'Карта <span style="font-weight:normal; color:#9B7B68;">— платено онлайн</span>'

  return `<!DOCTYPE html><html lang="bg"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head>
<body style="margin:0; padding:0; background-color:#FFF0E0; font-family:Arial,Helvetica,sans-serif; color:#7C3018;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF0E0; padding:32px 12px;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#FFFBF5; border-radius:16px; overflow:hidden; border:1px solid rgba(155,123,104,0.18);">
  <tr><td style="background-color:#2D0E04; padding:24px 32px; text-align:center;">
    <img src="${LOGO_URL}" alt="ALPÉ" height="34" style="height:34px; display:inline-block;"/>
  </td></tr>
  <tr><td style="padding:36px 32px 8px 32px; text-align:center;">
    <div style="width:56px; height:56px; line-height:56px; border-radius:50%; background-color:#EDE4D6; color:#C4A266; font-size:28px; margin:0 auto 16px auto;">&#10003;</div>
    <h1 style="font-family:Georgia,serif; font-size:28px; font-weight:bold; color:#2D0E04; margin:0 0 8px 0;">Поръчката е приета!</h1>
    <p style="font-size:14px; line-height:1.6; color:#9B7B68; margin:0;">Благодарим ти, ${m.customerFirstName}. Получихме поръчката ти и я подготвяме.<br/>Изпращаме до 24 часа · доставка 1–3 работни дни.</p>
  </td></tr>
  <tr><td style="padding:20px 32px 4px 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF0E0; border-radius:12px;"><tr>
      <td style="padding:12px 16px; font-size:12px; color:#9B7B68; text-transform:uppercase; letter-spacing:1px;">Номер на поръчка</td>
      <td style="padding:12px 16px; font-size:13px; color:#2D0E04; font-weight:bold; text-align:right;">${m.orderRef}</td>
    </tr></table>
  </td></tr>
  <tr><td style="padding:20px 32px 0 32px;">
    <p style="font-size:11px; color:#9B7B68; text-transform:uppercase; letter-spacing:1.5px; margin:0 0 12px 0;">Твоята поръчка</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${productRows}</table>
  </td></tr>
  <tr><td style="padding:16px 32px 0 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px; color:#9B7B68;">
      ${summaryRow('Междинна сума', fmtEUR(m.subtotal))}
      ${m.discount ? summaryRow(`Отстъпка (${m.discount.code})`, `−${fmtEUR(m.discount.amount)}`, '#2e7d32') : ''}
      ${summaryRow(`Доставка · ${m.shippingLabel}`, shippingValue, '#9B7B68', m.shippingAmount === 0)}
      ${m.codFee ? summaryRow('Наложен платеж', fmtEUR(m.codFee)) : ''}
      <tr>
        <td style="padding:12px 0 0 0; border-top:1px solid rgba(155,123,104,0.25); font-family:Georgia,serif; font-size:18px; font-weight:bold; color:#2D0E04;">Общо</td>
        <td style="padding:12px 0 0 0; border-top:1px solid rgba(155,123,104,0.25); text-align:right; font-family:Georgia,serif; font-size:18px; font-weight:bold; color:#2D0E04;">${fmtEUR(m.total)} <span style="font-size:12px; color:#9B7B68; font-weight:normal;">EUR</span><br/><span style="font-size:11px; color:#9B7B68; font-weight:normal;">${fmtBGN(m.total)}</span></td>
      </tr>
    </table>
  </td></tr>
  <tr><td style="padding:24px 32px 0 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF0E0; border-radius:12px;"><tr><td style="padding:16px 18px;">
      <p style="font-size:11px; color:#9B7B68; text-transform:uppercase; letter-spacing:1.5px; margin:0 0 6px 0;">Начин на плащане</p>
      <p style="font-size:14px; color:#2D0E04; margin:0 0 14px 0; font-weight:bold;">${paymentLabel}</p>
      <p style="font-size:11px; color:#9B7B68; text-transform:uppercase; letter-spacing:1.5px; margin:0 0 6px 0;">Доставка до</p>
      <p style="font-size:14px; color:#2D0E04; line-height:1.6; margin:0;">${m.deliveryTo.name}<br/>${m.deliveryTo.line}<br/>${m.deliveryTo.phone}</p>
    </td></tr></table>
  </td></tr>
  <tr><td style="padding:24px 32px; text-align:center;">
    <p style="font-size:13px; color:#9B7B68; line-height:1.6; margin:0;">Въпроси по поръчката? Пиши ни на<br/><a href="mailto:support@alpe.bg" style="color:#7C3018; text-decoration:underline;">support@alpe.bg</a></p>
  </td></tr>
  <tr><td style="background-color:#2D0E04; padding:24px 32px; text-align:center;">
    <p style="font-size:12px; color:rgba(237,228,214,0.75); line-height:1.7; margin:0;">ALPÉ · Очила за блокиране на синя и зелена светлина<br/><a href="https://www.alpewear.com" style="color:rgba(237,228,214,0.75); text-decoration:underline;">alpewear.com</a></p>
    <p style="font-size:11px; color:rgba(237,228,214,0.45); margin:12px 0 0 0;">Screen All Day. Sleep All Night.</p>
  </td></tr>
</table></td></tr></table></body></html>`
}

export async function sendOrderConfirmation(to: string, model: OrderEmailModel): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) { console.warn('[EMAIL] RESEND_API_KEY not set — skipping'); return }
  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: 'ALPÉ <hello@alpewear.com>',
    to,
    subject: `Поръчката ти е приета — ${model.orderRef}`,
    html: buildOrderEmailHtml(model),
  })
  if (error) throw new Error(`Resend send failed: ${JSON.stringify(error)}`)
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- email.test.ts`
Expected: PASS (both tests).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json lib/email.ts __tests__/email.test.ts
git commit -m "feat(email): add Resend order-confirmation template for both checkout flows"
```

---

## Task 2: Generate the ALPÉ logo PNG

**Files:**
- Create: `public/images/logo.png`
- Create then delete: `app/api/_logogen/route.tsx` (temporary generator)

- [ ] **Step 1: Create the temporary generator route**

```tsx
// app/api/_logogen/route.tsx  (TEMPORARY — deleted in Step 4)
import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'

export async function GET() {
  // Cormorant Garamond TTF (Google Fonts static export). 600 weight, latin-ext for É.
  const fontData = await fetch(
    'https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/CormorantGaramond-SemiBold.ttf'
  ).then(r => r.arrayBuffer())

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2D0E04' }}>
        <div style={{ fontFamily: 'Cormorant', fontSize: 96, fontWeight: 600, color: '#EDE4D6', letterSpacing: 28, paddingLeft: 28 }}>ALPÉ</div>
      </div>
    ),
    { width: 600, height: 180, fonts: [{ name: 'Cormorant', data: fontData, weight: 600, style: 'normal' }] }
  )
}
```

- [ ] **Step 2: Start dev server (if not running) and generate the PNG**

Run:
```bash
cd /e/ALPE/alpe-store && npm run dev   # if not already running on :3000
curl -s http://localhost:3000/api/_logogen -o public/images/logo.png
```
Expected: `public/images/logo.png` is a ~600×180 onyx image with cream "ALPÉ". Verify it opens and looks correct (open the file). If the GitHub font URL 404s, fall back to fetching the Google Fonts CSS2 TTF: request `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600` with header `User-Agent: Mozilla/4.0` to receive a `.ttf` URL, then fetch that.

- [ ] **Step 3: Visually confirm the PNG matches the site wordmark**

Open `public/images/logo.png`. It must read "ALPÉ" in Cormorant serif, cream on onyx, matching the preview header. Regenerate with adjusted `letterSpacing`/`fontSize` if spacing looks off.

- [ ] **Step 4: Delete the temporary route**

```bash
rm app/api/_logogen/route.tsx
```
Expected: generator removed; `public/images/logo.png` remains.

- [ ] **Step 5: Commit**

```bash
git add public/images/logo.png
git commit -m "feat(email): add ALPÉ Cormorant wordmark logo for email header"
```

---

## Task 3: Extract shared fulfillment into `lib/orders.ts`

**Files:**
- Create: `lib/orders.ts`
- Test: `__tests__/orders.test.ts`

This moves the Notion-write and CAPI-Purchase logic out of the webhook so the COD route can reuse it. Behavior must stay identical for the card flow.

- [ ] **Step 1: Write the failing test**

```typescript
// __tests__/orders.test.ts
import { writeOrderToNotion, type OrderRecord } from '@/lib/orders'

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- orders.test.ts`
Expected: FAIL — `lib/orders.ts` does not exist.

- [ ] **Step 3: Implement `lib/orders.ts`**

```typescript
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- orders.test.ts`
Expected: PASS (both tests).

- [ ] **Step 5: Commit**

```bash
git add lib/orders.ts __tests__/orders.test.ts
git commit -m "refactor(orders): extract shared Notion write + CAPI Purchase into lib/orders"
```

---

## Task 4: Stash price breakdown in Stripe metadata (card flow)

**Files:**
- Modify: `app/api/checkout/route.ts`

The webhook needs the breakdown to build the email. The client already computes it; pass it through and store compact numbers in session metadata. **Do not change the existing line-item or CAPI logic.**

- [ ] **Step 1: Extend the request body type and destructure**

In `app/api/checkout/route.ts`, change the body destructure (currently lines 21-25) to also accept an optional `summary`:

```typescript
const {
  items,
  email,
  shipping,
  summary,
}: {
  items: LineItem[]
  email: string
  shipping: Record<string, string>
  summary?: { subtotal: number; discountCode: string; discountAmount: number; shippingAmount: number; shippingLabel: string }
} = await req.json()
```

- [ ] **Step 2: Add summary numbers to session metadata**

In the `stripe.checkout.sessions.create({ ... metadata: { ... } })` call (currently lines 68-72), add the summary fields alongside the existing spread:

```typescript
metadata: {
  ...shipping,
  ...(clientIpAddress ? { clientIpAddress } : {}),
  ...(clientUserAgent ? { clientUserAgent } : {}),
  ...(summary ? {
    subtotal: String(summary.subtotal),
    discountCode: summary.discountCode,
    discountAmount: String(summary.discountAmount),
    shippingAmount: String(summary.shippingAmount),
    shippingLabel: summary.shippingLabel,
  } : {}),
},
```

- [ ] **Step 3: Verify build compiles**

Run: `npm run build`
Expected: compiles with no type errors. (No unit test — this is plumbing verified end-to-end in Task 10.)

- [ ] **Step 4: Commit**

```bash
git add app/api/checkout/route.ts
git commit -m "feat(checkout): stash price breakdown in Stripe metadata for confirmation email"
```

---

## Task 5: Webhook uses lib/orders + sends card confirmation email

**Files:**
- Modify: `app/api/webhooks/stripe/route.ts`

- [ ] **Step 1: Replace inline Notion write with `writeOrderToNotion`**

Replace the Notion `try` block (currently lines 47-81) so it builds an `OrderRecord` and calls the helper, keeping the same alert-on-failure behavior:

```typescript
import { writeOrderToNotion, firePurchase, type OrderRecord } from '@/lib/orders'
import { sendOrderConfirmation, type OrderEmailModel, type OrderEmailRow } from '@/lib/email'
// ...
const orderRecord: OrderRecord = {
  orderRef: session.id,
  paymentMethod: 'card',
  name: meta.name ?? '',
  email: customerEmail,
  phone: meta.phone ?? '',
  city: meta.city ?? '',
  address: meta.address ?? '',
  postalCode: meta.postalCode ?? '',
  deliveryMethod: meta.deliveryMethod ?? '',
  courier: meta.courier ?? '',
  officeLocation: meta.officeLocation ?? '',
  courierNote: meta.courierNote ?? '',
  itemsText: items,
  total,
}

let notionOk = false
try {
  await writeOrderToNotion(orderRecord)
  notionOk = true
  console.log(`[WEBHOOK] Notion row created — session=${session.id}`)
} catch (err) {
  const errMessage = err instanceof Error ? err.message : String(err)
  console.error(`[WEBHOOK_NOTION_FAIL] session=${session.id} email=${customerEmail} error=${errMessage}`)
  await notifyAlert({
    severity: 'error',
    title: 'Notion order write FAILED',
    body: `Customer paid but order not saved to Notion.\n\n**Session:** \`${session.id}\`\n**Email:** ${customerEmail}\n**Total:** €${total}\n**Items:** ${items}\n**Error:** \`${errMessage}\``,
  })
}
```

- [ ] **Step 2: Replace inline CAPI block with `firePurchase`**

Replace the CAPI `try` block (currently lines 88-120) with:

```typescript
const capiOk = await firePurchase({
  email: customerEmail || undefined,
  phone: meta.phone ?? undefined,
  firstName,
  lastName,
  city: meta.city ?? undefined,
  country: meta.country ?? undefined,
  zip: meta.postalCode ?? undefined,
  fbp: meta.fbp ?? undefined,
  fbc: meta.fbc ?? undefined,
  clientIpAddress: meta.clientIpAddress ?? undefined,
  clientUserAgent: meta.clientUserAgent ?? undefined,
  value: total,
  currency: 'EUR',
  orderId: session.id,
  contentIds: lineItems.data.map(i => i.description ?? 'ALPÉ'),
  numItems: lineItems.data.reduce((sum, i) => sum + (i.quantity ?? 1), 0),
  eventId: `purchase-${session.id}`,
  sourceUrl: 'https://alpewear.com/checkout/success',
  eventTime: session.created,
}, { orderRef: session.id, email: customerEmail, total })
```

(`firstName`/`lastName` are already computed above this block — keep them.)

- [ ] **Step 3: Add the card confirmation email (independent task #3)**

After the CAPI block, before the final `console.log`/return, add:

```typescript
// Independent task #3 — confirmation email. Failures must NOT block the 200 response.
const shippingAmount = Number(meta.shippingAmount ?? '0') || 0
const subtotal = Number(meta.subtotal ?? '0') || (total - shippingAmount)
const discountAmount = Number(meta.discountAmount ?? '0') || 0
// Product rows = all Stripe line items except the trailing shipping line (only present when shippingAmount > 0).
const productLineItems = shippingAmount > 0 ? lineItems.data.slice(0, -1) : lineItems.data
const productRows: OrderEmailRow[] = productLineItems.map(li => {
  const [label, sublabel] = (li.description ?? 'ALPÉ').split(' — ')
  return { label, sublabel, amount: (li.amount_total ?? 0) / 100 }
})
const emailModel: OrderEmailModel = {
  orderRef: session.id,
  paymentMethod: 'card',
  customerFirstName: firstName || 'клиент',
  productRows,
  subtotal,
  discount: discountAmount > 0 ? { code: meta.discountCode || 'отстъпка', amount: discountAmount } : undefined,
  shippingLabel: meta.shippingLabel || meta.deliveryMethod || 'Доставка',
  shippingAmount,
  total,
  deliveryTo: {
    name: meta.name ?? '',
    line: meta.officeLocation || [meta.address, meta.city].filter(Boolean).join(', '),
    phone: meta.phone ?? '',
  },
}
let emailOk = false
try {
  if (customerEmail) { await sendOrderConfirmation(customerEmail, emailModel); emailOk = true }
} catch (err) {
  const errMessage = err instanceof Error ? err.message : String(err)
  console.error(`[WEBHOOK_EMAIL_FAIL] session=${session.id} email=${customerEmail} error=${errMessage}`)
  await notifyAlert({
    severity: 'warn',
    title: 'Confirmation email FAILED (card)',
    body: `Order saved but confirmation email not sent.\n\n**Session:** \`${session.id}\`\n**Email:** ${customerEmail}\n**Error:** \`${errMessage}\``,
  })
}

console.log(`[WEBHOOK] Done — session=${session.id} notion=${notionOk} capi=${capiOk} email=${emailOk}`)
return NextResponse.json({ received: true, notion: notionOk, capi: capiOk, email: emailOk })
```

Remove the now-duplicated old final `console.log`/return (currently lines 124-125).

- [ ] **Step 4: Verify build + existing tests**

Run: `npm run build && npm test`
Expected: compiles; all existing tests still pass.

- [ ] **Step 5: Commit**

```bash
git add app/api/webhooks/stripe/route.ts
git commit -m "feat(webhook): use shared orders helper + send card confirmation email"
```

---

## Task 6: COD API route

**Files:**
- Create: `app/api/checkout/cod/route.ts`
- Test: `__tests__/cod-route.test.ts`

- [ ] **Step 1: Write the failing test (total recompute + dedup id)**

```typescript
// __tests__/cod-route.test.ts
import { computeCodTotal, makeCodOrderId } from '@/app/api/checkout/cod/route'

describe('computeCodTotal', () => {
  it('sums products − discount + shipping + COD fee', () => {
    const total = computeCodTotal({
      items: [{ name: 'ALPÉ', variantLabel: '🟠 Вечер · 2 чифта', price: 66.99, quantity: 1, image: '' }],
      discountAmount: 6.7, shippingAmount: 0, codFee: 1,
    })
    expect(total).toBeCloseTo(61.29, 2)
  })
})

describe('makeCodOrderId', () => {
  it('produces a cod- prefixed id', () => {
    expect(makeCodOrderId()).toMatch(/^cod-\d+-[A-Z0-9]{4}$/)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- cod-route.test.ts`
Expected: FAIL — module/exports missing.

- [ ] **Step 3: Implement `app/api/checkout/cod/route.ts`**

```typescript
import { NextResponse } from 'next/server'
import { writeOrderToNotion, firePurchase, type OrderRecord } from '@/lib/orders'
import { sendOrderConfirmation, type OrderEmailModel, type OrderEmailRow } from '@/lib/email'
import { notifyAlert } from '@/lib/alerts'

interface CodProduct { name: string; variantLabel: string; price: number; quantity: number; image?: string }
interface CodPayload {
  email: string
  items: CodProduct[]
  shipping: Record<string, string>
  discountCode?: string
  discountAmount?: number
  shippingAmount: number
  shippingLabel: string
  codFee: number
}

export function computeCodTotal(o: { items: CodProduct[]; discountAmount: number; shippingAmount: number; codFee: number }): number {
  const subtotal = o.items.reduce((s, i) => s + i.price * i.quantity, 0)
  return +(subtotal - o.discountAmount + o.shippingAmount + o.codFee).toFixed(2)
}

export function makeCodOrderId(): string {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `cod-${Date.now()}-${rand}`
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

    const discountAmount = body.discountAmount ?? 0
    const subtotal = +items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)
    const total = computeCodTotal({ items, discountAmount, shippingAmount: body.shippingAmount, codFee: body.codFee })
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
      discount: discountAmount > 0 ? { code: body.discountCode || 'отстъпка', amount: discountAmount } : undefined,
      shippingLabel: body.shippingLabel, shippingAmount: body.shippingAmount, codFee: body.codFee, total,
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

    return NextResponse.json({ orderId, value: total })
  } catch (err) {
    console.error('COD checkout error:', err)
    return NextResponse.json({ error: 'Order could not be created' }, { status: 500 })
  }
}
```

Note: `eventId: purchase-${orderId}` where `orderId = cod-...` produces `purchase-cod-...`, matching the browser pixel's `purchase-${orderId}` in `PurchasePixelFire`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- cod-route.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/api/checkout/cod/route.ts __tests__/cod-route.test.ts
git commit -m "feat(checkout): add Cash on Delivery order route with Notion, email, CAPI"
```

---

## Task 7: Checkout UI — payment method, COD fee, BG gating, branch submit

**Files:**
- Modify: `components/checkout/CheckoutPageClient.tsx`

- [ ] **Step 1: Add COD constant and payment-method state**

Below `DELIVERY_PRICE` (line 9) add:
```typescript
const COD_FEE = 1.0
```
After the `deliveryId` state (around line 42) add:
```typescript
const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card')
```

- [ ] **Step 2: Compute COD eligibility and adjust totals**

After the existing calculations (around line 81), add:
```typescript
const codEligible = deliveryType === 'office' || shipping.country === 'България'
const isCod = paymentMethod === 'cod' && codEligible
const codFee = isCod ? COD_FEE : 0
```
Change the `total` line (line 81) to include the fee:
```typescript
const total = +(afterDiscount + shipping_ + codFee).toFixed(2)
```
Add a guard so an ineligible selection can't persist — after the calc block:
```typescript
if (paymentMethod === 'cod' && !codEligible && paymentMethod !== 'card') {
  // country switched away from BG while COD selected → fall back to card on next render
  setTimeout(() => setPaymentMethod('card'), 0)
}
```

- [ ] **Step 3: Add the payment-method section UI**

Insert a new section after the Delivery section's closing `</div>` (after line 364, before the right column), inside the left column flex container:

```tsx
{/* Payment method */}
<div className="bg-white rounded-2xl border border-stone/15 p-6">
  <div className="flex items-center justify-between mb-5">
    <span className="font-sans text-xs font-semibold text-stone uppercase tracking-widest"><span className="text-stone/40 mr-2">03.</span>Начин на плащане</span>
  </div>
  <div className="flex flex-col gap-3">
    <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-onyx bg-onyx/5' : 'border-stone/20 hover:border-stone/40'}`}>
      <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="accent-onyx" />
      <div className="flex-1">
        <span className="font-sans text-sm font-semibold text-onyx">Карта</span>
        <p className="font-sans text-xs text-stone mt-0.5">Visa · Mastercard · Apple Pay · Google Pay · Revolut</p>
      </div>
    </label>
    {codEligible && (
      <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-onyx bg-onyx/5' : 'border-stone/20 hover:border-stone/40'}`}>
        <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-onyx" />
        <div className="flex-1">
          <span className="font-sans text-sm font-semibold text-onyx">Наложен платеж</span>
          <p className="font-sans text-xs text-stone mt-0.5">Плащаш в брой на куриера при доставка · +€{COD_FEE.toFixed(2)}</p>
        </div>
      </label>
    )}
    {isCod && (
      <p className="font-sans text-[11px] text-stone/60 leading-relaxed">При наложен платеж плащаш в брой при получаване. Такса за услугата: €{COD_FEE.toFixed(2)}.</p>
    )}
  </div>
</div>
```

- [ ] **Step 4: Add the COD fee line to the order summary**

In the totals block, after the Доставка row (after line 436), add:
```tsx
{isCod && (
  <div className="flex justify-between text-stone">
    <span>Наложен платеж</span>
    <span className="text-right">€{COD_FEE.toFixed(2)} <span className="block text-[11px] text-stone/50">{formatBGN(COD_FEE)}</span></span>
  </div>
)}
```

- [ ] **Step 5: Branch the submit handler for COD**

In `handleSubmit`, after the validation passes and `setLoading(true)` (line 120), replace the single card path with a branch. Keep the existing card block exactly as-is for `paymentMethod === 'card'`; add the COD branch:

```typescript
if (isCod) {
  const codProducts = items.map(i => ({
    name: i.name,
    variantLabel: i.variantLabel,
    price: i.price,
    quantity: i.quantity,
    image: i.image.startsWith('/') ? `${process.env.NEXT_PUBLIC_SITE_URL}${i.image}` : i.image,
  }))
  try {
    const res = await fetch('/api/checkout/cod', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: contact.email,
        items: codProducts,
        shipping: checkoutShipping,
        discountCode: applied?.code,
        discountAmount: discount,
        shippingAmount: shipping_,
        shippingLabel: deliveryType === 'address' ? 'До адрес' : delivery.label,
        codFee: COD_FEE,
      }),
    })
    const data = await res.json()
    if (!res.ok || !data.orderId) throw new Error(data.error ?? 'Грешка')
    window.location.href = `/checkout/success?cod=1&order=${encodeURIComponent(data.orderId)}&value=${data.value}`
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Грешка при поръчка')
    setLoading(false)
  }
  return
}
// ...existing card path (POST /api/checkout) unchanged below...
```

Also pass `summary` to the card request body (the existing `/api/checkout` fetch body) so card emails get the breakdown:
```typescript
body: JSON.stringify({
  items: lineItems, email: contact.email, shipping: checkoutShipping,
  summary: { subtotal, discountCode: applied?.code ?? '', discountAmount: discount, shippingAmount: shipping_, shippingLabel: deliveryType === 'address' ? 'До адрес' : delivery.label },
}),
```

- [ ] **Step 6: Make the button + trust block COD-aware**

Change the submit button label (line 491) to:
```tsx
{loading ? (/* unchanged spinner */) : (
  <>{isCod ? 'ПОРЪЧАЙ С НАЛОЖЕН ПЛАТЕЖ' : 'ПОТВЪРДИ ПОРЪЧКА'} <span className="text-lg">→</span></>
)}
```
In the trust block (lines 453-459), when `isCod`, replace the "Сигурно плащане със Stripe" line with:
```tsx
{isCod ? (
  <div className="flex items-center gap-2 font-sans text-[11px] text-stone">
    <span>💵</span><span>Плащаш в брой при доставка · без онлайн плащане</span>
  </div>
) : (/* existing Stripe SSL line */)}
```

- [ ] **Step 7: Verify build + existing cart tests**

Run: `npm run build && npm test -- cartStore.test.ts`
Expected: compiles; cart tests still pass.

- [ ] **Step 8: Commit**

```bash
git add components/checkout/CheckoutPageClient.tsx
git commit -m "feat(checkout): add Cash on Delivery payment method with fee and BG gating"
```

---

## Task 8: Success page — COD branch

**Files:**
- Modify: `app/checkout/success/page.tsx`

- [ ] **Step 1: Handle the `cod` query param**

Change `searchParams` type and logic so COD skips the Stripe lookup:

```typescript
export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; cod?: string; order?: string; value?: string }>
}) {
  const { session_id, cod, order, value } = await searchParams

  let pixelValue = 0
  let pixelOrderId = ''
  const isCod = cod === '1'

  if (isCod) {
    pixelValue = value ? Number(value) : 0
    pixelOrderId = order ?? ''
  } else if (session_id) {
    const session = await getPaidSession(session_id)
    if (session) {
      pixelValue = (session.amount_total ?? 0) / 100
      pixelOrderId = session.id ?? session_id
    }
  }
  // ...render unchanged; PurchasePixelFire fires purchase-${pixelOrderId}
```

`PurchasePixelFire` builds `purchase-${pixelOrderId}` → for COD `purchase-cod-...`, deduping with the route's CAPI event.

- [ ] **Step 2: COD-aware confirmation copy**

In the JSX, make the body paragraph conditional:
```tsx
<p className="font-sans text-base text-stone leading-relaxed">
  {isCod
    ? 'Благодарим ти. Изпратихме ти имейл с потвърждение. Ще се свържем с теб за детайли по доставката — плащаш в брой при получаване.'
    : 'Благодарим ти. Ще получиш имейл с потвърждение и информация за доставката.'}
</p>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: compiles, no type errors.

- [ ] **Step 4: Commit**

```bash
git add app/checkout/success/page.tsx
git commit -m "feat(checkout): COD success branch fires Purchase pixel from query params"
```

---

## Task 9: Terms page — COD clause

**Files:**
- Modify: `app/terms/page.tsx`

- [ ] **Step 1: Read the terms page to find the payment/ordering section**

Run: `grep -n "плащане\|поръчка\|Stripe\|раздел" app/terms/page.tsx` (locate where to insert).

- [ ] **Step 2: Add a COD clause**

Insert a short paragraph in the payment/ordering section (match the file's existing JSX/markup style):
> „Предлагаме плащане с карта (чрез Stripe) и плащане в брой при доставка (наложен платеж). При наложен платеж се начислява такса за услугата в размер на 1,00 €, видима в обобщението на поръчката преди потвърждение. Правото на отказ в рамките на 14 дни и законовата гаранция от 24 месеца важат независимо от избрания начин на плащане."

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: compiles.

- [ ] **Step 4: Commit**

```bash
git add app/terms/page.tsx
git commit -m "docs(terms): add Cash on Delivery clause and fee disclosure"
```

---

## Task 10: End-to-end manual verification

**Files:** none (manual + cleanup)

- [ ] **Step 1: Full test + build**

Run: `npm test && npm run build`
Expected: all tests pass, production build succeeds. Watch for the recurring `FinalCtaSection.tsx` unused-import build break (per CLAUDE.md) — remove the unused `Button` import if it reappears.

- [ ] **Step 2: Dev-server smoke test — card flow unchanged**

Start `npm run dev`. Add a 2-pair Evening bundle, go to checkout, fill fields, keep **Карта**, confirm. Verify redirect to Stripe still works and the order summary has no COD fee.

- [ ] **Step 3: Dev-server smoke test — COD flow**

Add an item, select **Наложен платеж**, confirm: order summary shows **+€1.00** and updated total; submit redirects to `/checkout/success?cod=1&order=cod-...&value=...`; success page shows COD copy. Check the Network tab: `POST /api/checkout/cod` returns `{ orderId, value }`.

- [ ] **Step 4: Verify tracking dedup**

In the browser console / Meta Pixel Helper confirm a `Purchase` fires on the COD success page with the `cod-...` order id. Confirm server logs show the COD route's `[CAPI] Purchase sent`. Both share `event_id = purchase-cod-...` (dedup). Confirm COD email arrived (if `RESEND_API_KEY` is set locally) or that the route logged the skip warning.

- [ ] **Step 5: Verify BG gating**

On checkout, switch delivery to **До адрес** and country to e.g. **Германия** — the COD option must disappear and selection fall back to Карта. Switch back to **България** — COD reappears.

- [ ] **Step 6: Final commit (if any fixups)**

```bash
git add -A
git commit -m "test: verify COD + confirmation email end-to-end"
```

---

## Self-Review (completed)

- **Spec coverage:** COD UI (T7), COD route + Notion/CAPI/email (T6), shared helper (T3), webhook refactor + card email (T5), card metadata (T4), success page (T8), terms (T9), email template (T1), logo (T2). All spec sections covered.
- **Tracking:** COD `eventId = purchase-${orderId}` (orderId `cod-...`) matches browser `PurchasePixelFire` `purchase-${orderId}` → dedup preserved. Card flow CAPI eventId unchanged (`purchase-${session.id}`). Card line-item + CAPI logic untouched except added metadata.
- **Type consistency:** `OrderEmailModel`/`OrderEmailRow` defined in `lib/email.ts`, imported by T5 + T6. `OrderRecord` defined in `lib/orders.ts`, imported by T5 + T6. `computeCodTotal`/`makeCodOrderId` exported from the COD route and used in tests.
- **Risk note:** card product-row reconstruction assumes the shipping line is the last Stripe line item when `shippingAmount > 0` (true — client appends it last). If that ordering ever changes, the card email's product list would include the shipping line; the COD flow is unaffected.
