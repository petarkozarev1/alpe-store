# Responsive Overlay Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore text-over-video composition on every device and tune the supplied landscape video for common phone and monitor sizes.

**Architecture:** Use one absolutely positioned `object-cover` video inside a viewport-height hero. Keep all content in one centered overlay layer and apply a mobile focal point that favors the primary person/glasses, returning to centered positioning on desktop.

**Tech Stack:** Next.js 14 App Router, React, Tailwind CSS, Jest, Testing Library

## Global Constraints

- This is preview-only; do not push or deploy.
- Keep exactly one hero video element and `/videos/alpe-hero-preview.mp4`.
- Keep `autoPlay`, `muted`, `loop`, `playsInline`, `preload="metadata"`, and `motion-reduce:hidden`.
- Preserve the existing H1 copy, supporting copy, CTA, and `CTAClick` tracking.
- Stop the dev server before running `next build`; restart it only after the build finishes.

---

### Task 1: Responsive overlay composition

**Files:**
- Modify: `__tests__/HeroSection.test.tsx`
- Modify: `components/landing/HeroSection.tsx`

**Interfaces:**
- Consumes: `heroContent`, `Button`, and `fireTrackedEvent`.
- Produces: one viewport-height overlay hero with breakpoint-specific video focus.

- [ ] **Step 1: Write the failing assertions**

Replace the full-frame panel assertions with:

```tsx
expect(video).toHaveClass('absolute', 'inset-0', 'object-cover')
expect(video).toHaveClass('object-[68%_center]', 'md:object-center')
expect(video).not.toHaveClass('object-contain')
expect(container.querySelector('[data-testid="hero-content"]')).toHaveClass(
  'min-h-[calc(100svh-97px)]',
)
expect(container.querySelectorAll('video')).toHaveLength(1)
```

- [ ] **Step 2: Confirm the test fails**

Run: `npm.cmd test -- --runInBand __tests__/HeroSection.test.tsx`

Expected: FAIL because the current mobile layout uses a normal-flow aspect-ratio panel and `object-contain`.

- [ ] **Step 3: Restore and tune the overlay hero**

Use this structure in `HeroSection.tsx`, retaining the current motion children and analytics callback:

```tsx
<section className="relative min-h-[calc(100svh-97px)] w-full overflow-hidden bg-onyx text-center text-linen">
  <video
    className="absolute inset-0 z-0 h-full w-full object-cover object-[68%_center] motion-reduce:hidden md:object-center"
    src="/videos/alpe-hero-preview.mp4"
    autoPlay
    muted
    loop
    playsInline
    preload="metadata"
    aria-hidden="true"
  />
  {/* Existing contrast gradients remain absolute overlay layers. */}
  <div
    data-testid="hero-content"
    className="relative z-20 mx-auto flex min-h-[calc(100svh-97px)] max-w-5xl flex-col items-center justify-center px-6 py-10 md:px-10 md:py-14"
  >
    {/* Existing eyebrow, H1, supporting copy, and CTA. */}
  </div>
</section>
```

Use `text-[clamp(40px,11vw,96px)] md:text-[clamp(56px,8vw,96px)]` for the H1 so phone text remains within the first viewport while desktop retains the original scale.

- [ ] **Step 4: Run focused verification**

Run: `npm.cmd test -- --runInBand __tests__/HeroSection.test.tsx`

Expected: the hero test passes.

- [ ] **Step 5: Verify safely and restore preview**

1. Stop the exact process listening on port 3000.
2. Run `npm.cmd test -- --runInBand` and expect all Jest suites to pass.
3. Run `npm.cmd run build` and expect a successful Next.js build.
4. Remove only the generated `E:\ALPE\alpe-store\.next` directory after validating that exact path.
5. Restart `npm.cmd run dev -- --hostname 0.0.0.0 --port 3000` in the background.
6. Confirm the generated stylesheet and JavaScript assets return HTTP 200.
7. Inspect 390×844, 1366×768, 1440×900, and 1920×1080. At each size, confirm content overlays the video, no horizontal overflow exists, and the main subject remains in frame.
