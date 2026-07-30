# P2G Referral, Cash on Delivery, and Paid-Order Postback

## Goal

Integrate ALPE with the P2G affiliate platform so referred customers receive a
20% product discount and P2G receives exactly one conversion postback only
after ALPE has received payment.

The integration must support both Stripe card payments and cash on delivery
(COD). Notion remains the operational order database and the place where COD
payments are manually confirmed.

## Partner Link Model

P2G creates a redirect link similar to:

```text
https://<p2g-redirect-host>/<campaign>?source_id=<p2g-affiliate-id>
```

The campaign path identifies ALPE inside P2G, while `source_id` identifies the
affiliate inside P2G. P2G has confirmed that ALPE's affiliate ID is fixed for
every visit. The final ID will be generated after P2G creates ALPE's account;
UAT may use a temporary static value that is replaced in configuration later.
The affiliate ID is not an ALPE order identifier.

ALPE supplies this base destination URL to P2G:

```text
https://alpewear.com/shop
```

P2G's redirect must forward its fixed affiliate ID to ALPE as `source_id`.
When a customer reaches ALPE with that parameter, the server compares it with
the configured `P2G_AFFILIATE_ID`. A match is stored in a first-party, secure,
same-site cookie for 30 days. The exact affiliate ID is copied into the checkout
session and the Notion order, which marks the order as belonging to P2G.

The configured affiliate ID is stored in a server-only Vercel environment
variable. Checkout request data alone cannot assert P2G attribution, and an
unknown `source_id` does not receive the discount or P2G attribution.

## Discount Rules

- P2G-attributed orders receive a 20% discount on product merchandise.
- Shipping is calculated after the merchandise discount.
- Shipping remains free under the store's existing multi-pair rule.
- Shipping is not discounted when it applies.
- The server recalculates and validates all prices and discounts. Browser totals
  are display values, not the source of truth.
- Notion stores subtotal, discount, shipping, and final total separately.

The amount reported to P2G is the full amount actually collected:

```text
paid amount = discounted merchandise total + applicable shipping
```

## Order Identity

Every order receives one stable ALPE order ID. Stripe-backed orders also retain
their Stripe Checkout Session ID. COD orders do not depend on Stripe for their
identity.

The ALPE order ID is sent as P2G's `customer_id`, following the field mapping
provided by P2G.

## Payment Flows

### Stripe

1. The server creates a Stripe Checkout Session with validated products,
   discount, shipping, ALPE order ID, and validated affiliate metadata.
2. The signed Stripe webhook handles `checkout.session.completed`.
3. The handler proceeds only when `session.payment_status === "paid"`.
4. The order is created or updated in Notion with Payment Status `Paid`.
5. If the stored Affiliate ID matches the configured P2G ID, the server
   attempts the P2G postback.

The success page never marks an order paid and never sends the P2G postback.

### Cash on Delivery

1. The customer selects `Наложен платеж` at checkout.
2. The server validates the order and creates it directly in Notion.
3. Payment Method is `Cash on delivery`.
4. Payment Status is `Awaiting payment`.
5. No P2G postback is sent when the order is placed or delivered.
6. After ALPE receives the cash, the operator changes Payment Status to `Paid`
   in Notion.
7. Notion sends a page-properties webhook to ALPE.
8. ALPE retrieves the complete page through the Notion API and evaluates the
   stored order state.
9. P2G-attributed orders are reported; other orders are simply left as paid.

This Notion status workflow applies to every COD order, including orders that
did not originate from P2G.

## Notion Schema

The order database needs these integration fields in addition to its current
customer, delivery, item, and tracking fields:

| Property | Type | Purpose |
|---|---|---|
| Order ID | Rich text | Stable ALPE order identifier |
| Stripe Session | Rich text | Stripe Checkout Session ID when applicable |
| Payment Method | Select | `Card` or `Cash on delivery` |
| Payment Status | Status | `Awaiting payment`, `Paid`, or `Cancelled` |
| Referral Source | Select | `p2g` or empty |
| Affiliate ID | Rich text | Exact validated P2G `source_id` or empty |
| Subtotal | Number | Merchandise value before discount |
| Discount | Number | Applied discount value |
| Shipping | Number | Shipping charged |
| Paid Amount | Number | Final amount collected |
| Currency | Select | `EUR` |
| P2G Reported | Checkbox | Duplicate-postback guard |
| P2G Reported At | Date | Successful postback timestamp |

The integration reads properties by their configured names and ignores Notion
events for pages outside the configured order database.

