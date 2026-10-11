# Jumbo Press Shopify theme — Claude Code guidelines

A Shopify Online Store 2.0 theme for Jumbo Press, built from the design in `design_handoff_shopify_liquid/`. Read its `README.md` before working on any page. `docs/phase-1-audit.md` holds the architecture plan and open decisions.

Part 1 holds the project rules and Part 2 the general Shopify conventions. Where they conflict, Part 1 wins. The "Project decisions" section records every deliberate deviation.

---

# Part 1 — Project rules

## Design source
- Desktop reference: `design_handoff_shopify_liquid/reference/Jumbo Press v66.dc.html`. Mobile reference: `Jumbo Press Mobile.dc.html` (view at ~390px). Screenshots in `screenshots/`.
- The design is an HTML prototype. Recreate it; never ship or copy its inline styles wholesale.
- **All copy, images and videos in the design are placeholder content.** Every piece of text, image, video, colour accent and link must be editable in the theme editor (section/block settings) or come from Shopify objects (`product`, `collection`, `cart`, `article`, `shop`, metafields, metaobjects). Prototype copy may be used as schema defaults; never hardcode it in markup.
- Never invent factual brand content (reviews, ratings, awards, specs). Review UI renders only from real review data and hides itself otherwise.

## Stack
- Liquid, JSON templates, sections with `{% schema %}`, theme blocks, section groups. No build step, no frameworks, no TypeScript, no jQuery.
- Vanilla JS as ES modules in `assets/`, using custom elements, loaded with `type="module"`. Global namespace is `window.JumboPress`. Custom events use the `jumbo:` prefix, except the cart events `cart:updated` / `cart:refresh`.
- Fonts: Outfit (variable, display and body) and DM Mono 400 (labels), self-hosted woff2 in `assets/`, `font-display: swap`.

## Design system
- Tokens live in `snippets/css-variables.liquid` as CSS custom properties. Colours come from theme settings. Components use tokens, never raw hex values.
- `assets/base.css` holds only the reset, typography, primitives (`.pill`, `.button`, `.chip`, `.icon-button`, `.section-head`, `.spec-list`, `.stepper`, `.progress`) and utilities. Component styles go in section/snippet `{% stylesheet %}` with BEM-ish class names.
- One breakpoint at **750px** (mobile below). Add a tablet step at **990px** only where the 3-column grid gets too tight.
- Motion uses the `fade` and `nav-in` keyframes. `prefers-reduced-motion: reduce` disables all animation and transitions.

## Commerce
- Money via `money` filters only. Never hardcode prices, product IDs, titles, stock or URLs.
- Cart mutations go through the Cart AJAX API, with re-rendering through the Section Rendering API (`sections` param). Product forms and the cart page must still work as plain `<form>` posts without JS.

## Workflow
- Work in slices: tokens/layout → header/footer → home → collection → product → cart → remaining pages. Commit per slice.
- After each slice run `shopify theme check` (zero errors, zero warnings in new code) and compare against the reference at 1440px, ~924px and 390px.
- Ask before adding sections or features that aren't in the design.
- Dev store: `jakelucas.myshopify.com`. Use a development or unpublished theme only. **Never push to or publish the live theme without explicit approval.**

## Project decisions (deviations from Part 2)
| Part 2 rule | Decision | Why |
|---|---|---|
| Branch prefixes `feature/`, `fix/`, `chore/` | Use them for new branches. Claude cloud sessions work on the branch the session assigns (e.g. `claude/…`) | The harness fixes the session branch |
| Shopify CLI 3.x | Use the current stable CLI (4.x). Commands (`theme dev/push/pull/check`) are unchanged | 3.x is no longer current |
| Minify CSS with a build pipeline | No build step. Keep sources lean. Shopify minifies `{% stylesheet %}`/`{% javascript %}` bundles. Add a documented build step only if `assets/` minification becomes a measured need | Project rule: no build step |
| Only standard theme directories | `blocks/` (standard OS 2.0) is used. `docs/` and `design_handoff_shopify_liquid/` exist for documentation and are excluded in `.shopifyignore` and `.theme-check.yml` | Documentation, never deployed |
| All strings via locales | Customer-facing strings use `locales/`. Theme-editor schema labels are plain English | Merchant-facing labels only. Avoids duplicating every label as a key |
| `settings_data.json` gitignored | Followed. Setting defaults live in `settings_schema.json` and section schemas. Template and section-group JSON files are committed | Avoid overwriting live customisations |

---

# Part 2 — Shopify theme development conventions

These are general frontend conventions for Shopify themes. Follow them unless Part 1, the project README or a team member overrides them.

## Project structure
- Follow the standard Shopify theme directory structure: `assets/`, `config/`, `layout/`, `sections/`, `snippets/`, `templates/`, `locales/` (plus `blocks/`).
- Never create directories outside this structure without explicit justification.
- Keep `layout/theme.liquid` lean. Load scripts and styles via `{% render %}` snippets or section includes, not inline.
- Use `templates/` for JSON templates (Online Store 2.0). Avoid `.liquid` templates unless supporting a legacy theme. `gift_card.liquid` is the exception, because Shopify requires it.

## Liquid templating
- Prefer `{% render %}` over `{% include %}`. `render` has a sandboxed scope. `include` leaks parent variables and is deprecated. Never use `{% include %}` in new code.
- Keep logic out of templates. Move conditional blocks and loops into snippets.
- Avoid deeply nested Liquid logic (more than 3 levels). Refactor into named snippets.
- Use `{% liquid %}` blocks to group multiple tags without extra whitespace output.
- Strip whitespace with `{%- -%}` and `{{- -}}` in performance-sensitive areas (loops, large partials).
- Always provide fallback values for variables: `{{ product.title | default: 'Untitled' }}`.
- Never output raw user-controlled data without appropriate filters (`escape`, `strip_html`).

