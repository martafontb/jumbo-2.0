# Handoff: Jumbo Press storefront → Shopify Liquid theme

## Overview
Jumbo Press is a risograph studio and publisher selling limited editions, zines, books and merch, and offering a small-run print service. The design covers the home page, shop (PLP), two product page types, merch, cart (drawer and full page), artists, journal articles, print service pages, FAQ, policies, and about. Target: a Shopify Online Store 2.0 theme (Liquid, JSON templates, sections and blocks), built from scratch or on Dawn.

## About the Design Files
`reference/Jumbo Press v66.dc.html` (desktop) and `reference/Jumbo Press Mobile.dc.html` (mobile) are **design references built in HTML**. It is a prototype showing intended look and behaviour, not production code. Recreate it in Liquid, CSS and vanilla JS using Shopify conventions. Do not ship the HTML. The prototype uses inline styles and a JS state machine (`state.page`) to fake routing; in the theme each "page" becomes a template, and each state-driven widget becomes a section or snippet with real Shopify data.

Open the file in a browser to see every page. Navigate with the header and footer links. Props on the root component toggle homepage sections.

## Fidelity
**High fidelity.** Colours, type, spacing, radii and interactions are final for desktop and mobile. Recreate pixel-accurately. Text content is placeholder where marked (prices, policies, FAQ, artists, reviews). Replace with Shopify data or theme settings.

## Suggested Claude Code workflow
1. Read this README and `reference/Jumbo Press v66.dc.html`. Propose a section-by-section plan before writing code.
2. Build in slices: tokens and layout, header/footer/announcement, home, collection, product, cart, then remaining pages.
3. After each slice, run `shopify theme check`, preview with `shopify theme dev`, and compare against the reference.
4. Rules to follow: Online Store 2.0, no build step, vanilla JS, no jQuery, `image_url` with `srcset` for every image, schema settings for all editable copy and images.

## Design Tokens

### Colours
| Token | Hex | Use |
|---|---|---|
| `--bg` | `#F0EDEC` | page background, cards, panels |
| `--ink` | `#231F20` | text, borders, primary buttons |
| `--blue` | `#22A8E1` | accent, tags, highlights, full stops in headings |
| `--red` | `#EA5A46` | accent, button hover, announcement bar, tags |
| `--grey` | `#C8C9D0` | pills, placeholders, secondary tags |
| `--white` | `#FFFFFF` | text on ink, nav (difference blend) |
| overlay | `rgba(17,17,17,.55)` | drawer/modal scrims (`.85` for stories) |

Text on `--bg`, `--blue`, `--red`, `--grey` is `--ink`. Text on `--ink` is white. Product-card grounds cycle through blue, red, grey and ink. Merch colourways: Cream `#F0EDEC`, Yellow `#C8C9D0`, Blue `#22A8E1`, Red `#EA5A46`, Black `#231F20`. Several swatches in the prototype share a hex because of a palette consolidation; use real ink colours from Jumbo's ink list (Red, Yellow, Green, Blue, Aqua, Purple, Fluo-Green) as metafield or metaobject values.

### Typography
- Display and body: **Outfit** (400, 500, 700, 800).
- Labels, prices, buttons, metadata: **DM Mono** 400, uppercase, `letter-spacing:.04em`, mostly 11–12px.
- Body 15px / 1.35 Outfit. Long-form article 19px / 1.6, max 60ch.
- Headline scale (all Outfit 500, tight tracking):
  - Page title: `clamp(56px,12vw,200px)/.85`, `-.05em`
  - Product title: `clamp(56px,6vw,96px)/.9`, `-.045em`, accent word in italic blue
  - Section statement: `clamp(28px,3.4vw,56px)/1.02`, `-.04em`, weight 400
  - Card title: 26px/1.05 (large) or 20px/1.1 (small), weight 400
  - Cart/price numerals: 32–56px, 500
