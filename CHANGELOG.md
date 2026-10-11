# Changelog

All notable changes to this theme are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Theme foundation on Shopify Skeleton v1.0.0: layout, password layout, Theme Check config, `.shopifyignore`.
- Design tokens (`snippets/css-variables.liquid`) driven by theme colour settings; self-hosted Outfit (variable) and DM Mono fonts with preload.
- `assets/base.css`: reset, typography scale, pills, buttons, chips, icon buttons, section heads, spec lists, progress bars, steppers, media frames, dialog-based overlays, reduced-motion support.
- `assets/global.js`: shared overlay controller (native `<dialog>`), Cart API client with Section Rendering support and `cart:updated` events, live-region announcements.
- Announcement bar section with rotating messages, copy-to-clipboard discount codes and session dismissal.
- Header section: difference-blend sticky header, nav entrance and text-roll animations, mega menus built from Shopify menus with product and info cards, full-screen mobile menu, search overlay with predictive search.
- Footer section with statement, link/text/social columns, policy links and newsletter trigger.
- Baseline templates and sections for page, 404, search, collection, collections list, product, cart, blog, article, password and gift card.
- `CLAUDE.md` project guidelines, `README.md` setup checklist, Phase 1 audit.
