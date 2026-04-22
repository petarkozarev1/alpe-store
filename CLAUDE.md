# ALPE — Project Reference

**ALPE** is a blue light blocking glasses brand. This is their Next.js 14 ecommerce site.

> There is no other brand. There is no "Raydiant". The brand is ALPE. Always.

---

## Brand Identity

| Property | Value |
|---|---|
| Brand name | ALPE |
| Product | Blue light blocking glasses |
| Tagline | "Screen All Day. Sleep All Night." |
| Target customer | People who work long hours in front of computers or phones |
| Positioning | Premium feel, affordable prices |
| Language | English |

### Color Palette (warm tokens — no `brand-` prefix)

| Token | Hex | Role |
|---|---|---|
| `onyx` | `#2D0E04` | Primary text, dark section backgrounds |
| `iron` | `#7C3018` | Warm dark card/section accent |
| `gold` | `#C4A266` | Logo, stars, highlight accents |
| `stone` | `#9B7B68` | Muted/secondary text |
| `linen` | `#EDE4D6` | Light text on dark backgrounds |
| `cream` | `#FFFBF5` | Navbar, Hero background |
| `ivory` | `#FFF6EC` | BenefitsScroll, FAQ background |
| `parchment` | `#FFF0E0` | DarkCtaCard outer, Ingredients background |
| `peach` | `#FFE4CC` | Comparison section background |
| `sand` | `#F5DFC5` | Gallery background |
| `white` | `#FFFFFF` | Pure white where needed |

### Typography

| Role | Font | Variable |
|---|---|---|
| Display / headings (h1–h3) | Cormorant Garamond (serif) | `--font-cormorant` / `font-serif` |
| Body / UI / nav | Raleway (sans-serif) | `--font-raleway` / `font-sans` |

Weights: Cormorant 400/500/600 · Raleway 300/400/500/600

### Button Variants

| Variant | Style |
|---|---|
| `primary` | `bg-onyx text-linen hover:bg-iron` |
| `outlined-black` | `border-onyx text-onyx hover:bg-onyx hover:text-linen` |
| `outlined-white` | `border-linen text-linen hover:bg-linen hover:text-onyx` |
| `pill` | `bg-onyx text-linen rounded-full` |

### Section Background Map

| Section | Background |
|---|---|
| Navbar | `cream` |
| Hero | `cream` |
| BenefitsScroll | `ivory` |
| DarkCtaCard outer | `parchment` |
| DarkCtaCard card | `iron` (dark) |
| Ingredients | `parchment` |
| HowItWorks | `onyx` (dark) |
| Comparison | `peach` |
| Gallery | `sand` |
| FAQ | `ivory` |
| FinalCta | `iron` (dark) |
| Footer | `onyx` (dark) |

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 App Router, TypeScript |
| Styles | Tailwind CSS v3 — warm token system (see above) |
| Animation | Framer Motion v12 — use `motion.div` etc., `motion()` factory for custom components |
| State | Zustand v5 — cart store at `lib/store/cartStore.ts` |
| Fonts | Cormorant Garamond + Raleway via `next/font/google` |
| Tests | Jest + React Testing Library, `nextJest` wrapper |
| Images | `unoptimized: true` in `next.config.mjs` |
| Dev server | `npm run dev` → port 3000 |

---

## Data layer — `lib/data/`

All copy and product data lives here. Components are purely presentational.

| File | Exports |
|---|---|
| `site.ts` | `siteConfig` — brand name, tagline, nav links, footer links |
| `content.ts` | `heroContent`, `benefits`, `darkCtaContent`, `ingredientsContent`, `ingredients`, `howItWorksContent`, `steps`, `beforeAfterContent`, `withoutItems`, `withItems`, `testimonialContent`, `galleryContent`, `faqs`, `faqSectionContent`, `finalCtaContent` |
| `products.ts` | `products: Product[]`, `getProductBySlug(slug)` |
| `index.ts` | Barrel re-export of everything above |

**`withoutItems` and `withItems` are `string[]`**, not objects.

---

## Types (`lib/types.ts`)

