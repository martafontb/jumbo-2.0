# Settings that need a value from the client

Written after the art direction work (Notion: "Jumbo: Art Direction and Claude Code To-Do", parts 0 to 8). Nothing here is published. Each line says where to set it.

## Theme settings (Customize > Theme settings)

- **Cart > Free shipping threshold.** Enter `100`. It is in the store's default currency. It drives the blue bar in the cart and drawer and the "Free shipping over ..." announcement. It must match the shipping rates in Settings > Shipping.
- **Product page > Delivery line.** One short line under the Add to cart button, for example the delivery time. Empty = hidden. The delivery time is not known yet.

## Sections (theme editor)

- **Announcement bar.** The second message still holds the old brand line. Change it to the next fair.
- **Home > Product carousel ("New & Best Sellers").** The collection is `soft-goods`. Pick the collection that matches the heading. With an empty label the heading and end button follow the collection.
- **Footer > Shipping, contact and payment.** Add the shipping text and link, the contact text and link. Payment icons come from Settings > Payments.
- **Cart page and cart drawer > Add-ons.** Pick an add-on collection for each. Set the second empty-cart button link (for example the Print page).
- **Newsletter popup.** Style is "Card" with an 8 second delay. Switch to "Modal" for the old centred popup.
- **Hero.** Back to the original layout. Nothing to set.

## Shopify admin

- **Search & Discovery > Filters.** Turn on Availability, Price and Product type so the filter pills have something to show.
- **Metafields on products.** `custom.artist` (artist entry with a `name` field), `custom.format`, `custom.dimensions`, `custom.paper`. The card artist name and the spec line read these.
- **Review app (Judge.me).** The rating next to the title and on cards needs the `reviews.rating` and `reviews.rating_count` metafields the app fills in. Check the 3-star rating on the first Books card there.
- **Notify-me form.** Requests arrive as contact form messages in the store email inbox. Use a back-in-stock app later if the client wants automatic emails.

## Brand and navigation (part 9)

- **Theme settings > Brand and studio.** The brand line is Option 1. The studio facts (2018, 2 machines, 14 inks, 40 artists a year) come from the About page: confirm them before publishing.
- **Shop description.** Paste the brand line into Settings > Store details (the home page meta description in the theme already uses it).
- **Shipping pill.** It is on by default and shows "Free shipping over [amount]" from the shipping threshold. Overlays group > Shipping pill.
- **Menu.** Print links to `/pages/print`. Studio, Books and Info are not added yet.

## Still waiting for the client

- Opening hours on the About page: the page says Monday to Friday 10:00 to 16:00 and also "appointments required". Make it one line.
- Studio name: the visit section is captioned "Canal Yard", which is also a fair venue.
- Name for apparel and objects (not "PrintWorks").
- Language switch: wanted, but the store needs Catalan or Spanish content first.
- The "Print with us" block and the proof strip use A3, runs of 10 to 300 and about 7 days from the Notion notes. Confirm them.
