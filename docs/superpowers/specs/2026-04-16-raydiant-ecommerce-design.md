# ALPE Ecommerce — Design Spec
**Date:** 2026-04-16  
**Status:** Approved — ready for implementation  
**Approach:** Data-layer separation (Approach 2), CMS migration path documented

---

## Overview

Pixel-perfect Next.js 14+ implementation of the ALPE brand, extended into a full ecommerce flow. All brand config, copy, and product data lives in `/lib/data/`.

**Tech stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Zustand

---

## 1. Routes

| Route | Description |
|---|---|
| `/` | Landing page — all 13 sections |
| `/shop` | Product listing with filter/sort |
| `/product/[slug]` | Product detail — gallery, variants, add-to-cart |
| `/cart` | Cart page (fallback) |
| `/checkout` | Checkout UI (UI only — no payment) |

---

## 2. File Structure

```
app/
  layout.tsx                ← root layout, fonts, CartProvider
  page.tsx                  ← landing page
  shop/page.tsx
  product/[slug]/page.tsx
  cart/page.tsx
  checkout/page.tsx

components/
  layout/
    Navbar.tsx
    Footer.tsx
    CartDrawer.tsx
  landing/
    HeroSection.tsx
    BenefitsScroll.tsx
    DarkCtaCard.tsx
    IngredientsSection.tsx
    HowItWorksSection.tsx
    BeforeAfterSlider.tsx
    ComparisonSection.tsx
    TestimonialSection.tsx
    GallerySection.tsx
    FaqSection.tsx
  shop/
    ProductGrid.tsx
    ProductCard.tsx
    FilterBar.tsx
  product/
    ImageGallery.tsx
    VariantSelector.tsx
    AddToCartButton.tsx
  checkout/
    CheckoutForm.tsx
    OrderSummary.tsx
  ui/
    Badge.tsx               ← section badge (logo icon + label pill)
    Button.tsx              ← black / outlined / pill variants
    SectionWrapper.tsx      ← consistent padding + max-width

lib/
  data/
    site.ts                 ← brand name, nav links, footer copy
    products.ts             ← product catalog
    content.ts              ← all section copy (hero, benefits, FAQs etc.)
  store/
    cartStore.ts            ← Zustand cart state
  types.ts                  ← shared TypeScript interfaces

public/
  images/                   ← product + editorial images
```

---

## 3. Design System

### Colors
```
--color-black:       #000000
--color-white:       #FFFFFF
--color-off-white:   #F5F5F0
--color-muted:       #888888
--color-gray-light:  #E8E8E8
--color-dark-card:   #111111
--color-charcoal:    #555555
--color-footer:      #1A1A1A
--color-border:      #E5E5E5
```

### Typography
- **Font:** DM Sans (Google Fonts)
- **Weights:** 400, 500, 700, 800

| Role | Size | Weight | Letter-spacing |
|---|---|---|---|
| Hero H1 | 72px | 800 | -2px |
| Section H2 | 56px | 700 | -1px |
| Card H3 | 40px | 700 | 0 |
| Body | 16px | 400 | 0 |
| Muted | 16px | 400 | 0 |
| Badge | 14px | 500 | 0 |
| Nav links | 15px | 500 | 0 |
| Footer wordmark | 160px | 800 | -4px |

### Spacing
- Max content width: `1200px`
- Section padding: `96px` vertical (desktop) → `64px` (tablet) → `48px` (mobile)
- Navbar height: `64px`

### Buttons
| Variant | Style |
|---|---|
| Primary | `bg-black text-white px-6 py-3 rounded-xl` |
| Outlined white | `border border-white text-white px-6 py-3 rounded-xl` |
| Outlined black | `border border-black text-black px-6 py-3 rounded-xl` |
| Nav CTA | `bg-black text-white px-5 py-2 rounded-full` |

---

## 4. Landing Page — Section Breakdown

### 4.1 Navbar
- Sticky, white bg, 1px bottom border (`#E5E5E5`)
- Logo: circle icon + wordmark, left-aligned
- Nav links: centered (Benefits, Ingredients, How it Works, FAQs) — anchor links to page sections
- CTA: black pill "Buy Now →", right-aligned, links to `/shop`
- Mobile: hamburger menu, links stack vertically in a slide-down drawer

