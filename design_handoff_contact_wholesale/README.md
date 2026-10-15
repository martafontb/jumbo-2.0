# Handoff: Contact and Wholesale pages (Shopify Liquid)

## Overview
Two new pages for the Jumbo Press Shopify theme, shown as two tabs of one section group: **Contact** and **Wholesale**. A new **Contact** link is added to the header nav, to the right of `Print ▾`. This extends the existing theme handoff in `design_handoff_shopify_liquid/`; follow its tokens, global components and rules.

## About the Design Files
`reference/Jumbo Press v67.dc.html` is a **design reference built in HTML**: a prototype showing intended look and behaviour, not production code. Recreate it in the theme (Online Store 2.0, Liquid, vanilla JS) using the theme's existing CSS variables and class conventions. Do not copy inline styles wholesale. Open the file in a browser, click `Contact` in the header (prototype state `page: 'contact'` / `'wholesale'`).

Only the new `isContact` and `isWholesale` blocks and the `ws` header nav item are new in v67. Everything else is unchanged from v66.

## Fidelity
**High fidelity** for desktop. No mobile mock exists for these pages: collapse to one column below 750px following the patterns in `Jumbo Press Mobile.dc.html` (3-col grids become 1 col, rows stack, 4-card grid becomes 1 col).

## Shopify mapping
| Page | Template | URL |
|---|---|---|
| Contact | `templates/page.contact.json` | `/pages/contact` |
| Wholesale | `templates/page.wholesale.json` | `/pages/wholesale` |

Both pages share a tab strip. Build it as a snippet `snippets/contact-tabs.liquid` taking `active: 'contact' | 'wholesale'`. Tabs are plain links (not buttons): `routes.root_url | append: 'pages/contact'` etc., or via a link-list menu `contact-tabs`. Header: add `Contact` to `main-menu`, same animated label treatment as `Print ▾` (see README of the main handoff: `navIn`, 1.3em clip, label slide on hover), stagger `.15s`.

## Shared elements
- Page: `main` with `padding:4px 20px 20px`, 3-col grid `repeat(3,minmax(0,1fr))`, gap `4px` (Contact uses `4px 12px`), `animation: fade .4s`.
- H1: Outfit 500, `clamp(56px,12vw,200px)/.85`, `letter-spacing:-.05em`, text followed by a `--blue` (`#22A8E1`) full stop.
- Tab strip: spans 3 cols; `border-top` and `border-bottom` `1px solid --ink`, padding `10px 0`, flex gap 6px. Tab = pill, `padding:6px 14px`, `1px solid --ink`, DM Mono 12px uppercase `.04em`; active = `--ink` fill, white text; inactive transparent.
- Section divider: span 3, `margin-top:104px` (80px on Wholesale first divider), `border-top:1px solid --ink`, `padding-top:8px`, flex space-between: pill label left (DM Mono 11px uppercase, `padding:2px 12px`, radius 999) and optional mono caption right.
- Tokens: `--bg #F0EDEC`, `--ink #231F20`, `--blue #22A8E1`, `--red #EA5A46`, `--grey #C8C9D0`.
- Info row (used on both pages): top border `1px solid --ink`, padding `16px 0 28px`, 2-col grid gap 12px. Left: coloured pill label (DM Mono 11px) above an h2 at `clamp(32px,4.2vw,64px)/.95` Outfit 500 `-.04em`. Right: optional paragraph (Outfit 15px/1.4, max-width 44ch) then an action. Email action: DM Mono 13px uppercase `.04em`, underlined, `--ink`, hover `--red`. A final empty element with a top border closes the list.

## Screen 1: Contact
Layout, top to bottom:
1. H1 "Contact."
2. Tab strip (Contact active).
3. Grid row: left col = image 3/4, radius 20, `--blue` fallback ground (image_picker, alt text from setting); cols 2–3 = stack of info rows, `margin-top:12px`.

Rows (pill colour, pill text, h2, body, action):
1. grey, "General", "General enquiries", email
2. red, "Print", "Print quotes", "Send your artwork and run size. We reply with a price within 2 days.", email
3. blue, "Shop", "Online orders", email
4. grey, "Wholesale", "Stock Jumbo", "If you are a retailer interested in stocking our products, see how it works.", underlined mono link "Wholesale →" to the Wholesale page

