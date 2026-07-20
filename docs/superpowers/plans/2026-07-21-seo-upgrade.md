# ALPÉ SEO Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a local, preview-first technical/ecommerce SEO upgrade with indexable Daily and Evening product pages, cross-selling through the existing shop bundle flow, and the user-supplied homepage hero video.

**Architecture:** Preserve `/shop` as the shared bundle/pricing source of truth while making `/product/alpe-daily` and `/product/alpe-evening` distinct search landing pages. Centralize URL, route, metadata, and merchant-policy facts in `lib/seo.ts`; use a small pure shop-selection helper to translate cross-sell query parameters into the existing client-side bundle state.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Jest/React Testing Library, Next Metadata API, schema.org JSON-LD, Tailwind CSS.

## Global Constraints

- Work only in `E:/ALPE/alpe-store`; never create or use a worktree.
- Preserve every unrelated pre-existing working-tree change.
- Keep `/shop` as the canonical bundle and cross-sell conversion hub.
- Do not change the existing 1/2/3-pair prices or checkout calculations.
- Do not invent reviews, ratings, GTINs, studies, certificates, or medical evidence.
- Use the attached `E:/Google Downloads/alpe website.mp4` only in the local preview until a production-sized rendition is available or the user explicitly accepts its 14.6 MB cost.
- Do not push or deploy before explicit approval after preview review.

---

### Task 1: Establish SEO route and URL behavior

**Files:**
- Create: `__tests__/seo.test.ts`
- Modify: `lib/seo.ts`
- Modify: `app/sitemap.ts`
- Modify: `app/robots.ts`

**Interfaces:**
- Produces: `siteUrl`, `absoluteUrl(path?)`, `productUrl(product)`, `indexableRoutes`, and stable route metadata consumed by sitemap and page metadata.

- [ ] **Step 1: Write failing URL, sitemap, and robots tests**

Test that:

```ts
expect(siteUrl).toBe('https://www.alpewear.com')
expect(absoluteUrl('/shop')).toBe('https://www.alpewear.com/shop')
expect(indexableRoutes).toEqual(expect.arrayContaining([
  '', '/shop', '/about', '/science', '/certifications', '/lenses', '/faqs',
  '/pricing', '/returns', '/contact', '/privacy', '/terms',
  '/product/alpe-daily', '/product/alpe-evening',
]))
expect(indexableRoutes).not.toEqual(expect.arrayContaining(['/cart', '/checkout', '/frames']))
```

Import `sitemap()` and assert every URL uses `www`, product URLs are present, transactional routes are absent, and `lastModified` values are stable ISO dates. Import `robots()` and assert `/api/` and `/partner/` are disallowed while `/cart` and `/checkout` are not blocked from exposing page-level `noindex` metadata.

- [ ] **Step 2: Run the test and verify RED**

Run: `npm.cmd test -- --runTestsByPath __tests__/seo.test.ts --runInBand`

Expected: FAIL because the current origin is non-www, only two routes are indexable, sitemap dates are generated at build time, and robots blocks cart/checkout.

- [ ] **Step 3: Implement the minimal shared SEO configuration**

Use `https://www.alpewear.com`, add all public/product routes, associate each route with a stable last-modified date and priority, and update sitemap/robots generation from that configuration.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm.cmd test -- --runTestsByPath __tests__/seo.test.ts --runInBand`

Expected: PASS.

### Task 2: Normalize page metadata and indexing directives

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/about/page.tsx`
- Modify: `app/science/page.tsx`
- Modify: `app/certifications/page.tsx`
- Modify: `app/lenses/page.tsx`
- Modify: `app/faqs/page.tsx`
- Modify: `app/pricing/page.tsx`
- Modify: `app/returns/page.tsx`
- Modify: `app/contact/page.tsx`
- Modify: `app/privacy/page.tsx`
- Modify: `app/terms/page.tsx`
- Modify: `app/cart/page.tsx`
- Modify: `app/checkout/page.tsx`
- Modify: `app/checkout/success/page.tsx`

