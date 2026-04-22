# ALPE — Project Reference

**ALPE** is a blue light blocking glasses brand. This is their Next.js 14 ecommerce site.

> There is no other brand. There is no "Raydiant". The brand is ALPE. Always.

---

## ⚠️ CRITICAL RULES — READ FIRST

1. **NEVER use the Preview tool or start a dev server from a worktree.** The only valid project root is `C:/ALPE`. Any path containing `.claude/worktrees/` is an old stale copy — do NOT serve, edit, or read from it.
2. **NEVER touch worktree directories.** They caused the site to revert to an old broken version. Ignore them completely.
3. **Always start the dev server from `C:/ALPE`:**
   ```bash
   cd C:/ALPE && npm run dev
   ```
4. **The canonical saved version is the git tag `colors`** (commit `64462af`). To restore: `git -C C:/ALPE checkout colors -- .`
5. **Do NOT run `git checkout` on the whole repo** without specifying files — it will blow away working changes.
6. **Before ANY color or style change**, read this file's Section Background Map so you know what token each section uses.

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

## Section Background Map (current — "colors" tag)

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
| Tests | Jest + React Testing Library |
| Dev server | `npm run dev` from `C:/ALPE` → port 3000 |

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

## Hero Rotating Images

6 images cycle every 1.5s in the headline inline circle:
```
public/images/hero/person-1-night.png  through  person-6-night.png
```
Defined in `heroContent.heroFaceImages` in `lib/data/content.ts`.

---

## Known Gotchas

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

---

## Dev commands

```bash
cd C:/ALPE
npm run dev        # http://localhost:3000
npm test           # Jest
npm run build      # production build check
```
