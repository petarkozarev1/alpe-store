# KALOYAN Affiliate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the `KALOYAN10` 10% discount and a private `/partner/kaloyan` affiliate dashboard identical to the existing ILIYANA dashboard.

**Architecture:** Extend the existing server-side promo registry and shared partner registry. Reuse the dynamic partner route and Notion order mirror without creating new UI code.

**Tech Stack:** Next.js 14 App Router, TypeScript, Jest, Notion API, Vercel environment variables.

## Global Constraints

- The dashboard password is `20072026`.
- Production access uses `PARTNER_DASHBOARD_KEY_KALOYAN`.
- Dedicated affiliate orders use `NOTION_PROMO_DATABASE_ID_KALOYAN10`.
- Do not alter ALETEA or ILIYANA behavior.
- Preserve all unrelated working-tree changes.

---

### Task 1: Add the KALOYAN10 promo code

**Files:**
- Modify: `__tests__/promo.test.ts`
- Modify: `lib/promo.ts`

**Interfaces:**
- Consumes: `getPromo(code?: string | null)` and `promoDiscount(amount, code)`.
- Produces: server-validated `KALOYAN10` support at 10%.

- [ ] **Step 1: Write the failing test**

Add:

```ts
it('accepts KALOYAN10 as a 10 percent influencer code', () => {
  expect(getPromo('KALOYAN10')).toEqual({ code: 'KALOYAN10', percent: 10 })
  expect(promoDiscount(66.99, 'kaloyan10')).toEqual({
    code: 'KALOYAN10',
    percent: 10,
    amount: 6.7,
  })
})
```

- [ ] **Step 2: Verify the test fails**

Run: `npm.cmd test -- --runTestsByPath __tests__/promo.test.ts`

Expected: FAIL because `KALOYAN10` is absent from `PROMO_CODES`.

- [ ] **Step 3: Add the minimal promo configuration**

Add to `PROMO_CODES`:

```ts
KALOYAN10: 10,
```

- [ ] **Step 4: Verify the promo test passes**

Run: `npm.cmd test -- --runTestsByPath __tests__/promo.test.ts`

Expected: PASS.

### Task 2: Add the KALOYAN dashboard profile

**Files:**
- Modify: `__tests__/partner-dashboard.test.ts`
- Modify: `lib/partner-dashboard.ts`

**Interfaces:**
- Consumes: `getPartnerDashboardAccess(slug, key)` and `getPartnerDashboardData(slug, key)`.
- Produces: `kaloyan` partner slug with name `KALOYAN`, code `KALOYAN10`, production key env `PARTNER_DASHBOARD_KEY_KALOYAN`, Notion env `NOTION_PROMO_DATABASE_ID_KALOYAN10`, and local password `20072026`.

- [ ] **Step 1: Write failing access and preview tests**

Add `PARTNER_DASHBOARD_KEY_KALOYAN: '20072026'` to the test environment and assert:

```ts
expect(getPartnerDashboardAccess('kaloyan', '20072026')).toBe(true)
expect(getPartnerDashboardAccess('kaloyan', 'wrong')).toBe(false)
```

Add a local preview test:

```ts
it('uses KALOYAN10 preview rows locally with password 20072026', async () => {
  process.env = { ...originalEnv, NODE_ENV: 'development' }
  delete process.env.PARTNER_DASHBOARD_KEY_KALOYAN
  delete process.env.NOTION_PROMO_DATABASE_ID_KALOYAN10

  const data = await getPartnerDashboardData('kaloyan', '20072026')

  expect(data.status).toBe('authorized')
  if (data.status === 'authorized') {
    expect(data.partnerName).toBe('KALOYAN')
    expect(data.promoCode).toBe('KALOYAN10')
    expect(data.isPreview).toBe(true)
    expect(data.totalOrders).toBe(2)
  }
})
```

- [ ] **Step 2: Verify the tests fail**

Run: `npm.cmd test -- --runTestsByPath __tests__/partner-dashboard.test.ts`

Expected: FAIL because `kaloyan` is not in the partner registry.

- [ ] **Step 3: Add the minimal partner configuration**

Add to `PARTNERS`:

```ts
kaloyan: {
  name: 'KALOYAN',
  promoCode: 'KALOYAN10',
  keyEnv: 'PARTNER_DASHBOARD_KEY_KALOYAN',
  notionDbEnv: 'NOTION_PROMO_DATABASE_ID_KALOYAN10',
  localPassword: '20072026',
},
```

Add two KALOYAN-specific records to `PREVIEW_ORDERS.kaloyan` using `KALOYAN10`.

- [ ] **Step 4: Verify partner tests pass**

Run: `npm.cmd test -- --runTestsByPath __tests__/partner-dashboard.test.ts`

Expected: PASS.

### Task 3: Document and verify the complete affiliate flow

**Files:**
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: the completed promo and partner registry entries.
- Produces: project instructions for maintaining and deploying KALOYAN.

- [ ] **Step 1: Update the affiliate table**

Add:

```md
| KALOYAN | `KALOYAN10` | `/partner/kaloyan` | `PARTNER_DASHBOARD_KEY_KALOYAN` | `NOTION_PROMO_DATABASE_ID_KALOYAN10` |
```

- [ ] **Step 2: Run focused tests together**

Run: `npm.cmd test -- --runTestsByPath __tests__/promo.test.ts __tests__/partner-dashboard.test.ts`

Expected: both suites PASS.

- [ ] **Step 3: Run the full test suite**

Run: `npm.cmd test -- --runInBand`

Expected: all suites PASS.

- [ ] **Step 4: Run a production build**

Run: `npm.cmd run build`

Expected: build, lint, type checking, and static generation all succeed.

- [ ] **Step 5: Configure production environment**

Set `PARTNER_DASHBOARD_KEY_KALOYAN` to `20072026`. Resolve the connected KALOYAN Notion page/database ID from available local configuration or user-provided data, then set it as `NOTION_PROMO_DATABASE_ID_KALOYAN10`. Do not guess an ID.

- [ ] **Step 6: Deploy and smoke-test if environment configuration is complete**

Deploy the verified build, then confirm `/partner/kaloyan` renders the shared login screen, accepts `20072026`, and identifies the dashboard as `KALOYAN` with code `KALOYAN10`.
