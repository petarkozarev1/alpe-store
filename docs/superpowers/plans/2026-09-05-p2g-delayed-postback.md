# P2G Delayed Postback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve P2G referral attribution at normal website prices and dispatch the P2G payment postback only after an attributed order has remained paid for 15 full days.

**Architecture:** Notion remains the durable order store and gains a write-once `Paid At` date. Stripe and Notion webhooks record the payment time without contacting P2G; an authenticated daily Vercel Cron endpoint queries eligible rows, re-reads each row, and invokes the existing idempotent reporter.

**Tech Stack:** Next.js 14 App Router, TypeScript, Jest, Notion API, Stripe webhooks, Vercel Cron Jobs

**Spec:** `docs/superpowers/specs/2026-09-05-p2g-delayed-postback-design.md`

## Global Constraints

- P2G attribution must never alter the website or Stripe price.
- Wait at least 15 full days from `Paid At`; daily dispatch may occur up to 24 hours later.
- `Cancelled`, direct, wrong-affiliate, missing-date, and already-reported orders must never be sent.
- Never log customer names, email addresses, phone numbers, or delivery information.
- Keep `P2G_AFFILIATE_ID` and `P2G_POSTBACK_URL`; protect cron with `CRON_SECRET`.
- Do not force-send a production order until P2G confirms the endpoint contract currently rejecting `brand=ALPE`.

---

### Task 1: Remove P2G pricing behavior while preserving attribution

**Files:**
- Modify: `lib/orders/pricing.ts`
- Modify: `lib/orders/checkout.ts`
- Modify: `components/checkout/CheckoutPageClient.tsx`
- Test: `__tests__/orderPricing.test.ts`
- Test: `__tests__/checkoutRoute.test.ts`
- Test: `__tests__/CheckoutPageClient.test.tsx`

**Interfaces:**
- Consumes: existing `affiliateId` attribution stored in checkout metadata and Notion orders.
- Produces: `quoteOrder(items: CheckoutItemInput[]): OrderQuote` with only ordinary product/shipping prices; checkout still saves `affiliateId` independently.

- [ ] **Step 1: Write failing pricing and checkout tests**

  Replace P2G-discount expectations with assertions that an attributed order has `discountCents: 0`, full `totalCents`, no Stripe coupon creation, and no `discounts` field in the session request.

- [ ] **Step 2: Run the focused tests and observe failure**

  Run: `npm.cmd test -- --runInBand __tests__/orderPricing.test.ts __tests__/checkoutRoute.test.ts __tests__/CheckoutPageClient.test.tsx`

  Expected: failures still show the 20% calculation, coupon, and P2G discount copy.

- [ ] **Step 3: Remove the discount implementation**

  Delete `P2G_DISCOUNT_PERCENT`, remove the `isP2G` pricing argument, remove Stripe coupon creation, and always pass full-price line items. Keep `affiliateId` in order data and Stripe metadata. In the checkout client, calculate discounts only from normal promo codes, keep the ordinary promo-code input available to attributed visitors, and remove all P2G discount text.

- [ ] **Step 4: Run the focused tests and observe success**

  Run the Task 1 command again. Expected: all three suites pass.

- [ ] **Step 5: Commit the pricing change**

  Commit: `fix: keep P2G referrals at normal price`

---

### Task 2: Persist the write-once payment timestamp in Notion

**Files:**
- Modify: `lib/orders/notion.ts`
- Test: `__tests__/notionOrders.test.ts`

**Interfaces:**
- Produces: `OrderInput.paidAt?: string`, `OrderRecord.paidAt?: string`, `setPaidAtIfMissing(pageId: string, paidAt: string): Promise<OrderRecord | null>`, and `listP2GCandidates(cutoff: string, affiliateId: string): Promise<OrderRecord[]>`.
- Notion property: `Paid At` date.

- [ ] **Step 1: Write failing repository tests**

  Add tests proving a paid card upsert serializes `Paid At`, an awaiting COD order leaves it empty, parsing returns the date, `setPaidAtIfMissing` preserves an existing timestamp and writes only when absent, and the candidate query filters `Payment Status = Paid`, `Affiliate ID = configured ID`, `P2G Reported = false`, and `Paid At <= cutoff`.

- [ ] **Step 2: Run the focused repository test and observe failure**

  Run: `npm.cmd test -- --runInBand __tests__/notionOrders.test.ts`

  Expected: failures for missing fields and repository methods.

- [ ] **Step 3: Implement the Notion model and methods**

  Add a safe date parser for `Paid At`. Include `paidAt` only when supplied so later upserts cannot clear a stored timestamp. Implement the one-time setter by re-reading the row before updating, and implement paginated candidate querying followed by page retrieval/parsing.

- [ ] **Step 4: Run the focused repository test and observe success**

  Run the Task 2 command again. Expected: suite passes.

- [ ] **Step 5: Commit the durable payment state**

  Commit: `feat: persist P2G payment eligibility time`

---

### Task 3: Stop immediate postbacks and timestamp payment events

**Files:**
- Modify: `lib/orders/stripeWebhook.ts`
- Modify: `app/api/webhooks/stripe/route.ts`
- Modify: `lib/orders/notionWebhook.ts`
- Modify: `app/api/webhooks/notion/route.ts`
- Test: `__tests__/stripeWebhookRoute.test.ts`
- Test: `__tests__/notionWebhookRoute.test.ts`

**Interfaces:**
- Consumes: `OrderInput.paidAt`, `setPaidAtIfMissing(pageId, paidAt)`.
- Stripe dependency adds `now(): string`; Notion webhook dependencies replace `reportOrder` with `setPaidAtIfMissing` and `now`.