- Headings end with a coloured full stop (`<span style="color:var(--blue)">.</span>`) on index pages.
- Optional tweaks in the prototype (type treatment, headline font, label font, label case) are exploration only. Ship Outfit + DM Mono as defaults.

### Spacing, radii, borders
- Page padding: `4px 20px 20px`. Main grid: 3 equal columns (`repeat(3,minmax(0,1fr))`), gap **4px**.
- Section divider: `1px solid var(--ink)` top border, then a pill label (left) and a mono caption (right). Typical gap above a section: 80px, up to 200px on PDP.
- Radii: cards and images 20px, small cards and inputs 8px, pills and buttons 999px, circles 50%.
- Pills: DM Mono 11px uppercase, padding `2px 12px`, background from palette.
- Primary button: pill, `padding:16px`, `background:var(--ink)`, white DM Mono 12px uppercase; hover `background:var(--red); color:var(--ink)`.
- Secondary button: pill, `1px solid var(--ink)`, transparent; hover `background:var(--grey)`.
- Selected option (size, filter, tab): `background:var(--ink); color:#fff`.
- Links: `--ink`, hover `--blue`.

### Motion
- Page and overlay fade-in: `fade` keyframes, opacity 0→1 and translateY 8px→0, 0.2–0.4s.
- Header items on load: `navIn` 0.9s `cubic-bezier(.16,1,.3,1)`, staggered 0.05–0.35s, translateY 100%→0 inside an overflow-hidden wrapper.
- Nav link hover: text rolls up. Two stacked copies inside a 1.3em-high overflow-hidden box, `translateY(-50%)`, 0.55s `cubic-bezier(.76,0,.24,1)`.
- Drawer, popup and search use the fade animation; no slide.

## Global components

### Announcement bar
Full width, `--red` background, DM Mono 12px uppercase, 36px min height, text centred in white, close `×` at right (3-col grid `48px 1fr 48px`). Rotates through 3 messages every 5s: "10% off your first order with code 'WELCOME'" (click copies code and shows "Code WELCOME copied ✓" for 2.5s), "Free UK shipping over £75", "Next fair: Small Press Fair, 7 Nov". Liquid: section with blocks, schema for each message; JS rotates.

### Header
Sticky, `z-index:10`, transparent with **`mix-blend-mode:difference`** and white text, so it inverts over any background. 3-column grid `1fr auto 1fr`, padding `18px 20px`, DM Mono 12px uppercase.
- Left: `Shop ▾`, `Print ▾` (hover opens mega menus).
- Centre: logo image (`uploads/jumbo-logo-cropped.png`, height 48px, `filter:invert(1)`).
- Right: `Search`, `Cart (n)`. Cart count updates live from the Cart API.
- On the PLP a solid `--bg` strip (88px) sits behind the header so filters can stick below it.

### Mega menus (Shop, Print)
Full-width panel under the header, `--bg`, bottom border ink, padding `4px 20px 20px`, 3-col grid, opens on hover with 180ms close delay.
- **Shop**: column 1 is a list of rows (Editions 24, Zines 18, Books 7, Artists 40, Merch 12, All shop 89). Each row: 14px colour dot, label at `clamp(32px,4.2vw,64px)` Outfit 500, count pill at right; hover shifts padding-left 12px and fills the row with its colour. Columns 2 and 3 are feature cards (image 4/3 radius 20 with pill, then title and price): Soft Machines £58 ("New edition"), Orbit Pamphlet £14 ("Zines"). Liquid: menu from `linklists`, counts from `collection.products_count`, feature cards as blocks picking a product.
- **Print**: same list (Print studio, Custom print, Inks & papers, Artwork guide), a grey "Specs" card (Process Risograph 1–3 inks; Max size A3 sheet; Stock Uncoated 100–300gsm; Min run 25 copies; Turnaround 5–7 working days) and a blue "Get a quote" card ("Send your artwork, get a price within 2 days.", button "Start a quote →").

