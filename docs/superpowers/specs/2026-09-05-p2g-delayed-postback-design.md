# P2G Delayed Postback Design

## Goal

Track orders that arrive through the configured P2G referral link without changing the price on the ALPÉ website. Report an attributed order to P2G only after it has remained paid and not cancelled for 15 full days.

## Confirmed business rules

- The referral URL and attribution cookie remain in place.
- P2G-attributed customers pay the normal website price. No P2G discount is calculated, displayed, or sent to Stripe.
- P2G provides cashback separately and invoices ALPÉ separately each month.
- The 15-day hold applies to every P2G-attributed order, including card and cash-on-delivery orders.
- The hold begins when the order becomes paid.
- A returned pair of glasses is represented by changing the existing Notion `Payment Status` to `Cancelled`.
- An order is reported only when it is still `Paid`, has reached its eligibility time, and has not already been reported.

## Selected architecture

Use Notion as the durable order state and a protected Vercel Cron endpoint as the dispatcher.

When an attributed order first becomes paid, store a `Paid At` timestamp on its Notion row. Do not call P2G from the Notion or Stripe webhook. A daily cron invocation queries for attributed orders that are still paid, are not reported, and have `Paid At` at least 15 days in the past. It retrieves and validates each candidate again immediately before sending the P2G postback. After a successful 2xx response, it sets the existing `P2G Reported` flag and `P2G Reported At` timestamp.

This architecture is durable across deployments and function restarts, requires no additional database, and naturally skips an order changed to `Cancelled` during the return window. A daily schedule means delivery can occur up to 24 hours after the exact 15-day threshold, never before it.

## Alternatives considered

### One Vercel Workflow per order

A durable 15-day sleep would dispatch closer to the exact timestamp. It adds a workflow dependency and per-order workflow lifecycle without improving the business outcome, because each order must still be re-read from Notion before reporting.

### In-memory timer from the webhook

Rejected because serverless processes do not remain alive for 15 days and deployments would lose pending timers.

### Use Notion `last_edited_time`

Rejected because unrelated edits would move the eligibility date and make the payment timestamp unreliable.

## Data model

Add one Notion date property:

- `Paid At`: the first confirmed payment time. It is written once and must not be moved by later edits.

Keep the existing fields:

- `Affiliate ID`
- `Referral Source`
- `Payment Status`
- `Paid Amount`
- `P2G Reported`
- `P2G Reported At`

For an existing paid P2G row without `Paid At`, the timestamp is set when that row is first processed after deployment, and its 15-day countdown begins then. This conservative migration ensures no historical order is sent early.

## Event flows

### Attribution and checkout

The middleware validates `source_id` against the configured P2G affiliate ID and stores the existing attribution cookie. Checkout uses normal product and promotional pricing. P2G attribution is saved with the order but does not override or block ordinary promo-code behavior.

### Card payment

The Stripe webhook persists the paid order and its `Paid At` time, but does not invoke the P2G reporter. The order becomes eligible 15 days later if it remains paid.

### Cash on delivery

The Notion webhook observes the transition to `Paid` and records `Paid At` once. It acknowledges the event without invoking the P2G reporter. If the status becomes `Cancelled` before dispatch, the order is excluded.

### Scheduled reporting

Vercel invokes a GET route daily. The route requires `Authorization: Bearer <CRON_SECRET>`. It queries eligible rows, re-validates all business conditions, sends each postback, and records only successful reports. Failures remain unreported and are retried on a later cron run.

## Safety and idempotency

- The cron route is unauthorized without the exact secret.
- Attribution must match the configured P2G affiliate ID.
- `Paid At` must be at least 15 full days old.
- Status must still be `Paid` immediately before sending.
- `P2G Reported` prevents later duplicate attempts after success.
- Failed or non-2xx P2G calls do not mark the order reported.
- Logs include order identifiers and response status but exclude customer personal information.

## Configuration

- Keep `P2G_AFFILIATE_ID` and `P2G_POSTBACK_URL`.
- Add `CRON_SECRET` to production.
- Add the daily cron entry to `vercel.json`.
- Add `Paid At` to the Notion Orders data source.

## Testing and verification

- Pricing tests prove P2G attribution no longer changes totals or creates a Stripe coupon.
- Checkout UI tests prove no P2G discount message is shown and ordinary promo codes remain available.
- Stripe and Notion webhook tests prove they record payment timing without sending immediately.
- Eligibility tests cover the 15-day boundary, cancelled orders, direct orders, wrong affiliates, already-reported orders, and missing timestamps.
- Cron route tests cover authentication, successful dispatch, partial failures, and safe retries.
- Repository tests cover Notion serialization, querying, and one-time `Paid At` updates.
- Run the complete test suite and production build before deployment.
- After deployment, verify the referral link preserves attribution while showing normal pricing and verify that the cron endpoint rejects unauthenticated requests. Do not force-send a live order while P2G's endpoint still rejects the configured brand; successful delivery is verified after P2G confirms its final endpoint contract.
