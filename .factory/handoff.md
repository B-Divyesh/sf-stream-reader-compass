# Stream Reader Compass — polish 1 handoff

## Status

Perfection-loop round 1 is complete with no unresolved review finding. The product remains a WXT + TypeScript Manifest V3 browser extension with a static Vite site in `dist/site/`. The broadsheet visual identity and original generated editorial art are unchanged.

Implementation commit `d0420beb9115619d1fecc2788ac123a7cdb3e052` was pushed to `origin/main`. The deployed static artifact was built from that commit.

## What changed

- Replaced universal browser access and automatic injection with optional HTTP(S) host permissions, a user-triggered current-origin request, on-demand script injection, and permission removal when a site is disabled.
- Added the required one-click `/?demo=1` path. Its isolated sample is ready immediately, uses only `demo:` storage, preserves non-demo keys, and has persistent reset/exit controls.
- Added `demo-one-click-isolation` and `heading-key-navigation` to the 16-entry claims inventory, with one tagged test per claim.
- Rewrote the overlong README sentence, the preview heading, the 404 heading, and the demo exit action. `.factory/copy-audit.md` contains the updated sentence counts and terminology audit.
- Completed route-specific title, description, canonical, Open Graph, and Twitter updates. The static and SPA 404s share the standard header/footer and the static 404 has complete metadata.
- Kept all three header destinations on mobile, added a clear demo-exit helper, and verified no overflow or sub-44 px control at 390 px.
- Added the verb-first, 96-character `.factory/catalog-description.txt`.
- Made the downloadable ZIP reproducible by fixing archive entry timestamps; two consecutive package runs produced SHA-256 `c6f41e571c76a162c2bda40e424793ad22401e758470497d007bfbbbf0008ca9`.
- Preserved all earlier repairs for stable anchors, focus retention, hidden-content filtering, duplicate messages, clean export, dialog focus containment, skip focus, caching, AVIF MIME type, and dependency safety.

## Verification

Fresh-clone verification:

- `npm ci`: passed; zero vulnerabilities.
- Every exact command in `.factory/claims.json`: 16/16 passed individually.
- `npm test`: 45/45 Playwright tests passed across desktop Chromium and 390 × 844 mobile Chromium.
- `npm run test:unit`: 4/4 passed in two files.
- `npm run lint`: passed (`wxt prepare && tsc --noEmit`).
- `npm run build`: passed; produced `.output/chrome-mv3/`, `dist/site/`, and the downloadable ZIP.
- `npm audit --audit-level=high`: zero vulnerabilities.
- `npm audit --omit=dev --audit-level=high`: zero vulnerabilities.

Coverage includes the packaged reader, manifest permissions, demo isolation/reset, copy/export, link lists, resume stability, streaming focus, J/K and Escape, reverse Tab, offline use after page load, same-origin request logging, route/back focus, metadata, legal links, static 404, reduced motion, touch targets, and Axe checks. Axe found zero serious or critical issues on every route, the popup, and the reader dialog.

Build budgets: main site JavaScript 17.17 KB raw / 5.83 KB gzip; CSS 10.23 KB raw / 3.06 KB gzip; no downloaded fonts; mobile hero AVIF 19.75 KB; unpacked extension 26.68 KB.

Lighthouse:

- Local mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.7 s, TBT 0 ms, CLS 0.
- Live mobile: Performance 98, Accessibility 100, Best Practices 100, SEO 100; LCP 1.3 s, TBT 0 ms, CLS 0, transfer 86 KiB.

## Deployment and cold live check

- Deployment command: `/opt/fleet/lib/deploy-static.sh stream-reader-compass dist/site`
- Azure Static Web Apps deployment: `2da35f15-3840-40e4-ad42-7cd308b78cac`
- Live site: <https://stream-reader-compass.sociobot.in/>
- Demo: <https://stream-reader-compass.sociobot.in/?demo=1>
- ZIP: <https://stream-reader-compass.sociobot.in/downloads/stream-reader-compass-chrome.zip>

After deployment, fresh browser contexts rechecked every finding. Home, demo, Privacy, Terms, the ZIP, and all documented external links returned 200. Unknown routes returned HTTP 404 with **Page not found** and the standard three-link header. The live AVIF returned `image/avif`; hashed assets returned one-year immutable caching. Demo storage isolation/reset, mobile layout, 44 px targets, route metadata, same-origin privacy, and zero serious/critical Axe results passed. The expected browser network message for the deliberate 404 was the only 404 console entry.

The downloaded ZIP's 10 files matched the local extension build. Its manifest contains no `host_permissions` and no `content_scripts`; it contains only optional HTTP(S) host permissions plus `storage`, `activeTab`, and `scripting`.

Factory verifier evidence is under `.factory/evidence/polish-1/live-home/` and `.factory/evidence/polish-1/live-demo/`. Finding-by-finding evidence is in `.factory/polish-1.md`.

## Known limits

No reviewed defect remains. As documented product boundaries, sites with closed shadow roots, cross-origin frames, or changed/virtualized markup may need a site-specific adapter, and only currently mounted messages can be read.
