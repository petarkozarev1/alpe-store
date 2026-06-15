# Partner Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a private influencer dashboard at `/partner/iliyana` that shows ILIYANA10 Notion promo order stats without affecting the public shop.

**Architecture:** Use a route handler that returns server-rendered HTML, so the page does not load the store layout, cart, cookies, analytics, or client React bundle. Gate access with `PARTNER_DASHBOARD_KEY_ILIYANA` before querying Notion, then query `NOTION_PROMO_DATABASE_ID_ILIYANA10` server-side with short caching.

**Tech Stack:** Next.js App Router route handlers, Notion SDK, TypeScript, Jest.

---

### Task 1: Partner Dashboard Data Module

**Files:**
- Create: `lib/partner-dashboard.ts`
- Test: `__tests__/partner-dashboard.test.ts`

- [ ] Add tests for access-key checking, Notion property parsing, and development preview fallback.
- [ ] Implement a focused server-only helper that validates the key, fetches Notion rows, computes totals, and returns a render-friendly view model.
- [ ] Run `npm.cmd test -- --runTestsByPath __tests__\partner-dashboard.test.ts`.

### Task 2: Private Dashboard Route

**Files:**
- Create: `app/partner/iliyana/route.ts`

- [ ] Create a GET route that reads `?key=...`, calls the helper, and returns noindex HTML.
- [ ] Render an access screen when the key is missing or invalid.
- [ ] Render stats and latest order rows when access is valid.
- [ ] Ensure the route handler sets private/noindex headers and does not import the store layout.

### Task 3: Verification

**Files:**
- Verify only.

- [ ] Run `npm.cmd run build`.
- [ ] Start local dev server on `0.0.0.0:3000`.
- [ ] Preview `http://localhost:3000/partner/iliyana?key=local-preview`.
- [ ] Do not push until the user approves the localhost preview.