### Search overlay
Full-width top sheet over a scrim. Large input `clamp(36px,6vw,104px)` Outfit 500, bottom border 2px ink, close button 40px circle. Below: "Try" pill plus suggestion chips (Zines, Editions, Books, Mara, Process), result count label ("Trending now" when empty, "n results" when typing), 3-col grid of results (96px square swatch/thumb, title 20px, kind pill and meta). Empty state: "Nothing for “query”. Try zines or editions." Esc closes. Liquid: use the Predictive Search API (`/search/suggest`) with products, articles and collections or pages for artists.

### Mini cart drawer
Right drawer, `min(420px,100vw)`, `--bg`, left border ink, header "Cart" 40px with count pill and a 36px close button. Lines: 76px thumb, title 22px, variant mono caption, quantity stepper (pill with − / n / +), Remove underline link, line total 22px. Empty: "Nothing here yet." Upsell block "Fancy a little extra?" with a blue pill showing "£n from free shipping" or "Free shipping unlocked", up to 2 add-on rows (56px thumb, title, blurb, `+ £price` button; products that would unlock free shipping show "Gets you free shipping"). Footer: shipping progress text, 6px progress bar (threshold **£75**), subtotal 44px, black "Checkout →" pill, "View full cart" link. Liquid: `sections/cart-drawer.liquid` rendered through the Section Rendering API; add-ons from a collection or `recommendations`; free-shipping threshold as a theme setting.

### Newsletter popup
Appears 3s after first load, once. Centred modal `min(860px, 100vw-32px)`, radius 24, 2-col: image (min-height 340, pill "Next drop: 24 Oct") and content (red pill "Studio letter", h2 "Get the next drop first." `clamp(40px,5vw,68px)`, body "New editions, zines and workshop dates, once a month. Subscribers see every run 24 hours early.", email input, "Subscribe →", "No thanks"). Success: "You're on the list." and "We'll write before the next drop. Nothing else." and "Keep browsing →". Liquid: `{% form 'customer' %}` with `contact[tags]=newsletter`; store dismissal in `localStorage`. Also opened from the footer "Newsletter" link.

### Size and shipping guide drawer (PDP)
Right drawer 480px with tabs Sizes / Shipping / Returns. Sizes: nested scale diagram (A2 100%, A3 71%, A4 50%, multiply blend) plus rows A2 420×594 mm, A3 297×420 mm, A4 210×297 mm. Shipping: UK 3–4 days £6, Europe 5–8 days £12, Worldwide 7–14 days £18, "Free UK shipping over £75." Returns: "14 days to change your mind." plus link to the Refunds policy. Liquid: snippet populated from a page or metaobject; link to `shop.refund_policy.url`.

### Footer
`margin-top:112px`, top border ink, padding `56px 20px 24px`. 4-col grid: statement ("**Jumbo Press** is a risograph studio and print shop." Outfit 500 `clamp(32px,4.4vw,72px)`, spans 2 columns, max 16ch); link columns with pill headings: Shop (Editions, Zines, Books, Merch), Info (About, Artists, Print guide, FAQs), Visit (Unit 4, Canal Yard; next workshop), Follow (Instagram, Newsletter). Bottom row: Shipping, Refunds, Privacy policy, Terms and conditions, "© 2026 Jumbo Press". Use `shop.policies` for legal links.

## Screens / Views and Shopify mapping

| Prototype page (`state.page`) | Shopify template | Notes |
|---|---|---|
| `home` | `templates/index.json` | sections below |
| `plp` | `templates/collection.json` | |
| `product` (framed option) and `product2` (artist) | `templates/product.json` | one template, variants for Unframed / Framed |
| `merch`, `merch2` | `templates/product.merch.json` | colour, size, ink options |
| `cart` | `templates/cart.json` | |
| done | order status / thank-you | Shopify checkout owns this; style via checkout branding only |
| `artists`, `artist` | `templates/page.artists.json`, `templates/metaobject/artist.json` | artists as a metaobject |
| `article` | `templates/article.json` | journal blog |
| `print`, `prices` | `templates/page.print.json`, `page.prices.json` | |
| `faq` | `templates/page.faq.json` | |
| `policies` | `templates/policy` via `shop.policies`, or a page | |
| `studio` | `templates/page.about.json` | |