**Interfaces:**
- Consumes: `siteUrl`, `defaultSeo`, and canonical helper values from Task 1.
- Produces: unique unbranded child titles, descriptions, self-canonicals, and explicit transactional noindex behavior.

- [ ] **Step 1: Add metadata assertions to `__tests__/seo.test.ts`**

Assert public page metadata titles do not already end in `| ALPÉ`, each public page declares its route canonical, and cart/checkout/success declare `{ index: false, follow: false }` or `{ index: false, follow: true }` as appropriate.

- [ ] **Step 2: Run the test and verify RED**

Expected failures: repeated branded child titles, missing canonicals, and missing cart metadata.

- [ ] **Step 3: Implement minimal metadata corrections**

Keep the layout template `%s | ALPÉ`, use child titles such as `Нашата история`, add `alternates.canonical` to public pages, and move cart into a server page/layout metadata boundary if required by its current client-component implementation.

- [ ] **Step 4: Re-run SEO tests**

Expected: PASS.

### Task 3: Make product pages indexable and add cross-selling

**Files:**
- Modify: `next.config.mjs`
- Modify: `app/product/[slug]/page.tsx`
- Modify: `components/product/ProductDetailClient.tsx`
- Create: `components/product/ComplementaryProductCard.tsx`
- Modify: `lib/data/products.ts`
- Create: `__tests__/ProductCrossSell.test.tsx`

**Interfaces:**
- Consumes: `products`, `getProductBySlug`, `productUrl`, and existing `/shop` bundle pricing.
- Produces: directly accessible product pages and a complementary-product card linking to `/shop?bundle=daily-evening` plus the complementary product route.

- [ ] **Step 1: Write the failing cross-sell test**

Render the cross-sell component for each product and assert:

```ts
expect(screen.getByRole('link', { name: /Daily \+ Evening/i }))
  .toHaveAttribute('href', '/shop?bundle=daily-evening')
expect(screen.getByRole('link', { name: /ALPÉ Evening/i }))
  .toHaveAttribute('href', '/product/alpe-evening')
```

Repeat the inverse assertion for Evening recommending Daily.

- [ ] **Step 2: Run the test and verify RED**

Expected: FAIL because the component and cross-sell mapping do not exist.

- [ ] **Step 3: Implement the product architecture**

Remove the blanket product redirect. Change product metadata from `noindex` to `index, follow`. Add differentiated Bulgarian descriptions/SEO copy in product data without unsupported claims. Add breadcrumb schema, Product schema, and the complementary card below the primary product details.

- [ ] **Step 4: Run the product test and existing product tests**

Run: `npm.cmd test -- --runTestsByPath __tests__/ProductCrossSell.test.tsx __tests__/AddToCartButton.test.tsx --runInBand`

Expected: PASS.

### Task 4: Connect cross-sell links to the existing shop bundle selector

**Files:**
- Create: `lib/shop-selection.ts`
- Create: `__tests__/shop-selection.test.ts`
- Modify: `app/shop/page.tsx`
- Modify: `components/shop/ProductPage.tsx`

**Interfaces:**
- Produces: `getInitialShopSelection(bundle?: string): { lens: 'daily' | 'evening'; bundle: 1 | 2 | 3; slots: Array<'daily' | 'evening'> }`.
- `ProductPage` receives this selection as serializable initial props.

- [ ] **Step 1: Write the failing pure helper test**

```ts
expect(getInitialShopSelection('daily-evening')).toEqual({
  lens: 'daily',
  bundle: 2,
  slots: ['daily', 'evening'],
})
expect(getInitialShopSelection(undefined)).toEqual({
  lens: 'evening',
  bundle: 1,
  slots: ['evening'],
})
```

- [ ] **Step 2: Run the test and verify RED**

Expected: FAIL because the helper does not exist.

- [ ] **Step 3: Implement helper and wire server-to-client props**