```ts
Product { id, slug, name, subtitle, description, price, images: string[], variants: Variant[], badge? }
Variant { id, label, inStock }
CartItem { productId, variantId, name, variantLabel, price, quantity, image, slug }
SiteConfig { brand, tagline, nav: NavLink[], footer: { tagline, pages, social } }
BenefitItem { id, headline, side: 'left'|'right' }
StepItem { number, title, description, image }
Ingredient { number, name, description }
FaqItem { question, answer }
```

---

## Cart store (`lib/store/cartStore.ts`)

```ts
useCartStore() → { items, isDrawerOpen, addItem, removeItem, updateQuantity,
                   clearCart, openDrawer, closeDrawer, getItemCount, getSubtotal }
```

- `addItem` increments quantity if same `productId+variantId` already in cart
- `getItemCount()` / `getSubtotal()` are selector functions (call them as functions)

---

## File map

```
app/
  layout.tsx                 Root layout — Cormorant + Raleway, Navbar, CartDrawer, Footer
  page.tsx                   Landing page — assembles all sections
  shop/page.tsx              /shop — ProductGrid with sort/filter
  product/[slug]/page.tsx    /product/[slug] — generateStaticParams, notFound()
  cart/page.tsx              /cart — useCartStore
  checkout/page.tsx          /checkout — CheckoutForm + OrderSummary

components/
  landing/
    HeroSection.tsx
    BenefitsScroll.tsx       Sticky glasses + scrolling benefit panels (-mb-[100vh] trick)
    DarkCtaCard.tsx          Dark card with iron background
    IngredientsSection.tsx   Lens technology section
    HowItWorksSection.tsx    3 step cards, onyx background
    BeforeAfterSlider.tsx    Drag/touch slider, keyboard a11y
    ComparisonSection.tsx    Two-column without/with list (items are strings)
    TestimonialSection.tsx
    GallerySection.tsx       4-column grid
    FaqSection.tsx           AnimatePresence accordion
    FinalCtaSection.tsx      iron background
  layout/
    Navbar.tsx               Sticky, cream bg, gold logo wordmark, mobile hamburger
    CartDrawer.tsx           Slides from right, role="dialog"
    Footer.tsx               onyx background, giant brand watermark
  product/
    ImageGallery.tsx
    VariantSelector.tsx
    AddToCartButton.tsx
    ProductDetailClient.tsx
  shop/
    ProductCard.tsx
    FilterBar.tsx
    ProductGrid.tsx
  checkout/
    CheckoutForm.tsx
    OrderSummary.tsx
  ui/
    Badge.tsx
    Button.tsx               Uses motion(Link) — see gotcha below
    SectionWrapper.tsx

lib/
  data/                      (see Data layer above)
  store/cartStore.ts
  types.ts
```

---

## Known patterns & gotchas

### Framer Motion `ease` type
`'easeOut'` widens to `string` and breaks TS. Fix:
```ts
import type { Transition } from 'framer-motion'
const t = (delay: number): Transition => ({ duration: 0.6, delay, ease: 'easeOut' })
```

### `motion(Link)` in tests
`Button.tsx` calls `motion(Link)`. Mock as:
```ts
jest.mock('framer-motion', () => {
  const el = (tag: string) => ({ children, ...props }: any) => {
    const Tag = tag as keyof JSX.IntrinsicElements
    return <Tag {...props}>{children}</Tag>
  }
  const motion = Object.assign((C: any) => C, {
    div: el('div'), span: el('span'), h2: el('h2'),
    button: el('button'), blockquote: el('blockquote'),
  })
  return { motion, AnimatePresence: ({ children }: any) => <>{children}</> }
})
```

### `next/image` with `fill`
Always include `sizes` prop.

### Sticky scroll (BenefitsScroll)
`-mb-[100vh]` negative margin on sticky wrapper so benefit panels scroll over the fixed glasses image.

### BeforeAfterSlider
Touch guard uses `dragging.current` ref. Handle has `role="slider"` + keyboard support.

---

## Dev commands

```bash
npm run dev        # http://localhost:3000
npm test           # Jest
npm run build      # production build check
```
