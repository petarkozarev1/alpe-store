# ALPE - Project Reference

**ALPE** is a blue light blocking glasses brand. This is their Next.js 14 ecommerce site.

> There is no other brand. There is no "Raydiant". The brand is ALPE. Always.

---

## Critical Rules - Read First

1. **NEVER use the Preview tool or start a dev server from a worktree.** The only valid project root is `E:/ALPE/alpe-store`. Any path containing `.claude/worktrees/` is an old stale copy - do NOT serve, edit, or read from it.
2. **NEVER touch worktree directories.** They caused the site to revert to an old broken version. Ignore them completely.
3. **Always start the dev server from `E:/ALPE/alpe-store`:**
   ```bash
   cd E:/ALPE/alpe-store && npm run dev
   ```
4. **The canonical saved version is the git tag `legal`** (commit `895cd15`). To restore: `git -C E:/ALPE/alpe-store checkout legal -- .`
   - Previous saves (do not revert to these unless explicitly asked): `checkoutv1`, `pre-checkoutpage`, `save-2`, `colors`
5. **Do NOT run `git checkout` on the whole repo** without specifying files - it will blow away working changes.
6. **Before ANY color or style change**, read this file's Section Background Map and Contrast Rules.

---

## Brand Identity

| Property | Value |
|---|---|
| Brand name | ALPE |
| Product | Blue light blocking glasses |
| Tagline | "Screen All Day. Sleep All Night." |
| Target customer | People who work long hours in front of computers or phones |
| Positioning | Premium feel, affordable prices |
| Language | **Bulgarian** - all user-visible strings. English requires explicit approval. |
| Website | https://www.alpewear.com |
| Email | hello@alpe.bg (general), support@alpe.bg, returns@alpe.bg |

---

## Color Palette (warm tokens - no `brand-` prefix)

| Token | Hex | Role |
|---|---|---|
| `onyx` | `#2D0E04` | Dark section backgrounds (footer) |
| `iron` | `#7C3018` | Dark card/section accent, body text color |
| `gold` | `#C4A266` | Stars, highlight accents |
| `stone` | `#9B7B68` | Muted/secondary text |
| `linen` | `#EDE4D6` | Navbar text, light text on dark/brown backgrounds |
| `parchment` | `#FFF0E0` | **Main page background - all light sections** |
| `peach` | `#FFE4CC` | Available for accents |
| `sand` | `#F5DFC5` | Available for accents |
| `cream` | `#FFFBF5` | Available (near-white, rarely used) |
| `white` | `#FFFFFF` | Avoid - use linen/parchment instead |
| `#B8906A` | - | **Navbar + HowItWorks section background (soft brown)** |

> **Body default:** `background-color: parchment` / `color: iron`
> **Zero pure white or black anywhere on the site.**

---

## Contrast Rules

On **dark backgrounds** (`bg-iron`, `bg-onyx`, inline dark styles):
- Use `text-linen` variants - e.g. `text-linen/75`, `text-linen/60`, `text-linen/45`
- Never use `text-stone` or `text-stone/XX` on dark backgrounds - near invisible

On **light backgrounds** (`bg-parchment`, `bg-sand`, white cards):
- `text-stone` is fine for body copy
- Avoid `text-stone/40` or lower - use `text-stone/60` minimum
- Avoid `text-gold/40` - use `text-gold/65` minimum for decorative numbers

---

## Section Background Map

| Section | Background | Text |
|---|---|---|
| Navbar | `#B8906A` (soft brown) | `linen` |
| Hero | `parchment` | `iron` |
| BenefitsScroll | `parchment` | `iron` |
| DarkCtaCard outer | `parchment` | - |
| DarkCtaCard card | `iron` (dark) | `linen` |
| Ingredients | `parchment` | `iron` |
| HowItWorks | `#B8906A` (matches navbar) | `linen` |
| Comparison | `parchment` | `iron` |
| Testimonial | `parchment` | `iron` |
| Gallery | `parchment` | `iron` |
| FAQ | `parchment` | `iron` |
| FinalCta | `iron` (dark) | `linen` |
| Footer | `onyx` (dark) | `linen` |
| Certifications standards strip | `iron` (dark) | `linen` variants |