Read `searchParams.bundle` in the server page, call the helper, and initialize ProductPage state from props. Do not use client-side URL parsing or duplicate bundle prices.

- [ ] **Step 4: Run selection and shop component tests**

Run: `npm.cmd test -- --runTestsByPath __tests__/shop-selection.test.ts __tests__/ShopProductPageTracking.test.tsx --runInBand`

Expected: PASS.

### Task 5: Improve merchant structured data

**Files:**
- Modify: `lib/seo.ts`
- Modify: `app/layout.tsx`
- Modify: `app/shop/page.tsx`
- Modify: `app/product/[slug]/page.tsx`
- Extend: `__tests__/seo.test.ts`

**Interfaces:**
- Produces stable Organization/WebSite IDs, organization-level Bulgarian return policy, and offer-level Bulgarian shipping details.

- [ ] **Step 1: Add failing schema-helper assertions**

Test exact facts: country `BG`, 14-day return window, free returns only if consistent with visible legal copy, EUR currency, delivery destination Bulgaria, and the existing below/above-€50 shipping rules.

- [ ] **Step 2: Run and verify RED**

Expected: FAIL because current schema lacks merchant policies and stable IDs.

- [ ] **Step 3: Implement supportable schema only**

Create reusable plain objects/helpers in `lib/seo.ts`, connect Organization/WebSite/Product entities using `@id`, add shipping/return details, and avoid unsupported aggregate ratings or identifiers.

- [ ] **Step 4: Re-run SEO tests**

Expected: PASS.

### Task 6: Replace and optimize hero delivery for preview

**Files:**
- Copy: `E:/Google Downloads/alpe website.mp4` to `public/videos/alpe-hero-preview.mp4`
- Modify: `components/landing/HeroSection.tsx`
- Create: `__tests__/HeroSection.test.tsx`

**Interfaces:**
- Produces a preview hero using `/videos/alpe-hero-preview.mp4` with `preload="metadata"`, muted autoplay, loop, playsInline, and reduced-motion fallback behavior.

- [ ] **Step 1: Write the failing hero media test**

Render HeroSection with motion/analytics mocks and assert one discoverable video source uses `/videos/alpe-hero-preview.mp4`, no video uses `preload="auto"`, and hero heading/CTA remain present.

- [ ] **Step 2: Run and verify RED**

Expected: FAIL because the current component references desktop/mobile files with eager preload.

- [ ] **Step 3: Copy the supplied binary and implement preview delivery**

Use the new source for both layouts with CSS object positioning, `preload="metadata"`, and a reduced-motion CSS rule. Lower product gallery `quality={100}` overrides to `quality={85}` where visually equivalent.

- [ ] **Step 4: Run hero tests**

Expected: PASS.

### Task 7: Verify and launch local preview

**Files:**
- No production file additions beyond Tasks 1–6.

- [ ] **Step 1: Run focused SEO tests**

Run all newly added suites together. Expected: PASS.

- [ ] **Step 2: Run full test suite**

Run: `npm.cmd test -- --runInBand`

Expected: all suites PASS with no unexpected warnings.

- [ ] **Step 3: Run production build**

Run: `npm.cmd run build`

Expected: compile, lint, type checking, route generation, robots, and sitemap generation succeed.

- [ ] **Step 4: Inspect generated metadata**

Parse `.next/server/app/**/*.html`, `sitemap.xml.body`, and `robots.txt.body`. Verify unique titles, `www` canonicals, product indexability, transactional noindex, and sitemap contents.

- [ ] **Step 5: Start preview from canonical root**

Run `npm run dev` only from `E:/ALPE/alpe-store`, bind to the available local network interface/port, and provide the preview URL.

- [ ] **Step 6: User review checkpoint**

Ask the user to inspect `/`, `/shop?bundle=daily-evening`, `/product/alpe-daily`, and `/product/alpe-evening`. Do not push or deploy until explicit approval.
