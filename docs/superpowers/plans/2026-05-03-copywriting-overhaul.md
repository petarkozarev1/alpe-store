# ALPÉ Copywriting Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all English/inconsistent Bulgarian copy on the landing page with colloquial Bulgarian, unified under the ALPÉ brand name, targeting skeptical Bulgarian office workers with an Empathy → Authority → Evidence page structure.

**Architecture:** All landing page copy is centralized in `lib/data/content.ts` and `lib/data/site.ts`. The plan touches only these two data files plus one component (`ComparisonSection.tsx`) which has hardcoded column title strings, and the `FinalCta` section which needs a new `subtext` field added. No layout, imagery, styling, or font changes.

**Tech Stack:** Next.js 14, TypeScript, `lib/data/content.ts`, `lib/data/site.ts`

---

## File Map

| File | What changes |
|---|---|
| `lib/data/content.ts` | All copy fields — hero, darkCta, ingredients, howItWorks, beforeAfter, withoutItems, withItems, testimonial, gallery, faqs, faqSection, finalCta |
| `lib/data/site.ts` | `siteConfig.brand` → `'ALPÉ'` |
| `components/landing/ComparisonSection.tsx` | Hardcoded column titles "Without ALPE" / "With ALPE" |
| Type definitions in `content.ts` or `types.ts` | Add optional `subtext` field to `finalCtaContent` |

---

## Task 1: Update brand name in `site.ts`

**Files:**
- Modify: `alpe-store/lib/data/site.ts`

- [ ] **Step 1: Change brand name**

In `lib/data/site.ts`, change:
```ts
// Before
brand: 'ALPE',

// After
brand: 'ALPÉ',
```

- [ ] **Step 2: Verify dev server**

```bash
cd E:/ALPE/alpe-store && npm run dev
```
Open `http://localhost:3000` — confirm the navbar logo reads **ALPÉ**.

- [ ] **Step 3: Commit**

```bash
git add lib/data/site.ts
git commit -m "copy: rebrand ALPE → ALPÉ in site config"
```

---

## Task 2: Update hero copy in `content.ts`

**Files:**
- Modify: `alpe-store/lib/data/content.ts`

- [ ] **Step 1: Update `heroContent`**

```ts
export const heroContent = {
  badge: '✓ EU сертифицирани · ★★★★★ 1000+ доволни клиенти',
  headlinePart1: 'До 17:00 очите ти са готови.',
  headlinePart2Before: 'Ние го',
  headlinePart2After: 'знаем.',
  subtext: 'Синята светлина те убива бавно. Очилата ALPÉ я спират — за да издържиш до края на деня и да спиш като хора.',
  cta: 'Вземи си чифт →',
  heroFaceImages: [/* leave unchanged */],
}
```

> **Note on headline split:** The rotating customer face circle renders between `headlinePart2Before` and `headlinePart2After`. The split above places it between "Ние го" and "знаем." — verify this looks natural at `http://localhost:3000`. If the placement feels awkward, move more words into `headlinePart1` (e.g. `headlinePart1: 'До 17:00 очите ти са готови. Ние го'`, `headlinePart2Before: ''`, `headlinePart2After: 'знаем.'`).

- [ ] **Step 2: Verify hero section**

Open `http://localhost:3000`, scroll to top. Confirm:
- Badge reads: `✓ EU сертифицирани · ★★★★★ 1000+ доволни клиенти`
- Headline reads: `До 17:00 очите ти са готови. Ние го [face] знаем.`
- Subtext reads: `Синята светлина те убива бавно...`
- CTA button reads: `Вземи си чифт →`

- [ ] **Step 3: Commit**

```bash
git add lib/data/content.ts
git commit -m "copy: update hero section to Bulgarian pain-first copy"
```

---

## Task 3: Update Dark CTA card copy

**Files:**
- Modify: `alpe-store/lib/data/content.ts`

- [ ] **Step 1: Update `darkCtaContent`**

```ts
export const darkCtaContent = {
  socialProof: '1000+ успокоени очи',
  headline: 'Пази очите си. Карай докрай.',
  cta: 'Вземи си чифт →',
}
```

- [ ] **Step 2: Verify dark CTA card**