---

## Typography

| Role | Font | Variable |
|---|---|---|
| Display / headings (h1-h3) | Cormorant Garamond (serif) | `--font-cormorant` / `font-serif` |
| Body / UI / nav | Raleway (sans-serif) | `--font-raleway` / `font-sans` |

---

## Button Variants

| Variant | Style |
|---|---|
| `primary` | `bg-onyx text-linen hover:bg-iron` |
| `outlined-black` | `border-onyx text-onyx hover:bg-onyx hover:text-linen` |
| `outlined-white` | `border-linen text-linen hover:bg-linen hover:text-onyx` |
| `pill` | `bg-onyx text-linen rounded-full` |

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 App Router, TypeScript |
| Styles | Tailwind CSS v3 - warm token system (see above) |
| Animation | Framer Motion v12 |
| State | Zustand v5 - cart store at `lib/store/cartStore.ts` |
| Fonts | Cormorant Garamond + Raleway via `next/font/google` |
| Payments | Stripe Checkout Sessions with embedded Payment Element + Cash on Delivery |
| Orders DB | Notion via `lib/orders.ts` from Stripe webhook and COD route |
| Email | Resend order confirmations |
| Analytics | Meta Pixel + CAPI, including browser-to-CAPI mirror (`/api/track`) |
| Tests | Jest + React Testing Library |
| Dev server | `npm run dev` from `E:/ALPE/alpe-store` - port 3000, or 3001 if 3000 is occupied |
| GitHub | https://github.com/petarkozarev1/alpe-store |

---

## Data Layer - `lib/data/`

| File | Exports |
|---|---|
| `site.ts` | `siteConfig` - brand name, tagline, nav links, footer |
| `content.ts` | Landing page copy + `heroFaceImages` array (6 rotating person images) |
| `products.ts` | `products: Product[]`, `getProductBySlug(slug)` |
| `index.ts` | Barrel re-export |

**`withoutItems` and `withItems` are `string[]`**, not objects.

---

## Analytics - Meta Pixel + Conversions API

### Pixel ID
`1435898268342097`

### Current Behavior

Meta Pixel initializes on page load and fires `PageView`. `_fbp` is created if missing; `_fbc` is created from `fbclid` when present. Checkout forwards `_fbp`/`_fbc`, IP, and user agent into server-side CAPI calls. Pixel Advanced Matching is enabled with `setPixelUser()` after the customer fills checkout fields.

The cookie banner controls the user's displayed cookie choice, but current Meta tracking is intentionally built for ads attribution resilience: browser events fire normally and important events are mirrored server-side through CAPI. PII is only sent after the user provides it during checkout, and `lib/meta-capi.ts` hashes email, phone, name, city, country, and zip before sending.

### Client-side Events

| Event | File | Trigger |
|---|---|---|
| `PageView` | `components/analytics/MetaPixel.tsx` | Every page load |
| `ViewContent` | `components/shop/ProductPage.tsx`, `components/product/ProductDetailClient.tsx` | Product page mount |
| `AddToCart` | `components/shop/ProductPage.tsx`, `components/product/AddToCartButton.tsx` | Add to cart click |
| `ViewCart` | `components/layout/CartDrawer.tsx` | Cart drawer opens |
| `InitiateCheckout` | `components/layout/CartDrawer.tsx`, `app/cart/page.tsx` | Checkout CTA click |
| `Purchase` | `components/analytics/PurchasePixelFire.tsx` | Valid success page mount |
| `Lead` | `components/landing/NewsletterSection.tsx` | Newsletter form submit |
| `CTAClick` (custom) | `Navbar`, `HeroSection`, `HowItWorksSection`, `FaqSection` | CTA click |

Use `fireTrackedEvent()` for most client events. It fires the browser Pixel event and POSTs to `/api/track` with the same `event_id` so Meta can deduplicate browser + CAPI events.

### Server-side CAPI

