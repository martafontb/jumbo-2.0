# Prompt for Claude Code

Paste this into Claude Code from the root of the Jumbo Press Shopify theme repo.

---

Add two new pages to this Shopify theme: **Contact** and **Wholesale**, plus a **Contact** link in the header nav.

Read these first, in order:
1. `design_handoff_contact_wholesale/README.md` (the spec for these pages)
2. `design_handoff_contact_wholesale/reference/Jumbo Press v67.dc.html` (open in a browser, click Contact in the header; search the file for `isContact` and `isWholesale`)
3. `design_handoff_shopify_liquid/README.md` and `CLAUDE.md` for the theme's tokens, header, and rules, if they exist in this repo

Rules:
- The HTML is a design reference. Recreate it with the theme's existing CSS variables, class naming and section patterns. Do not copy inline styles.
- Online Store 2.0: `templates/page.contact.json`, `templates/page.wholesale.json`, sections `sections/contact.liquid` and `sections/wholesale.liquid` with `{% schema %}` and blocks, snippet `snippets/contact-tabs.liquid` for the shared tab strip. Vanilla JS only, and none should be needed.
- All copy, emails, colours and images are schema settings or blocks. Wholesale copy must match the README verbatim as defaults. Email default is `hey@jumbo-press.com`.
- Add `Contact` to the main menu with the same animated label as `Print ▾`. Do not change other nav items.
- Images: `image_picker`, `image_url` with srcset, width/height, lazy loading.
- Accessibility: `aria-current="page"` on the active tab, focus-visible styles, `prefers-reduced-motion` disables the fade.
- Responsive: one column below 750px; no mobile mock exists, so follow the patterns of the existing mobile pages.
- Do not add a form, extra sections or extra copy. Ask first.

Process: propose a short plan (files to create or change), then build, run `shopify theme check`, and compare each page against the reference at 1440px and 390px. Commit once per page.