## Sections and blocks
- Every merchant-editable area must be a section or a block inside a section.
- Define schema settings for all configurable content. Never hardcode merchant-facing copy.
- Use `presets` in section schemas so sections are available in the theme editor.
- Sections must be self-contained and re-renderable in isolation (required by the Section Rendering API).
- Use `blocks` for repeatable elements (slides, tabs, FAQ items) and set a reasonable `max_blocks`.
- Always define a `name` and `class` in the section schema.
- Validate that schema `type` values are Shopify-supported input types.
- Declare app blocks under `"blocks": [{ "type": "@app" }]` where integrations make sense.

## Metafields and metaobjects (read-only in the theme)
- Themes only **read** metafields. Never write them from Liquid or client-side JS.
- Access them as `product.metafields.namespace.key`. Never construct keys dynamically at runtime.
- Check for existence before output: `{% if product.metafields.custom.tagline != blank %}`.
- Values are capped at 16 KB. If a value looks truncated, flag it; the fix is on the admin side.
- Document every namespace and key the theme depends on in `README.md`.

## Performance
- Lazy-load all below-the-fold images with `loading="lazy"`. Use `image_url` with explicit `width`/`height`.
- Always pass `width` to `image_url`. Never output raw CDN URLs or hardcoded sizes.
- Use `srcset` for responsive images (`image_tag` generates it).
- Defer non-critical JS with `defer` or `type="module"`. Never use `document.write()`.
- Don't load third-party scripts in `<head>`. Use `async` or load them at the end of `<body>`.
- Limit section-level `<script>` tags. Consolidate theme JS in `assets/`.
- Preload critical fonts and above-the-fold images.
- Target Lighthouse performance ≥ 80 on mobile for new features.

## JavaScript
- Vanilla JS. Don't introduce React, Vue or Alpine.js without approval. No jQuery.
- Use web components / custom elements for encapsulated UI (carousels, modals, accordions).
- Namespace globals (`window.JumboPress`) and custom events.
- Use `CustomEvent` dispatched on `document` for cross-component communication.
- Use `addEventListener`. Never use inline `onclick` attributes.
- Wrap Fetch and Cart API calls in try/catch with user-visible fallback messaging.

## Cart (client-side)
- Use the Cart API (`/cart/add.js`, `/cart/update.js`, `/cart/change.js`) for mutations where a dynamic cart experience is expected.
- Dispatch `cart:refresh` / `cart:updated` after mutations so the mini cart, header count and others react without coupling.
- Update the UI optimistically and roll back on API error with a visible message.
- Never redirect to `/checkout` from JS except after a confirmed cart state. Prefer the standard checkout button.

## CSS
- Use CSS custom properties for all design tokens (colours, spacing, type, radii).
- Define colour and font settings in `config/settings_schema.json` and expose them as CSS variables.
- Avoid `!important`; it signals a specificity problem.
- No inline styles in Liquid except dynamically injected custom properties.
- Scope component styles with BEM-like names or custom element selectors. Avoid broad tag selectors.

## Localisation and accessibility
- Customer-facing strings use `{{ 'key' | t }}` keys in `locales/`, even for a single-locale store.
- Always provide meaningful `alt` text (image alt, metafield or schema fallback). Use `alt=""` only for purely decorative images.
- All interactive elements must be keyboard accessible with visible focus styles.
- Use semantic HTML: `<nav>`, `<main>`, `<header>`, `<footer>`, `<article>`, `<section>`, `<button>`.
- Every form input has an associated `<label>` (visible or `.visually-hidden`).
- Modals and drawers trap focus and close on `Escape`.
- Target WCAG 2.2 AA (2.1 AA minimum).

## Shopify CLI
- `shopify theme dev`, `shopify theme push`, `shopify theme pull`, `shopify theme check`.
- Never push directly to a live theme. Use a development theme or a duplicate.
- Keep `config/settings_data.json` in `.gitignore`.
- Always keep a `.shopifyignore`.

## Git
- Use feature branches. Never commit directly to `main`/`production`. Prefixes: `feature/`, `fix/`, `chore/`.
- Keep commits small and focused. Write messages in the imperative, naming the theme area (`Add sticky header behaviour`).
- Open a pull request for every change. Require a review before merging to `main` on team projects. Squash on merge.
- Tag releases on `main` with semver (`v1.0.0`).
- Never commit secrets, tokens or credentials.
- Keep `config/settings_data.json`, `node_modules/`, `.env`, `.DS_Store` and build artefacts in `.gitignore`.
- Run `shopify theme check` and resolve all errors before opening a PR.

## Testing and quality
- Run `shopify theme check` before every commit. Treat warnings as errors in new code.
- Validate all schema JSON. Malformed schema silently breaks the theme editor.
- Test on real Shopify preview URLs, not just `localhost`.
- Test in Chrome, Firefox, Safari (desktop and iOS) and Chrome Android.
- Test accessibility-critical flows with a screen reader (VoiceOver, NVDA).
- In the theme editor, every section must be addable, removable and reorderable without JS errors.

## Documentation
- Every section starts with a comment block describing its purpose and any non-obvious settings.
- Document all metafield namespaces and keys in `README.md`.
- Explain non-obvious Liquid workarounds in `{% comment %}` blocks.
- Maintain `CHANGELOG.md` in Keep a Changelog format.
