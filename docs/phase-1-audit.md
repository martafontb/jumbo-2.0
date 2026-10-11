# Jumbo Press theme: Phase 1 audit and plan

Status: audit only. No theme code has been written yet.
Date: 11 Oct 2026

## 0. What was inspected

| Input | Location | Notes |
|---|---|---|
| Design handoff README and rules | `design_handoff_shopify_liquid/README.md`, `CLAUDE.md` (copied to repo root) | Detailed spec: tokens, every page, Shopify mapping, data model suggestions |
| Desktop prototype | `design_handoff_shopify_liquid/reference/Jumbo Press v66.dc.html` | One HTML file, inline styles, `state.page` fake routing. Reference only, not shipped |
| Mobile prototype | `design_handoff_shopify_liquid/reference/Jumbo Press Mobile.dc.html` | Same pages and data, 1-column layout, 750px breakpoint |
| Screenshots | `design_handoff_shopify_liquid/screenshots/` (26 PNGs + `_overview.png`) | Desktop only, ~924px wide, page tops |
| Repository | `martafontb/jumbo-2.0` | Empty before this commit. No conventions to inherit |
| Shopify store | none | No store URL, credentials or catalogue in this environment |

Tooling available in this environment: Node 22.22, npm 10.9. Current published versions: `@shopify/cli` 4.9.3, `@shopify/theme-check-node` 3.30.1. Theme Check runs locally without a store. `shopify theme dev` and theme previews need a store and login, so they can't run here.

## 1. Design summary and page inventory

The design is a high-fidelity editorial storefront: a warm off-white ground (`#F0EDEC`), ink black, risograph blue and red, a grey. Outfit is used for very large, tightly tracked headlines and DM Mono uppercase for labels, prices and buttons. It's built on a 3-column, 4px-gap grid with 20px radii on images and pill buttons. Its signatures: a `mix-blend-mode: difference` sticky header, headings ending in a coloured full stop, coloured product-card grounds, and hover rows that fill with colour.

| # | Prototype page | Shopify template | Notes |
|---|---|---|---|
| 1 | Home | `index.json` | 10 sections, several toggleable |
| 2 | Shop (PLP) | `collection.json` | Mixed-span grid, interleaved studio notes, sticky filters |
| 3 | Product (framed option) and Product (artist) | `product.json` | One template; artist block shown when metafield present |
| 4 | Merch (tee, cushion) | `product.merch.json` | Swatches, size chart, quantity, ink option |
| 5 | Cart page | `cart.json` | Ink summary card |
| 6 | Mini cart drawer | section `cart-drawer` | Upsells, free-shipping bar |
| 7 | Artists index | `page.artists.json` | Hover preview list |
| 8 | Artist page | `metaobject/artist.json` | Metaobject web page |
| 9 | Journal article | `article.json` | Reading progress, featured product |
| 10 | Print guide | `page.print.json` | Inks, file checklist, overprint simulator, process steps |
| 11 | Price guide | `page.prices.json` | Calculator (placeholder rates) |
| 12 | FAQ | `page.faq.json` | Accordion, FAQPage JSON-LD |
| 13 | Policies | `policy` + `page.policies.json` | From `shop.policies` |
| 14 | About / studio | `page.about.json` | Red page ground |
| – | Overlays | snippets/sections | Search, mega menus, newsletter popup, size and shipping guide, story viewer, mobile menu |

**Not designed but required or implied:** collection listing (`list-collections`), blog listing (`blog`), search results page (`search`), generic page (`page`), 404, password, gift card, customer account pages, quote request form. For customer accounts I propose using Shopify's new customer accounts, which are hosted by Shopify and need no theme templates. These pages will reuse the existing tokens and components rather than introduce new design.

## 2. Components

