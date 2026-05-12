# ALPE — Project Reference

**ALPE** is a blue light blocking glasses brand. This is their Next.js 14 ecommerce site.

> There is no other brand. There is no "Raydiant". The brand is ALPE. Always.

---

## ⚠️ CRITICAL RULES — READ FIRST

1. **NEVER use the Preview tool or start a dev server from a worktree.** The only valid project root is `E:/ALPE/alpe-store`. Any path containing `.claude/worktrees/` is an old stale copy — do NOT serve, edit, or read from it.
2. **NEVER touch worktree directories.** They caused the site to revert to an old broken version. Ignore them completely.
3. **Always start the dev server from `E:/ALPE/alpe-store`:**
   ```bash
   cd E:/ALPE/alpe-store && npm run dev
   ```
4. **The canonical saved version is the git tag `legal`** (commit `895cd15`). To restore: `git -C E:/ALPE/alpe-store checkout legal -- .`
   - Previous saves (do not revert to these unless explicitly asked): `checkoutv1`, `pre-checkoutpage`, `save-2`, `colors`
5. **Do NOT run `git checkout` on the whole repo** without specifying files — it will blow away working changes.
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
| Language | **Bulgarian** — all user-visible strings. English requires explicit approval. |
| Website | https://www.alpewear.com |
| Email | hello@alpe.bg (general), support@alpe.bg, returns@alpe.bg |

---

## Color Palette (warm tokens — no `brand-` prefix)

| Token | Hex | Role |
|---|---|---|
| `onyx` | `#2D0E04` | Dark section backgrounds (footer) |
| `iron` | `#7C3018` | Dark card/section accent, body text color |
| `gold` | `#C4A266` | Stars, highlight accents |
| `stone` | `#9B7B68` | Muted/secondary text |
| `linen` | `#EDE4D6` | Navbar text, light text on dark/brown backgrounds |
| `parchment` | `#FFF0E0` | **Main page background — all light sections** |
| `peach` | `#FFE4CC` | Available for accents |
| `sand` | `#F5DFC5` | Available for accents |
| `cream` | `#FFFBF5` | Available (near-white, rarely used) |
| `white` | `#FFFFFF` | Avoid — use linen/parchment instead |
| `#B8906A` | — | **Navbar + HowItWorks section background (soft brown)** |

> **Body default:** `background-color: parchment` · `color: iron`
> **Zero pure white or black anywhere on the site.**

---

## Contrast Rules (IMPORTANT)

On **dark backgrounds** (`bg-iron`, `bg-onyx`, inline dark styles):
- Use `text-linen` variants — e.g. `text-linen/75`, `text-linen/60`, `text-linen/45`
- Never use `text-stone` or `text-stone/XX` on dark backgrounds — near invisible

On **light backgrounds** (`bg-parchment`, `bg-sand`, white cards):
- `text-stone` is fine for body copy
- Avoid `text-stone/40` or lower — use `text-stone/60` minimum
- Avoid `text-gold/40` — use `text-gold/65` minimum for decorative numbers

---

## Section Background Map

| Section | Background | Text |
|---|---|---|
| Navbar | `#B8906A` (soft brown) | `linen` |
| Hero | `parchment` | `iron` |
| BenefitsScroll | `parchment` | `iron` |
| DarkCtaCard outer | `parchment` | — |
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
| Display / headings (h1–h3) | Cormorant Garamond (serif) | `--font-cormorant` / `font-serif` |
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
| Styles | Tailwind CSS v3 — warm token system (see above) |
| Animation | Framer Motion v12 |
| State | Zustand v5 — cart store at `lib/store/cartStore.ts` |
| Fonts | Cormorant Garamond + Raleway via `next/font/google` |
| Payments | Stripe Checkout Sessions (`app/api/checkout/route.ts`) |
| Orders DB | Notion (`app/api/webhooks/stripe/route.ts`) |
| Analytics | Meta Pixel + CAPI (see Analytics section below) |
| Tests | Jest + React Testing Library |
| Dev server | `npm run dev` from `E:/ALPE/alpe-store` → port 3000 |
| GitHub | https://github.com/petarkozarev1/alpe-store |

---

## Data layer — `lib/data/`

| File | Exports |
|---|---|
| `site.ts` | `siteConfig` — brand name, tagline, nav links, footer |
| `content.ts` | All landing page copy + `heroFaceImages` array (6 rotating person images) |
| `products.ts` | `products: Product[]`, `getProductBySlug(slug)` |
| `index.ts` | Barrel re-export |

**`withoutItems` and `withItems` are `string[]`**, not objects.

---

## Analytics — Meta Pixel + Conversions API

### Pixel ID
`1435898268342097`

### Cookie consent gate
All client-side pixel events are gated on `localStorage.getItem('alpe-cookie-consent') === 'all'`. Never fire pixel events without checking consent.

### Client-side events (browser)