### Home (`isHome`)
Sections, top to bottom. Each must be a section with a schema.
1. **Hero**: 3-col grid. Left 2 columns: 3/2 radius-20 block with looping muted autoplay video (`uploads/hero.mp4`) and a floating review card bottom-left (white-ish `--bg`, radius 16, 5 stars, quote 18px, name pill, product title); right 1 column: image with pill "Now printing". Review card cycles through reviews.
2. **Intro statement**: `max-width:30ch`, Outfit 400 `clamp(28px,3.4vw,56px)/1.02`, spans 2 columns: "Jumbo Press is a risograph studio and publisher. We print editions, zines and books with artists, one colour at a time, in small runs."
3. **Reviews strip** (toggle): big rating "4.8" `clamp(56px,7vw,112px)`, stars, "312 verified reviews", rotating quote with ← → buttons and "n / N" counter.
4. **Editions carousel**: horizontal scroll-snap row, 3 cards visible (`calc((100% - 8px)/3)`), drag-to-scroll with snap on release, cards 3/4 radius 20 with title 26px, price mono, meta line ("edition of 120 · 3 colours"). Final card: sold-out note ("Sold out · Bloom Fields Vol. 2 / Back in print: November") and "Shop all editions →" button.
5. **Studio note**: border top and bottom, label "Studio note 09.10.2026" left, quote right at `clamp(28px,3.4vw,52px)` with attribution mono.
6. **On the press** (toggle): section header, one 16/9 video poster spanning 2 columns and two stacked in column 3; click toggles play; 5px progress bar at bottom, title pill and 44px play/pause circle.
7. **Shop the studio** (toggle): 3/2 lifestyle image with 3 numbered hotspot dots (30px, ink border); click opens a 220px popover with title, price, "+ Add to cart". Right column "Get the look." list (`0n`, title, price) mirrors the hotspots. Liquid: hotspots as blocks with x/y range settings and a product picker.
8. **Packs**: header "Packs / Buy together, pay less". 3 cards (3/4 image, red pill "Save £n", title, struck-through original price and new price, blurb, "Add" button that adds the bundle). Liquid: bundles as products with compare-at price, or a bundle app.
9. **Events** (toggle): header "Find us", h2 "See you there." `clamp(40px,6vw,96px)`; feature row (image 1fr, card 2fr with date line, event name, 4-box live countdown Days/Hrs/Min/Sec, "Get directions →", "Remind me" toggle); filter chips All/Fairs/Workshops/Launches; list rows (big day number, month, title, location, kind pill, Remind me, Details →). Countdown target in the prototype is 7 Nov 2026 10:00. Liquid: events as metaobjects.
10. **Stories / Instagram** (toggle): 3-col grid of 3/5 tiles, bordered 2px, gradient overlay with name pill and "▶ Watch"; opens a 9:16 story viewer (progress bars, auto-advance 5s, tap left 35% = previous, right = next, caption, "Shop this →"). "Follow on Instagram →" button at right.

### Collection / PLP
- Title "Shop." `clamp(56px,12vw,200px)` with superscript product count "(n)"; right column intro "Editions, zines and books. Every run is small and numbered, and once it's gone it's gone."
- Sticky filter bar (`top:88px`, `--bg`, top and bottom border ink): chips All / Editions / Zines / Books (each with a colour dot), and a right-aligned sort toggle "Sort: Featured ↕" / "Price low–high".
- Grid: items span 1 or 2 columns and rows fill with no gaps (the prototype widens the last item to complete the row). Card: image (aspect ratio by span: 1→3/4, 2→3/2), top-left grey pill with border (tag: Limited, New, Zine, Book, Studio), title 26px, price mono, meta mono ("Mara Oyelaran · Ed. 120 · A2"). Studio-note tiles (coloured block with quote, white text) interleave with products.
- Liquid: `collection.products`, `collection.filters` (Storefront Filtering), `sort_by`. Card span, tag, meta from product metafields (`custom.card_span`, `custom.tag`, `custom.meta`). Interleaved notes as section blocks inserted at an index setting.