- [ ] **Step 1: Write failing webhook tests**

  Assert that Stripe saves `paidAt` for every paid card order and never calls the P2G reporter. Assert that an attributed paid COD update calls `setPaidAtIfMissing(pageId, now())`, while awaiting, cancelled, direct, wrong-affiliate, or card rows do not. Preserve signature and stale-Notion-state coverage.

- [ ] **Step 2: Run the webhook tests and observe failure**

  Run: `npm.cmd test -- --runInBand __tests__/stripeWebhookRoute.test.ts __tests__/notionWebhookRoute.test.ts`

  Expected: current immediate reporter calls violate the new assertions.

- [ ] **Step 3: Implement timestamp-only webhook behavior**

  Remove reporter dependencies/imports from both webhook routes. Set card `paidAt` using injected `now()`. For COD, retain the short stale-state retry, then call the write-once timestamp setter instead of P2G. Acknowledge successfully after timestamp persistence.

- [ ] **Step 4: Run the webhook tests and observe success**

  Run the Task 3 command again. Expected: both suites pass.

- [ ] **Step 5: Commit webhook behavior**

  Commit: `fix: defer P2G reporting after payment`

---

### Task 4: Add 15-day eligibility and the protected cron dispatcher

**Files:**
- Modify: `lib/orders/p2g.ts`
- Create: `lib/orders/p2gCron.ts`
- Create: `app/api/cron/p2g/route.ts`
- Modify: `vercel.json`
- Test: `__tests__/p2g.test.ts`
- Create: `__tests__/p2gCronRoute.test.ts`

**Interfaces:**
- Produces: `isP2GEligible(order, affiliateId, now): boolean` and `createP2GCronHandler({ cronSecret, affiliateId, now, listCandidates, getOrder, reportOrder })`.
- Route: `GET /api/cron/p2g` with `Authorization: Bearer ${CRON_SECRET}`.

- [ ] **Step 1: Write failing eligibility and route tests**

  Cover the exact boundary (`Paid At <= now - 15 days`), too-new orders, cancelled orders, missing timestamps, direct/wrong-affiliate orders, zero amount, and reported rows. Route tests must reject a missing/wrong secret, query with the calculated cutoff, re-read each candidate, send only still-eligible orders, continue after individual failures, and return aggregate counts without personal data.

- [ ] **Step 2: Run the focused tests and observe failure**

  Run: `npm.cmd test -- --runInBand __tests__/p2g.test.ts __tests__/p2gCronRoute.test.ts`

  Expected: missing eligibility helper, cron handler, and route.

- [ ] **Step 3: Implement eligibility and dispatch**

  Require `paidAt` in the reporter's eligibility guard. In the cron handler, compare the header exactly, derive the cutoff with `new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString()`, query candidates, re-read each page, call the reporter sequentially, and count `sent`, `failed`, and `skipped`. Log only order/page IDs and statuses. Add a daily schedule such as `15 6 * * *` in `vercel.json`.

- [ ] **Step 4: Run the focused tests and observe success**

  Run the Task 4 command again. Expected: both suites pass.

- [ ] **Step 5: Commit the scheduler**

  Commit: `feat: report P2G orders after 15 days`

---

### Task 5: Configure Notion and production safely

**Files:**
- Modify: `.env.example`

**Interfaces:**
- Requires Notion `Paid At` date property.
- Requires Vercel production `CRON_SECRET`.

- [ ] **Step 1: Add configuration documentation**

  Add `CRON_SECRET=` to `.env.example` without a real secret.

- [ ] **Step 2: Add the Notion schema property**

  Update the configured Orders data source with `Paid At` as a date property and read the schema back to verify the exact name/type.

- [ ] **Step 3: Add the production secret**

  Generate a high-entropy value locally, store it as the production `CRON_SECRET`, and never print it in commentary, logs, commits, or the final response.

- [ ] **Step 4: Commit configuration documentation**

  Commit: `chore: configure delayed P2G cron`

---

### Task 6: Full verification, deployment, and controlled production checks

**Files:**
- Verify all modified files; no planned source changes.

**Interfaces:**
- Consumes the complete checkout-to-Notion-to-cron flow.

- [ ] **Step 1: Run all tests**

  Run: `npm.cmd test -- --runInBand`

  Expected: all suites and tests pass.

- [ ] **Step 2: Run the production build**

  Run: `npm.cmd run build`

  Expected: exit code 0; document any pre-existing warning separately.

- [ ] **Step 3: Review the final diff and repository state**

  Confirm no generated files, credentials, customer personal data, obsolete discount logic, or unrelated edits are present. Confirm `git status --short` is clean after the final commit.

- [ ] **Step 4: Push and deploy production**

  Push the current branch to `codex/p2g-integration`, deploy with `vercel.cmd deploy --prod --yes`, and capture the production deployment URL.

- [ ] **Step 5: Verify production behavior without sending P2G a premature order**

  Open `https://www.alpewear.com/shop?source_id=VPL5EQ42`, continue to checkout, and confirm normal pricing plus preserved attribution. Request `/api/cron/p2g` without authorization and confirm HTTP 401. Inspect the existing test order and confirm it is not marked P2G Reported. Do not invoke an authorized cron request against a 15-day-old live order while P2G still rejects the brand contract.

- [ ] **Step 6: Report the exact operational state**

  State what was removed, how the 15-day clock works, what was deployed, test/build results, and the remaining external dependency on P2G's endpoint confirmation.
