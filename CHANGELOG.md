# Changelog

All notable changes to this theme are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Ink marquee "Worm" shape (now the default): wiggling worms of overlapping, overprinting round segments with eyes; names on hover, always visible on touch screens and under reduced motion. Pausing stops the wiggle too.

### Fixed
- Page no longer scrolls behind the mobile menu or overlays on iOS: a shared scroll lock pins the page and restores the position.
- The announcement bar hides while the mobile menu is open.

### Added
- Gift wrapping: a gift wrap product (Theme settings > Cart) added or removed with a checkbox in the cart drawer and cart page, plus an optional gift message saved as the "Gift message" cart attribute. Works without JS on the cart page.
- Ink marquee: "Overprint" (overlapping blocks that multiply where they cross) and "Misregistration" settings.
- Product gallery: "Auto" image fit (portrait images shown whole) as the default; swipeable carousel with a counter on phones.

### Changed
- Related products ("Also from …") is a drag-to-scroll carousel; default limit 9.
- The gift wrap product is never suggested as a cart add-on; the add-on setting explains that only single-variant products are shown.
- README: Judge.me setup, cart upsell and gift wrap instructions.

### Added
- "Show top border" setting on every section that opens with a ruled line.
- Video option next to most image settings, through a shared `image-or-video` snippet and `<auto-video>` (muted loop, pause button, pauses off screen, no autoplay under reduced motion).
- Ink marquee section: scrolling row of ink colour blocks with names and optional codes, pause button, static under reduced motion. Added to the homepage.
- Collection blocks: "Media" tile (image or video, 1–3 columns) and "Product layout" (width 1–3 columns and replacement image or video per product). `custom.card_span` accepts 3.
- Theme settings > Product cards: card background (product colour on hover or always) and image fit.
- Product section: image fit (crop or show the whole image).
- Product reviews: theme editor prompt to add the reviews app block.

### Changed
- Product cards no longer zoom on hover; by default they fill with the product's colour on hover and keyboard focus.
- Cart and size guide drawers slide in from the right and back out (instant under reduced motion). The design specified a fade.
- Mega menu product cards fill the full height of the menu panel.
- Product carousel shows the open-hand cursor over cards, not just between them.
- Stories: more space under the label and caption, and inside tiles.
- Colour swatches are smaller (28px) and round, with a 44px touch area.

## [1.0.0-rc.1] - 2026-10-11

Release candidate: the full design is built and validated on a local render. It becomes 1.0.0 after testing on the store (see `docs/phase-6-validation.md`).

