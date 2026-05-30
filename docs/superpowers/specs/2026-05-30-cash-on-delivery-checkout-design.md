# Cash on Delivery (Наложен платеж) — Checkout Design

**Date:** 2026-05-30
**Status:** Approved design, pending implementation plan

## Goal

Add Cash on Delivery (COD / „наложен платеж") as a second payment method on the
ALPÉ checkout, alongside the existing Stripe card flow, without losing Meta Pixel
+ CAPI Purchase tracking.

## Background — current architecture

The entire order-recording and Purchase-tracking pipeline is triggered by Stripe:

1. `CheckoutPageClient` collects contact + shipping → POSTs to `/api/checkout`.
2. `/api/checkout` creates a Stripe Checkout Session and redirects the customer to Stripe.
3. On return, `app/checkout/success/page.tsx` fires the **browser Purchase pixel**
   (value pulled from the retrieved Stripe session).
4. Stripe's `checkout.session.completed` **webhook** (`app/api/webhooks/stripe/route.ts`)
   writes the order to Notion **and** fires the **server-side CAPI Purchase**
   (deduped via `event_id = purchase-{session.id}`).

COD has no Stripe session, so none of steps 2–4 happen by default. The design adds a
**parallel, Stripe-free order path** that performs the equivalent Notion write,
confirmation email, and Purchase tracking.

## Locked decisions

| Decision | Choice |
|---|---|
| Purchase tracking timing | Fire at **order placement** (browser pixel + CAPI), industry standard for COD |
| Pixel redundancy | Keep **both** browser pixel + CAPI, shared `event_id` |
| COD fee | Fixed **€1.00** surcharge, line item shown only when COD selected |
| Availability | **Bulgaria only** (country = България) |
| Default method | **Card** stays default; COD is secondary |
| Order-value limits | **None** |
| Confirmation email | **Automated via Resend** (instant Bulgarian email after Notion write) |
| Notion display | Prepend `[НАЛОЖЕН ПЛАТЕЖ]` to Items field (no schema change) |
| Anti-abuse (repeat refusers) | **Deferred** — monitor manually in Notion |

## Tracking parity (the critical part)

- COD generates a server-side `orderId = cod-{timestamp}-{rand}`.
- Browser Purchase pixel fires `purchase-cod-{id}` (via existing `PurchasePixelFire`,
  which builds `purchase-${orderId}`).
- CAPI Purchase fires with `eventId: purchase-cod-{id}` → browser/server dedup, exactly
  mirroring the card flow's `purchase-{session.id}`.
- **Tracked value parity:** COD value = `subtotal − discount + shipping + €1 fee`,
  matching the card flow's Stripe `amount_total` (which already includes shipping as a
  line item).
- **Match quality (EMQ):** COD route forwards `_fbp`/`_fbc` (from the client payload) and
  `clientIpAddress`/`clientUserAgent` (from request headers) into CAPI, same as the card route.
- `contentIds`/`numItems` use **product line items only** (matches the existing
  InitiateCheckout event).
- Server-side InitiateCheckout is **not** re-fired for COD — the browser already fires
  InitiateCheckout on checkout-page mount; COD fires Purchase directly.

## Components & changes

### 1. `components/checkout/CheckoutPageClient.tsx` (modify)
- New section **„03. Начин на плащане"** with two radio cards:
  - **Карта** (default) — sub: „Visa · Mastercard · Apple Pay · Google Pay · Revolut".
    Routes to the existing `/api/checkout` Stripe flow, unchanged.
  - **Наложен платеж** — sub: „Плащаш в брой на куриера при доставка · +1,00 €".
    Adds the €1.00 fee and routes to the new `/api/checkout/cod` flow.
- COD radio is **shown only when the order ships to България**. If COD is selected and the
  user switches to a non-BG country (address delivery), payment method falls back to Card.
- New constant `COD_FEE = 1.0`. When COD is active:
  - Order summary shows a **„Наложен платеж · +€1,00"** line (with лв. equivalent).
  - `total` includes `COD_FEE`.
- Submit handler branches on payment method:
  - Card → existing behavior (POST `/api/checkout`, redirect to Stripe).
  - COD → POST `/api/checkout/cod` with the same `items`/`email`/`shipping` payload plus
    a COD-fee line item; on success redirect to
    `/checkout/success?cod=1&order={orderId}&value={value}`.
- Trust block + button adapt for COD: button label „ПОРЪЧАЙ С НАЛОЖЕН ПЛАТЕЖ →"; the
  „Сигурно плащане със Stripe" block is replaced with a „Плащаш при доставка" note.
