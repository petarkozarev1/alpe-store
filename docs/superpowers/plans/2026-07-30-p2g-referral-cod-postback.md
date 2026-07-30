# P2G Referral, COD, and Paid-Order Postback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give P2G-referred customers an automatic 20% product discount, support card and cash-on-delivery orders, use Notion for manual COD payment confirmation, and send exactly one P2G postback after payment.

**Architecture:** A server-validated `source_id` cookie carries P2G attribution into checkout. A shared order/pricing layer calculates authoritative totals, a Notion repository stores both Stripe and COD orders, and a shared paid-order reporter handles the P2G callback from either Stripe or a signed Notion property-change webhook.

**Tech Stack:** Next.js 14 App Router, TypeScript, Stripe Checkout, `@notionhq/client` 5.20, Vercel environment variables, Jest 30, React Testing Library

## Global Constraints

- Work only in `C:/ALPE`; never read, edit, or serve a `.Codex/worktrees/` path.
- The brand is `ALPE`; send `brand=ALPE`.
- P2G attribution requires an exact match with server-only `P2G_AFFILIATE_ID`.
- The affiliate ID is fixed per P2G account; use a static UAT value until P2G supplies the production value.
- The P2G discount is 20% of merchandise only; shipping is never discounted.
- The reported deposit is the complete amount collected: discounted merchandise plus applicable shipping.
- Shipping remains free when the existing order contains at least two pairs; otherwise it is EUR 4.99.
- Stripe orders become paid only when Stripe reports `payment_status === "paid"`.
- COD orders begin as `Awaiting payment` and become paid only through Notion.
- Send no personal data to P2G and no request body in the P2G GET postback.
- Do not add a database or queue dependency; use the stable ALPE order ID and P2G's confirmed `customer_id` deduplication contract.
- Preserve all unrelated working-tree changes.

## File Map

- Create `lib/orders/types.ts`: shared checkout, quote, order, and payment types.
- Create `lib/orders/catalog.ts`: authoritative bundle catalog and variant validation.
- Create `lib/orders/pricing.ts`: server-side merchandise, discount, shipping, and total calculation.
- Create `lib/orders/attribution.ts`: affiliate-ID validation and cookie constants.
- Create `lib/orders/notion.ts`: Notion order serialization, retrieval, and updates.
- Create `lib/orders/p2g.ts`: eligibility checks, URL construction, callback, and reported-state update.
- Create `middleware.ts`: capture validated `source_id` into an HTTP-only referral cookie.
- Modify `components/shop/ProductPage.tsx`: consume shared bundle pricing rather than private constants.
- Modify `app/shop/page.tsx`: read referral state and pass the automatic discount state to the shop.
- Modify `components/checkout/CheckoutPageClient.tsx`: submit identifiers instead of prices and add card/COD controls.
- Modify `app/checkout/page.tsx`: pass server-validated P2G state to the checkout client.
- Modify `app/api/checkout/route.ts`: validate and quote orders, create Stripe sessions, or create COD Notion orders.
- Modify `app/api/webhooks/stripe/route.ts`: enforce paid status, upsert the order, and invoke shared reporting.
- Create `app/api/webhooks/notion/route.ts`: verify Notion signatures and react to paid COD status changes.
- Modify `app/checkout/success/page.tsx`: support Stripe and COD success states without declaring COD paid.
- Create focused Jest tests for each server unit and route plus checkout UI behavior.
- Create `.env.example`: document required variable names without secrets.
- Modify `README.md`: document Notion properties, webhook setup, UAT, and production rollout.

---

### Task 1: Authoritative Catalog and Order Pricing

**Files:**
- Create: `lib/orders/types.ts`
- Create: `lib/orders/catalog.ts`
- Create: `lib/orders/pricing.ts`
- Modify: `components/shop/ProductPage.tsx`
- Test: `__tests__/orderPricing.test.ts`

