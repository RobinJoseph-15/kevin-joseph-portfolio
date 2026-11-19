# I. Kevin Joseph - Engineering Portfolio

An existing React/TypeScript portfolio redesigned around the supplied BORCELLE CREATIVE PDF: oversized condensed typography, black and warm ivory, orange accents, monochrome photography and asymmetric editorial layouts. The seven sections use ordinary document scrolling, with GSAP reveals and reduced-motion support. There are no 3D scenes.

## Run locally

Use Node.js 22.12+ and npm (validated with Node 24).

```sh
npm ci
npm run dev
npm run typecheck
npm run build
npm test
```

Vite normally serves http://127.0.0.1:5173/. Preview a production build with `npm run preview`.

Tests use isolated installed Chrome, without a personal browser profile. The default executable is the standard Windows Chrome location; set `CHROME_PATH` for another installation. Set `TEST_BASE_URL` to test an already running production preview. Screenshots and failure traces are saved in `artifacts/`.

## Structure

| Location | Purpose |
| --- | --- |
| `src/app/App.tsx` | Seven-section composition and shared providers |
| `src/sections/` | Hero, About, Expertise, Projects, Experience, Education, Contact |
| `src/data/portfolio.ts` | Career data, skills and concept categories |
| `src/components/modal/Overlay.tsx` | Native dialog, keyboard dismissal, focus restoration, scroll locking and mobile menu |
| `src/components/UI.tsx` | Responsive photos, decorative strokes and Gmail link |
| `src/hooks/useEditorialMotion.ts` | Scoped GSAP reveals, heading animation and parallax |
| `src/styles/global.css` | Tokens, editorial composition and responsive rules |
| `src/styles/desktop-fit.css` | Viewport-aware desktop compositions below the sticky header |
| `scripts/fetch-editorial-assets.mjs` | Download reproducible local WebP assets and credits |
| `tests/portfolio.spec.ts` | Browser interaction, motion, navigation and responsive checks |
| `tests/viewport-fit.spec.ts` | Exact desktop/mobile viewport bounds, visibility and popup checks |

Project cards, every skill/category, experience entries and education/recognition rows open information overlays. Native dialogs support Escape, outside click, close buttons, focus containment and restoring the opener without scrolling. Contact opens Gmail compose with the recipient prefilled; a mailto link and clipboard copy are also available. There is no form backend and no message is sent automatically.

## Content and assets

Career information is retained from the supplied portfolio data. The five engineering categories use neutral descriptions, without claims about delivered projects, clients, capacities or results. Reference photography provenance remains in ASSET_MANIFEST.md. Visitor-facing development notes have been removed.

Fonts and photographs are local, so normal page viewing does not depend on a third-party asset server. Asset credits and licenses are documented in `ASSET_MANIFEST.md`; `npm run assets` re-downloads the photographs and requires network access. The reference PDF informs composition only; its sample agency name and marketing claims are not used.

## Deploy

Run `npm ci` and `npm run build`, then publish the complete `dist/` directory to a static host. Use HTTPS for clipboard access. Root-domain hosting is assumed; subdirectory hosting requires updating Vite's `base` and root-relative asset paths. No site has been published by this redesign task.

## Validation limits

Automated checks use desktop Chrome at nine viewport widths, including mobile-sized viewports; these are not physical-device or cross-browser certification. The Gmail destination is intercepted in tests to verify the compose URL without contacting an account. Current results and the previous design history are recorded in `DEVELOPMENT_LOG.md`.

## Themes

The icon button in the header and dialogs selects dark or light mode. Semantic color tokens in `src/styles/theme.css` cover sections, navigation, controls, photography surroundings and overlays. `src/components/Theme.tsx` manages selection, localStorage and a 900ms circular reveal from the actual button center. The initial head script applies stored/system preference before the stylesheet loads.

Supporting browsers use root view-transition snapshots with a circular Web Animations mask; older browsers use a new-background curtain and commit at full coverage. Reduced motion commits immediately. Resize completes an active reveal, and repeated input is guarded. Neither page scroll nor overlay state is recreated. API pattern: https://developer.mozilla.org/en-US/docs/Web/API/ViewTransition/ready