### 4.2 Hero
- Centered layout, white bg
- "Chosen by 2500+ Women" Badge component at top
- H1 with inline circular face image (`rounded-full`, ~56px) embedded mid-sentence between "Endless" and "Glow."
- Subtext paragraph, muted
- Black CTA → `/shop`
- Entrance: navbar + hero content fade up on mount (`y: 20 → 0`, `opacity: 0 → 1`, `duration: 0.6s`)

### 4.3 Benefits Sticky Scroll
- Tall scroll container (~300vh)
- Product bottle image: `position: sticky`, vertically centered, `top: 50%`, `transform: translateY(-50%)`
- 3 benefit text blocks scroll past, alternating left / right:
  1. "Smooth Away Fine Lines Instantly" (right)
  2. "Reveal Radiant and Youthful Skin" (left)
  3. "Boost Your Confidence" (right)
- Each text block: `whileInView` fade + slide from its side (x: ±40 → 0)

### 4.4 Dark CTA Card
- Rounded card `bg-[#111]`, `rounded-2xl`, `overflow: visible`
- Product image: negative `margin-top` to bleed above card
- 3 overlapping avatar circles + 5 stars + "2,500+ Glowing" label
- Bold white heading + outlined white "Buy Now →" → `/shop`

### 4.5 Ingredients Section
- "Ingredients" Badge
- H2 centered
- Full-width editorial photo, `rounded-xl`
- "Key Ingredients" heading (left) + "Buy Now →" (right) — flex space-between
- 5 numbered rows: circled number + ingredient name (left) + description (right, muted)
- `<hr>` dividers between each row
- `whileInView` stagger on rows (each fades up with 0.1s delay)

### 4.6 How it Works
- Full-bleed black section
- Left column (sticky on desktop): "How it Works" Badge + H2 "Simple Steps. Lasting Results." + outlined "Buy Now →"
- Right column: 3 step cards scroll past
  - Each card: photo + bottom-left overlay ("Step N" pill badge + bold title + description)
  - Cards enter with `whileInView` scale (0.95 → 1) + fade

### 4.7 Before/After Slider
- "Why Choose ALPE?" Badge + H2 centered above
- Custom `BeforeAfterSlider` component:
  - Two images stacked, clip-path controlled by drag handle position
  - Circular `< >` drag handle at center
  - "Before" label top-left, "After" label top-right (pill style)
  - Mouse/touch drag supported
- Below slider: "Without ALPE" vs "With ALPE" comparison cards (see §4.8)

### 4.8 Comparison Cards
- 2-col grid, `bg-[#E8E8E8]`, `rounded-2xl`
- Left "Without": muted text, dark circle ✗ icon per item
- Right "With": bold black text, filled black circle ✓ icon per item
- Black CTA centered below → `/shop`

### 4.9 Testimonial
- "Testimonial" Badge
- Large centered bold quote in `"…"` with `text-2xl font-bold`
- 5 star icons + `~ Emily Carter` attribution

### 4.10 Social Proof Gallery
- H2: "Beautiful Faces Powered by ALPE"
- 4-column grid of portrait photos, `rounded-xl`
- Black CTA below → `/shop`

### 4.11 FAQs
- 2-col layout: left = badge + H2 + CTA (sticky top on scroll); right = accordion
- 5 questions, each row:
  - Question text + chevron right-aligned
  - Chevron rotates 0° → 180° on open (`transition: transform 0.3s`)
  - Answer height animates 0 → auto via Framer Motion `AnimatePresence`
  - `<hr>` dividers between items

### 4.12 Final CTA
- `bg-[#555]` section
- "Get Yours Now" Badge (white variant)
- H2 white "Radiate With Confidence Today"
- White outlined "Buy Now →" → `/shop`
- Editorial image of woman with towel, overlapping into footer

### 4.13 Footer
- `bg-[#1A1A1A]`
- Row 1: Logo + tagline left; "Pages Link" (Privacy Policy, 404) + "Social Media" (X, Instagram) right
- Row 2: Full-bleed "ALPE" in ~160px, `color: #2a2a2a` (barely visible on dark bg)
- Row 3: "ALPE © 2026 – All Rights Reserved" left; "Template By Charles Owoeye" right
- Mobile: stacks vertically

