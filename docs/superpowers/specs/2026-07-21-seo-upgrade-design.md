# ALPÉ SEO Upgrade Design

## Goal

Implement the high-impact technical and ecommerce SEO improvements identified in the July 2026 audit while preserving the current ALPÉ design and bundle-selling experience.

The work must remain local until the user reviews it on a preview server and explicitly approves a production release.

## Search architecture

### Homepage

`/` remains the brand and category landing page for Bulgarian searches around blue-light glasses, screen use, eye comfort, and sleep.

### Shop and cross-selling

`/shop` remains the main conversion and bundle hub. It retains the Daily/Evening selector, multi-pair pricing, and existing purchase flow. It represents the combined ALPÉ range and bundle offers in metadata and structured data.

### Product pages

Remove the blanket `/product/:slug` redirect and make these pages indexable:

- `/product/alpe-daily` targets daytime computer-work intent.
- `/product/alpe-evening` targets evening blue/green-light and pre-sleep intent.

Each product page must contain unique Bulgarian copy, its own canonical URL, Open Graph metadata, Product structured data, and a prominent complementary-product cross-sell. The cross-sell links visitors to the two-pair bundle on `/shop` rather than duplicating checkout pricing logic.

## Technical indexing

- Change the canonical site origin to `https://www.alpewear.com`, matching the production redirect destination.
- Include every legitimate public page and both product pages in `sitemap.xml`.
- Exclude carts, checkout, success, partner dashboards, API routes, and redirects from the sitemap.
- Use stable last-modified dates derived from content/configuration rather than assigning the current timestamp to every URL on every build.
- Add self-referencing canonicals to public pages.
- Remove repeated `| ALPÉ | ALPÉ` titles by keeping the root title template and using unbranded child titles.
- Add explicit `noindex` metadata to cart, checkout, and success routes.
- Let search engines crawl pages that need to expose a `noindex` directive; keep API and private partner surfaces out of crawl paths.
- Preserve the existing partner dashboard `X-Robots-Tag` protection.

## Metadata and social sharing

- Centralize common metadata generation in `lib/seo.ts` where it reduces repetition.
- Keep Bulgarian titles and descriptions specific to each page's intent.
- Ensure canonical, Open Graph, Twitter, sitemap, robots, and schema URLs all use the `www` origin.
- Use relevant product imagery for product/shop social previews. A new designed Open Graph artwork is outside this implementation unless separately approved.

## Structured data

- Keep Organization and WebSite entities in the root layout and connect them using stable `@id` values.
- Add the business-wide 14-day Bulgarian return policy to Organization markup.
- Add Bulgarian shipping details and return-policy references to purchasable offers.
- Give Daily and Evening separate Product entities with SKU, image, brand, price, condition, availability, and URL.
- Represent the shop page as the ALPÉ range/bundle sales hub without claiming unsupported ratings, GTINs, reviews, or medical evidence.
- Keep FAQ structured data only when the corresponding questions and answers are visible on the page.

## Cross-sell experience

Each product page adds a complementary-product section:

- Daily recommends Evening for use after sunset.
- Evening recommends Daily for daytime screen work.
- The primary cross-sell action opens `/shop` with a query parameter identifying the desired two-pair bundle.
- `/shop` reads that parameter only to preselect the existing two-pair configuration; all pricing and cart behavior continue to use the existing source of truth.
- A secondary action lets the visitor view the complementary product page.

The implementation must not create separate prices, duplicate checkout calculations, or alter the existing bundle amounts.

## Performance improvements

- Replace the homepage hero visual in the local preview with the user-supplied `E:/Google Downloads/alpe website.mp4` clip.
- The supplied clip is 1920×1080, 30 fps, approximately 9 seconds, and 14.6 MB. Preserve the source file outside the repository and copy it into `public/videos/` under a web-safe name for preview.
- Because the Adobe video connector and local FFmpeg are unavailable in this session, the raw clip may be used only for local visual approval. Do not deploy the 14.6 MB source to production without first producing a smaller web rendition or receiving explicit approval to accept the performance cost.
- Prevent desktop and mobile hero videos from both being eagerly preloaded.
- Provide a poster/fallback where an existing suitable asset is available.
- Respect reduced-motion preferences without hiding crawlable text.
- Lower unnecessary `next/image` quality overrides from 100 to a visually safe range around 82–85.
- Do not delete or recompress source assets during this upgrade without separate approval.

## Content and claims boundary

This implementation improves architecture, metadata, discoverability, schema, internal linking, and cross-selling. It does not invent studies, reviews, survey methodology, certificates, medical claims, authors, publication dates, or laboratory evidence.

Any existing strong health or survey claims remain a separate content-review workstream.

## Testing and preview

- Add unit tests for canonical URL generation, sitemap inclusion/exclusion, robots behavior, product metadata/indexability, and cross-sell parameter handling.
- Follow test-driven development: observe each new behavior fail before implementing it.
- Run focused tests, the complete Jest suite, and `npm.cmd run build`.
- Start the preview server only from `E:/ALPE/alpe-store`.
- Provide the local preview URL and key pages for user inspection.
- Do not push Git commits or deploy to Vercel until the user explicitly approves the preview.

## Success criteria

- Public pages emit unique titles, descriptions, self-canonicals, and correct `www` URLs.
- The sitemap includes all intended public and product pages and no private/transactional pages.
- Daily and Evening are directly accessible, indexable, and cross-sell the complementary pair through the existing shop bundle flow.
- Structured data contains only visible, accurate, supportable facts.
- Tests and production build pass.
- The user can review the complete result locally before any live release.