**Interfaces:**
- Produces: `CheckoutItemInput`, `OrderQuote`, `PaymentMethod`, and `OrderStatus`.
- Produces: `BUNDLE_PRICES`, `BUNDLE_SAVINGS`, `resolveCatalogItem(item)`, and `quoteOrder(items, isP2G)`.
- `quoteOrder` returns integer euro cents to avoid floating-point payment errors.

- [ ] **Step 1: Write failing pricing tests**

```ts
import { quoteOrder } from '@/lib/orders/pricing'

test('applies 20 percent to merchandise and adds one-pair shipping', () => {
  expect(quoteOrder([
    { productId: 'ALPÉ-evening', variantId: 'ALPÉ-evening-bundle-1', quantity: 1 },
  ], true)).toMatchObject({
    subtotalCents: 4499,
    discountCents: 900,
    shippingCents: 499,
    totalCents: 4098,
    totalPairs: 1,
  })
})

test('keeps shipping free for a multi-pair bundle', () => {
  expect(quoteOrder([
    { productId: 'ALPÉ-daily', variantId: 'ALPÉ-daily-bundle-2', quantity: 1 },
  ], true)).toMatchObject({
    subtotalCents: 6699,
    discountCents: 1340,
    shippingCents: 0,
    totalCents: 5359,
    totalPairs: 2,
  })
})

test('rejects unknown products, variants, and invalid quantities', () => {
  expect(() => quoteOrder([
    { productId: 'unknown', variantId: 'fake', quantity: 1 },
  ], false)).toThrow('Invalid cart item')
})
```

- [ ] **Step 2: Run the pricing tests and confirm failure**

Run: `npm test -- --runInBand __tests__/orderPricing.test.ts`

Expected: FAIL because `lib/orders/pricing.ts` does not exist.

- [ ] **Step 3: Add shared order types and catalog resolution**

```ts
export interface CheckoutItemInput {
  productId: string
  variantId: string
  quantity: number
}

export type PaymentMethod = 'card' | 'cod'
export type OrderStatus = 'Awaiting payment' | 'Paid' | 'Cancelled'

export interface OrderQuote {
  items: Array<CheckoutItemInput & {
    name: string
    unitAmountCents: number
    pairsPerUnit: number
  }>
  subtotalCents: number
  discountCents: number
  shippingCents: number
  totalCents: number
  totalPairs: number
}
```

Move the existing bundle values `44.99`, `66.99`, and `89.99` into
`BUNDLE_PRICES` as cents (`4499`, `6699`, `8999`). Validate both lens product
IDs and bundle variant IDs, enforce integer quantities from 1 through 10, and
return the canonical display name from the catalog.

- [ ] **Step 4: Implement cent-based quoting**

```ts
export const P2G_DISCOUNT_PERCENT = 20
export const SHIPPING_CENTS = 499

export function quoteOrder(
  items: CheckoutItemInput[],
  isP2G: boolean
): OrderQuote {
  const resolved = items.map(resolveCatalogItem)
  const subtotalCents = resolved.reduce(
    (sum, item) => sum + item.unitAmountCents * item.quantity,
    0
  )
  const totalPairs = resolved.reduce(
    (sum, item) => sum + item.pairsPerUnit * item.quantity,
    0
  )
  const discountCents = isP2G ? Math.round(subtotalCents * 0.2) : 0
  const shippingCents = totalPairs >= 2 ? 0 : SHIPPING_CENTS

  return {
    items: resolved,
    subtotalCents,
    discountCents,
    shippingCents,
    totalCents: subtotalCents - discountCents + shippingCents,
    totalPairs,
  }
}
```

- [ ] **Step 5: Make the product page import shared bundle values**

Replace its private `bundlePrices` and `bundleSavings` constants with imports
from `lib/orders/catalog.ts`, converting cents to euros only for display and
cart state. Preserve the current bundle UI and cart identifiers.

- [ ] **Step 6: Run focused tests and commit**

Run: `npm test -- --runInBand __tests__/orderPricing.test.ts`

Expected: PASS.

