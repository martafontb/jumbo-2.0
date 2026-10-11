# Changelog

All notable changes to this theme are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
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
