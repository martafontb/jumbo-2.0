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
| 5 | Interactions and polish | Planned |
| 6–7 | Validation and handover | Planned |

## Development

Requires [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) (current stable, 4.x).

```bash
shopify theme dev --store jakelucas.myshopify.com    # local preview against the dev store
shopify theme check                                  # lint (must be clean before committing)
shopify theme push --unpublished --store jakelucas.myshopify.com   # upload as a new unpublished theme
```

Never push to the live theme without approval. `config/settings_data.json` is gitignored and listed in `.shopifyignore`, so the store's live customisations are never overwritten from git.

## Store setup checklist

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

### Reviews (Shop app)

Reviews come from the Shop app. The theme never invents review content:

- **Star ratings** on product cards read the standard `reviews.rating` product metafield and render only when it's populated. Product pages (Phase 4) also accept the Shop app's app blocks.
- **Reviews strip** (homepage): add the Shop app's block, and/or fill in the average rating, review count and "Review quote" blocks with real reviews. It stays hidden until something is filled in.
- **Hero review card:** "Review quote" blocks on the Hero section. Empty by default; the card is hidden until you add one.

### Metafields and metaobjects

All optional. Create product metafields in Settings > Custom data > Products, and the `artist` metaobject in Settings > Custom data > Metaobjects.

**Product metafields**

| Namespace.key | Type | Used for |
|---|---|---|
| `custom.card_meta` | Single line text | Caption under product cards, add-on blurbs |
| `custom.card_tag` | Single line text | Tag pill on collection cards and "Complete the set" cards |
| `custom.card_span` | Integer (1 or 2) | Card width in the collection grid |
| `custom.card_ground` | Single line text (blue, red, grey, ink, bg) | Card background colour override |
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
- **Studio notes** in the collection grid are blocks on the Collection section ("Show after product" sets the position).
- **Cart drawer:** Theme settings > Cart chooses the drawer or the cart page. The drawer's add-ons come from a collection set on the Cart drawer section (Theme editor > any page > Cart drawer). The free-shipping bar uses the threshold in Theme settings > Cart.
- **Size & shipping guide:** content lives on the Product section (sizes, shipping zones, returns text). Keep the shipping zones in sync with Settings > Shipping.

### Print service and FAQ pages

Create these pages in Online Store > Pages and pick the matching template:

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

### Homepage content

Every homepage section is editable in the theme editor. All text, images and videos are placeholders to replace:

- **Hero:** Shopify-hosted video (Content > Files) or an image, side image and label, optional review quotes.
- **Product carousel:** pick a collection (defaults to the `editions` handle). The end card's note and button are editable.
- **Studio note:** hidden until a real quote is added.
- **Video grid** and **Shop the look:** included but switched off, as in the design. Enable them in the theme editor.
- **Packs:** pick bundle products (e.g. made with Shopify Bundles). Set a compare-at price to show the saving.
- **Events:** one block per event, with start/end as `YYYY-MM-DD HH:MM`. Past events hide automatically. "Remind me" downloads a calendar file.
- **Stories:** upload portrait images or videos per story. The follow button uses the Instagram link from Theme settings.

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

## Known limitations

- The design's photography, logo and hero video weren't supplied. Empty image slots show Shopify placeholder illustrations.
- The prototype's copy is used as editable defaults. Prices, shipping thresholds, events and policies are placeholders to replace.
- The free-shipping bar is hidden when a customer shops in a currency other than the store's, because Liquid has no exchange rate to convert the threshold.
- The product reviews area shows the average from the `reviews.*` metafields plus the Shop app's block. The design's per-star distribution bars need data the theme can't read, so they aren't built.
- Collection filtering and sorting reload the page, using Shopify's URL parameters. This is deliberate: it works without JS.
- Without JS, desktop mega menus don't open. Their top-level links still work, and the footer carries the same links.

## Credits

Based on Shopify's Skeleton theme (© Shopify Inc., used under its licence for themes that integrate with Shopify). Outfit and DM Mono are licensed under the SIL Open Font License 1.1.