### Product page, artist variant (`product2`) and framed variant (`product`)
Layout: left 2 columns stacked 4/3 images (main, detail with grey label "DETAIL × 12", registration-mark shot); right column is `aside` with `position:sticky; top:64px`.
Right column, top to bottom: breadcrumb `Editions / Mara Oyelaran` (mono); h1 "Soft *Machines*" (italic blue second word); artist link (underlined mono); price 32px with red stock note "● 38 OF 120 REMAINING" and 6px blue progress bar (68% = remaining/edition size); spec list (Edition 120, signed and numbered; Inks Blue, green, black; Paper Munken Pure 150 gsm; Size A2 · 420 × 594 mm; Format Unframed, ships flat); size/frame toggle (Unframed £58, Framed oak £138); primary "Add to cart" ("Added ✓ — add another" for a moment); a "View cart (n) →" button after add; "Size & shipping guide →" link; description paragraph; "Other PDPs" links are prototype navigation only, drop them.
Below the fold:
- "Also from Mara Oyelaran & Jumbo Press": 3 square image cards.
- **Pairs well with / Complete the set.**: h2, 3 add-on cards (4/3 image, red pill tag, title, price, blurb, "+ Add to cart"); hides items already in cart and shows "Everything's in your cart. Nice set."
- **Reviews**: left: large "4.8" `clamp(80px,12vw,200px)`, stars, five distribution bars, "Write a review"; right: list rows (150px meta column with name, "Verified buyer" pill, date; content with stars, title 28px, body 15px), "Show all reviews" toggle. Wire to Shopify Product Reviews, Judge.me or similar.
- The artist variant adds "The artist" block: 3/4 portrait, h2 name, bio, spec list (Practice, Based in, Editions, Elsewhere) and "See all 6 editions →".
- Liquid: `sections/main-product.liquid` + snippets `product-gallery`, `product-info`, `product-upsells`, `product-reviews`, `artist-block`. Edition size and remaining stock from metafields (`custom.edition_size`) and `variant.inventory_quantity`. Artist from a `custom.artist` metaobject reference. Complete-the-set from `custom.pairs_with` product list metafield.

### Merch PDP (`merch2`, `merch`)
Left: 4/3 main image on a ground colour (`mix-blend-mode:multiply` tint overlay at 55% for the cushion), two 1/1 details. Right sticky column: breadcrumb, item switcher chips (Tee / Hoodie / Tote), title, price + "● IN STOCK" (blue), colour swatches 48px radius 8 (selected = 2px ink outline offset 2px), size pills, a collapsible size chart (table in a radius-8 bordered box with the selected size row inverted), quantity stepper (48px buttons) beside "Add to cart · £total", spec list, handmade-variance note ("Each piece is printed by hand, so ink density and registration vary slightly. Ships in 3 working days.").
- Cushion variant also has a "Print ink" selector (Red, Blue, Green, Black) and sizes 40 × 40 cm £34 / 50 × 50 cm £42. Model ink and colourway as variant options or line item properties.
- Sizes: Tee XS–XXL £28; Hoodie S–XL £58; Tote one size £18. Size-chart data (Chest, Length, Sleeve cm) as a metaobject or page.

### Cart page
h1 "Cart. (n)" with blue italic count. Left 2 columns: lines (140px square image, title 32px, variant pill in blue, stepper 34px buttons, Remove link, line total 32px, "£n each"); "← Keep shopping". Right: sticky summary card on **ink** background, white text: red pill "Order summary", shipping progress (8px bar, blue fill), Subtotal and Shipping rows, Total 56px, grey "Checkout →" pill, note "Ships flat in board envelopes. Tracked delivery." Empty state: grey 2/1 block with "Nothing here yet. Fresh prints are waiting." and "Shop editions →". Shipping logic in prototype: free over £75, otherwise £6 (UK). Replace with Shopify shipping rates and show an estimate or "Calculated at checkout".