## Notion Webhook

ALPE exposes a dedicated server route for Notion webhook verification and event
delivery.

For a `page.properties_updated` event:

1. Validate that the event belongs to the configured Notion subscription.
2. Retrieve the page using the existing Notion integration.
3. Confirm that it belongs to the configured order database.
4. Read the complete current state instead of trusting the event payload.
5. Continue only when Payment Status is `Paid`.
6. Invoke the shared P2G reporting service.

Notion webhook events are signals; the event payload is not treated as the
authoritative order record.

## P2G Postback

The reporting service sends an HTTP `GET` request with no body:

```text
https://p2g-uat.epixel.link/en/api/postback/player-deposit/?customer_id=<encoded-order-id>&deposit=<encoded-paid-amount>&brand=ALPE
```

The base URL is stored in a server-only Vercel environment variable. UAT remains
configured until P2G validates the test conversions and supplies or confirms
the production endpoint.

The service sends a postback only when all conditions hold:

- Payment Status is `Paid`.
- Affiliate ID matches the configured `P2G_AFFILIATE_ID`.
- Paid Amount is greater than zero.
- P2G Reported is false.

Amounts use a fixed two-decimal representation with `.` as the decimal
separator. Query values are URL-encoded.

P2G has said the affiliate ID may also be returned in the postback, but it is
not required. ALPE will omit it unless P2G supplies an explicit query-parameter
name. The required `customer_id` remains the stable ALPE order ID.

After a successful 2xx response, ALPE updates `P2G Reported` and
`P2G Reported At` in Notion. Non-2xx responses and network failures are logged
and remain eligible for retry.

## Idempotency and Concurrency

Stripe and Notion may retry events. The reporting service therefore centralizes
all eligibility checks for both payment flows.

Before sending, it reads the latest Notion order. After success, it records the
reported state. A short-lived in-process check is not sufficient in a
serverless environment, so the implementation must use a persistent claim or
equivalent compare-before-send mechanism to prevent two concurrent handlers
from reporting the same order.

If Notion cannot provide an atomic claim, the postback request must use the same
stable ALPE order ID on every retry and P2G must confirm that `customer_id` is
idempotent. This confirmation is a launch requirement.

## Security and Privacy

- P2G and Notion requests run only on the server.
- The Notion token and webhook identifiers remain server-only.
- The P2G base URL is server-only configuration.
- No customer name, email, phone, or address is sent to P2G.
- The P2G postback contains only order ID, paid amount, and brand.
- Referral cookies contain only the fixed affiliate ID, not personal data.

## Error Handling

- A P2G failure must not reverse payment or prevent the order from being saved.
- Failed postbacks remain unreported and retryable.
- Malformed or unverified Notion events return an error without reading or
  updating orders.
- Stripe events for unpaid sessions are acknowledged without marking orders
  paid.
- COD order creation is successful only after Notion confirms the order write.

## Testing

Automated tests cover:

- Exact P2G `source_id` validation, capture, and expiration.
- Automatic 20% merchandise discount.
- Server-side rejection of manipulated prices or referrals.
- Shipping inclusion for one-pair orders and free shipping under the existing
  multi-pair rule.
- Stripe paid and unpaid event handling.
- COD creation as `Awaiting payment`.
- Notion status changes for P2G and non-P2G orders.
- Postback URL encoding and two-decimal amount formatting.
- Duplicate Stripe and Notion events.
- P2G timeout and non-2xx behavior.

UAT acceptance covers:

1. A referred Stripe order reports the full paid amount once.
2. A direct Stripe order does not report.
3. A referred COD order does not report when placed.
4. The referred COD order reports once after its Notion status becomes Paid.
5. A direct COD order can become Paid without a P2G postback.
6. A one-pair order reports merchandise after discount plus shipping.
7. A qualifying multi-pair order reports merchandise after discount with zero
   shipping.

## Rollout

1. Add the Notion properties and webhook subscription.
2. Configure the P2G UAT endpoint in Vercel.
3. Deploy to a preview environment and run automated tests.
4. Give P2G the ALPE base destination URL, configure a static UAT affiliate ID,
   and verify that the redirect forwards it to ALPE as `source_id`.
5. Obtain P2G confirmation that the ALPE order ID is accepted as
   `customer_id`, retries are idempotent, and the production endpoint is ready.
6. Replace the UAT affiliate ID with the fixed ID generated for ALPE's P2G
   account and configure the production endpoint.
7. Deploy to production and verify one low-value card or controlled COD order.