### Reusable (snippets or blocks)
- **Primitives:** pill/tag, primary button, secondary button, selected-option chip, mono label, coloured-dot heading, section header (rule + pill + mono caption), stars, quantity stepper, progress bar, spec list (`dl`), countdown boxes, icon close button.
- **Product card:** variants for large (26px) and small (20px), image ratio 3/4 or 3/2 by span, coloured ground, tag pill, meta line.
- **Feature card:** image + pill + title + price. Used in the mega menu and "also from".
- **Add-on row/card:** used in the cart drawer upsell, "Pairs well with", the hotspot popover and the featured product in articles.
- **Drawer shell:** right side, scrim, focus trap, Esc. Used for the cart and the size guide.
- **Modal shell:** used for the newsletter and the story viewer.
- **Responsive image** (`image_url` + `srcset` + `sizes`, explicit dimensions, lazy by default).
- **Hover-row list:** used in the mega menu, mobile menu, artists index and policies tabs.
- **Tabs / chip filters:** used for collection filters, FAQ categories, event kinds, print/price tabs and the size guide.

### Unique sections
Hero (video + rotating review card), intro statement, reviews strip, editions carousel, studio note, on the press (videos), shop the studio (hotspots), packs, events (countdown + list), stories, PLP grid with notes, artists index, artist page, print guide components (ink picker, checklist, overprint simulator, process stepper), price calculator, FAQ, policies, about.

## 3. Proposed theme architecture

```
layout/        theme.liquid, password.liquid
config/        settings_schema.json (tokens, shipping threshold, social, popup), settings_data.json
locales/       en.default.json, en.default.schema.json (+ es/ca if confirmed, see §5)
assets/        base.css (tokens consumers, primitives, utilities)
               fonts: outfit-*.woff2, dm-mono-400.woff2 (self-hosted, font-display: swap)
               global.js (drawer/modal/focus-trap helpers, cart API client, section rendering)
               per-feature ES modules loaded only where used:
               cart.js, product-form.js, variant-picker.js, predictive-search.js,
               facets.js, carousel.js, countdown.js, story-viewer.js, print-tools.js
snippets/      css-variables, meta-tags, image, product-card, price, pill, stars,
               quantity-stepper, drawer, icon-*, section-header, spec-list,
               product-gallery, product-info, size-guide, artist-block …
sections/      header-group.json (announcement-bar, header), footer-group.json (footer)
               overlay-group or layout-rendered: cart-drawer, search-overlay, newsletter-popup
               home: hero, intro-statement, reviews-strip, product-carousel, studio-note,
                     video-grid, shop-the-look, packs, events, stories
               main-product, product-upsells, product-reviews, product-recommendations
               main-collection, main-list-collections, main-cart, main-search
               main-article, main-blog, main-page, main-404
               artists-index, main-artist (metaobject), print-guide-*, price-calculator,
               faq, policies, about-*
blocks/        theme blocks where nesting pays off (product-info rows, FAQ item,
               hotspot, event, story, announcement message, studio-note tile)
templates/     JSON templates listed in §1, plus alternates (product.merch, page.*)
```

Principles:
- Tokens live once in `snippets/css-variables.liquid` as CSS custom properties, fed by theme settings for colours. Components reference the tokens and never use raw hex values.
- Section CSS uses `{% stylesheet %}` (Shopify bundles and dedupes it). Global CSS covers only tokens, the reset, typography and primitives.
- No build step. JS is native ES modules and custom elements, loaded with `type="module"` (deferred by default).
- Progressive enhancement: the product form and cart page are real `<form>`s that work without JS. JS upgrades them to AJAX and re-renders the drawer through the Section Rendering API.
- Commerce data always comes from Shopify objects: `product`, `variant`, `collection.filters`, `cart`, `predictive_search`, `shop.policies`, `linklists`. Card span, tag, meta, edition size, inks and artist come from metafields with sensible fallbacks.

### Data model (metafields / metaobjects)
I'll only create what the design actually needs:

