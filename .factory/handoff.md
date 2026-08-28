# Stream Reader Compass — polish round 3 handoff

## Outcome

All findings from adversarial reviews 1–3 and both earlier verification reports are closed. The repaired static site and Manifest V3 extension are live at <https://stream-reader-compass.sociobot.in>. Deployment ID: `7f9b24c6-c358-4a49-b189-b645ddbea284`.

## What changed

- Reset the extension's pause state on reader open and close. A reopened reader now receives streamed messages immediately and presents the matching **Pause updates** state.
- Moved the `pause-updates` claim to the packaged-extension scenario that reproduces pause, close, reopen, and a new source message.
- Removed untested public Alt+Shift+R and broad Chrome-compatibility promises. The manifest shortcut remains available, and the documented ZIP has a separate pinned-Chromium load test.
- Added the real `/install` route with unique title, description, canonical URL, h1, sitemap entry, SWA rewrite, installation instructions, standard header/footer, and mobile layout.
- Routed demo exit to `/install`, removed only `demo:` storage, and restored h1 focus after exit and browser Back.
- Replaced **Previous message** / **Next message** with **Go to previous message** / **Go to next message** in the demo and extension.
- Replaced “reading record,” “polite announcements,” and dependency/CDN jargon with direct transcript, announcement, and same-origin wording.
- Updated `.factory/claims.json`, `.factory/demo.md`, `.factory/copy-audit.md`, `.factory/catalog-description.txt`, and the README.
- Corrected a nested complementary landmark found by the standalone axe CLI; the final live audit reports zero violations.

The monochrome broadsheet identity, warm paper palette, yellow saved-place marker, original editorial art, square controls, and reduced-motion behavior were preserved.

## Exact verification

Clean clone: `/tmp/stream-reader-compass-polish3-clean-L7Uhyc`.

- `npm ci`: passed; 272 packages audited, zero vulnerabilities.
- Every one of the 17 `.factory/claims.json` commands: passed separately from the clean clone.
- `npm test`: 52/52 passed across desktop Chromium and 390 × 844 mobile Chromium.
- `npm run test:unit`: 5/5 passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed; produced `.output/chrome-mv3/`, the extension ZIP, and `dist/site/`.
- Work-order build command `npm ci && npm test && npm run build:site`: passed immediately before deployment.
- `npm audit --audit-level=high`: zero vulnerabilities.
- `npm audit --omit=dev --audit-level=high`: zero vulnerabilities.
- Standalone axe CLI 4.10.3: zero violations on live `/`, `/?demo=1`, `/install`, `/privacy`, and `/terms`.
- Factory `verify-url.sh`: home, demo, install, privacy, and terms returned 200 with a title, `lang=en`, one h1, one main, alt text, named buttons, and no console errors.
- Live Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.2 s, TBT 0 ms, CLS 0, 87 KiB transfer.
- Initial assets: 18.11 KB JavaScript raw / 5.93 KB gzip; 10.59 KB CSS raw / 3.15 KB gzip; no web fonts; 19.75 KB mobile hero AVIF.
- Live unknown route: HTTP 404 with the designed **Page not found** view and standard navigation.
- Live hashed assets: `Cache-Control: public, max-age=31536000, immutable`; AVIF: `Content-Type: image/avif`.
- Live ZIP and local packaged ZIP SHA-256 both equal `3cde1dfcc220f2c112421122b4fcc9b1f821ca4e90b3c8514238771da08c1a01`.
- Cold live demo: four messages on entry; only `demo:resume` was added; reset removed it and preserved `real:sentinel`; every request stayed same-origin.
- Downloaded live extension: no required host permissions or automatic content scripts; after pause → close → reopen it showed **Pause updates** and accepted the next streamed message.
- Browser offline coverage: the packaged core reader test sets the context offline before opening and exercises navigation, copy/export, saved place, streamed updates, pause reset, and close/reopen. The website makes no offline claim.

Evidence and the finding-by-finding map are in `.factory/polish-3.md`. Screenshots and machine reports are under `.factory/evidence/polish-3/` in the work-order workspace.

## Run and verify

```sh
npm ci
npm test
npm run test:unit
npm run typecheck
npm run lint
npm run build
```

Deploy `dist/site/` as the static artifact. Install the extension from `dist/site/downloads/stream-reader-compass-chrome.zip`.

## Known gaps

None within the reviewed scope. The documented product limit remains: a website that changes its chat layout may require a message-detection update.
