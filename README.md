# ALPE Store

Next.js 14 ecommerce site for ALPE blue-light-blocking glasses.

## P2G and order configuration

Copy the variable names from `.env.example` into local and Vercel
configuration. Keep all values except `NEXT_PUBLIC_*` server-only.

P2G test configuration:

- `P2G_AFFILIATE_ID`: the fixed UAT affiliate ID forwarded as `source_id`.
- `P2G_POSTBACK_URL`: use the supplied `p2g-uat.epixel.link` URL until P2G
  confirms test conversions.
- Replace both values with P2G's production values only after acceptance.

Stripe sends paid checkout events to:

```text
https://alpewear.com/api/webhooks/stripe
```

Notion sends page property events to:

```text
https://alpewear.com/api/webhooks/notion
```

When creating the Notion subscription, its first request writes the one-time
verification token to the private Vercel function log. Enter that token in the
Notion connection UI and save it as `NOTION_WEBHOOK_VERIFICATION_TOKEN`.
Subsequent events are verified using HMAC-SHA256.

The Notion order data source must contain the existing customer and delivery
properties plus:

| Property | Type |
|---|---|
| Order ID | Rich text |
| Stripe Session | Rich text |
| Payment Method | Select |
| Payment Status | Status |
| Referral Source | Select |
| Affiliate ID | Rich text |
| Subtotal | Number |
| Discount | Number |
| Shipping | Number |
| Paid Amount | Number |
| Currency | Select |
| P2G Reported | Checkbox |
| P2G Reported At | Date |

`Payment Method` uses `Card` and `Cash on delivery`. `Payment Status` uses
`Awaiting payment`, `Paid`, and `Cancelled`. After collecting a COD payment,
change its Notion status to `Paid`; only a matching P2G order triggers the
partner postback.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