### Added
- Quote page (`page.contact`): contact form section with size, colours, run and artwork-link fields, prefilled from the price calculator, with success and error states.
- README handover: go-live checklist, pages and templates, apps, placeholder content list, maintenance notes.
- Announcement bar "Text colour" setting (ink by default, white optional).
- `docs/phase-6-validation.md`: what was tested, how, and what still needs the store.
- Newsletter popup (Overlays group): opens once per visitor after a delay, from the footer link, or on section select in the editor; Shopify customer form tagged `newsletter` with success and error states.
- Sticky add-to-cart bar on mobile product pages, shown while the buy buttons are off screen; it submits the main product form and mirrors its "Added" state.
- Touch-target helper: 44px invisible hit areas on touch screens for chips, buttons, mono links and `.tap-target` elements (breadcrumbs, logo, cart line titles, variant pills, hotspot list, carousel end link); larger range inputs and sort select.
- Artists page (`page.artists`): artist metaobject list with kind filters and a sticky hover/focus preview card. Artist pages (`metaobject/artist`): image with kind pill, bio, details, website link, editions grid with ink filters, "In their words" quote, next-artist link.
- Journal: blog page with tag chips and article cards (kind pill, reading time); article page with reading-progress bar, copy link, 21:9 hero, sticky featured product (`custom.featured_product`), pull-quote styling and "Read next".
- Policies page (`page.policies`): vertical tabs over the store policies with deep links by handle (`#refund-policy`), keyboard support and no-JS fallback. Native `/policies/…` pages styled.
- About page (`page.about`): intro with full-page colour option, image and text sections, numbers band, visit hours.
- `artists`, `article` and `policy-tabs` modules; `article-card` snippet.
- Print service pages: `page.print` (page header with tabs, ink picker, file checklist, spec cards, CTA band, overprint simulator, "How it is made" stepper with inline SVG illustrations) and `page.prices` (price calculator with live estimate, quote link with chosen options, rate card).
- FAQ page (`page.faq`): category filter chips, native `<details>` accordion, contact card, FAQPage JSON-LD.
- Reusable sections: page header, CTA band, spec cards, checklist; statement section gains an ink-block button style. `print-tools`, `price-calculator` and `faq` modules.
- Collection page: title with count, sticky filter bar (menu or Search & Discovery chips, sort), gap-free mixed-span grid driven by `custom.card_span`, studio-note tiles, empty state.
- Product page (`main-product`): stacked or grid gallery, sticky info column built from blocks (breadcrumb, switcher, accented title, artist line, price with edition stock, specs from metafields, variant picker with swatches and size chart, buy buttons with quantity, live total and "View cart", guide link, description, text, app blocks), size & shipping guide drawer, Section Rendering on variant change, no-JS variant fallback.
- Product sections: related products (artist collection or recommendations), "Complete the set" (`custom.pairs_with`), product reviews (Shop app blocks + `reviews.*` metafields), "The artist" (artist metaobject). New `product.merch` template.
- Cart drawer (static section, re-rendered through the Section Rendering API) with steppers, removal, add-on upsells and free-shipping progress; designed cart page with ink summary card. Both work as plain forms without JS.
- `cart-items`, `product-info`, `quantity-input` and `product-related` modules; `formatMoney` helper.
- Homepage sections: hero (video or image, side image, rotating review card), statement, reviews strip (Shop app blocks + optional real quotes), product carousel with drag-to-scroll and an end card, studio note, video grid, shop the look (hotspots with add to cart), packs (savings from compare-at prices), events (featured countdown, kind filters, .ics reminders, auto-hiding past events) and stories (9:16 viewer with auto-advance).
- Shared snippets: product card, price, stars, section head, add-to-cart form; `product-form`, `drag-scroller`, `quote-rotator`, `video-tile`, `event-list`, `story-viewer` and `hero` modules.
- Theme foundation on Shopify Skeleton v1.0.0: layout, password layout, Theme Check config, `.shopifyignore`.
- Design tokens (`snippets/css-variables.liquid`) driven by theme colour settings; self-hosted Outfit (variable) and DM Mono fonts with preload.
- `assets/base.css`: reset, typography scale, pills, buttons, chips, icon buttons, section heads, spec lists, progress bars, steppers, media frames, dialog-based overlays, reduced-motion support.
- `assets/global.js`: shared overlay controller (native `<dialog>`), Cart API client with Section Rendering support and `cart:updated` events, live-region announcements.
- Announcement bar section with rotating messages, copy-to-clipboard discount codes and session dismissal.
- Header section: difference-blend sticky header, nav entrance and text-roll animations, mega menus built from Shopify menus with product and info cards, full-screen mobile menu, search overlay with predictive search.
- Footer section with statement, link/text/social columns, policy links and newsletter trigger.
- Baseline templates and sections for page, 404, search, collection, collections list, product, cart, blog, article, password and gift card.
- `CLAUDE.md` project guidelines, `README.md` setup checklist, Phase 1 audit.

### Changed
- Stock status and form error messages use ink text with a red or blue marker, for WCAG AA contrast.
- Product form accepts submit buttons outside the form (`form="…"`), mirroring busy and "Added" states and returning focus to the button used.
- Muted text uses an `--opacity-muted` token (0.68) for WCAG AA contrast.
- Collection studio notes use ink text on blue and red backgrounds.
- Price calculator renders its default estimate in Liquid, so it shows without JS.
- Empty collections link back to the shop unless a filter is applied.

### Fixed
- Size guide diagram colours (blue, grey, blue, as designed) so the size labels stay readable.
- Visible focus ring on the collection sort control.
- Quantity inputs and the policy permalink meet the 24px target size.
- Ink picker, process steps and FAQ no longer leak `document` listeners when the theme editor re-renders them.
