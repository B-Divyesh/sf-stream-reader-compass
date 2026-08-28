# Stream Reader Compass — polish 2 handoff

## Outcome

Released repair commit `150d75f2e9faf59e619e7cfb0032b85b1a1d1fcc` to `main` and production. Every finding in adversarial reviews 1 and 2 is closed; no known product gaps remain.

## What changed

- Kept text and controls fully opaque during demo and extension-reader entry; only the editorial rule animates.
- Added the immediate-transition Axe regression test and a real `site-self-contained` claim/test.
- Rewrote the reviewed first-screen, demo, preview, 404, README, privacy, and limitation copy in plain, consistent terms.
- Renamed the semantic-reader claim to `message-headings` and kept all demo isolation, routing, focus, mobile, legal, and per-site-permission fixes intact.
- Made `npm run test:unit` generate required WXT types so it works from a fresh install.
- Updated the catalog sentence and copy audit.

## Exact verification

- Fresh clone `/tmp/stream-reader-clean-wjBdsT`: `npm ci` (zero vulnerabilities), then each of the 17 exact `.factory/claims.json` commands passed independently.
- Main checkout: `npm run test:unit` (4/4), `npm run typecheck`, `npm run lint`, `npm run build`, `npm test` (47/47), `npm audit --audit-level=high`, and `npm audit --omit=dev --audit-level=high` all passed.
- Build output: `dist/site/`; landing JS is 16.96 KB raw / 5.72 KB gzip. The packaged MV3 extension is 26.79 KB before ZIP compression.
- Live cold browser verification at `https://stream-reader-compass.sociobot.in`: landing, `/?demo=1`, `/privacy`, `/terms`, and `/missing-page` passed titles, `lang`, one `h1`, one `main`, metadata, navigation, mobile layout, demo isolation/reset, immediate Axe, and same-origin request checks. The unknown route returned HTTP 404; the ZIP returned HTTP 200 with immutable caching.
- Screenshots: `/tmp/stream-reader-compass-polish-2-desktop.png`, `/tmp/stream-reader-compass-polish-2-mobile.png`, `/tmp/stream-reader-compass-polish-2-demo.png`, `/tmp/stream-reader-compass-polish-2-404.png`.
- Lighthouse live home: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 841 ms, TBT 14 ms, CLS 0.

## Deployment

Deployed `dist/site` with Azure Static Web Apps CLI to production app `sf-stream-reader-compass` in resource group `sociobot`. The custom domain was re-opened cold after deployment. The packaged extension remains at `/downloads/stream-reader-compass-chrome.zip`.

## Known gaps and next steps

None.
