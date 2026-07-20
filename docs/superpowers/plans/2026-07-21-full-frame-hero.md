# Full-frame Responsive Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the complete 16:9 hero video visible on every viewport while preserving an intentional ALPÉ composition and readable conversion copy.

**Architecture:** Keep one video source and one video element. Its wrapper participates in normal document flow as a 16:9 panel on narrow screens, then becomes an absolute full-hero layer at the desktop breakpoint; the video itself always uses `object-contain`, while the copy sits below it on mobile and overlays it on desktop.

**Tech Stack:** Next.js 14 App Router, React, Tailwind CSS, Jest, Testing Library

## Global Constraints

- Never use `object-cover` for the hero video.
- Keep `preload="metadata"`, `muted`, `playsInline`, looping playback, and `motion-reduce:hidden`.
- Keep exactly one video element and do not introduce another media download.
- Preserve the existing semantic heading, tracked CTA, ALPÉ typography, and onyx/linen palette.
- Keep all work local; do not push or deploy to production.

---

### Task 1: Responsive full-frame hero

**Files:**
- Modify: `__tests__/HeroSection.test.tsx`
- Modify: `components/landing/HeroSection.tsx`

**Interfaces:**
- Consumes: `heroContent`, `Button`, and the existing `CTAClick` analytics event.
- Produces: a single responsive hero whose full video frame remains visible at every aspect ratio.

- [ ] **Step 1: Strengthen the failing component test**

Extend the existing test with these assertions:

```tsx
expect(video).toHaveClass('object-contain')
expect(video).not.toHaveClass('object-cover')
expect(video?.parentElement).toHaveClass('aspect-video', 'md:absolute', 'md:inset-0')
expect(container.querySelector('[data-testid="hero-content"]')).toHaveClass('md:min-h-[calc(100svh-160px)]')
```

- [ ] **Step 2: Run the test and observe the crop-to-fill failure**

Run: `npm.cmd test -- --runInBand __tests__/HeroSection.test.tsx`

Expected: FAIL because the current video uses `object-cover` and has no responsive 16:9 media wrapper.

- [ ] **Step 3: Implement the responsive composition**

In `HeroSection.tsx`, use this structural pattern while retaining the existing copy and analytics callback:

```tsx
<section className="relative w-full overflow-hidden bg-onyx text-center text-linen md:min-h-[100svh] md:px-10 md:py-16">
  <div className="relative aspect-video w-full bg-onyx md:absolute md:inset-0 md:h-full md:aspect-auto">
    <video
      className="h-full w-full object-contain motion-reduce:hidden"
      src="/videos/alpe-hero-preview.mp4"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
    {/* Existing overlays remain inside the media layer. */}
  </div>
  <div
    data-testid="hero-content"
    className="relative z-20 mx-auto flex max-w-5xl flex-col items-center justify-center px-6 pb-16 pt-10 md:min-h-[calc(100svh-160px)] md:px-0 md:py-0"
  >
    {/* Existing eyebrow, heading, supporting copy, and CTA. */}
  </div>
</section>
```

- [ ] **Step 4: Run the focused test**

Run: `npm.cmd test -- --runInBand __tests__/HeroSection.test.tsx`

Expected: 1 test suite passed, with the full-frame and single-video assertions green.

- [ ] **Step 5: Verify the whole preview**

Run:

```powershell
npm.cmd test -- --runInBand
npm.cmd run build
```

Expected: all Jest suites pass and the Next.js production build exits with code 0.

Open `http://localhost:3000` and inspect narrow portrait, tablet, laptop, and wide desktop widths. Confirm the complete frame is visible, mobile copy is below the media panel, desktop copy overlays the contained video, and reduced-motion styling remains present.
