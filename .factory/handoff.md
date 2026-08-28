# Stream Reader Compass v1 handoff

## Shipped

- WXT + TypeScript Manifest V3 extension for Chrome-compatible browsers.
- Explicit per-origin enable and disable control in the extension popup.
- Local transcript reader with message headings, stable anchors, named link lists, per-message copy, copy all, text export, and saved places.
- Polite live updates that preserve focus, plus pause, refresh, previous, and next controls.
- Keyboard flow: Alt+Shift+R opens the reader; J and K move by message; Escape closes it and returns focus.
- Clear empty and action-error states.
- One-click `/demo` sandbox with realistic support-chat data, isolated `demo:` storage, reset, and start-for-real paths.
- Responsive landing, demo, privacy, terms, and designed 404 routes in the monochrome broadsheet system.
- Original generated hero art, optimized WebP derivatives, social image, favicon, and extension icons.
- No analytics, external runtime scripts, remote fonts, accounts, payments, or model calls.

## Build and deploy

Run from a clean clone:

```sh
npm install
npm test
npm run build
```

The deploy root is `dist/site/`. Its `index.html` is at the root. The build also creates `.output/chrome-mv3/` and packages it as `dist/site/downloads/stream-reader-compass-chrome.zip`.

## Verification

- `npm test`: **29 passed** across desktop Chromium and a 390 × 844 mobile Chromium viewport. The suite includes all twelve tagged claims, Axe checks on every route, keyboard navigation, route focus, link crawling, and a real MV3 extension run in a fresh browser profile.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed.
- `npm audit --omit=dev --audit-level=high`: 0 production vulnerabilities.
- Factory `verify-url.sh`: 200 response, title and `lang`, one `h1`, main landmark, all image alt text, zero console errors. Local load completed in 555 ms.
- Lighthouse 12.8.2, mobile mode on the production build: **Performance 100, Accessibility 100, Best Practices 100, SEO 100**.
- Lighthouse lab metrics: LCP 1.7 s, CLS 0, Total Blocking Time 0 ms. INP was not available in the no-interaction lab run.
- Output budgets: initial site JavaScript 5.71 KB gzip, CSS 3.02 KB gzip, no font downloads. The 600 px hero is 24 KB AVIF or 39 KB WebP; the 1200 px WebP is 145 KB. Extension unpacked total is 24.3 KB; packaged ZIP is about 14 KB.
- Original hero inspected for readable text artifacts, brands, people, and visual seams. None were found. Prompt and generation metadata are in `assets/src/` and `.factory/design.md`.

## Privacy notes

The content script is present on HTTP and HTTPS pages so one package can support different chat sites. It does not query page content until the current origin is in the user-controlled enabled-site list and the user opens the reader. The integration test proves the same open request is rejected before enablement and succeeds after it.

Enabled origins use extension sync storage. A saved message identifier uses local extension storage. Transcript text is held only in memory and is never stored or sent.

## Known gaps and next steps

- Generic selectors cover common semantic chat markup. Chats inside closed shadow roots, cross-origin frames, or heavily virtualized lists may need a site adapter.
- The reader captures messages currently mounted in the page. Users may need to scroll older virtualized messages into view first.
- The ZIP is an unpacked Chrome-compatible build. Store signing and Firefox packaging belong to the release pipeline.
- Pilot usage is still needed to measure the brief's 70% navigation-or-marker target and loss-of-place rate.