| Event | File | Trigger |
|---|---|---|
| `PageView` | `components/analytics/MetaPixel.tsx` | Every page load |
| `ViewContent` | `components/shop/ProductPage.tsx` | Product page mount |
| `AddToCart` | `components/shop/ProductPage.tsx` | Add to cart button click |
| `ViewCart` | `components/layout/CartDrawer.tsx` | Cart drawer opens |
| `InitiateCheckout` | `components/layout/CartDrawer.tsx` | "Към плащане" click |
| `InitiateCheckout` | `components/checkout/CheckoutPageClient.tsx` | Checkout page mount |
| `Purchase` | `components/analytics/PurchasePixelFire.tsx` | Success page mount (fires once) |
| `Lead` | `components/landing/NewsletterSection.tsx` | Newsletter form submit |
| `CTAClick` (custom) | `HeroSection`, `HowItWorksSection`, `FaqSection` | CTA button click |

### Server-side CAPI (`lib/meta-capi.ts`)
- Fires `Purchase` from `app/api/webhooks/stripe/route.ts` after every confirmed Stripe order
- PII (email, phone, first name, last name, city) is SHA-256 hashed before sending
- Uses `event_id: purchase-{session.id}` for browser/server deduplication
- Requires `META_CAPI_TOKEN` env var in Vercel — token stored in Vercel project settings
- Gracefully skips (logs warning) if token not set

### Helper function
```ts
import { firePixelEvent } from '@/components/analytics/MetaPixel'
firePixelEvent('EventName', { key: value }) // safe, consent-gated, try/catch
```

---

## Payments

- **Stripe Checkout Sessions** — `app/api/checkout/route.ts`
- **Webhook** — `app/api/webhooks/stripe/route.ts` — handles `checkout.session.completed`, saves to Notion, fires CAPI
- **Discount codes** — handled in `components/checkout/CheckoutPageClient.tsx`:
  - `WELCOME10` = 10% off
  - `FAMILY40` = 40% off
- **Payment methods shown** — VISA, MC, Apple Pay, Google Pay, Revolut Pay (in `components/shop/ProductPage.tsx`)

---

## Legal & Compliance (EU + Bulgarian law)

All implemented. Key facts:
- Return period: **14 calendar days** (Consumer Rights Directive 2011/83/EU, ЗЗП чл.50)
- Warranty: **24 months** (Directive 2019/771, ЗЗП чл.112-114)
- ODR link: `https://ec.europa.eu/consumers/odr` — in footer and terms
- Cookie consent: `localStorage` key `alpe-cookie-consent`, values `'all'` or `'necessary'`
- Cookie revocation: "Настройки за бисквитки" button in footer calls `resetCookieConsent()`
- Delivery: **1–3 работни дни** (consistent across terms and product page)
- Bundle reference prices: shown as "поотделно: €X" (not struck-through, Omnibus compliant)

---

## Favicon

`app/icon.tsx` — Next.js ImageResponse generating "ALPÉ" wordmark in `linen` on `onyx` background.
`app/favicon.ico` has been deleted (was overriding icon.tsx).

---

## Hero Rotating Images

6 images cycle every 1.5s in the headline inline circle:
```
public/images/hero/person-1-night.png  through  person-6-night.png
```
Defined in `heroContent.heroFaceImages` in `lib/data/content.ts`.

---

## Known Gotchas

### Vercel deployment
Token expires between sessions — user must provide a fresh one each time.
Command: `VERCEL_TOKEN=<token> vercel --prod --yes` from `E:/ALPE/alpe-store`

### FinalCtaSection.tsx — recurring build failure
`components/landing/FinalCtaSection.tsx` has an unused `Button` import that breaks Vercel builds (ESLint `no-unused-vars`). Remove it if it reappears.

### React inline styles vs CSS classes
Inline `style={{}}` props beat CSS classes. Use `!important` in CSS/`<style>` tags to override them.

### Tailwind JIT + keyframe animations with `100vw`
Tailwind silently drops `100vw` inside `@keyframes`. Use a raw `<style>` tag in the component instead.

### ProductPage.tsx secondary text color
Inline styles use `rgba(28,15,10,0.8)` for secondary text (equivalent to `text-stone` on Tailwind pages).

### Footer is a Client Component
`components/layout/Footer.tsx` uses `'use client'` (imports `resetCookieConsent` from CookieBanner).

### Framer Motion `ease` type
```ts
import type { Transition } from 'framer-motion'
const t = (delay: number): Transition => ({ duration: 0.6, delay, ease: 'easeOut' })
```

### `motion(Link)` in tests
Mock `framer-motion` — see previous session notes.

### `next/image` with `fill`
Always include `sizes` prop.

### Sticky scroll (BenefitsScroll)
`-mb-[100vh]` negative margin on sticky wrapper.

### MetaPixel noscript img tag
Uses `eslint-disable-next-line @next/next/no-img-element` — standard 1×1 tracking pixel, next/image not applicable here.

---

## Dev commands

```bash
cd E:/ALPE/alpe-store
npm run dev        # http://localhost:3000
npm test           # Jest
npm run build      # production build check
```
