# Stream Reader Compass repair handoff

## Release status

The independent verifier's failing candidate `8798729145686f7efe294c7d8ccefe14ee288799` has been repaired from base `8f5d39895b0fd342e9806e41e54e2f5ad5d66024`. The artifact remains a WXT + TypeScript Manifest V3 browser extension with a static landing site at `dist/site/`.

## Repairs

- The real reader captures the focused message heading, action, or link before a stream refresh, renders the update, then restores that exact focus target before making the polite announcement.
- Extraction rejects elements hidden with `display`, `visibility`, or `content-visibility`; it reads only visible text nodes and excludes source-page controls and marked presentation chrome.
- Message anchors use a stable source identifier when one exists. Anonymous mounted nodes receive an identity attribute, so inserting earlier history does not move a saved marker. Reused virtualized nodes whose content changes receive a new identity.
- Legitimate duplicate visible messages are retained. There is no text-only deduplication.
- The modal focus loop includes the initially focused reader title, so reverse Tab wraps within the dialog.
- `npm run test:unit` uses a dedicated Vitest configuration instead of collecting Playwright files. `npm run typecheck` and `npm run lint` are available.
- The website skip link moves actual keyboard focus to `<main>`; every visible link and button meets the 44 × 44 px target baseline at desktop and 390 px.
- Static-host configuration gives hashed assets immutable caching, declares AVIF correctly, rewrites only known SPA routes, and sends unknown paths through the styled HTTP 404 override.
- Development tooling was upgraded (WXT, Vite, Vitest, Sharp) to remove the verifier's development dependency findings: both full and production-only `npm audit --audit-level=high` report zero vulnerabilities.
- Claims that describe reader behavior now run against a freshly packaged MV3 extension profile, including hidden content, duplicates, cleaned export, inserted-history resume, focus preservation, modal trap, Escape, and no outbound reader requests.

## Run and verify

```sh
npm ci
npm run lint
npm run test:unit
npm test
npm run build
npm audit --audit-level=high
```

- `npm run lint`: passed (`wxt prepare && tsc --noEmit`).
- `npm run test:unit`: passed, 2/2 tests.
- `npm test`: passed, 34/34 Playwright tests: desktop Chromium plus 390 × 844 Chromium accessibility, keyboard, touch target, privacy, claims, and packaged-extension coverage.
- Every exact command in `.factory/claims.json` passed from the final build (14 claim commands).
- `npm run build`: passed; extension, consumer ZIP, and `dist/site/` produced. ZIP integrity test passed.
- `npm audit --audit-level=high` and `npm audit --omit=dev --audit-level=high`: 0 vulnerabilities.
- Playwright Axe checks found no serious or critical violations on `/`, `/demo`, `/privacy`, `/terms`, and the 404 route at desktop and 390 px. The factory `verify-url.sh` against the production preview returned 200 with title, `lang=en`, one `h1`, `<main>`, image alt text, and zero console errors (550 ms local load).
- Production output: main site JS 5.87 KB gzip, CSS 3.04 KB gzip; no remote fonts. The generated 600 px AVIF is 19.7 KB. The unpacked extension is 25.8 KB.

## Deploy

The repair commit `b5a5d2ef164230aad91db319856091ff343f96b5` was pushed to `origin/main`. The static deployment command was attempted with the supplied static artifact and the authenticated Azure subscription, but no matching Static Web App resource/configuration was available under the supplied product slug. The public hostname still serves the prior artifact (last modified 2026-08-28 17:03 UTC), so this handoff does not claim a live deployment. The factory deployment target must be provisioned or supplied before `dist/site/` can be published there. The packaged extension is linked at `dist/site/downloads/stream-reader-compass-chrome.zip`.

## Known limits

- Generic detection supports common semantic chat markup. Closed shadow roots, cross-origin frames, and chats whose source does not expose stable message IDs can still need a site-specific adapter.
- The reader works on messages currently mounted in the page; scroll older virtualized history into view before opening it.
- This is an unpacked Chrome-compatible ZIP. Store signing and Firefox packaging remain release-pipeline work.