```bash
git add lib/orders/types.ts lib/orders/catalog.ts lib/orders/pricing.ts components/shop/ProductPage.tsx __tests__/orderPricing.test.ts
git commit -m "feat: add authoritative order pricing"
```

### Task 2: Fixed Affiliate-ID Attribution

**Files:**
- Create: `lib/orders/attribution.ts`
- Create: `middleware.ts`
- Modify: `app/shop/page.tsx`
- Modify: `components/shop/ProductPage.tsx`
- Modify: `app/checkout/page.tsx`
- Test: `__tests__/attribution.test.ts`
- Test: `__tests__/middleware.test.ts`

**Interfaces:**
- Produces: `P2G_COOKIE_NAME = "alpe_p2g_source"`.
- Produces: `isConfiguredP2GSource(sourceId, configuredId): boolean`.
- Produces: `getP2GAttribution(cookieValue, configuredId): string | null`.
- Shop and checkout receive `isP2G: boolean`.

- [ ] **Step 1: Write failing attribution and middleware tests**

```ts
test('accepts only an exact configured affiliate ID', () => {
  expect(isConfiguredP2GSource('partner-fixed-id', 'partner-fixed-id')).toBe(true)
  expect(isConfiguredP2GSource('PARTNER-FIXED-ID', 'partner-fixed-id')).toBe(false)
  expect(isConfiguredP2GSource('', 'partner-fixed-id')).toBe(false)
})

test('stores a validated source_id in an HTTP-only 30-day cookie', async () => {
  process.env.P2G_AFFILIATE_ID = 'partner-fixed-id'
  const response = middleware(
    new NextRequest('https://alpewear.com/shop?source_id=partner-fixed-id')
  )
  expect(response.cookies.get('alpe_p2g_source')?.value).toBe('partner-fixed-id')
  expect(response.cookies.get('alpe_p2g_source')?.httpOnly).toBe(true)
  expect(response.cookies.get('alpe_p2g_source')?.maxAge).toBe(2_592_000)
})
```

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm test -- --runInBand __tests__/attribution.test.ts __tests__/middleware.test.ts`

Expected: FAIL because the attribution module and middleware do not exist.

- [ ] **Step 3: Implement exact validation and cookie capture**

Use constant-time comparison for equal-length configured IDs. Middleware should
set `httpOnly: true`, `sameSite: "lax"`, `secure` outside development,
`path: "/"`, and `maxAge: 2_592_000`. Unknown or missing IDs must not overwrite
an existing valid cookie.

```ts
export const P2G_COOKIE_NAME = 'alpe_p2g_source'

