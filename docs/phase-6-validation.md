# Jumbo Press theme: Phase 6 validation

What was tested, how, what was fixed, and what still needs testing on the store.

## Method and its limits

The dev store (`jakelucas.myshopify.com`) can't be reached from the build environment: its network policy blocks `*.myshopify.com`. Everything below was tested on a **local render**, not on Shopify:

- A LiquidJS harness renders each JSON template with its sections, snippets, locales and section stylesheets, using fake fixtures (products, variants, a collection, a cart, artists, articles). It approximates Shopify's Liquid; it is not Shopify.
- Playwright (Chromium) drives the rendered pages at 1440, 924 and 390px. Cart and Section Rendering API responses are mocked.
- Images are Shopify placeholder SVGs, and there is no hero video, so performance numbers are indicative only.

**Not tested here, still needed on the store:** see [What still needs the store](#what-still-needs-the-store).

## Results

| Check | Tool | Result |
|---|---|---|
| Theme Check | `shopify theme check` (CLI 4.9.3) | 105 files, 0 offenses |
| Schema validity | Script: every section schema and template JSON | All settings use valid types; select and range defaults are valid; no duplicate ids; every section has a name, class, leading comment and a preset or template use |
| Accessibility | axe-core 4.10 (WCAG 2.0/2.1/2.2 A and AA plus best practice), 14 pages × 2 widths, plus open overlays (newsletter popup, search, cart drawer, mobile menu, story viewer, size guide) | Fixed everything real (below). What remains are false positives and two design decisions |
| Keyboard focus | Script tabs through every page (up to 120 stops) and checks for a visible focus style | All focusable elements show focus (one fix, below) |
| Touch targets | Script measures every control at 390px on a touch device | 44px hit areas on touch screens; footer link rows meet the 24px AA minimum |
| Reduced motion | Script checks every element for running animations or transitions, and for content left invisible, with `prefers-reduced-motion: reduce` | None. A control run with motion allowed confirms the check detects motion |
| No JavaScript | Every page with JS disabled | No content hidden; product and cart forms post; the price calculator shows its default estimate |
| Interactions | Playwright suites: header and mega menus (mouse, keyboard, tap), mobile menu, search, cart drawer and cart page, variant re-render, size chart, quantity, sticky add-to-cart bar, newsletter popup (auto-open, dismissal memory, Esc, scrim, posted states), print tools, price calculator, FAQ, artist filters, ink filter, policy tabs and deep links, article progress and copy link | All pass, no page errors |
| Theme editor | Each section on each page removed and re-inserted 5 times, with `shopify:section:unload/load`; listeners on `document`/`window` counted through Chrome DevTools | No JS errors, no leaked listeners (two leaks fixed, below). Block select opens the right ink, process step and FAQ question |
| Edge cases | Fixtures for sold out, single variant, first variant unavailable, empty collection, empty cart and drawer | All render correctly (one fix, below) |
| Layout | Screenshots and an overflow check, 14 pages at 1440, 924 and 390px | No horizontal overflow, no errors |
| Performance | Lighthouse 12 (mobile, simulated throttling) on home, collection, product, print guide, article | Performance 96–100, CLS 0, TBT ≤ 70 ms, LCP ≤ 1.7 s (on placeholders) |
| Asset weight | File sizes | 67 KB JS in total, split into per-feature modules loaded only where used; 14 KB `base.css`; about 70 KB of fonts (Latin subsets preloaded) |

## Fixed in this phase

- **Muted text contrast:** labels at 55–60% opacity measured 3.6–4.1:1. New `--opacity-muted` token (0.68, 5.25:1) used for all muted text.
- **Announcement bar:** white 12px text on red is 3.47:1. Added a "Text colour" setting, defaulting to ink (4.7:1). White is still available and the setting explains when it passes.
- **Collection studio notes:** white on blue (2.7:1) and red (3.47:1). Text is now ink on blue and red, white only on ink.
- **Search placeholder:** raised to ≥ 3:1 (it's large text).
- **Size guide diagram:** the sheets used blue, red, grey, which multiply to near black and hid the A3/A4 labels. Now blue, grey, blue, as in the design.
- **Sort select focus:** keyboard focus on the collection sort was invisible. The chip around it now shows the focus ring.
- **Target size:** quantity inputs and the policy permalink were below 24px. Fixed.
- **Theme editor listener leaks:** the ink picker, process steps and FAQ added a `document` listener on every re-render. They now listen on themselves.
- **Price calculator without JS:** showed "–". The default estimate is now rendered in Liquid with the same formula (verified: £170 / £1.70, matching the JS).
- **Empty collection:** offered "Clear filters" with no filters applied. Now it does that only when a filter is active, and otherwise links back to the shop.

## Remaining axe findings

| Finding | Status |
|---|---|
| Header links and wordmark (white on light background) | **False positive.** The header uses `mix-blend-mode: difference`, which axe can't compute. Measured from rendered pixels: 16:1 on the page background |
| Cart summary fine print | **False positive.** The text sits on the ink summary card (verified with `elementsFromPoint`); axe sampled the sticky card in the wrong place |
| Size guide diagram labels (A3, A4) | Decorative and `aria-hidden`; the same sizes are listed as text below. Matches the design |
| Blue accent text: the accented word in product titles ("Soft *Machines*"), heading counts ("Artists. (4)"), full stops | **Design decision.** Blue on the page background is 2.32:1, below the 3:1 large-text minimum. A darker blue in Theme settings > Colours fixes it everywhere |

## What still needs the store

These depend on Shopify itself and can't be checked locally:

1. **Real Liquid rendering:** `shopify theme dev` or an unpublished theme, every template with real products, collections, metafields and metaobjects (see the README checklist).
2. **Cart API and Section Rendering:** real add, change and remove, quantity rules, inventory limits and error messages. These were mocked here.
3. **Customer form:** the newsletter popup's post, Shopify's spam challenge, and the success redirect.
4. **Search & Discovery filters** and sort URLs on a real collection; predictive search results.
5. **Shop app reviews block** placement on the homepage and product page.
6. **Theme editor:** add, remove, reorder and edit every section and block; block selection; section groups (header, footer, overlays).
7. **Images and video:** real photography and the hero video for LCP and Lighthouse; responsive `srcset` from Shopify's CDN.
8. **Browsers and assistive tech:** Safari (desktop and iOS), Firefox, Chrome Android; VoiceOver and NVDA through menus, cart drawer, variant picker and popup. Only Chromium was used here.
9. **Checkout handoff:** the checkout button and dynamic checkout buttons.
