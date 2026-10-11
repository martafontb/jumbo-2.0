# Jumbo Press Shopify theme

Build a Shopify Online Store 2.0 theme from the design in `design_handoff_shopify_liquid/`. Read its README.md first.

## Rules
- Liquid, JSON templates, sections with `{% schema %}` and blocks. No build step, no frameworks, vanilla JS (ES modules in `assets/`).
- Design is a reference in HTML. Recreate it; never copy its inline styles wholesale. Use CSS custom properties in `snippets/css-variables.liquid` for the tokens in the README, and BEM-ish class names in `assets/base.css` plus section-scoped `{% stylesheet %}`.
- Every piece of copy, image, colour accent and link must be editable via schema settings or come from Shopify objects (`product`, `collection`, `cart`, `article`, `shop`). No hardcoded product data.
- Images: `image_url` with `srcset`/`sizes`, explicit width/height, lazy loading except the hero.
- Money via `money` filters. Cart via Cart AJAX API and Section Rendering API.
- Accessibility: focus-visible styles, trap focus in drawers and modals, keyboard-operable menus, `prefers-reduced-motion` disables animations.
- Fonts: Outfit (display/body), DM Mono (labels). Self-host, `font-display: swap`.
- Work in slices (tokens/layout, header/footer, home, collection, product, cart, rest). After each slice run `shopify theme check` and compare to the reference. Commit per slice.
- Ask before adding sections or features not in the design.
- Desktop reference: `reference/Jumbo Press v66.dc.html`. Mobile reference: `reference/Jumbo Press Mobile.dc.html` (open at ~390px wide). One theme, responsive CSS, breakpoint 750px.