export function getP2GAttribution(
  cookieValue: string | undefined,
  configuredId: string | undefined
) {
  return isConfiguredP2GSource(cookieValue, configuredId)
    ? configuredId!
    : null
}
```

- [ ] **Step 4: Surface the automatic discount**

Read the HTTP-only cookie in the server `app/shop/page.tsx` and
`app/checkout/page.tsx`, validate it again, and pass `isP2G` to client
components. In the shop purchase panel and checkout summary, show the automatic
20% reduction with Bulgarian copy `P2G отстъпка (20%)`; do not add a promo-code
entry requirement.

- [ ] **Step 5: Run focused tests and commit**

Run: `npm test -- --runInBand __tests__/attribution.test.ts __tests__/middleware.test.ts`

Expected: PASS.

```bash
git add lib/orders/attribution.ts middleware.ts app/shop/page.tsx components/shop/ProductPage.tsx app/checkout/page.tsx __tests__/attribution.test.ts __tests__/middleware.test.ts
git commit -m "feat: capture P2G affiliate attribution"
```

### Task 3: Notion Order Repository

**Files:**
- Create: `lib/orders/notion.ts`
- Test: `__tests__/notionOrders.test.ts`

**Interfaces:**
- Consumes: `OrderQuote`, `PaymentMethod`, and `OrderStatus`.
- Produces: `OrderRecord`.
- Produces: `createOrUpdateOrder(input): Promise<OrderRecord>`.
- Produces: `getOrderByPageId(pageId): Promise<OrderRecord | null>`.
- Produces: `markP2GReported(pageId, reportedAt): Promise<void>`.

- [ ] **Step 1: Write failing repository mapping tests**

Mock `@notionhq/client` and assert that a COD order writes:

```ts
expect(notion.pages.create).toHaveBeenCalledWith(expect.objectContaining({
  properties: expect.objectContaining({
    'Order ID': { rich_text: [{ text: { content: orderId } }] },
    'Payment Method': { select: { name: 'Cash on delivery' } },
    'Payment Status': { status: { name: 'Awaiting payment' } },
    'Affiliate ID': { rich_text: [{ text: { content: 'partner-fixed-id' } }] },
    'Paid Amount': { number: 40.98 },
    'P2G Reported': { checkbox: false },
  }),
}))
```

Also test parsing an existing Notion page and rejecting pages whose parent data
source ID does not match `NOTION_DATA_SOURCE_ID`.

- [ ] **Step 2: Run the repository tests and confirm failure**

Run: `npm test -- --runInBand __tests__/notionOrders.test.ts`

Expected: FAIL because `lib/orders/notion.ts` does not exist.

- [ ] **Step 3: Implement typed Notion serialization and retrieval**

Reuse `NOTION_API_KEY` and add `NOTION_DATA_SOURCE_ID` for the current Notion
API. Preserve the existing customer, delivery, courier, office, note, item,
total, date, and Stripe fields. Add all properties from the approved schema.
Query with `notion.dataSources.query({ data_source_id, filter })` by `Order ID`
before creating so a retried Stripe event updates the existing page instead of
creating a duplicate. Create pages with
`parent: { data_source_id: getRequiredEnv("NOTION_DATA_SOURCE_ID") }`.

Normalize Notion values into:

```ts
export interface OrderRecord {
  pageId: string
  orderId: string
  stripeSessionId?: string
  paymentMethod: 'card' | 'cod'
  paymentStatus: OrderStatus
  affiliateId?: string
  paidAmountCents: number
  currency: 'EUR'
  p2gReported: boolean
}
```

- [ ] **Step 4: Run focused tests and commit**

Run: `npm test -- --runInBand __tests__/notionOrders.test.ts`

Expected: PASS.

```bash
git add lib/orders/notion.ts __tests__/notionOrders.test.ts
git commit -m "feat: add Notion order repository"
```

### Task 4: Card and Cash-on-Delivery Checkout API

**Files:**
- Modify: `app/api/checkout/route.ts`
- Test: `__tests__/checkoutRoute.test.ts`

**Interfaces:**
- Consumes: `quoteOrder`, `getP2GAttribution`, and `createOrUpdateOrder`.
- Accepts: `{ items, email, shipping, paymentMethod }`.
- Returns card: `{ paymentMethod: "card", url, orderId }`.
- Returns COD: `{ paymentMethod: "cod", orderId, url }`.

- [ ] **Step 1: Write failing route tests**

Cover these cases with mocked Stripe, cookies, and Notion:

```ts
test('ignores browser prices and creates Stripe line items from the catalog')
test('applies P2G discount only with the validated referral cookie')
test('creates COD in Notion as Awaiting payment without calling Stripe')
test('rejects malformed quantities and out-of-stock identifiers')
```

The Stripe assertion must verify canonical cent values, an ALPE order ID in
metadata, `affiliateId` only for a valid cookie, and the existing customer and
delivery metadata.

- [ ] **Step 2: Run the route tests and confirm failure**

Run: `npm test -- --runInBand __tests__/checkoutRoute.test.ts`

Expected: FAIL because the current API accepts browser-computed prices and has
no COD path.

- [ ] **Step 3: Implement the authoritative request contract**

Generate `ALPE-${crypto.randomUUID()}` before branching. Read
`alpe_p2g_source` through `cookies()`, validate it against
`P2G_AFFILIATE_ID`, call `quoteOrder`, and reject invalid customer or shipping
data with HTTP 400.

For card, create canonical Stripe line items and one amount-off coupon for the
validated P2G merchandise discount. Include shipping as a canonical line item
when charged. Store `orderId`, `affiliateId`, totals, and delivery data in
Stripe metadata.

For COD, call `createOrUpdateOrder` with `Awaiting payment`, then return:

```ts
return NextResponse.json({
  paymentMethod: 'cod',
  orderId,
  url: `/checkout/success?order_id=${encodeURIComponent(orderId)}&payment=cod`,
})
```

- [ ] **Step 4: Run focused tests and commit**

Run: `npm test -- --runInBand __tests__/checkoutRoute.test.ts`

Expected: PASS.

```bash
git add app/api/checkout/route.ts __tests__/checkoutRoute.test.ts
git commit -m "feat: support secure card and COD checkout"
```

### Task 5: Checkout Payment Controls and Success States

**Files:**
- Modify: `components/checkout/CheckoutPageClient.tsx`
- Modify: `app/checkout/success/page.tsx`
- Test: `__tests__/CheckoutPageClient.test.tsx`
- Test: `__tests__/CheckoutSuccessPage.test.tsx`

**Interfaces:**
- Consumes: `isP2G` from the server checkout page.
- Sends only product ID, variant ID, quantity, payment method, and customer
  delivery data.

- [ ] **Step 1: Write failing UI tests**

```ts
test('shows card and cash-on-delivery payment choices')
test('shows automatic P2G discount without requiring a code')
test('submits identifiers and cod without browser prices')
test('redirects COD orders to the unpaid success state')
test('does not fire PurchasePixelFire for COD')
```

- [ ] **Step 2: Run UI tests and confirm failure**

Run: `npm test -- --runInBand __tests__/CheckoutPageClient.test.tsx __tests__/CheckoutSuccessPage.test.tsx`

Expected: FAIL because payment selection and COD success handling do not exist.

- [ ] **Step 3: Implement payment controls and request cleanup**

Add an accessible segmented choice using radio inputs for `Карта` and
`Наложен платеж`. Keep card selected initially. Replace the current
browser-generated negative discount and shipping line items with:

```ts
items: items.map(({ productId, variantId, quantity }) => ({
  productId,
  variantId,
  quantity,
})),
paymentMethod,
```

Continue showing totals locally for responsiveness, but use the API as the
payment authority. For `isP2G`, show `P2G отстъпка (20%)` automatically and
disable stacking with existing promo codes.

- [ ] **Step 4: Implement separate success semantics**

Keep Stripe session verification for card success. For
`payment=cod&order_id=...`, show that the order was accepted and payment is due
to the courier. Do not render `PurchasePixelFire` with a COD order value.

- [ ] **Step 5: Run focused tests and commit**

Run: `npm test -- --runInBand __tests__/CheckoutPageClient.test.tsx __tests__/CheckoutSuccessPage.test.tsx`

Expected: PASS.

```bash
git add components/checkout/CheckoutPageClient.tsx app/checkout/success/page.tsx __tests__/CheckoutPageClient.test.tsx __tests__/CheckoutSuccessPage.test.tsx
git commit -m "feat: add COD checkout experience"
```

### Task 6: P2G Paid-Order Reporter

**Files:**
- Create: `lib/orders/p2g.ts`
- Test: `__tests__/p2g.test.ts`

**Interfaces:**
- Consumes: `OrderRecord`, `getOrderByPageId`, and `markP2GReported`.
- Produces: `buildP2GPostbackUrl(order): URL`.
- Produces: `reportPaidP2GOrder(order): Promise<"sent" | "skipped" | "failed">`.

- [ ] **Step 1: Write failing reporter tests**

```ts
test('builds a bodyless GET with encoded order ID, full amount, and ALPE')
test('formats EUR cents with exactly two decimal places')
test('skips unpaid, direct, zero-value, and already-reported orders')
test('marks Notion reported only after a 2xx response')
test('leaves a failed request retryable')
```

Use an order ID containing spaces and `&` to prove query encoding. Assert that
`4098` cents becomes `deposit=40.98`.

- [ ] **Step 2: Run reporter tests and confirm failure**

Run: `npm test -- --runInBand __tests__/p2g.test.ts`

Expected: FAIL because `lib/orders/p2g.ts` does not exist.

- [ ] **Step 3: Implement eligibility and postback**

Read `P2G_POSTBACK_URL` and `P2G_AFFILIATE_ID` only on the server. Build the
URL with `URL` and `searchParams`, set `customer_id`, `deposit`, and
`brand=ALPE`, and call:

```ts
const response = await fetch(url, {
  method: 'GET',
  cache: 'no-store',
  signal: AbortSignal.timeout(8_000),
})
```

Do not send a body. Mark Notion reported only after `response.ok`. Log order ID
and HTTP status on failure without logging customer data.

- [ ] **Step 4: Run focused tests and commit**

Run: `npm test -- --runInBand __tests__/p2g.test.ts`

Expected: PASS.

```bash
git add lib/orders/p2g.ts __tests__/p2g.test.ts
git commit -m "feat: report paid P2G orders"
```

### Task 7: Paid-Only Stripe Webhook

**Files:**
- Modify: `app/api/webhooks/stripe/route.ts`
- Test: `__tests__/stripeWebhookRoute.test.ts`

**Interfaces:**
- Consumes: `createOrUpdateOrder` and `reportPaidP2GOrder`.
- Retains the existing Notion delivery fields and Meta CAPI Purchase event.

- [ ] **Step 1: Write failing Stripe webhook tests**

```ts
test('acknowledges completed but unpaid sessions without saving or reporting')
test('upserts a paid card order and reports it when its affiliate ID matches')
test('upserts a direct paid order without calling P2G')
test('reuses the metadata ALPE order ID across Stripe retries')
```

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm test -- --runInBand __tests__/stripeWebhookRoute.test.ts`