Open `http://localhost:3000`, scroll past hero. Confirm the dark card shows:
- `1000+ успокоени очи`
- `Пази очите си. Карай докрай.`
- Button: `Вземи си чифт →`

- [ ] **Step 3: Commit**

```bash
git add lib/data/content.ts
git commit -m "copy: update dark CTA card to Bulgarian"
```

---

## Task 4: Update Lens Technology (Ingredients) copy

**Files:**
- Modify: `alpe-store/lib/data/content.ts`

- [ ] **Step 1: Update `ingredientsContent`**

```ts
export const ingredientsContent = {
  badge: '✓ EU сертифицирана технология',
  headline: 'Изобретено за\n"Дигиталната Ера"',
  editorialImage: /* leave unchanged */,
  editorialImageAlt: /* leave unchanged */,
  sectionTitle: 'Какво има във всяко стъкло?',
  cta: 'Вземи си чифт →',
}
```

- [ ] **Step 2: Update `ingredients` array**

Replace the 5 ingredient objects in place (preserve `number` field and any other non-text fields):

```ts
export const ingredients: Ingredient[] = [
  { number: /* existing */, name: 'Филтър за синя светлина', description: 'Спира 99% от синята светлина. Доказано.' },
  { number: /* existing */, name: 'Антирефлексно покритие', description: 'Край на блясъка от екрана и лампите.' },
  { number: /* existing */, name: 'UV400 защита', description: 'Пълна защита, вътре и навън.' },
  { number: /* existing */, name: 'Устойчиви лещи', description: 'Издържат на ежедневието, без драскотини.' },
  { number: /* existing */, name: 'Лека рамка', description: 'Слагаш ги и забравяш, че ги носиш.' },
]
```

- [ ] **Step 3: Verify ingredients section**

Open `http://localhost:3000`, scroll to the lens technology section. Confirm badge, headline, section title, all 5 ingredient names and descriptions, and CTA button are in Bulgarian.

- [ ] **Step 4: Commit**

```bash
git add lib/data/content.ts
git commit -m "copy: update lens technology section to Bulgarian"
```

---

## Task 5: Update How It Works copy

**Files:**
- Modify: `alpe-store/lib/data/content.ts`

- [ ] **Step 1: Update `howItWorksContent`**

```ts
export const howItWorksContent = {
  badge: 'Как работи',
  headline: 'Лесно.\nПросто работи.',
  cta: 'Вземи си чифт →',
}
```

- [ ] **Step 2: Update `steps` array**

Replace only `title` and `description` fields; leave `number` and `image` unchanged:

```ts
export const steps: StepItem[] = [
  { number: /* existing */, title: 'Сложи ги', description: 'Преди работа, игри или безкрайно скролване — сложи ги и готово.', image: /* existing */ },
  { number: /* existing */, title: 'Филтрирай', description: 'Лещите филтрират синята светлина цял ден — без пауза, без умора.', image: /* existing */ },
  { number: /* existing */, title: 'Почини си', description: 'Вечерта тялото ти знае, че е край на деня. Заспиваш по-лесно, спиш по-дълбоко.', image: /* existing */ },
]
```

- [ ] **Step 3: Verify How It Works section**

Open `http://localhost:3000`. Confirm badge, headline, and all 3 steps read in Bulgarian.

- [ ] **Step 4: Commit**

```bash
git add lib/data/content.ts
git commit -m "copy: update how it works section to Bulgarian"
```

---

## Task 6: Update Comparison (Before/After) copy

**Files:**
- Modify: `alpe-store/lib/data/content.ts`
- Modify: `alpe-store/components/landing/ComparisonSection.tsx`

- [ ] **Step 1: Update `beforeAfterContent` in `content.ts`**

```ts
export const beforeAfterContent = {
  badge: 'Защо ALPÉ?',
  headline: 'Умора вчера.\nЯснота днес.',
  beforeImage: /* leave unchanged */,
  afterImage: /* leave unchanged */,
}
```

- [ ] **Step 2: Update `withoutItems` and `withItems` arrays in `content.ts`**

