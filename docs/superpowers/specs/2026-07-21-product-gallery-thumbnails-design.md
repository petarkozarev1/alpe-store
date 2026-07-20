# Product Gallery Thumbnail Design

## Goal

Improve the three product-gallery thumbnails on the ALPÉ Daily and ALPÉ Evening pages without altering or inventing product photography.

## Approved Direction

- Present every thumbnail as a consistent 4:3 card.
- Use the existing parchment palette as a quiet background behind each image.
- Render images with `object-contain` so both portrait and landscape source photos remain fully visible.
- Use a subtle border and shadow to separate the cards from the page.
- Identify the active image with an ALPÉ-brown outline and a slight upward lift.
- Keep thumbnails larger on desktop and compact enough to fit comfortably on mobile.
- Preserve the existing click behavior, accessibility labels, and `aria-pressed` state.

## Scope

Only `components/product/ImageGallery.tsx` and its focused tests are in scope. The source images, main gallery image, product data, cart behavior, and live website remain unchanged.

## Responsive Behavior

The thumbnail row stays horizontal. Cards use a 4:3 ratio with responsive widths, and the row may scroll horizontally only if a very narrow viewport cannot fit all three without crowding.

## Verification

- Confirm all three source images remain uncropped in their thumbnails.
- Confirm clicking a thumbnail changes the main image.
- Confirm the active state is visible and keyboard focus remains clear.
- Check ALPÉ Daily and ALPÉ Evening at desktop and mobile widths.
- Run the existing automated test suite and production build.