| Owner | Key | Type | Used for |
|---|---|---|---|
| Product | `custom.artist` | metaobject ref (artist) | breadcrumb, artist block, "also from" |
| Product | `custom.edition_size` | integer | "38 of 120 remaining" + bar (with `variant.inventory_quantity`) |
| Product | `custom.inks` | list of metaobject ref (ink) | spec list, ink dots |
| Product | `custom.paper`, `custom.dimensions`, `custom.format` | single-line text | spec list |
| Product | `custom.card_tag`, `custom.card_meta` | single-line text | product card pill and caption |
| Product | `custom.card_span` | integer (1/2) | PLP mixed grid |
| Product | `custom.pairs_with` | list of product ref | "Complete the set" |
| Product | `custom.size_chart` | metaobject ref (size_chart) | merch size chart |
| Article | `custom.featured_product` | product ref | "Featured in this story" |
| Metaobject | `artist` | name, kind, since, bio, colour, image, website, quote, inks; web pages on | artists index + artist page |
| Metaobject | `ink` | name, hex, note | print guide, swatches, ink dots |
| Metaobject | `event` | title, kind, start, location, map link, image, details URL | events section |
| Metaobject | `size_chart` | rows (JSON or rich text) | merch |

FAQ items, announcement messages, hotspots, stories and studio notes stay as **section blocks**. They're page-specific and simpler for merchants to edit in context. Reviews come from the store's review app through Shopify's standard `reviews.rating` / `reviews.rating_count` metafields plus an app block slot (see §5).

I'll ship metafield and metaobject definitions as a documented setup checklist in `docs/`. A theme can't create definitions itself.

## 4. Starter theme comparison and recommendation

I inspected the current state of each starter:

| | **Horizon** (main, theme v4.2.0, Sep 2026) | **Dawn** (v16.0.0, Aug 2026) | **Skeleton** v1.0.0 (stable) | Skeleton `main` (rc-v2.0.0, Oct 2026) |
|---|---|---|---|---|
| Model | OS 2.0, theme blocks everywhere (95 blocks, 42 sections, 145 snippets) | OS 2.0, sections (48) and snippets, no theme blocks | OS 2.0, JSON templates, sections + theme blocks, ~15 sections | Block-first Liquid templates, **no sections, no JSON templates** |
| JS shipped | ~755 KB across 81 modules, its own component framework | ~220 KB, custom elements | 0 KB | ~1 KB |
| CSS shipped | ~50 KB + heavy per-block styles | ~370 KB | ~2 KB critical | ~6 KB |
| Visual fit with this design | Low. Generic merchant-configurable look, every block styled through its own settings system | Low. Rounded/generic patterns, would need wholesale overrides | Neutral blank slate | Neutral |
| Commerce features out of the box | Complete (cart drawer, facets, predictive search, quick add) | Complete and mature | Minimal (plain forms) | Minimal |
| Maintenance | Shopify's current flagship, updated often. A bespoke fork loses the update path anyway | Maintenance mode since Horizon | Stable tag | Release candidate; new syntax |

**Recommendation: start from Skeleton v1.0.0 and build the commerce layer bespoke, using Dawn's MIT-licensed implementations as a reference.** Dawn's patterns for cart AJAX with section rendering, the variant picker, predictive search and facets are battle-tested. I'll re-implement them lean rather than copy them wholesale.

Why:
1. **Fidelity.** The design shares almost no visual vocabulary with Horizon or Dawn. On either, most of the time would go into fighting and deleting existing CSS and settings, and the result would carry dead code and generic patterns the brief explicitly rules out.
2. **Performance.** Starting near zero JS/CSS and adding per-feature modules keeps the storefront light. Horizon's ~755 KB of JS is hard to justify for this catalogue.
3. **Architecture compliance.** Skeleton v1 is exactly what the brief asks for: JSON templates, sections, theme blocks, section groups, Theme Check config, `{% stylesheet %}`.
4. **Why not Skeleton `main`.** It's a release candidate that deliberately removes sections and JSON templates. That contradicts the brief and the handoff, and its new composition syntax isn't yet on a stable release.
5. **Cost.** I'll build more commerce code myself than with Dawn. That's mitigated by following Dawn's proven patterns and Shopify's documented Cart and Section Rendering APIs.

## 5. Missing assets, content and decisions

### Assets (needed before visual sign-off)
- **Logo** `jumbo-logo-cropped.png`. Ideally SVG. It only appears in screenshots, so the theme will use a text wordmark until it's uploaded via an `image_picker` setting.
- **All photography** listed in the handoff (`STATIONARYSET1.jpg`, `DSC04769.jpeg`, …, Instagram stills) and **`hero.mp4`** (not yet supplied). The theme will use Shopify placeholder SVGs on coloured grounds until then.
- **Fonts:** Outfit and DM Mono, both SIL OFL. I'll self-host woff2 subsets in `assets/`. No supplied brand font files are needed. Ronzino is an unused exploration font and will be ignored.
- **Real ink hex values** for the 7 Jumbo inks. The prototype reuses `#22A8E1` for several.

