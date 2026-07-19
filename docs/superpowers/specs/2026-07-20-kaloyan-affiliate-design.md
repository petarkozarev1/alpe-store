# KALOYAN Affiliate Design

## Goal

Add KALOYAN as an ALPÉ affiliate using the same promo-code validation, private login screen, order dashboard, and Notion-backed reporting flow already used by ILIYANA and ALETEA.

## User-facing behavior

- Promo code `KALOYAN10` gives 10% off the already bundle-discounted product price.
- The private dashboard is available at `/partner/kaloyan`.
- The login and dashboard use the existing shared partner route and must look exactly like the ILIYANA dashboard, with the displayed partner name changed to `KALOYAN`.
- The dashboard password is `20072026`.
- Successful login shows only orders attributed to `KALOYAN10`, with the existing totals, revenue, average-order-value, and latest-orders presentation.

## Configuration

- Production dashboard access uses `PARTNER_DASHBOARD_KEY_KALOYAN`.
- Kaloyan's dedicated Notion order mirror uses `NOTION_PROMO_DATABASE_ID_KALOYAN10`.
- Local development uses `20072026` as the preview password and presents KALOYAN-specific preview orders when no Notion database is configured.
- The Notion database must contain the existing partner columns: `Name`, `Промо код`, `Сума`, `Артикули`, and `Дата`.

## Implementation boundaries

- Add `KALOYAN10` to the existing server-side promo registry.
- Add `kaloyan` to the existing partner registry and preview-order map.
- Reuse `app/partner/[slug]/route.ts`; do not create a separate dashboard page or duplicate its HTML/CSS.
- Update the project reference with Kaloyan's promo code, dashboard path, and environment variables.
- Do not change the behavior or credentials of ALETEA or ILIYANA.

## Testing

Use test-driven development:

1. Add a failing promo test proving that `KALOYAN10` is accepted case-insensitively and discounts 10%.
2. Add failing access tests proving that the configured Kaloyan key works and incorrect keys fail.
3. Add a failing local-preview test proving `/partner/kaloyan` resolves to KALOYAN, `KALOYAN10`, and preview data with password `20072026`.
4. Implement the smallest registry changes that make the tests pass.
5. Run the focused promo and partner-dashboard tests, the complete test suite, and a production build.

## Deployment requirements

- Set `PARTNER_DASHBOARD_KEY_KALOYAN=20072026` in the Vercel production environment.
- Create and connect a dedicated Notion affiliate-order database, then set its ID as `NOTION_PROMO_DATABASE_ID_KALOYAN10`.
- Deploy only after tests and the production build pass.