Expected: FAIL because the current route does not explicitly reject unpaid
completed sessions and writes Notion inline.

- [ ] **Step 3: Refactor the signed event handler**

Immediately after reading the Checkout Session:

```ts
if (session.payment_status !== 'paid') {
  return NextResponse.json({ received: true })
}
```

Build the paid `OrderRecord` from canonical Stripe metadata and
`session.amount_total`, upsert it in Notion, retain the current Meta CAPI call,
then call `reportPaidP2GOrder`. A P2G failure must be logged but must not return
an error to Stripe after the paid order has been stored.

- [ ] **Step 4: Run focused tests and commit**

Run: `npm test -- --runInBand __tests__/stripeWebhookRoute.test.ts`

Expected: PASS.

```bash
git add app/api/webhooks/stripe/route.ts __tests__/stripeWebhookRoute.test.ts
git commit -m "fix: enforce paid-only Stripe completion"
```

### Task 8: Signed Notion Status Webhook

**Files:**
- Create: `app/api/webhooks/notion/route.ts`
- Test: `__tests__/notionWebhookRoute.test.ts`

**Interfaces:**
- Consumes: `verifyWebhookSignature` from `@notionhq/client`.
- Consumes: `getOrderByPageId` and `reportPaidP2GOrder`.
- Handles only `page.properties_updated`.