- Disclosure line near the COD option: „При наложен платеж плащаш в брой при получаване.
  Такса за услугата: 1,00 €."
- All existing validation (required fields, scroll-to-invalid) is reused for both methods.

### 2. `lib/orders.ts` (new — targeted refactor)
Extract the order-recording logic currently inline in the Stripe webhook so the webhook
and the COD route share it (no behavior change for the card flow):
- `writeOrderToNotion(order)` — creates the Notion row (same property shape as today).
- `firePurchaseCapi(order)` — fires the CAPI Purchase event.
- Each is independently try/caught with `notifyAlert` on failure, preserving current
  resilience semantics.

### 3. `app/api/webhooks/stripe/route.ts` (refactor)
Replace the inline Notion-write and CAPI-Purchase blocks with calls into `lib/orders.ts`.
Behavior identical; this is purely de-duplication so COD and card share one code path.

### 4. `app/api/checkout/cod/route.ts` (new)
1. Parse `{ items, email, shipping }`; capture `clientIpAddress`/`clientUserAgent` from headers.
2. Validate non-empty product items and required shipping fields server-side.
3. **Recompute the total on the server** — sum product line items, subtract the discount
   line item (negative), add shipping and the €1.00 COD fee. Never trust the client number.
4. Generate `orderId = cod-{Date.now()}-{rand}`.
5. `writeOrderToNotion(...)` — Items field prefixed with `[НАЛОЖЕН ПЛАТЕЖ]`; `orderId`
   stored in the „Stripe Session" field.
6. `sendOrderConfirmation(...)` (Resend) — Bulgarian confirmation email to the customer.
7. `firePurchaseCapi(...)` with `eventId: purchase-cod-{id}` and the server-computed value.
8. Return `{ orderId, value }`.

**Resilience:** Notion, email, and CAPI are independent — each wrapped in try/catch with
`notifyAlert`. A failure in any one must **not** block the customer reaching the success
page (the order intent is real), mirroring the webhook's „always succeed, alert async" model.

### 5. `lib/email.ts` (new)
- Resend client initialized from `RESEND_API_KEY` (gracefully no-ops + logs a warning if
  unset, matching the `META_CAPI_TOKEN` pattern).
- `sendOrderConfirmation({ email, name, orderId, items, total, shipping })` — sends a
  Bulgarian HTML confirmation from `hello@alpe.bg`.

### 6. `app/checkout/success/page.tsx` (modify)
- When `cod=1`: skip the Stripe session lookup; read `value` and `order` from query params
  and feed them to `PurchasePixelFire` (fires `purchase-cod-{id}`, deduping with the
  route's CAPI event).
- COD confirmation copy (since an email IS sent via Resend): „Поръчката е приета! Изпратихме
  ти имейл с потвърждение. Ще се свържем с теб за детайли по доставката." Card copy unchanged.

### 7. `app/terms/page.tsx` (modify)
Add a short COD clause: payment in cash on delivery, the 1,00 € service fee, and a note
that the 14-day return right and 24-month warranty apply regardless of payment method.

## Data flow (COD)

```
CheckoutPageClient (COD selected, BG)
  → POST /api/checkout/cod  { items(+COD fee), email, shipping(+fbp/fbc) }
      → validate + recompute total
      → orderId = cod-...
      → writeOrderToNotion()        [Notion row, [НАЛОЖЕН ПЛАТЕЖ] prefix]
      → sendOrderConfirmation()     [Resend email]
      → firePurchaseCapi()          [CAPI Purchase, eventId purchase-cod-id]
      → { orderId, value }
  → redirect /checkout/success?cod=1&order=...&value=...
      → PurchasePixelFire           [browser Purchase, purchase-cod-id → dedupes]
```

## Prerequisites (manual, external)
- **Resend account + domain verification for `alpe.bg`** (DNS records) so confirmation
  emails don't land in spam.
- **`RESEND_API_KEY`** added to Vercel project env.

## Out of scope
- Automated repeat-refuser detection (no customer accounts / phone-keyed history).
- COD order-value limits (none).
- Extending Resend confirmation emails to the **card** flow (the helper is reusable; card
  continues to rely on Stripe receipts for now — can be a follow-up).
- SMS / phone verification.

## Error-handling summary
- Client double-submit guarded by existing `loading` state (no server idempotency key —
  matches card flow's risk profile).
- COD route: Notion / email / CAPI failures are independent, alerted, non-blocking.
- Pixel failures never break the success page (existing `try/catch` in `PurchasePixelFire`).