- `app/api/track/route.ts` mirrors selected browser events server-side with shared `event_id`, `_fbp`, `_fbc`, source URL, IP, and user agent.
- `app/api/checkout/route.ts` fires server-side `InitiateCheckout` after embedded Checkout Session creation.
- `app/api/webhooks/stripe/route.ts` fires `Purchase` after every confirmed Stripe order.
- `app/api/checkout/cod/route.ts` fires `Purchase` after every confirmed COD order.
- `Purchase` uses deterministic event IDs (`purchase-{session.id}` or `purchase-cod-{orderId}`) for browser/server deduplication.
- Requires `META_CAPI_TOKEN` in Vercel. Missing token skips CAPI with a warning; failed critical order events also send an alert.

### Helper Functions

```ts
import { fireTrackedEvent } from '@/components/analytics/MetaPixel'

fireTrackedEvent('EventName', {
  data: { key: 'value' },
  value: 78.99,
  currency: 'EUR',
})
```

`firePixelEvent()` still exists for cases where only a browser Pixel event should fire, such as the guarded success-page `Purchase`.

---

## Payments

- **Stripe embedded Checkout / Payment Element** - `components/checkout/CheckoutPageClient.tsx` uses `CheckoutElementsProvider`, `PaymentElement`, and `getStripeClient()`.
- **Checkout API** - `app/api/checkout/route.ts` creates a Stripe Checkout Session with `ui_mode: 'elements'`, returns `clientSecret`, recomputes totals server-side, validates promo codes, stores Meta IDs in metadata, and fires CAPI `InitiateCheckout`.
- **Stripe webhook** - `app/api/webhooks/stripe/route.ts` handles `checkout.session.completed`, writes Notion, mirrors promo orders, fires CAPI `Purchase`, and sends confirmation email.
- **Cash on Delivery** - `app/api/checkout/cod/route.ts` handles Bulgaria-only COD orders, writes Notion, mirrors promo orders, fires CAPI `Purchase`, sends email, and signs the success URL.
- **COD success signature** - `lib/cod-signature.ts` verifies COD success-page Purchase pixels so forged URLs cannot inject fake browser purchases.
- **Shared order writes** - `lib/orders.ts` contains `writeOrderToNotion()`, `writePromoOrderToNotion()`, and `firePurchase()`.
- **Pricing** - `lib/pricing.ts` is the server-side source of truth for bundle totals and shipping.
- **Promo codes** - `lib/promo.ts`; current live code is `ALETEA10` = 10% off the already bundle-discounted product price.
- **Promo order mirror** - `NOTION_PROMO_DATABASE_ID` stores PII-free promo order records for influencer tracking.
- **Alerts** - `lib/alerts.ts` notifies when critical Meta CAPI events fail after an order succeeds.
- **Payment methods shown** - VISA, MC, Apple Pay, Google Pay, Revolut Pay (in `components/shop/ProductPage.tsx`).

---

## Affiliate / Influencer Setup

Current working partner dashboard pattern:

| Partner | Promo code | Dashboard | Password env | Notion env |
|---|---|---|---|---|
| ALETEA | `ALETEA10` | `/partner/aletea` | `PARTNER_DASHBOARD_KEY_ALETEA` | `NOTION_PROMO_DATABASE_ID` |
| ILIYANA | `ILIYANA10` | `/partner/iliyana` | `PARTNER_DASHBOARD_KEY_ILIYANA` | `NOTION_PROMO_DATABASE_ID_ILIYANA10` |
| KALOYAN | `KALOYAN10` | `/partner/kaloyan` | `PARTNER_DASHBOARD_KEY_KALOYAN` | `NOTION_PROMO_DATABASE_ID_KALOYAN10` |

To add a new influencer:
1. Add the promo code to `lib/promo.ts`.
2. Add or verify promo tests in `__tests__/promo.test.ts`.
3. Add the partner entry in `lib/partner-dashboard.ts` with:
   - `name`
   - `promoCode`
   - `keyEnv`
   - `notionDbEnv`
   - `localPassword`
4. Add a dashboard test in `__tests__/partner-dashboard.test.ts`.
5. Add Vercel production env vars:
   - `PARTNER_DASHBOARD_KEY_<NAME>`
   - `NOTION_PROMO_DATABASE_ID_<PROMOCODE>` unless using the default `NOTION_PROMO_DATABASE_ID`.