- [ ] **Step 1: Write failing Notion webhook tests**

```ts
test('acknowledges the initial Notion verification payload without processing an order')
test('rejects a missing or invalid x-notion-signature')
test('ignores unrelated event types')
test('retrieves the page and reports a paid P2G COD order')
test('does not report awaiting-payment or direct COD orders')
```

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm test -- --runInBand __tests__/notionWebhookRoute.test.ts`

Expected: FAIL because the Notion webhook route does not exist.

- [ ] **Step 3: Implement verification and current-state retrieval**

Read the request as raw text. Acknowledge the initial `{ verification_token }`
subscription handshake without treating it as an order event. During setup,
retrieve that one-time token from the Vercel function log, save it immediately
as `NOTION_WEBHOOK_VERIFICATION_TOKEN`, and remove the temporary token log
before the verification commit. For subsequent events, call:

```ts
await verifyWebhookSignature({
  body,
  signature: req.headers.get('x-notion-signature') ?? '',
  verificationToken: getRequiredEnv('NOTION_WEBHOOK_VERIFICATION_TOKEN'),
})
```

For `page.properties_updated`, retrieve `event.entity.id` through the Notion
repository. The repository must reject pages outside `NOTION_DATA_SOURCE_ID`.
Continue only for COD orders whose current Notion status is `Paid`; then invoke
the shared reporter.

- [ ] **Step 4: Run focused tests and commit**

Run: `npm test -- --runInBand __tests__/notionWebhookRoute.test.ts`

Expected: PASS.

```bash
git add app/api/webhooks/notion/route.ts __tests__/notionWebhookRoute.test.ts
git commit -m "feat: confirm COD payments from Notion"
```

### Task 9: Configuration, Full Verification, and UAT Handoff

**Files:**
- Create: `.env.example`
- Modify: `README.md`
- Modify: `docs/superpowers/specs/2026-07-30-p2g-referral-cod-postback-design.md` only if UAT reveals a confirmed contract correction

**Interfaces:**
- Documents: `P2G_AFFILIATE_ID`, `P2G_POSTBACK_URL`,
  `NOTION_WEBHOOK_VERIFICATION_TOKEN`, existing Stripe variables, and existing
  Notion variables including the current data source ID.

- [ ] **Step 1: Add non-secret configuration documentation**

```dotenv
NEXT_PUBLIC_SITE_URL=https://alpewear.com
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NOTION_API_KEY=
NOTION_DATABASE_ID=
NOTION_DATA_SOURCE_ID=
NOTION_WEBHOOK_VERIFICATION_TOKEN=
P2G_AFFILIATE_ID=
P2G_POSTBACK_URL=https://p2g-uat.epixel.link/en/api/postback/player-deposit/
```

Document the exact Notion properties and types from the design. Document the
Notion subscription URL as
`https://alpewear.com/api/webhooks/notion` and the Stripe URL as
`https://alpewear.com/api/webhooks/stripe`.