---

## 5. Shop Page (`/shop`)

- Grid of `ProductCard` components (2-col mobile, 3-col desktop)
- `FilterBar`: sort dropdown (Price ↑↓, Name A–Z) + variant filter pills
- `ProductCard`: image, name, price, "View Product" on hover overlay
- `whileInView` stagger entrance on cards

---

## 6. Product Detail Page (`/product/[slug]`)

- `ImageGallery`: main image + thumbnail strip below; click thumbnail → swap main
- Product name, price, short description
- `VariantSelector`: pill buttons per variant; selected = black filled
- `AddToCartButton`: black CTA; on click → adds to Zustand store + opens `CartDrawer`
- Visual feedback: button briefly shows "Added ✓" for 1.5s

---

## 7. Cart Drawer

- Rendered in root `layout.tsx`, always in DOM
- Slides in from right: `x: "100%" → 0`, backdrop `opacity: 0 → 0.4`
- CartItem rows: image thumbnail, name, variant, price, quantity `+/-` controls, remove `×`
- Subtotal row
- "Checkout →" button → `/checkout`
- "Continue Shopping" closes drawer

---

## 8. Checkout Page (`/checkout`)

- Two-column layout (desktop): form left, order summary right
- Form fields: First name, Last name, Email, Address, City, Postal code, Country
- Order summary: CartItem list + subtotal + shipping ("Free") + total
- "Place Order →" button: logs to console, shows "Order placed!" confirmation state
- UI only — no payment integration

---

## 9. TypeScript Interfaces (`lib/types.ts`)

```typescript
interface Product {
  id: string
  slug: string
  name: string
  subtitle: string
  description: string
  price: number
  images: string[]
  variants: Variant[]
  badge?: string
}

interface Variant {
  id: string
  label: string
  inStock: boolean
}

interface CartItem {
  productId: string
  variantId: string
  name: string
  variantLabel: string
  price: number
  quantity: number
  image: string
}

interface SiteConfig {
  brand: string
  tagline: string
  nav: { label: string; href: string }[]
  footer: {
    tagline: string
    pages: { label: string; href: string }[]
    social: { label: string; href: string }[]
  }
}
```

---

## 10. Zustand Cart Store (`lib/store/cartStore.ts`)

```typescript
interface CartStore {
  items: CartItem[]
  isDrawerOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantId: string) => void
  updateQuantity: (productId: string, variantId: string, qty: number) => void
  clearCart: () => void
  openDrawer: () => void
  closeDrawer: () => void
}
```

---

## 11. Animations Reference

| Component | Animation | Method |
|---|---|---|
| Page load | Navbar + hero fade up | Framer `initial/animate` on mount |
| All sections | Fade up on scroll enter | Framer `whileInView` |
| Benefits scroll | Product sticky, text fade in from sides | CSS sticky + `whileInView` |
| How it Works cards | Scale + fade stagger | `whileInView` + `delay` |
| Before/After slider | Drag divider | Custom pointer/touch events + `clip-path` |
| FAQ accordion | Height expand, chevron rotate | Framer `AnimatePresence` + CSS transform |
| Cart drawer | Slide from right, backdrop fade | Framer `AnimatePresence` |
| Button hover | Scale 0.97 | Framer `whileHover` |

---

## 12. CMS Migration Path (Future — Approach 3)

When ready to add Sanity or Contentful:

| Current file | Future Sanity schema |
|---|---|
| `lib/data/site.ts` | `siteSettings` singleton document |
| `lib/data/products.ts` | `product` document type with slug |
| `lib/data/content.ts` | `landingPage` document with portable text |

Each data file exports a `getData()` function today returning static objects. Migration = replace function body with `await sanityClient.fetch(GROQ_QUERY)`. Zero component changes required.

---

## 13. Responsiveness

| Breakpoint | Behavior |
|---|---|
| 375px (mobile) | Single column, hamburger nav, stacked sections |
| 768px (tablet) | 2-col grids, nav links visible |
| 1024px (small desktop) | Full layout, sticky elements active |
| 1440px (desktop) | Max-width container centered, full typography scale |
