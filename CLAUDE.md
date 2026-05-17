# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development commands

This repository is mostly a plain static site. A small Astro subproject under `docs-astro/` builds only the `/docs/` subtree. There is no linter or automated test suite checked in.

- Start a local preview server from the repo root:
  - `python3 -m http.server 8000`
- Open the pages directly in the browser while the server is running:
  - Landing page: `http://localhost:8000/index.html`
  - Onboarding page: `http://localhost:8000/onboarding.html`
  - Docs page: `http://localhost:8000/docs/`
- Build the Astro docs subtree:
  - `pnpm run build:docs`
- Start the Astro docs development server:
  - `pnpm run dev:docs`

Because there is no automated lint/test setup in the repo, validation is manual:
- Reload both pages after edits.
- Check responsive behavior in browser devtools.
- Verify the copy-to-clipboard UI on both pages.
- Verify onboarding progression, progress bar, and step dots after changing onboarding markup or JS.

## Architecture overview

This codebase is a two-page static website for the 2dserver Minecraft community.
The root static site is still deployed directly from the repository root.
Astro is used only for the `/docs/` subtree.

### Page split

- `index.html` is the landing page.
- `onboarding.html` is the guided onboarding flow for new players.
- `docs-astro/` contains the Astro source for the docs subtree.
- `docs/` is the generated Astro output served at `/docs/`.

Do not hand-edit files in `docs/`; they are overwritten by `pnpm run build:docs`.
Edit docs pages under `docs-astro/src/pages/` instead.

Each page has its own page-specific stylesheet and script:
- Landing page: `css/index.css`, `js/index.js`
- Onboarding page: `css/onboarding.css`, `js/onboarding.js`

Shared UI behavior lives in:
- `css/common.css` — shared server-address / copy-to-clipboard styling
- `js/copy-address.js` — shared clipboard interaction for elements with `.server-address[data-copy]`

### Landing page flow

The landing page is mostly static markup plus a JS-driven image carousel.

- `index.html` defines a split layout: left-side carousel, right-side server/community CTA content.
- `js/index.js` dynamically builds carousel slides and indicator dots from a hardcoded image filename list, preloads upcoming images, and crossfades both the carousel image and the full-page background layers.
- Background/carousel images are sourced from `assets/img/index-bg/`.

If you add or remove landing-page background images, update the `images` array in `js/index.js`; the HTML does not enumerate the slides itself.

### Onboarding page flow

The onboarding page is a progressive multi-section guide rather than a routed multi-page app.

- `onboarding.html` contains all onboarding sections up front in the DOM.
- Each section is wrapped in `.section-wrap`; only opened sections are shown.
- Buttons with `.continue-btn[data-next]` advance the flow by revealing the next section.
- `js/onboarding.js` is responsible for:
  - building the right-side step indicator dots
  - rendering inline markdown from `[data-md]` bilingual content blocks via vendored `libs/marked.min.js`
  - rendering Mermaid code blocks via vendored `libs/mermaid.min.js`
  - updating the progress bar and completed/current step states
  - centering the stack of currently open sections when the content is shorter than the viewport
  - scrolling and temporarily highlighting newly opened sections

Important implication: onboarding copy is authored as raw markdown directly inside the HTML, then converted to rendered HTML at runtime. When editing onboarding content, preserve the `[data-md]` blocks and their markdown structure so the JS renderer continues to work.

### Styling model

- `css/common.css` holds only genuinely shared primitives; right now that is the server address copy component.
- `css/index.css` defines the dark/glass landing-page visual system and the reusable black `.btn.btn-primary` CTA style used on the landing page.
- `css/onboarding.css` defines the softer onboarding theme, section cards, progress UI, and onboarding-specific layout. It also contains a local `.btn` / `.btn-primary` definition so onboarding can reuse the landing page’s black CTA appearance without importing landing-page layout styles.

When changing button styles, be careful not to couple `index.css` layout assumptions into onboarding; the two pages intentionally share only small style primitives, not a full common design system.

### Third-party assets

There is no package-managed dependency installation. Third-party libraries are vendored directly under `libs/`:
- `marked.min.js`
- `mermaid.min.js`

If behavior depends on markdown or diagram rendering, check those script tags in `onboarding.html` before assuming a bundler or npm dependency exists.
