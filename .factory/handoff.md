# Stream Reader Compass — polish round 4 handoff

## Outcome

Perfection-loop round 4 is complete. All four findings in `.factory/review-4.md` are closed, and every finding from reviews 1–3 and the earlier verification reports was rechecked. No known product, test, accessibility, privacy, routing, mobile, or deployment gap remains.

Production: <https://stream-reader-compass.sociobot.in>

Product repair commits: `e9b2302cd2653dc0ff9c42d61b46e8eed828ce96` and `dafa11a20319a7063f01940dafc514feb0f9cc91`. Final test and evidence state: `750a0d1570ee73f0de4a60668e46741a31857bf3`.

## What changed

- Added `site-disable-removes-access` and a packaged-extension test for popup enablement, reader use, permission removal, sync cleanup, reader closure, and blocked reinjection.
- Made permission-removal failure explicit instead of reporting false success.
- Removed the untestable browser-uninstall deletion promise.
- Replaced **Read and act** with **Navigate, save, copy, or export**.
- Replaced the hero metaphor with the literal numbered-page-order result and strengthened `message-headings` to prove it.
- Fixed the popup stylesheet so **Open transcript reader** remains hidden before enablement.
- Raised popup and extension-reader link targets to the 44 px accessibility baseline.
- Added `npm run verify:live -- <url> [evidence-dir]` for repeatable post-deploy checks.
- Updated the catalog description and copy audit.

## Verification

Clean remote clone: `/tmp/stream-reader-compass-polish4-clean-8HWzBX` at `750a0d1570ee73f0de4a60668e46741a31857bf3`.

```sh
npm ci
# Run every `test` command in .factory/claims.json separately (18/18 passed).
npm test                         # 53/53 passed
npm run test:unit                # 5/5 passed
npm run typecheck                # passed
npm run lint                     # passed
npm run build                    # passed; dist/site and extension ZIP produced
npm audit --audit-level=high     # zero vulnerabilities
npm audit --omit=dev --audit-level=high # zero vulnerabilities
npm run verify:live -- https://stream-reader-compass.sociobot.in .factory/evidence/polish-4
```

Two clean builds produced the same extension ZIP SHA-256: `ef45cf975dd8e9086cdb99812b6353430c9c26149acec6a7c09dd47581efb9cc`. The production download has the same hash.

Post-deploy checks passed for home, both demo URLs, install, privacy, terms, and an unknown route. They covered exact titles and metadata, one h1/main, focus, Back, same-origin requests, demo namespace/reset, 44 px controls, mobile overflow, reduced motion, serious/critical Axe findings, legal links, security/cache headers, AVIF MIME, and HTTP 404 behavior. Factory `verify-url.sh` also passed five public routes with zero console errors.

Live Lighthouse scored 100 performance, 100 accessibility, 100 best practices, and 100 SEO. LCP was 1.276 s, TBT 4 ms, CLS 0, and transfer 88,595 bytes. Initial JS is 18,084 bytes raw / 5,943 gzip; CSS is 10,592 bytes raw / 3,164 gzip; the mobile AVIF is 19,746 bytes; no web fonts load.

Deployment completed 2026-08-29 through the configured Azure Static Web Apps work order target `sf-stream-reader-compass`. The production environment reports `Ready`, and the custom domain returned the repaired product after upload.

## Evidence

- Finding map: `.factory/polish-4.md`
- Copy audit: `.factory/copy-audit.md`
- Demo contract: `.factory/demo.md`
- Screenshots: `.factory/evidence/polish-4/live-home-mobile.png`, `live-home-desktop.png`, `live-demo-mobile.png`, `live-privacy-desktop.png`, and `live-404-desktop.png`

## Known gaps and next steps

None. No finding is deferred.