All emails currently `hey@jumbo-press.com` (`mailto:`), the only address in the copy reference. Make the email per row a schema setting, defaulting to `shop.email`. Rows are blocks (`type: contact_row`) with settings: pill text, pill colour (select blue/red/grey), heading, body (textarea), email, link URL + label.

## Screen 2: Wholesale
Copy is taken verbatim from https://www.jumbo-press.com/pages/wholesale. Keep it editable via schema, do not hardcode.
1. Title block: 3-col grid, `padding:28px 0 14px`, align end. H1 "Jumbo Wholesale." spans 2 cols; right col paragraph (max 34ch): "If that sounds like you, we'd love to hear from you."
2. Tab strip (Wholesale active).
3. Statement spans 2 cols, `padding-top:12px`: Outfit 500 `clamp(28px,3.4vw,52px)/1.04 -.04em`: "Our full collection of risograph editions, artist books, prints and objects is available to stock wholesale." Right col, aligned to bottom: solid `--ink` button "Email us →" (mailto), padding 16px, centred, mono 12px uppercase, hover bg `--red`, text `--ink`.
4. Intro paragraph spans 2 cols, `margin-top:24px`, max 60ch, Outfit 19px/1.5: "We work with independent bookshops, design stores, galleries and concept stores who share our belief that print is worth doing properly." Right col: image 3/4, radius 20, `--blue` ground, spans two grid rows.
5. Divider: red pill "Why stock Jumbo?", caption "Four reasons". Then a 4-col card grid (gap 4px, `margin-top:8px`). Card: radius 20, padding 16, `min-height:340px`, flex column space-between. Top: `--bg` pill "01"–"04". Bottom: h3 Outfit 500 `clamp(24px,2.4vw,38px)/1 -.04em` and 15px/1.4 body. Ground colours: blue, grey, red, grey.
   - 01 **Printed in-house**: "Every edition is printed on our risograph in Barcelona using soy-based inks and sustainably sourced paper. Your customers are getting something genuinely handmade."
   - 02 **Artist-led, every time**: "Every product is made in collaboration with a credited artist. We work with emerging and established illustrators and artists from around the world, so your range stays varied and always worth looking at."
   - 03 **Small runs, high desirability**: "We produce limited editions on purpose. Low stock levels mean your customers know they're getting something worth owning before it's gone."
   - 04 **One supplier, many styles**: "From artist books and zines to apparel and objects, you can carry a varied range of aesthetics and formats, all from one place."
6. CTA block: span 3, `margin-top:104px`, `--blue` ground, radius 20, padding `clamp(20px,3vw,48px)`, 3-col grid. Left 2 cols: `--bg` pill "How to stock Jumbo" and h2 "Email us about your store." at `clamp(40px,6vw,96px)/.9 -.05em`. Right col, bottom aligned: body "You can order directly by emailing us at hey@jumbo-press.com with a few details about your store, your social profiles and what draws you to Jumbo." and an `--ink` button with the email address and "→".

Cards are blocks (`type: reason`: number, heading, body, colour). Max 4 for the grid; ignore extras or allow `repeat(auto-fit,minmax(...))`.

## Interactions & behaviour
- Tabs are links; active tab has `aria-current="page"`.
- Buttons and email links: hover background/colour transitions are instant in the prototype, add `transition:.15s`. Focus-visible outline 2px `--ink`, offset 2px.
- Page fade-in animation `fade` `.4s`; disabled under `prefers-reduced-motion`.
- No forms and no state. Wholesale is by email only (matches reference copy). If a form is wanted later, use Shopify's `{% form 'contact' %}`.

## Assets
Three image slots, none supplied yet: Contact portrait (`ct-1`), Wholesale intro portrait (`ws-1`). Expose as `image_picker` settings with `image_url` srcset, explicit width/height, lazy loading. The prototype has one further slot `ct-2` removed in the final design; ignore.

## Files
- `reference/Jumbo Press v67.dc.html`: full prototype. Search for `isContact` and `isWholesale` for the page markup, and `ws: mk('ws'` for the nav item.
- `reference/support.js`, `reference/image-slot.js`: runtime for the prototype only.
- Parent handoff: `design_handoff_shopify_liquid/README.md` (tokens, header, footer, rules).
