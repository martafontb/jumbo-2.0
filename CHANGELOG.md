# Changelog

All notable changes to this theme are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
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