### Content (placeholder in the prototype; not invented in the theme)
Prices, review quotes and ratings ("4.8 / 312 verified reviews"), FAQ answers, policies, price-guide rates, shipping rates and times, events, artist bios, specs card values, opening hours, contact email (`hello@jumbopress.example`). All of these become settings, blocks, metaobjects or Shopify data. Defaults will be clearly marked placeholders, and the review UI hides itself when no real review data exists.

### Decisions that affect implementation
1. **Location, currency and language conflict.** The brief says Barcelona. The design says "Free UK shipping over £75", prices in £, UK/Europe/Worldwide shipping and "Unit 4, Canal Yard". The theme formats money from the store's own currency and markets either way, so code doesn't block on this. But I need to know which locale files to ship (English only, or English + Spanish + Catalan) and what default copy to seed.
2. **Reviews.** Shopify's own Product Reviews app has been retired. Which review app will the store use (e.g. Judge.me)? I'll build against the standard `reviews.*` metafields + app blocks, which most apps populate, so this can be decided later.
3. **Packs/bundles.** I propose Shopify's free **Bundles** app. Each pack is a real product with a compare-at price, so the theme needs no custom bundle logic.
4. **Event reminders.** I propose a generated `.ics` calendar link per event (no app, works everywhere) instead of the prototype's local toggle.
5. **Quote form.** Shopify contact forms can't accept file uploads. I propose a contact form with size, colours, run and an artwork-link field (WeTransfer/Drive), unless they want a form app.
6. **Store access.** I need a development store (or a staff/collaborator account on the real store) for `shopify theme dev`, previews and testing real variants and cart. Until then I'll verify with Theme Check and the documented Liquid objects, and I won't claim live behaviour is verified.

## 6. Implementation plan (by dependency)

| Phase | Slice | Output | Verification |
|---|---|---|---|
| 2 | Foundation | Skeleton v1 import, `.theme-check.yml`, `.shopifyignore` (exclude handoff/docs), tokens, fonts, base.css, layout, meta/SEO, image snippet, drawer/modal + focus-trap helpers | Theme Check clean |
| 2 | Global chrome | Announcement bar, header (difference blend, mega menus with click/keyboard fallback, mobile menu), footer, search overlay (predictive search) | Keyboard walkthrough; Theme Check |
| 3 | Home | 10 sections with schemas and presets, `index.json` matching the reference order | Visual compare at 1440/924/390 against screenshots and prototype |
| 4 | Collection | Main collection grid (span logic, notes, Storefront filters, sort, pagination, empty state), list-collections | Filter/sort URLs, empty collection |
| 4 | Product | Main product (gallery, variant picker, edition stock, specs, add to cart w/ no-JS fallback), size guide drawer, upsells, reviews, artist block, recommendations; merch template | Multi-variant, sold-out, single-variant, unavailable-first-variant cases |
| 4 | Cart | Cart drawer + cart page, AJAX + Section Rendering, free-shipping bar, upsells, error states | Add/update/remove, quantity limits, failed requests, JS disabled |
| 4 | Content | Search results, article, blog, page, 404, password, policies, FAQ (+JSON-LD), about, artists index + artist metaobject page, print guide, price guide, quote form | Theme Check; heading order |
| 5 | Polish | Newsletter popup, story viewer, carousels, countdown, motion with `prefers-reduced-motion`, sticky mobile add-to-cart bar | Reduced-motion, touch targets ≥44px |
| 6 | Validation | `shopify theme check`, accessibility pass (axe via Playwright on a local HTML render where possible), responsive screenshots | Report of what was and wasn't tested |
| 7 | Handover | README: setup checklist (metafields, metaobjects, menus, collections, apps), preview and publish steps, known limitations | — |

I'll commit each slice separately on `claude/jumbo-press-shopify-theme-4z1xdl`. I won't publish to any live theme.
