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
| 4 | Collection, product, cart (drawer + page), content pages | Next. Collection, product, cart, blog and article currently use working baseline sections |
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

The theme reads these product metafields when present. All are optional; create them in Settings > Custom data > Products.

| Namespace.key | Type | Used for |
|---|---|---|
| `custom.card_meta` | Single line text | Caption under product cards, e.g. "edition of 120 · 3 colours" |
| `custom.card_tag` | Single line text | Tag pill on product cards in the collection grid (Phase 4) |
| `reviews.rating` | Rating (set by the reviews app) | Stars on product cards |

Further definitions planned for Phase 4 are listed in `docs/phase-1-audit.md` §3.

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
- Without JS, desktop mega menus don't open. Their top-level links still work, and the footer carries the same links.

## Credits

Based on Shopify's Skeleton theme (© Shopify Inc., used under its licence for themes that integrate with Shopify). Outfit and DM Mono are licensed under the SIL Open Font License 1.1.
