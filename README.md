# Jumbo Press — Shopify theme

A Shopify Online Store 2.0 theme for Jumbo Press, a risograph studio, print workshop and independent print shop. Built from the design handoff in `design_handoff_shopify_liquid/` on top of Shopify's [Skeleton theme](https://github.com/Shopify/skeleton-theme) v1.0.0.

- Liquid, JSON templates, sections, blocks and section groups. No build step.
- Vanilla JS ES modules and custom elements. No frameworks or jQuery.
- Self-hosted Outfit and DM Mono fonts (SIL OFL).

See `CLAUDE.md` for coding rules and `docs/phase-1-audit.md` for the architecture plan.

## Status

| Phase | Scope | State |
|---|---|---|
| 1 | Audit and plan | Done |
| 2 | Foundation: tokens, fonts, layout, announcement bar, header (mega menus, mobile menu, predictive search), footer, baseline templates | Done |
| 3 | Homepage: hero, statement, reviews strip, product carousel, studio note, video grid, shop the look, packs, events, stories | Done |
| 4 | Collection, product (editions + merch), cart drawer, cart page, print guide, price guide, FAQ, artists, journal, policies, about | Done |
| 5 | Interactions and polish: newsletter popup, sticky mobile add-to-cart bar, touch targets, reduced motion, contrast fixes | Done |
| 6 | Validation: Theme Check, axe, keyboard, touch, reduced motion, no-JS, editor reloads, edge cases, Lighthouse. See `docs/phase-6-validation.md` | Done (local render; store testing pending) |
| 7 | Handover: quote form page, go-live checklist, placeholder list, maintenance notes | Done |

## Development

Requires [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) (current stable, 4.x).

```bash
shopify theme dev --store jakelucas.myshopify.com    # local preview against the dev store
shopify theme check                                  # lint (must be clean before committing)
shopify theme push --unpublished --store jakelucas.myshopify.com   # upload as a new unpublished theme
```

Never push to the live theme without approval. `config/settings_data.json` is gitignored and listed in `.shopifyignore`, so the store's live customisations are never overwritten from git.

## Going live: checklist

Work through these in order on an **unpublished** copy of the theme. Sections further down explain each item in detail.

