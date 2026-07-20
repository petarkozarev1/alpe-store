# Responsive overlay hero design

## Goal

Restore the original ALPÉ hero composition—headline, supporting text, and CTA layered over the video—while sizing and cropping the supplied 16:9 clip intentionally for common monitors and phones.

## Chosen composition

The hero remains a single full-screen visual on every device. One absolutely positioned video fills the available hero area with `object-cover`; the copy remains centered above it. Responsive focal positioning keeps the people and glasses near the visual center as the sides crop on portrait screens.

The user explicitly accepts controlled left/right cropping on phones. Complete-frame letterboxing and a separate mobile media panel are out of scope.

## Responsive sizing

- Size the hero to the visible viewport below the site navigation so the main CTA remains within the first screen where practical.
- Validate at 390×844 phone, tablet width, 1366×768 laptop, 1440×900 monitor, and 1920×1080 desktop.
- Use a smaller mobile headline and tighter vertical rhythm while retaining the same copy hierarchy.
- Keep the existing desktop scale and centered composition on wide screens.
- Prevent horizontal overflow at every checked width.

## Video and overlay

- Keep exactly one video element and `/videos/alpe-hero-preview.mp4` as its source.
- Use `object-cover` with breakpoint-specific `object-position` values chosen to retain the main subjects.
- Keep `muted`, `loop`, `playsInline`, `autoPlay`, `preload="metadata"`, and `motion-reduce:hidden`.
- Use the existing warm, dark ALPÉ gradients to preserve text contrast without hiding the footage.

## Content and behavior

- Keep the eyebrow, H1, supporting copy, CTA, and existing `CTAClick` analytics behavior.
- Copy overlays the video on both desktop and mobile.
- Reduced-motion users retain the onyx background and readable overlay content.

## Verification

- Update the component test to require a single overlay composition and responsive `object-cover` video.
- Inspect mobile and desktop screenshots in the local preview.
- Confirm the hero content overlaps the video bounds at all tested viewports and that the page has no horizontal overflow.
- Run the full Jest suite and production build only after stopping the dev server; restart the preview afterward to avoid corrupting Next.js generated assets.

## Scope

This remains a local preview change. It does not push or deploy any SEO or hero work to production.