```ts
export const withoutItems: string[] = [
  'Очите горят до обяд',
  'Главоболие след работа',
  'Въртиш се в леглото до полунощ',
  'Не можеш да се съсредоточиш',
  'Сухи, зачервени очи',
]

export const withItems: string[] = [
  'Очите издържат целия ден',
  'Без главоболие след работа',
  'Заспиваш, когато легнеш',
  'Фокусът се връща',
  'Очите се отпускат',
]
```

- [ ] **Step 3: Fix hardcoded column titles in `ComparisonSection.tsx`**

Open `components/landing/ComparisonSection.tsx`. Find the hardcoded strings `"Without ALPE"` and `"With ALPE"` and replace:

```ts
// Before
"Without ALPE"
// After
"Без ALPÉ"

// Before
"With ALPE"
// After
"С ALPÉ"
```

- [ ] **Step 4: Verify comparison section**

Open `http://localhost:3000`. Scroll to comparison. Confirm badge reads `Защо ALPÉ?`, headline reads `Умора вчера. Яснота днес.`, column titles read `Без ALPÉ` / `С ALPÉ`, and all 5 items in each column are in Bulgarian.

- [ ] **Step 5: Commit**

```bash
git add lib/data/content.ts components/landing/ComparisonSection.tsx
git commit -m "copy: update comparison section to Bulgarian"
```

---

## Task 7: Update Testimonial copy

**Files:**
- Modify: `alpe-store/lib/data/content.ts`

- [ ] **Step 1: Update `testimonialContent`**

```ts
export const testimonialContent = {
  badge: 'Какво казват клиентите',
  quote: 'Работя по 10 часа на ден пред компютър. След като започнах да нося ALPÉ, главоболието изчезна за няколко дни. Сега заспивам веднага щом легна.',
  author: 'Александър М., София',
  stars: 5,
}
```

- [ ] **Step 2: Verify testimonial section**

Open `http://localhost:3000`. Scroll to testimonial. Confirm badge, quote, and author all read in Bulgarian.

- [ ] **Step 3: Commit**

```bash
git add lib/data/content.ts
git commit -m "copy: update testimonial to Bulgarian with local author"
```

---

## Task 8: Update Gallery copy

**Files:**
- Modify: `alpe-store/lib/data/content.ts`

- [ ] **Step 1: Update `galleryContent`**

```ts
export const galleryContent = {
  headline: 'Истинска защита. С ALPÉ.',
  images: /* leave unchanged */,
  cta: 'Вземи си чифт →',
}
```

- [ ] **Step 2: Verify gallery section**

Open `http://localhost:3000`. Scroll to the gallery carousel. Confirm headline reads `Истинска защита. С ALPÉ.` and CTA button reads `Вземи си чифт →`.

- [ ] **Step 3: Commit**

```bash
git add lib/data/content.ts
git commit -m "copy: update gallery section to Bulgarian"
```

---

## Task 9: Update FAQ copy

**Files:**
- Modify: `alpe-store/lib/data/content.ts`

- [ ] **Step 1: Update `faqSectionContent`**

```ts
export const faqSectionContent = {
  badge: 'Често задавани въпроси',
  headline: 'Всичко, което трябва да\nзнаете за ALPÉ',
  cta: 'Вземи си чифт →',
}
```

- [ ] **Step 2: Replace `faqs` array — new order and content**

Reorder to lead with skepticism-killing questions. Preserve the `FaqItem` type shape (check existing fields, usually `question` and `answer`):

```ts
export const faqs: FaqItem[] = [
  {
    question: 'Наистина ли работят тези очила?',
    answer: 'Да. Лещите на ALPÉ са EU сертифицирани и блокират до 99% от синята светлина. Над 1000 клиенти са усетили разлика в умората на очите и качеството на съня — обикновено в рамките на няколко дни.',
  },
  {
    question: 'Как да знам, че блокиращите синя светлина очила работят?',
    answer: 'Повечето хора усещат разлика още през първата седмица — по-малко напрежение в очите и по-лесно заспиване. Ако след 7 нощи не усетиш промяна, върни ги. Без въпроси.',
  },
  {
    question: 'Може ли да ги нося цял ден?',
    answer: 'Да — за това са направени. Рамката е лека и удобна, така че повечето клиенти забравят, че изобщо ги носят.',
  },
  {
    question: 'Изкривяват ли цветовете на екрана?',
    answer: 'Минимално. Дневните лещи имат лек жълтеникав оттенък, вечерните — оранжев. Свикваш за минути и повечето хора дори не го забелязват след малко.',
  },
  {
    question: 'Работят ли с диоптрични стъкла?',
    answer: 'Свържи се с нас и ще намерим решение заедно.',
  },
]
```

