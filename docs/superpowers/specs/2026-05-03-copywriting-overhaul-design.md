# ALPÉ Copywriting Overhaul — Design Spec
**Date:** 2026-05-03  
**Status:** Approved by user  
**Scope:** Text-only changes. No layout, imagery, or component structure is modified.

---

## Context

The ALPÉ website (Next.js 14, `alpe-store/`) is a blue light blocking glasses store targeting the Bulgarian market. All copy was mixed English/Bulgarian and lacked a consistent voice. The #1 conversion barrier identified is skepticism — buyers aren't sure the product works. The overhaul switches to 100% Bulgarian, adopts a colloquial tone, and structures every section around the **Empathy → Authority → Evidence** pattern: open with the customer's pain, introduce EU certification as a quiet trust signal mid-page, then close with a risk-reversal offer.

**Key decisions:**
- Language: Bulgarian only
- Primary persona: Office worker, 8–10hrs/day on screens
- Tone: Colloquial, raw, relatable — not clinical or corporate
- EU cert: Mentioned in hero badge and ingredients section badge — not a visual hero element
- All CTAs unified to: *"Вземи си чифт →"*
- Brand name written as **ALPÉ** (with accent) everywhere — not ALPÉ
- Social proof number: **1000+** everywhere (not 10,000+)
- Font family, size, and weight unchanged on all elements — text swaps only

All copy lives in `alpe-store/lib/data/content.ts` and `alpe-store/lib/data/site.ts`.

---

## Section-by-Section Copy Changes

### Section 1 — Hero (`HeroSection.tsx`)

| Field | Old | New |
|---|---|---|
| Badge | "Доверени от 10,000+ потребители" | "✓ EU сертифицирани · ★★★★★ 1000+ доволни клиенти" |
| Headline | "Само едни очила. Безкрайна яснота." | "До 17:00 очите ти са готови. Ние го знаем." |
| Subtext | "Очилата ALPÉ блокират синята светлина и намаляват умората на очите, главоболието и нарушения сън — за да работиш на най-доброто си ниво." | "Синята светлина те убива бавно. Очилата ALPÉ я спират — за да издържиш до края на деня и да спиш като хора." |
| CTA | "Пазарувай сега" | "Вземи си чифт →" |

---

### Section 2 — Dark CTA Card (`DarkCtaCard.tsx`)

| Field | Old | New |
|---|---|---|
| Social proof | "10,000+ Happy Eyes" | "1000+ успокоени очи" |
| Headline | "Protect your vision. Own your day." | "Пази очите си. Карай докрай." |
| CTA | "Shop Now" | "Вземи си чифт →" |

---

### Section 3 — Lens Technology / Ingredients (`IngredientsSection.tsx`)

| Field | Old | New |
|---|---|---|
| Badge | "Lens Technology" | "✓ EU сертифицирана технология" |
| Headline | "Engineered for the Screen Age." | "Изобретено за "Дигиталната Ера"" |
| Section title | "What's in Every Lens" | "Какво има във всяко стъкло?" |
| Ingredient 1 | "Blue Light Filter — Blocks 99% of harmful blue light from screens." | "Филтър за синя светлина — Спира 99% от синята светлина. Доказано." |
| Ingredient 2 | "Anti-Glare Coating — Eliminates screen glare and harsh reflections." | "Антирефлексно покритие — Край на блясъка от екрана и лампите." |
| Ingredient 3 | "UV400 Protection — Full UV protection for indoor and outdoor use." | "UV400 защита — Пълна защита, вътре и навън." |
| Ingredient 4 | "Scratch-Resistant Lens — Durable, long-lasting lenses built for daily wear." | "Устойчиви лещи — Издържат на ежедневието, без драскотини." |
| Ingredient 5 | "Lightweight Frame — Barely-there comfort you can wear all day." | "Лека рамка — Слагаш ги и забравяш, че ги носиш." |
| CTA | "Shop Now" | "Вземи си чифт →" |

---

### Section 4 — How It Works (`HowItWorksSection.tsx`)

| Field | Old | New |
|---|---|---|
| Badge | "How it Works" | "Как работи" |
| Headline | "Simple to Wear. Powerful Protection." | "Лесно. Просто работи." |
| Step 1 title | "Wear" | "Сложи ги" |
| Step 1 body | "Put on your ALPÉ glasses before any screen session — work, gaming, or scrolling." | "Преди работа, игри или безкрайно скролване — сложи ги и готово." |
| Step 2 title | "Filter" | "Филтрирай" |
| Step 2 body | "ALPÉ lenses continuously block blue light and reduce glare throughout your day." | "Лещите филтрират синята светлина цял ден — без пауза, без умора." |
| Step 3 title | "Rest" | "Почини си" |
| Step 3 body | "Wind down with ease — your body's natural sleep cycle stays intact." | "Вечерта тялото ти знае, че е край на деня. Заспиваш по-лесно, спиш по-дълбоко." |
| CTA | "Shop Now" | "Вземи си чифт →" |

---

### Section 5 — Comparison (`ComparisonSection.tsx`)

