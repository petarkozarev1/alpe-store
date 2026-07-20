# Full-frame responsive hero design

## Goal

Show the complete 16:9 ALPÉ hero video on every supported viewport without cropping, while keeping the headline and primary action readable and visually intentional.

## Chosen direction

Use two responsive compositions built around the same video element and source:

- On desktop and wide tablets, the video is centered inside the full-height dark hero using `object-contain`. Any remaining space uses the existing ALPÉ onyx background and restrained overlay treatment.
- On phones and narrow tablets, the video occupies a dedicated 16:9 panel at the top of the hero. The headline, supporting copy, and CTA sit below the panel instead of covering important parts of the footage.

This is preferred over a universal contained backdrop because a landscape clip would otherwise create large, accidental-looking bars on portrait screens. It is preferred over crop-to-fill because crop-to-fill cannot guarantee that the full frame remains visible.

## Responsive behavior

- The video must never use `object-cover`.
- The full frame must remain visible at common portrait, landscape, tablet, laptop, and ultrawide viewport ratios.
- The mobile hero may extend beyond one viewport height so neither the video nor the copy is compressed.
- Desktop copy remains layered over the hero, positioned where the existing overlays preserve contrast.
- Mobile copy uses the solid onyx section beneath the video for reliable contrast.
- Reduced-motion users receive the existing non-video dark background and readable copy.

## Performance and accessibility

- Keep one video element, `muted`, `playsInline`, looping, and `preload="metadata"`.
- Keep the video hidden under `prefers-reduced-motion`.
- Do not introduce a second blurred video or additional media download.
- Preserve semantic hero heading order and the existing tracked CTA.

## Verification

- Component test checks the new video source, metadata preload, reduced-motion behavior, and absence of crop-to-fill styling.
- Visually inspect desktop and mobile layouts in the local preview.
- Run the full test suite and production build before handoff.

## Scope

This change affects only the homepage hero presentation. It does not deploy to production and does not alter the remaining SEO preview work.