- [ ] **Step 3: Verify FAQ section**

Open `http://localhost:3000`. Scroll to FAQ. Confirm badge, headline, and all 5 questions and answers render in Bulgarian, in the correct order (skepticism question first).

- [ ] **Step 4: Commit**

```bash
git add lib/data/content.ts
git commit -m "copy: update FAQ to Bulgarian, reorder skepticism-first"
```

---

## Task 10: Update Final CTA copy + add subtext

**Files:**
- Modify: `alpe-store/lib/data/content.ts`
- Modify: `alpe-store/app/page.tsx` (or wherever `finalCtaContent` is rendered — check which component uses it)

- [ ] **Step 1: Add `subtext` to `finalCtaContent` in `content.ts`**

```ts
export const finalCtaContent = {
  badge: 'Вземи своя чифт',
  headline: 'Защити очите си.\nЖивей оптимално.',
  cta: 'Вземи си чифт →',
  image: /* leave unchanged */,
  subtext: 'EU сертифицирани · Безплатна доставка над €50 · 1000+ доволни клиенти',
}
```

- [ ] **Step 2: Add TypeScript type for `subtext` if needed**

Search `lib/data/content.ts` or `lib/types.ts` for the `FinalCtaContent` type definition. If it exists, add the field:

```ts
type FinalCtaContent = {
  badge: string
  headline: string
  cta: string
  image: string
  subtext: string   // ← add this
}
```

- [ ] **Step 3: Render `subtext` in the Final CTA component**

Find the component that renders `finalCtaContent` (likely `app/page.tsx` or a `FinalCtaSection.tsx` component). Add the subtext below the headline. Match the existing text style — use the same font class and a small size (e.g. the same class as other subtitle/muted lines in the section):

```tsx
{finalCtaContent.subtext && (
  <p className="font-sans text-sm text-stone tracking-wide mt-3">
    {finalCtaContent.subtext}
  </p>
)}
```

Adjust the className to match surrounding elements — check the section's existing text color token and font class before applying.

- [ ] **Step 4: Verify Final CTA section**

Open `http://localhost:3000`. Scroll to the bottom dark section. Confirm:
- Badge: `Вземи своя чифт`
- Headline: `Защити очите си. Живей оптимално.`
- Subtext: `EU сертифицирани · Безплатна доставка над €50 · 1000+ доволни клиенти`
- CTA button: `Вземи си чифт →`

- [ ] **Step 5: Commit**

```bash
git add lib/data/content.ts app/page.tsx
git commit -m "copy: update final CTA to Bulgarian + add trust subtext"
```

---

## Task 11: Full page English audit

- [ ] **Step 1: Search for remaining English strings**

```bash
cd E:/ALPE/alpe-store
grep -r "Shop Now\|Powered by\|Happy Eyes\|Testimonial\|Screen Age\|Every Lens\|How it Works\|Get Your Pair\|Own Your Day\|Clear Today\|Why Choose" lib/data/ components/landing/ app/page.tsx
```

Expected output: no matches. If any matches found, fix them and commit.

- [ ] **Step 2: Search for remaining "ALPE" without accent**

```bash
grep -r '"ALPE"\|'\''ALPE'\''\| ALPE ' lib/data/ components/landing/ app/page.tsx
```

Expected output: no matches in copy strings. (File paths and image alts referencing `ALPE` as a brand identifier in non-visible strings are acceptable.)

- [ ] **Step 3: Final visual check**

Open `http://localhost:3000` and scroll through the full page top to bottom. Verify:
- [ ] No English text visible anywhere on the landing page
- [ ] Every CTA button reads `Вземи си чифт →`
- [ ] ALPÉ (with accent) appears wherever the brand name is shown in copy
- [ ] `1000+` is used consistently (not `10,000+`)

- [ ] **Step 4: Commit if any fixes made**

```bash
git add -p
git commit -m "copy: fix remaining English strings found in audit"
```
