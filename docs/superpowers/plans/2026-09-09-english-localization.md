# English Localization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add complete Bulgarian/English storefront localization while preserving the current Bulgarian site, prices, checkout behavior, analytics, and P2G reporting.

**Architecture:** Put customer-facing pages under an internal `[locale]` App Router segment. Middleware keeps Bulgarian URLs unprefixed through rewrites, exposes English at `/en`, and composes locale routing with P2G attribution. Typed dictionaries localize content; stable IDs and codes remain language-neutral.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Jest, Vercel Middleware.

**Spec:** Approved conversation proposal dated 2026-09-09.

## Global Constraints

- `origin/master` commit `9a2476d` is the canonical baseline.
- Bulgarian public URLs and rendered behavior must remain compatible.
- English public URLs use `/en`.
- P2G attribution, delayed reporting, prices, products, Stripe and Notion behavior must not regress.
- No automatic browser-language redirect; only an explicit language selection is remembered.
- Every behavior change follows red-green-refactor.

---

### Task 1: Locale primitives and routing

**Files:** Create `lib/i18n/config.ts`, `lib/i18n/routing.ts`, `__tests__/i18n-routing.test.ts`; modify `middleware.ts`.

**Interfaces:** Produce `Locale`, `localizePath()`, `stripLocale()`, `resolveLocaleRequest()` and composed P2G/locale middleware behavior.

- [ ] Write failing tests for unprefixed Bulgarian paths, `/en` paths, query preservation, invalid locale handling and P2G redirect ordering.
- [ ] Run the focused tests and confirm expected failures.
- [ ] Implement the locale primitives and middleware composition.
- [ ] Run focused and P2G tests.
- [ ] Commit the routing foundation.

### Task 2: Locale layout and route migration

**Files:** Move public pages/layouts into `app/[locale]/`; preserve `app/api/`, `app/partner/`, `app/robots.ts`, `app/sitemap.ts`, `app/icon.tsx`; create `__tests__/localized-routes.test.ts`.

**Interfaces:** Every public page receives validated `params.locale`; `app/[locale]/layout.tsx` outputs the correct `<html lang>`.

- [ ] Write failing route/layout tests for `bg` and `en`.
- [ ] Run them and confirm the missing localized routes.
- [ ] Move routes mechanically and validate locale parameters.
- [ ] Run route tests and the production build.
- [ ] Commit the route migration.

### Task 3: Typed dictionaries and shared layout

**Files:** Create `lib/i18n/dictionaries/{bg,en}.ts`, `lib/i18n/get-dictionary.ts`, `components/i18n/LanguageSwitcher.tsx`; modify navbar, footer, cookie banner and cart drawer.

**Interfaces:** English dictionary must satisfy the Bulgarian dictionary shape; shared components consume `locale` and `dictionary` props; switcher preserves the equivalent route and query string.

- [ ] Write failing dictionary parity and route-switch tests.
- [ ] Implement dictionaries and shared translated UI.
- [ ] Verify desktop/mobile navigation, accessibility labels, cookie controls and cart drawer.
- [ ] Commit shared localization.

### Task 4: Persist cart safely across locale changes

**Files:** Modify `lib/store/cartStore.ts`; extend `__tests__/cartStore.test.ts`.

**Interfaces:** Persist only cart items using a versioned Zustand storage payload; drawer state is never persisted and checkout totals remain server-calculated.

- [ ] Write failing hydration/persistence/migration tests.
- [ ] Implement minimal persistence.
- [ ] Run cart, pricing and checkout tests.
- [ ] Commit cart persistence.

### Task 5: Landing, catalogue and informational pages

**Files:** Modify `lib/data/`, landing/shop/product components, and localized public pages; extend their existing tests.

**Interfaces:** Stable product IDs, slugs, prices, variants and images remain in one catalogue; localized product copy is selected by locale.

- [ ] Write failing English rendering tests for each component/page family.
- [ ] Extract Bulgarian content without changing its rendered text.
- [ ] Add reviewed English content and localized internal links.
- [ ] Run component tests and scan English output for Bulgarian residue.
- [ ] Commit customer-facing content localization.

### Task 6: Checkout, success and server messages

**Files:** Modify checkout components/pages, `app/api/checkout/route.ts`, `app/api/checkout/cod/route.ts`, and checkout tests.

**Interfaces:** Requests send a validated `locale`; Stripe receives `bg` or `en`, metadata stores locale, and return/success URLs preserve locale. Business decisions use stable country/delivery codes.

- [ ] Write failing tests for locale validation, Stripe locale/return URL and COD success URL.
- [ ] Localize checkout labels, validation, delivery display and success UI.
- [ ] Preserve price, promo, COD eligibility and P2G metadata behavior.
- [ ] Run checkout, pricing, Stripe and P2G tests.
- [ ] Commit checkout localization.

### Task 7: Transactional emails

**Files:** Modify `lib/email.ts`, Stripe/COD webhook callers, and `__tests__/email.test.ts`.

**Interfaces:** `OrderEmailModel.locale` selects Bulgarian or English templates; unknown/missing locale safely falls back to Bulgarian.

- [ ] Write failing English subject/body and Bulgarian-regression tests.
- [ ] Implement localized templates and pass locale through both payment flows.
- [ ] Run email and webhook tests.
- [ ] Commit email localization.

### Task 8: Localized SEO and legal cleanup

**Files:** Modify `lib/seo.ts`, localized metadata, `app/sitemap.ts`, footer, terms/privacy pages and SEO tests.

**Interfaces:** Each indexable page produces canonical, `bg-BG`, `en`, and `x-default` alternates; sitemap lists both variants; obsolete EU ODR links are removed and current dispute guidance is used.

- [ ] Write failing metadata, hreflang, JSON-LD and sitemap tests.
- [ ] Implement localized SEO and legal copy.
- [ ] Validate structured data and noindex pages.
- [ ] Commit SEO/legal localization.

### Task 9: Full verification and release

**Files:** No new production behavior; only regression fixtures if a discovered defect requires a failing test.

- [ ] Run all Jest suites.
- [ ] Run the production build.
- [ ] Verify the complete diff against `origin/master` and confirm P2G files remain present.
- [ ] Deploy a protected preview.
- [ ] Compare Bulgarian production and preview across all public routes at desktop/mobile sizes.
- [ ] Exercise BG↔EN switching, cart retention, checkout creation, referral attribution and endpoint authentication.
- [ ] Deploy only the verified commit and re-run live smoke checks.