- [ ] **Step 2: Run the complete automated verification**

Run: `npm test -- --runInBand`

Expected: all Jest suites PASS.

Run: `npm run build`

Expected: Next.js production build exits 0 with no TypeScript error.

- [ ] **Step 3: Inspect the final diff and working tree**

Run: `git diff --check`

Expected: no whitespace errors.

Run: `git status --short`

Expected: only task-related files plus the user's pre-existing unrelated
`.claude` and `AGENTS.md` changes.

- [ ] **Step 4: Commit documentation**

```bash
git add .env.example README.md
git commit -m "docs: add P2G and Notion setup"
```

- [ ] **Step 5: Configure Vercel UAT values**

Set `P2G_POSTBACK_URL` to the supplied UAT endpoint, set a static UAT
`P2G_AFFILIATE_ID`, and add the Notion webhook verification token to Preview.
Do not add the production affiliate ID or endpoint until P2G creates the ALPE
account and confirms them.

- [ ] **Step 6: Execute UAT acceptance**

Verify these seven cases against a preview deployment:

1. Referred paid card order: one callback with discounted products plus shipping.
2. Direct paid card order: no callback.
3. Referred COD placement: Notion status `Awaiting payment`, no callback.
4. Referred COD changed to Paid: one callback with full collected amount.
5. Direct COD changed to Paid: no callback.
6. One-pair P2G order: EUR 4.99 shipping included in `deposit`.
7. Multi-pair P2G order: zero shipping included in `deposit`.

- [ ] **Step 7: Production handoff**

Obtain the fixed production affiliate ID, production postback URL, and written
confirmation that repeated `customer_id` values are deduplicated. Replace the
three corresponding Vercel values, deploy the verified commit to production,
and inspect one controlled conversion in both Notion and P2G.