6. In Notion, create the influencer orders page/table with columns:
   - `Name` title
   - `Промо код` text
   - `Сума` number
   - `Артикули` text
   - `Дата` date
7. Connect the Notion page to the `ALPÉ Store` integration.
8. Run:
   ```bash
   npm.cmd test -- --runTestsByPath __tests__\promo.test.ts __tests__\partner-dashboard.test.ts
   npm.cmd run build
   ```

Important Notion gotcha: the Vercel Notion env may be a data source ID, database ID, or parent page ID containing an inline database. `lib/partner-dashboard.ts` intentionally resolves all three. Do not remove that resolver. This was required for ALETEA, whose env pointed at the Notion page rather than the inline database/data source.

Manual attribution: if an order came from an influencer but the customer did not use the code, add a row manually to that influencer's Notion table with the influencer promo code. The dashboard will count it as revenue for that partner. Example for ALETEA:
`Name = cod-1780918006985-YT70`, `Промо код = ALETEA10`, `Сума = 50.98`, `Дата = June 8, 2026 2:26 PM`.

---

## Legal & Compliance

All implemented. Key facts:
- Return period: **14 calendar days** (Consumer Rights Directive 2011/83/EU, Bulgarian Consumer Protection Act)
- Warranty: **24 months** (Directive 2019/771)
- ODR link: `https://ec.europa.eu/consumers/odr` - in footer and terms
- Cookie consent: `localStorage` key `alpe-cookie-consent`, values `'all'` or `'necessary'`
- Cookie revocation: footer cookie settings button calls `resetCookieConsent()`
- Delivery: **1-3 business days** (consistent across terms and product page)
- Bundle reference prices: shown as separate-item reference totals, not struck-through, for Omnibus compliance

---

## Favicon

`app/icon.tsx` returns an SVG response (`image/svg+xml`) with the `ALPE` wordmark in `linen` on `onyx` background.
`app/favicon.ico` has been deleted because it was overriding `icon.tsx`.

---

## Hero Rotating Images

6 images cycle every 1.5s in the headline inline circle:
```text
public/images/hero/person-1-night.png through person-6-night.png
```
Defined in `heroContent.heroFaceImages` in `lib/data/content.ts`.

---

## Known Gotchas

### Vercel Deployment
Use `vercel.cmd deploy --prod --yes` on Windows when PowerShell blocks `vercel.ps1`. GitHub/Vercel integration should also deploy after pushed commits when configured.

### FinalCtaSection.tsx - Recurring Build Failure
`components/landing/FinalCtaSection.tsx` has had unused import regressions before. If Vercel build fails on ESLint `no-unused-vars`, check this file first.

### React Inline Styles vs CSS Classes
Inline `style={{}}` props beat CSS classes. Use `!important` in CSS/`<style>` tags to override them.

### Tailwind JIT + Keyframe Animations With `100vw`
Tailwind can silently drop `100vw` inside `@keyframes`. Use a raw `<style>` tag in the component instead.

### ProductPage.tsx Secondary Text Color
Inline styles use `rgba(28,15,10,0.8)` for secondary text, equivalent to `text-stone` on Tailwind pages.

### Footer Is a Client Component
`components/layout/Footer.tsx` uses `'use client'` because it imports `resetCookieConsent` from `CookieBanner`.

### Framer Motion `ease` Type
```ts
import type { Transition } from 'framer-motion'
const t = (delay: number): Transition => ({ duration: 0.6, delay, ease: 'easeOut' })
```

### `motion(Link)` in Tests
Mock `framer-motion` when tests render motion-wrapped Next links.

### `next/image` With `fill`
Always include the `sizes` prop.

### Sticky Scroll (BenefitsScroll)
`-mb-[100vh]` negative margin on sticky wrapper.

---

## Dev Commands

```bash
cd E:/ALPE/alpe-store
npm run dev        # http://localhost:3000, or 3001 if 3000 is occupied
npm test           # Jest
npm run build      # production build check
```