### Artists index and artist page
- Index: h1 "Artists. (n)"; filter chips All / Illustrators / Photographers / Collectives; left 2 columns list of names at `clamp(40px,6.4vw,104px)` with kind pill and "n eds". Hovering a row fills it with the artist's colour and shifts padding; a sticky right column shows that artist's 3/4 image with name and "Since YYYY".
- Artist page: breadcrumb, h1 name `clamp(56px,11vw,180px)`, 3/2 image with kind pill, bio, details list (With us since, Editions, Prints with: ink dots), "Visit website ↗"; "Editions" with ink filter chips and 3/4 work cards (ink pill, title, price, meta); "In their words" grey block with large quote; "Next: {artist} →" full-width row.
- Liquid: `artist` metaobject (name, kind, since, bio, colour, image, website, quote, inks) and product metafield referencing it. Filter by kind via a metaobject list page.

### Journal article
Fixed 4px reading-progress bar (grey) at top. Breadcrumb, h1 `clamp(44px,8.4vw,140px)/.88` balanced, meta bar (kind pill, "n read", date, "Words: Jumbo Press", "Copy link" button that shows "Link copied ✓"), 21/9 hero, left sticky "Featured in this story" product card with "+ Add to cart", right column: dek 38px, paragraphs 19px/1.6 max 60ch, grey pull quote block (radius 20, `clamp(30px,3.6vw,56px)`), two 4/5 inline images; "Read next" row of 3 cards. Liquid: `article.liquid`; featured product from an article metafield; reading minutes computed from `article.content | strip_html | split: ' ' | size | divided_by: 200`.

### Print service pages
- **Print guide** (`print`) and **Price guide** (`prices`) share a title block and tab pills (Print guide / Price guide, selected = ink fill).
- Print guide: statement "Two drums, up to three colours, runs up to 300. We turn files around in about a week." plus "Request a quote →"; **Inks**: large colour field (3/2) named for the picked ink with swatch circles (7 inks: Jumbo Red, Yellow, Green, Blue, Aqua, Purple, Fluo-Green with notes); **Prepare your file**: 4 tick-off steps (Set your size, Split into layers, Export at 300 dpi, Send it over) that fill blue when ticked; an **overprint simulator** (two inks multiplied, misregistration slider 0–12 changes the offset, label "Offset n mm"; pure SVG, can stay as inline SVG or be rebuilt as an interactive snippet); **How it is made** with 4 steps (Mark, Master, Print, Edition) shown as stacked buttons with an illustration and text panel.
- Price guide: size pills (A5/A4/A3), colour pills (1–3), run slider 10–300 step 10, estimate card on ink (large total, "£x each · excl. shipping"), rate card table. Prototype formula: `total = qty × unit[size] × colours + 15 × colours`, with unit A5 0.4, A4 0.7, A3 1.2. **Placeholder rates; replace with real pricing.** "Request this quote →" goes to the quote form.
- Quote form: not designed beyond the About page link. Needs a form (`{% form 'contact' %}`) with file upload via an app or a link field, size, colours, run.
- Liquid: static copy in sections with schema; calculators in vanilla JS inside the section.

### FAQ
Title block, category chips (All, Orders, Shipping, Prints, Printing with us), accordion (question `clamp(24px,2.6vw,40px)`, 36px square +/− toggle, coloured by index), right grey "Still stuck?" card with email link. First item open by default. Liquid: FAQ items as blocks (category, question, answer rich text). Add `FAQPage` JSON-LD.

### Policies
Left list of 4 policy tabs (Shipping, Refunds, Privacy, Terms; selected row gets grey fill and 14px indent), right content with "Last updated" pill, h2 and paragraphs. Content in the prototype is placeholder and must be replaced. Liquid: use `shop.shipping_policy`, `refund_policy`, `privacy_policy`, `terms_of_service`.