1. **Upload the theme unpublished.** Either `shopify theme push --unpublished --store jakelucas.myshopify.com`, or Online Store > Themes > Add theme > Connect from GitHub. With GitHub, connect a dedicated branch (e.g. `store/live`): Shopify commits theme editor changes, including `config/settings_data.json`, back to the connected branch. `settings_data.json` isn't in this repository, so the theme starts with the defaults from the schemas and templates.
2. **Theme settings** (Customize > Theme settings): logo, favicon, the five colours (see [Colour contrast](#accessibility-notes) for the blue), cart type and free-shipping threshold (default £75; must match Settings > Shipping), social links.
3. **Navigation:** create the five menus in [Menus](#menus-online-store--navigation).
4. **Custom data:** create the product metafields, the `artist` metaobject (turn on **Web pages**) and the article metafield in [Metafields and metaobjects](#metafields-and-metaobjects).
5. **Apps:** Shop app (reviews; add its blocks to the Reviews strip and Product reviews sections), Search & Discovery (collection filters), and optionally Shopify Bundles (packs). See [Apps](#apps).
6. **Pages:** create the pages in [Pages and templates](#pages-and-templates) and assign their templates.
7. **Products and collections:** assign `product.merch` to merch, fill in metafields, create the `editions` collection (homepage carousel) and an add-ons collection for the cart drawer.
8. **Replace placeholder content** listed in [Placeholder content](#placeholder-content). Every item is editable in the theme editor or in Shopify admin.
9. **Test on the preview** using "What still needs the store" in `docs/phase-6-validation.md`: real cart, contact and newsletter forms, filters, reviews blocks, Safari/iOS, a screen reader.
10. **Publish** (Online Store > Themes > … > Publish) only once that passes and the owner approves. Keep the previous theme as a backup.

## Pages and templates

Create each page in Online Store > Pages, then pick its template under "Theme template". Handles are what the default links expect; change the links in the theme editor if you use others.

| Page (handle) | Template | Notes |
|---|---|---|
| Print guide (`print-guide`) | `page.print` | Tabs link to the print and price guides |
| Price guide (`price-guide`) | `page.prices` | "Request this quote" links to `/pages/contact` |
| Get a quote (`contact`) | `page.contact` | Contact form with quote fields; prefilled from the calculator |
| FAQ (`faq`) | `page.faq` | |
| Artists (`artists`) | `page.artists` | |
| Policies (`policies`) | `page.policies` | Content comes from Settings > Policies |
| About (`about`) | `page.about` | |

Artist pages use `templates/metaobject/artist.json` automatically once web pages are on for the `artist` definition. The journal is a regular Shopify blog using `blog.json` and `article.json`; add it to your menus.

After creating the quote page, point these buttons at it (theme editor): header **Print** mega menu > "Get a quote" card button, and any CTA band or statement button that should start a quote.

## Apps

| App | Used for | Theme side |
|---|---|---|
| Shop app (Product Reviews) | Star ratings and reviews | Reads `reviews.rating` / `reviews.rating_count`; app blocks in the Reviews strip and Product reviews sections. Nothing shows until there are real reviews |
| Search & Discovery | Collection filters | Filter chips fall back to its first list filter when no "Filter chips menu" is set |
| Shopify Bundles (optional) | Homepage packs | Packs are ordinary products; the saving comes from the compare-at price |

## Placeholder content

The design's copy, images and figures ship as editable defaults. Replace or confirm all of these before launch:

- **Announcement bar:** the "WELCOME" 10% code (create the discount in Discounts, or change the message), "Free UK shipping over £75", the fair date.
- **Header mega menus:** product cards (pick products), Print specs card values, "Get a quote" card text and link.
- **Footer:** Visit address and next workshop text.
- **Homepage:** hero video and images, product carousel collection, events (dates, places), stories (images or videos), packs. Review quotes and the studio note are empty by default and stay hidden until filled with real content.
- **Newsletter popup:** image, "Next drop: 24 Oct" label and copy.
- **Product section:** size guide sizes, shipping zones and prices, returns text (keep in sync with Settings > Shipping and the refund policy).
- **Print guide:** ink names, colours and notes (placeholder risograph inks), file checklist, spec card values, process steps.
- **Price guide:** sizes and rates, setup fee, run range. **The defaults are the design's placeholder rates.**
- **Quote page:** heading ("price within 2 days") and success text.
- **FAQ:** every question and answer.
- **About:** studio text, figures ("2 / 14 / 40", "Est. 2019"), opening hours, photos, contact email.
- **Policies:** write them in Settings > Policies.
- **Cart drawer:** add-ons collection; cart page note ("Ships flat in board envelopes").

## Store setup reference

Everything visible in the design is editable in the theme editor. The theme also expects these store-side resources.

### Menus (Online Store > Navigation)

| Handle | Used by | Contents in the design |
|---|---|---|
| `shop-menu` | Header "Shop" mega menu + mobile menu | Editions, Zines, Books, Artists, Merch, All shop. Collection links show their product count automatically |
| `print-menu` | Header "Print" mega menu | Print studio, Custom print, Inks & papers, Artwork guide |
| `info-menu` | Mobile menu secondary links | About, Artists, Print guide, Price guide, FAQ |
| `footer` | Footer "Shop" column | Editions, Zines, Books, Merch |
| `footer-info` | Footer "Info" column | About, Artists, Print guide, FAQs |

Each header "Menu" block picks its menu in the theme editor, so other handles work too.

### Theme settings

- **Logo:** upload a dark logo (SVG or PNG, transparent background). The header inverts it for the difference-blend effect. Until one is uploaded, the store name renders as a wordmark.
- **Colours:** the five brand tokens. Every component uses them.
- **Cart:** drawer or page on add, and the free-shipping threshold for the progress bar (must match your shipping rates).
- **Social media:** links shown in the footer "Follow" column.
- **Product cards:** card background (product colour on hover, the default, or always) and image fit (crop to fill, or show the whole image for transparent PNG packshots).

### Options on every section

- **Show top border:** sections that open with a ruled line have a "Show top border" checkbox.
- **Video instead of an image:** most image settings have a "Video" setting next to them (hero side image, about intro, media and text, visit hours, events feature, process steps, carousel end card, shop the look, newsletter popup, mega menu product cards, collection tiles and product layouts). Videos play muted on a loop, pause off screen and when the visitor presses pause, and don't autoplay for visitors who prefer reduced motion. The image becomes the poster.

### Reviews (Shop app)

Reviews come from the Shop app. The theme never invents review content:

- **Star ratings** on product cards read the standard `reviews.rating` product metafield and render only when it's populated.
- **Written reviews on product pages** come from your reviews app's block, which you add in the theme editor (Product reviews section > Add block > Apps). Liquid can't read individual reviews, so until the block is added the section shows only the average and the editor shows a prompt. Make sure the app you use publishes reviews to the Shop app.
- **Reviews strip** (homepage): add the Shop app's block, and/or fill in the average rating, review count and "Review quote" blocks with real reviews. It stays hidden until something is filled in.
- **Hero review card:** "Review quote" blocks on the Hero section. Empty by default; the card is hidden until you add one.

### Metafields and metaobjects

All optional. Create product metafields in Settings > Custom data > Products, and the `artist` metaobject in Settings > Custom data > Metaobjects.

**Product metafields**

| Namespace.key | Type | Used for |
|---|---|---|
| `custom.card_meta` | Single line text | Caption under product cards, add-on blurbs |
| `custom.card_tag` | Single line text | Tag pill on collection cards and "Complete the set" cards |
| `custom.card_span` | Integer (1, 2 or 3) | Card width in the collection grid (a "Product layout" block overrides it) |
| `custom.card_ground` | Single line text (blue, red, grey, ink, bg) | The product's card colour (shown on hover, or always; see Theme settings > Product cards) |
| `custom.artist` | Metaobject reference (artist) | Breadcrumb, artist line, "The artist" block, "Also from …" |
| `custom.year` | Integer or text | Artist line, e.g. "Mara Oyelaran · 2026" |
| `custom.edition_size` | Integer | "38 of 120 remaining" and the stock bar (needs Shopify-tracked inventory) |
| `custom.edition_detail` | Single line text | Edition spec, e.g. "signed and numbered" |
| `custom.inks` | List of single line text (or ink metaobjects with `name`) | Inks spec |
| `custom.paper`, `custom.dimensions`, `custom.format`, `custom.material` | Single line text | Spec list |
| `custom.size_chart` | Multi-line text | Merch size chart. First line is the header, e.g. `Size \| Chest \| Length \| Sleeve`, then one row per size |
| `custom.short_title` | Single line text | Label in the merch product switcher (e.g. "Tee") |
| `custom.pairs_with` | List of products | "Complete the set" |
| `reviews.rating`, `reviews.rating_count` | Set by the reviews app | Stars on cards, product reviews summary |

**Artist metaobject (`artist`)**. Turn on **Web pages** for the definition (Settings > Custom data > Metaobjects > Artist > Options) so each artist gets a URL using the `metaobject/artist` template.

| Field key | Type | Used for |
|---|---|---|
| `name` | Single line text (required) | Everywhere |
| `kind` | Single line text (e.g. Illustrator, Photographer, Collective) | Kind pill and the filter chips on the artists page |
| `color` | Color | Background behind the artist's image (defaults to the blue token) |
| `portrait` | File (image) | Artist page, preview card, "The artist" block |
| `bio` | Multi-line text | Artist page intro, "The artist" block |
| `story` | Rich text | "The artist" block on product pages |
| `quote` | Multi-line text | "In their words" on the artist page (hidden when empty) |
| `website` | URL | "Visit website" button |
| `inks` | List of single line text (or ink metaobjects with `name` and `color`) | "Prints with" detail |
| `practice`, `based_in`, `elsewhere` | Single line text | "The artist" block |
| `since` | Integer | "With us since" |
| `collection` | Collection reference | The artist's editions. Edition count, ink chips and the editions grid come from it |

**Article metafield:** `custom.featured_product` (product reference) shows the sticky "Featured in this story" card on a journal article. Without it the article runs full width.

### Products, collections and cart

- **Templates:** editions use the default product template. Assign **product.merch** to tees, totes and cushions (product page > Theme template). Merch colour options show as swatches when the option values are linked to Shopify's colour swatches; otherwise they show as pills.
- **Collection chips:** set a "Filter chips menu" on the Collection section (e.g. All, Editions, Zines, Books). Without one, the chips use the first list filter from the Search & Discovery app (e.g. Product type). Sorting uses Shopify's sort options.
- **Collection grid blocks** (Collection section): "Studio note" (coloured quote) and "Media" (image or video, 1–3 columns, optional label and link) tiles appear after the product you choose; a wide tile that doesn't fit the current row moves to the next so the grid stays gap-free. "Product layout" picks a product and sets its width (1–3 columns) and an optional replacement image or video for its card.
- **Cart drawer:** Theme settings > Cart chooses the drawer or the cart page. The drawer's add-ons come from a collection set on the Cart drawer section (Theme editor > any page > Cart drawer). The free-shipping bar uses the threshold in Theme settings > Cart.
- **Size & shipping guide:** content lives on the Product section (sizes, shipping zones, returns text). Keep the shipping zones in sync with Settings > Shipping.

### Print service and FAQ pages

What each page contains (create them as in [Pages and templates](#pages-and-templates)):

| Page (handle) | Template | Contents |
|---|---|---|
| Print guide (`print-guide`) | `page.print` | Header with tabs, statement, ink picker, file checklist, spec cards, CTA band, overprint simulator (off by default, as in the design), "How it is made" steps |
| Price guide (`price-guide`) | `page.prices` | Header with tabs, price calculator and rate card |
| FAQ (`faq`) | `page.faq` | Header, category chips, questions, "Still stuck?" card, FAQPage structured data |

- **Inks:** the ink picker and overprint simulator ship with standard risograph ink colours as placeholders. Replace them with Jumbo's real ink colours (each ink is a block with a colour setting).
- **Price calculator:** estimate = run × rate per sheet per colour × colours + setup fee × colours. The rates, setup fee, run range and sizes are section settings in the store's currency. **The defaults are the design's placeholder rates** and the note under the rate card says so until you change it. "Request this quote" links to `/pages/contact` by default and adds the chosen size, colours and run to the URL.
- **FAQ:** one block per question. Questions with the same category share a filter chip. The contact card uses the store's email unless one is set.

### Artists, journal, policies and about

| Page (handle) | Template | Contents |
|---|---|---|
| Artists (`artists`) | `page.artists` | Every `artist` metaobject, kind chips, hover/focus preview card |
| Policies (`policies`) | `page.policies` | Page header and vertical tabs over Settings > Policies. Link to one policy with its handle, e.g. `/pages/policies#refund-policy` |
| About (`about`) | `page.about` | Intro (full-page colour option), image and text blocks, numbers band, visit hours, contact |

- **Artist pages** use `templates/metaobject/artist.json` once web pages are on for the definition.
- **Journal:** the blog page shows tag chips and article cards. The kind pill on a card is the article's first tag (falls back to the blog title), and reading time is estimated from the word count. Article pages have a reading-progress bar, copy-link button, pull quotes (style a quote as a blockquote in the editor) and "Read next".
- **About figures** ("2 / 14 / 40", "Est. 2019"), hours and studio text are placeholders. Replace them in the theme editor.
- Shopify's own policy pages (`/policies/…`) are styled by the theme too.

### Newsletter popup

The popup lives in the **Overlays** group (Theme editor > any page > Overlays > Newsletter popup). Select the section to preview it; it never opens on its own in the editor.

- Opens once per visitor after the delay (3s by default). Closing or subscribing stores that in the browser, so it doesn't come back. The footer "Newsletter" link opens it any time.
- Signs people up with Shopify's customer form, tagged `newsletter` (Customers > filter by tag or email subscription). The form posts as a normal page load so Shopify's spam protection runs; the popup then re-opens with the success or error message.
- Turning "Enable popup" off removes it everywhere. Also clear the footer's "Newsletter link label" so the link disappears.

### Product page on mobile

"Sticky add-to-cart bar on mobile" (Product section, on by default) shows the product, selected variant, price and Add to cart at the bottom of the screen while the buy buttons are scrolled out of view. It submits the main product form, so it follows the selected variant and quantity.

### Homepage content

Every homepage section is editable in the theme editor. All text, images and videos are placeholders to replace:

- **Hero:** Shopify-hosted video (Content > Files) or an image, side image and label, optional review quotes.
- **Product carousel:** pick a collection (defaults to the `editions` handle). The end card's note and button are editable.
- **Studio note:** hidden until a real quote is added.
- **Video grid** and **Shop the look:** included but switched off, as in the design. Enable them in the theme editor.
- **Ink marquee:** a scrolling row of ink colours; one block per ink (name, colour, optional code). Size, speed and direction are section settings. It pauses on hover, keyboard focus and with its pause button, and stays still for visitors who prefer reduced motion.
- **Packs:** pick bundle products (e.g. made with Shopify Bundles). Set a compare-at price to show the saving.
- **Events:** one block per event, with start/end as `YYYY-MM-DD HH:MM`. Past events hide automatically. "Remind me" downloads an `.ics` calendar file with the event's title, time and place, which opens in Apple Calendar, Google Calendar or Outlook; the button then reads "Reminder set ✓". No email or account is involved.
- **Stories:** upload portrait images or videos per story. The follow button uses the Instagram link from Theme settings.

## Working on the theme after launch

- **Theme editor changes live in the store.** Before editing a JSON template or section group in git, pull the store's copy first so you don't overwrite the merchant's work: `shopify theme pull --theme <id> --only 'templates/*.json' --only 'sections/*.json'`, then commit it.
- **Branches and pull requests:** branch from `main` (`feature/`, `fix/`, `chore/`), run `shopify theme check` (zero offenses) and open a pull request. Preview with `shopify theme dev` or an unpublished push, never on the live theme.
- **Releases:** update `CHANGELOG.md`, bump `theme_version` in `config/settings_schema.json`, and tag `main` (`v1.0.0`).
- **Adding a section:** start with a `{% comment %}` block, give the schema a `name`, `class` and `presets`, use tokens from `snippets/css-variables.liquid`, put customer-facing strings in `locales/en.default.json`, and add any custom element to the `display: block` list in `assets/base.css`.
- **JS modules** import shared helpers from `@theme/global`. Listen for theme-editor events on the component itself, or remove `document` listeners in `disconnectedCallback`, so editor re-renders don't stack listeners.

## Structure

```
assets/      base.css, global.js (overlays, cart API, helpers), feature modules, fonts
config/      settings_schema.json
layout/      theme.liquid, password.liquid
locales/     en.default.json (customer-facing strings)
sections/    header-group.json, footer-group.json, overlay-group.json, sections
snippets/    tokens (css-variables), fonts, meta-tags, image, shared components
templates/   JSON templates (+ gift_card.liquid)
docs/        project documentation (not deployed)
design_handoff_shopify_liquid/   design reference (not deployed)
```

Shared JS: feature modules import from `@theme/global` (an import map in `snippets/theme-scripts.liquid`), so every module shares one instance of the cart client and overlay helpers. Components talk through `CustomEvent`s on `document`: `cart:updated` and `cart:refresh` for the cart, `jumbo:*` for everything else.

## Accessibility notes

- **Touch targets:** on touch screens, chips, buttons, mono links, breadcrumbs and similar small controls get an invisible 44px hit area (`.tap-target` and the primitives in `base.css`) without changing their size. Footer link rows keep the design's spacing and meet the WCAG 2.2 AA 24px minimum.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, every animation and transition is switched off, the hero video starts paused, and quote and story carousels don't auto-advance. The announcement bar still rotates (without the fade); it pauses on hover and focus and can be closed.
- **Colour contrast:** the brand red (2.98:1) and blue (2.32:1) are below 4.5:1 as text on the page background. Stock status and form errors therefore use ink text with a coloured ● marker; muted labels use `--opacity-muted` (5.25:1); collection notes use ink text on blue and red; the announcement bar defaults to ink text (its Text colour setting offers white). The design still uses blue for large accents (heading counts such as "Artists. (4)", the full stop) and for link hover. These are decorative or large, but blue is also below the 3:1 large-text minimum. Darkening the blue would fix it, at the cost of changing the brand colour.

## Known limitations

- The design's photography, logo and hero video weren't supplied. Empty image slots show Shopify placeholder illustrations.
- The prototype's copy is used as editable defaults. Prices, shipping thresholds, events and policies are placeholders to replace.
- The free-shipping bar is hidden when a customer shops in a currency other than the store's, because Liquid has no exchange rate to convert the threshold.
- The product reviews area shows the average from the `reviews.*` metafields plus the Shop app's block. The design's per-star distribution bars need data the theme can't read, so they aren't built.
- Collection filtering and sorting reload the page, using Shopify's URL parameters. This is deliberate: it works without JS.
- Without JS, desktop mega menus don't open. Their top-level links still work, and the footer carries the same links.

## Credits

Based on Shopify's Skeleton theme (© Shopify Inc., used under its licence for themes that integrate with Shopify). Outfit and DM Mono are licensed under the SIL Open Font License 1.1.