| Field | Old | New |
|---|---|---|
| Badge | "Why Choose ALPÉ?" | "Защо ALPÉ?" |
| Headline | "Strained Yesterday. Clear Today." | "Умора вчера. Яснота днес." |
| Left column title | "Without ALPÉ" | "Без ALPÉ" |
| Without — item 1 | "Eyes feel tired" | "Очите горят до обяд" |
| Without — item 2 | "Headaches" | "Главоболие след работа" |
| Without — item 3 | "Trouble falling asleep" | "Въртиш се в леглото до полунощ" |
| Without — item 4 | "Reduced focus" | "Не можеш да се съсредоточиш" |
| Without — item 5 | "Squinting and dry eyes" | "Сухи, зачервени очи" |
| Right column title | "With ALPÉ" | "С ALPÉ" |
| With — item 1 | "Eyes stay fresh" | "Очите издържат целия ден" |
| With — item 2 | "No headaches" | "Без главоболие след работа" |
| With — item 3 | "Fall asleep faster" | "Заспиваш, когато легнеш" |
| With — item 4 | "Sharper focus" | "Фокусът се връща" |
| With — item 5 | "Comfortable vision" | "Очите се отпускат" |
| CTA | "Shop Now" | "Вземи си чифт →" |

---

### Section 6 — Testimonial (`TestimonialSection.tsx`)

| Field | Old | New |
|---|---|---|
| Badge | "Testimonial" | "Какво казват клиентите" |
| Quote | "I work 10+ hours a day on screens. Since I started wearing ALPÉ, my eye strain is completely gone and I actually sleep through the night. These glasses changed everything." | "Работя по 10 часа на ден пред компютър. След като започнах да нося ALPÉ, главоболието изчезна за няколко дни. Сега заспивам веднага щом легна." |
| Author | "Alex M." | "Александър М., София" |

---

### Section 7 — Gallery (`GallerySection.tsx`)

| Field | Old | New |
|---|---|---|
| Headline | "Real People. Real Protection. Powered by ALPÉ." | "Истинска защита. С ALPÉ." |
| CTA | "Shop Now" | "Вземи си чифт →" |

---

### Section 8 — FAQ (`FaqSection.tsx`)

| Field | Old | New |
|---|---|---|
| Badge | "Frequently Asked Questions" | "Често задавани въпроси" |
| Headline | "Everything You Need to Know About ALPÉ" | "Всичко, което трябва да знаете за ALPÉ" |
| Q1 | "What makes ALPÉ different from other blue light glasses?" | "Наистина ли работят тези очила?" |
| A1 | *(current)* | "Да. Лещите на ALPÉ са EU сертифицирани и блокират до 99% от синята светлина. Над 1000 клиенти са усетили разлика в умората на очите и качеството на съня — обикновено в рамките на няколко дни." |
| Q2 | "How do I know if blue light glasses are working?" | "Как да знам, че блокиращите синя светлина очила работят?" |
| A2 | *(current)* | "Повечето хора усещат разлика още през първата седмица — по-малко напрежение в очите и по-лесно заспиване. Ако след 7 нощи не усетиш промяна, върни ги. Без въпроси." |
| Q3 | "Can I wear ALPÉ glasses all day?" | "Може ли да ги нося цял ден?" |
| A3 | *(current)* | "Да — за това са направени. Рамката е лека и удобна, така че повечето клиенти забравят, че изобщо ги носят." |
| Q4 | "Do ALPÉ glasses affect how colors look on screen?" | "Изкривяват ли цветовете на екрана?" |
| A4 | *(current)* | "Минимално. Дневните лещи имат лек жълтеникав оттенък, вечерните — оранжев. Свикваш за минути и повечето хора дори не го забелязват след малко." |
| Q5 | "Are ALPÉ glasses compatible with prescription lenses?" | "Работят ли с диоптрични стъкла?" |
| A5 | *(current)* | "Свържи се с нас и ще намерим решение заедно." |
| CTA | "Shop Now" | "Вземи си чифт →" |

---

### Section 9 — Final CTA (`app/page.tsx` final section)

| Field | Old | New |
|---|---|---|
| Badge | "Get Your Pair" | "Вземи своя чифт" |
| Headline | "Protect Your Eyes. Own Your Day." | "Защити очите си. Живей оптимално." |
| Subtext | *(none)* | "EU сертифицирани · Безплатна доставка над €50 · 1000+ доволни клиенти" |
| CTA | "Shop Now" | "Вземи си чифт →" |

---

## Files to Modify

- `alpe-store/lib/data/content.ts` — hero, ingredients, how it works, comparison, testimonial, FAQ copy
- `alpe-store/lib/data/site.ts` — any global CTA strings
- Individual section components if copy is hardcoded:
  - `alpe-store/components/landing/HeroSection.tsx`
  - `alpe-store/components/landing/DarkCtaCard.tsx`
  - `alpe-store/components/landing/IngredientsSection.tsx`
  - `alpe-store/components/landing/HowItWorksSection.tsx`
  - `alpe-store/components/landing/ComparisonSection.tsx`
  - `alpe-store/components/landing/TestimonialSection.tsx`
  - `alpe-store/components/landing/GallerySection.tsx`
  - `alpe-store/components/landing/FaqSection.tsx`
  - `alpe-store/app/page.tsx` (final CTA section)

## Verification

1. Run `npm run dev` in `alpe-store/` and open `http://localhost:3000`
2. Scroll through all 8 sections and verify every text change matches this spec
3. Check no English text remains on the landing page
4. Confirm CTA button reads "Вземи си чифт →" on all sections
5. Check the hero badge shows both EU cert signal and star rating
6. Check the final CTA subtext includes the €50 free shipping threshold