### About (`studio`)
Page background is **red `#EA5A46`** on this page only (the main area; header/footer unchanged). h1 "About", 16/9 studio photo, intro line, numbered sections (01 Our story, 02 Visit the studio with opening hours, 03 Work with us), blue "By the numbers" block (2 Machines, 14 Ink colours, 40 Artists a year). Opening hours: Monday closed; Tuesday to Saturday 10.00–18.00; Sunday 11.00–16.00. Contact email in prototype is `hello@jumbopress.example`.

## Interactions & Behaviour (summary)
- Hover mega menus (180ms close delay); keyboard and touch need a click/tap fallback and focus management that the prototype lacks.
- All overlays (cart, guide, search, popup, story) close on scrim click and ×; search closes on Esc. Add focus trapping and `aria-modal`.
- Add to cart opens the mini cart. Use `/cart/add.js` then re-render the cart drawer and header count with the Section Rendering API.
- Variant buttons update price, availability and the add-to-cart label; the "Added ✓" state resets on the next change.
- Filters, sort and list toggles in the prototype are client state; in Shopify use Storefront Filtering URL params with section rendering where possible.
- Countdown ticks every second client-side. Reminder buttons are local toggles in the prototype; wire to a calendar link (.ics) or a notification app.
- Reading progress and carousel dragging are vanilla JS.
- Responsive behaviour: desktop is `Jumbo Press v66.dc.html`; mobile is `Jumbo Press Mobile.dc.html` (same pages and data, 1-column layout). See "Mobile" below.

## Mobile
Reference: `reference/Jumbo Press Mobile.dc.html`. It has the same pages, copy and state logic as the desktop file with a mobile layout. View it in a ~390px-wide browser window (devtools device mode) to see the intended result. Build desktop and mobile in the same Liquid files with responsive CSS; use one breakpoint at **750px** (mobile below, desktop above) and add a tablet step at 990px only where the desktop 3-column grid is too tight. Colours, type and component styling are unchanged; only layout differs.

Differences from desktop:
- **Page padding** 16px (desktop 20px); grid gap stays 4px. Main grid is 1 column; the collection grid is 2 columns. Footer top margin 64px (desktop 112px); section spacing 56px (desktop 80px).
- **Header**: 56px high, still sticky with `mix-blend-mode:difference`. Three slots: `Menu`/`Close` text button (left, 44px min target), logo (36px high, centre), `Cart (n)` (right, 44px min target). Cart opens the mini cart drawer. Search is reached from the menu overlay or the search link; check the file for placement.
- **Menu**: full-screen overlay (`position:fixed; inset:0`, `--bg`) replaces the hover mega menus. Two groups with pill headings: **Shop** (rows at 40px Outfit 500 with colour dot and count pill: Editions, Zines, Books, Artists, Merch, All shop) and **Info** (rows at 28px with → : About, Artists, Print guide, FAQs etc.). Top padding is 108px with the announcement bar open, 72px when closed. Opening the menu scrolls to top. The Print mega menu content (specs card, quote card) is dropped on mobile.
- **PLP**: 2-column product grid; studio-note tiles span both columns; every product card is 3/4 (the desktop span logic is removed). Filter bar sticky at `top:56px` (strip behind header is 56px).
- **Home carousels**: editions carousel shows ~1.7 cards (`calc((100% - 4px)/1.7)`) with scroll-snap and the same drag handler; stories row is a horizontal scroll-snap strip showing ~2.4 tiles, bleeding off the right edge (`margin-right:-16px`).
- **PDP, merch, artist, cart, article**: all two-column desktop layouts stack to a single column; the sticky info column is not sticky. Cart summary is a normal block below the lines.
- **Drawers** (guide, cart): `min(480px,100vw)` / `min(420px,100vw)` so they fill the screen on phones. Close buttons are 44px.
- **Touch targets** are at least 44px in the header and drawers. Check remaining controls (filter chips are 6px/12px padding in the file and may need 44px hit areas in the theme).
- Hover-only behaviours (artist preview on hover, nav text roll, hotspot dots) need tap equivalents. The artist index should navigate directly on tap.

