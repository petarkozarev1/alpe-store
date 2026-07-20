# Product Gallery Thumbnails Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the ALPÉ product gallery thumbnails with uncropped 4:3 cards and a clear responsive active state.

**Architecture:** Keep the existing `ImageGallery` state and click behavior. Change only the thumbnail row and thumbnail image presentation, and add a focused component test that protects the responsive framing and selection behavior.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Jest, Testing Library

## Global Constraints

- Use only the existing product photographs.
- Do not alter the main gallery image, product data, cart behavior, or live website.
- Preserve existing accessibility labels and the `aria-pressed` state.
- Display portrait and landscape thumbnails without cropping.

---

### Task 1: Responsive Thumbnail Cards

**Files:**
- Create: `__tests__/ImageGallery.test.tsx`
- Modify: `components/product/ImageGallery.tsx`

**Interfaces:**
- Consumes: `ImageGalleryProps` with `images: string[]` and `alt: string`.
- Produces: The unchanged default `ImageGallery` component interface with responsive 4:3 thumbnail cards.

- [ ] **Step 1: Write the failing component test**

Create `__tests__/ImageGallery.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import ImageGallery from '@/components/product/ImageGallery'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ fill: _fill, priority: _priority, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} />
  ),
}))

test('renders uncropped 4:3 thumbnails and updates the active image', () => {
  render(<ImageGallery images={['/one.png', '/two.png', '/three.png']} alt="ALPÉ Daily" />)

  const first = screen.getByRole('button', { name: 'View image 1' })
  const second = screen.getByRole('button', { name: 'View image 2' })
  const secondImage = screen.getByAltText('ALPÉ Daily 2')

  expect(first).toHaveClass('aspect-[4/3]')
  expect(first).toHaveAttribute('aria-pressed', 'true')
  expect(secondImage).toHaveClass('object-contain')

  fireEvent.click(second)

  expect(first).toHaveAttribute('aria-pressed', 'false')
  expect(second).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByAltText('ALPÉ Daily')).toHaveAttribute('src', '/two.png')
})
```

- [ ] **Step 2: Run the focused test and confirm the expected failure**

Run: `npm.cmd test -- --runInBand __tests__/ImageGallery.test.tsx`

Expected: FAIL because thumbnails do not yet have `aspect-[4/3]` and thumbnail images still use `object-cover`.

- [ ] **Step 3: Implement the approved thumbnail treatment**

In `components/product/ImageGallery.tsx`, replace the thumbnail-row markup with:

```tsx
<div className="flex gap-2.5 overflow-x-auto px-0.5 pb-2 pt-1 sm:gap-3">
  {images.map((src, i) => (
    <button
      key={src}
      type="button"
      onClick={() => setActiveIndex(i)}
      aria-label={`View image ${i + 1}`}
      aria-pressed={i === activeIndex}
      className={`relative aspect-[4/3] w-[5.25rem] flex-none overflow-hidden rounded-xl border bg-parchment shadow-sm transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:w-24 ${
        i === activeIndex
          ? '-translate-y-0.5 border-onyx shadow-md ring-1 ring-onyx/10'
          : 'border-iron/10 opacity-80 hover:-translate-y-0.5 hover:border-gold/60 hover:opacity-100'
      }`}
    >
      <Image
        src={src}
        alt={`${alt} ${i + 1}`}
        fill
        sizes="(max-width: 640px) 84px, 96px"
        className="object-contain p-1"
      />
    </button>
  ))}
</div>
```

- [ ] **Step 4: Run the focused test and full automated suite**

Run: `npm.cmd test -- --runInBand __tests__/ImageGallery.test.tsx`

Expected: 1 test passes.

Run: `npm.cmd test -- --runInBand`

Expected: All test suites pass.

- [ ] **Step 5: Verify the production build**

Stop the local dev server before building so Next.js does not share `.next` state between development and production.

Run: `npm.cmd run build`

Expected: The build compiles successfully, TypeScript and lint checks pass, and `/product/alpe-daily` plus `/product/alpe-evening` are generated.

- [ ] **Step 6: Restart and inspect the preview**

Clear only the verified `E:\ALPE\alpe-store\.next` directory, restart `npm run dev -- --hostname 0.0.0.0 --port 3000`, and inspect both product pages at desktop and mobile widths.

Expected: all three thumbnails are visible, uncropped, consistently framed, keyboard-focusable, and the selected thumbnail updates the main image without horizontal page overflow.

- [ ] **Step 7: Commit the implementation**

```powershell
git add -- components/product/ImageGallery.tsx __tests__/ImageGallery.test.tsx
git commit -m "style: refine product gallery thumbnails"
```