Known gaps in the mobile reference to resolve while building: some `clamp()` sizes still use `vw` units tuned for desktop (they resolve to their minimum on phones, which is intended); search overlay padding and input size are unchanged from desktop; no mobile treatment is shown for sticky add-to-cart on the PDP. Suggest a sticky bottom bar with price and "Add to cart" on product pages.

## State Management
Prototype state worth mapping to real data: `cart` (use Shopify cart), `filter`/`sort` (collection URL params), selected variant (`product` form), `popSeen` and `annOpen` (localStorage), `remind` (localStorage), review/hero carousel index (section JS), story index (JS), menu open state (JS). Everything else is derived UI state.

## Content and data modelling suggestions
- **Product metafields**: `custom.artist` (metaobject), `custom.edition_size`, `custom.inks` (list), `custom.paper`, `custom.dimensions`, `custom.tag`, `custom.meta` (card caption), `custom.pairs_with` (product list), `custom.card_span` (1 or 2).
- **Metaobjects**: `artist`, `event`, `ink`, `faq`, `review` (if not using an app).
- **Collections**: Editions, Zines, Books, Merch, Packs, Add-ons.
- **Theme settings**: free-shipping threshold (£75), announcement messages, popup delay, social links, colour tokens.
- **Menus**: main-menu (Shop, Print), footer menus.

## Assets
Image files referenced in the prototype live in the project's `uploads/` folder (not bundled here): `STATIONARYSET1.jpg`, `JumboPress_Friendsinmanyplaces.jpg`, `DSC04769.jpeg`, `JumboPress_books.jpg`, `ONEDUCK1.jpg`, `DSC04953.jpg`, `BADGE1–3.jpg`, `WASHITAPE4.jpg`, `CUSHION2.jpg`, `JumboPress_38.jpg`, hero stills `DSC04906.jpg`, `DSC04719.jpg`, `2.JPG`, Instagram stills `000371--010--VK.JPG`, `000369--022--VK.JPG`, `000369--008--VK.JPG`, `000017-4.jpg`, `000013-4.jpg`, logo `jumbo-logo-cropped.png`, and `hero.mp4` (not yet supplied). Request them from the project owner. Ronzino font files (`uploads/Ronzino-*.otf`) are an unused exploration font; ignore. Fonts: Outfit and DM Mono from Google Fonts (self-host with `font-display:swap` in production).
Gaps in the prototype: image slots (`<image-slot>`) are drop zones that become real images in the theme (`image_picker` settings or product media). The ink-simulator and process illustrations are inline SVG.

## Known prototype quirks to resolve, not copy
- Several swatches share `#22A8E1` where different ink colours were intended (Blue and Green, Yellow/Aqua/grey). Confirm real ink hex values.
- Policy, FAQ, price-guide and review content is placeholder.
- Prototype pages have no real URLs; define handles (`/collections/editions`, `/pages/print-guide`, etc.).
- The footer statement has a fixed width/height (365×125px) from direct editing; use the fluid `clamp` and 16ch rule instead.
- Typography tweak code (`applyType`) mutates DOM styles at runtime; do not port it.

## Files
- `reference/Jumbo Press v66.dc.html`: the full desktop design (all pages, overlays, data).
- `reference/Jumbo Press Mobile.dc.html`: the mobile design, same pages and data.
- `reference/support.js`, `reference/image-slot.js`: runtime needed to open the reference file locally.
- `screenshots/`: viewport captures (desktop only; mobile screenshots not included, ~924px wide) of each page and the cart drawer; `_overview.png` is a contact sheet. They show page tops and a few scrolled positions only. Use the HTML reference for full pages.
- `CLAUDE.md`: drop into the theme repo root.
