# Perfection-loop polish 2

Polished release candidate `414c0f661148df2f03a287ef87bc78e5e93cbb63` against every finding in `.factory/review-1.md` and `.factory/review-2.md`. Repair commit: `150d75f2e9faf59e619e7cfb0032b85b1a1d1fcc`.

## Finding map

| Finding | Change made | Evidence | Screenshot and live check |
| --- | --- | --- | --- |
| F-1-1 | Kept the existing per-site permission design: no manifest host permissions or automatic content scripts; optional host permission plus explicit enablement remains. | `@claim:site-consent` passes from the clean clone; extracted live ZIP manifest has no `host_permissions` or `content_scripts`. | `/tmp/stream-reader-compass-polish-2-demo.png`; live ZIP returned 200. |
| F-1-2 | Kept the short two-sentence README feature introduction and strengthened the copy unit test. | `npm run test:unit` (4/4). | `/tmp/stream-reader-compass-polish-2-desktop.png`; live home returned 200. |
| F-1-3 | Kept the dedicated demo and J/K claim entries and their observable tests. | `@claim:demo-one-click-isolation`; `@claim:heading-key-navigation`, both passed from the clean clone. | `/tmp/stream-reader-compass-polish-2-demo.png`; live `/?demo=1` showed four messages. |
| F-1-4 | Kept **Exit demo and install extension** and its explicit clearing/install helper. | `@claim:demo-one-click-isolation`. | `/tmp/stream-reader-compass-polish-2-demo.png`; live demo banner includes both strings. |
| F-1-5 | Kept the shared header on SPA and static 404 routes. | `legal routes and the static 404 keep the complete site navigation`. | `/tmp/stream-reader-compass-polish-2-404.png`; live `/missing-page` returned 404 with Demo, How it works, and Privacy. |
| F-1-6 | Kept direct preview and 404 headings. | `unknown routes show the designed 404 page`; `plain-language release copy`. | `/tmp/stream-reader-compass-polish-2-404.png`; live page heading is **Page not found**. |
| F-2-1 | Replaced whole-message opacity/translation animation in both site and extension reader with a top-rule-only scale animation. Added immediate post-entry and post-reset Axe assertions plus computed-opacity checks. | `demo text keeps full contrast immediately after entry and reset` passed at desktop and mobile; both live immediate Axe runs had zero serious/critical violations. | `/tmp/stream-reader-compass-polish-2-demo.png`; live `/?demo=1` passed the cold transition/reset check. |
| F-2-2 | Added `site-self-contained` to `.factory/claims.json`; its tagged test records landing/demo requests, checks self-hosted script/style/font URLs, and verifies no runtime dependencies. | `@claim:site-self-contained` passed from the clean clone. | `/tmp/stream-reader-compass-polish-2-desktop.png`; live landing/demo request log was same-origin only. |
| F-2-3 | Rewrote the landing eyebrow to **Browser extension for screen-reader users**. | `plain-language release copy`; first-screen browser check. | `/tmp/stream-reader-compass-polish-2-desktop.png`; live `/` exposed the exact text. |
| F-2-4 | Replaced “stable anchor” with “heading that stays with that message”; renamed the matching claim to `message-headings`. | `@claim:message-headings`; `plain-language release copy`. | `/tmp/stream-reader-compass-polish-2-desktop.png`; live How it works copy has the plain wording. |
| F-2-5 | Standardized visitor copy on **demo**, **saved place**, and **enabled site**; rewrote README and privacy disclosures. | `@claim:demo-one-click-isolation`; `@claim:resume-marker`; `plain-language release copy`. | `/tmp/stream-reader-compass-polish-2-demo.png`; live demo reset preserved `real:sentinel` and removed `demo:resume`. |
| F-2-6 | Replaced/deleted decorative labels: **Transcript preview · first 2 of 4 messages**, **Sample transcript · 4 messages**, no “Clear boundaries” or “Edition 404”. | `plain-language release copy`; 404 navigation test. | `/tmp/stream-reader-compass-polish-2-desktop.png`, `/tmp/stream-reader-compass-polish-2-404.png`; live home and 404 checked cold. |
| F-2-7 | Rewrote the README limit in user terms: “If a website changes its chat layout, message detection may need an update.” | `plain-language release copy` and `.factory/copy-audit.md`. | `/tmp/stream-reader-compass-polish-2-desktop.png`; checked in the pushed README at commit `150d75f`. |

## Earlier unnumbered findings rechecked

The packaged-reader claim suite again proves focus retention during streamed updates, hidden-content exclusion, duplicate preservation, saved-place identity after insertion, correct export contents, reverse-Tab containment, offline operation, copy/link controls, pause/resume, and Escape close. The site suite again proves skip-link focus, 44 px controls, route titles/canonical/social metadata, legal links, mobile overflow absence, and the real 404. The fresh downloaded ZIP retains optional per-site permissions only.

## Verification and deployment

- Fresh clone: `/tmp/stream-reader-clean-wjBdsT`; `npm ci` completed with zero vulnerabilities, then all 17 exact commands listed in `.factory/claims.json` passed one at a time.
- Main checkout: `npm run test:unit` 4/4; `npm run lint`; `npm run build`; `npm test` 47/47; `npm audit --audit-level=high`; and `npm audit --omit=dev --audit-level=high` all passed.
- Live cold browser check: new desktop and 390 × 844 mobile contexts at `https://stream-reader-compass.sociobot.in`; no regular-route console errors or off-origin requests, correct route titles/landmarks, demo isolation/reset, immediate contrast checks, legal routes, and 404 all passed.
- Lighthouse on live home: performance 100, accessibility 100, best practices 100, SEO 100; LCP 841 ms, TBT 14 ms, CLS 0, transfer 11,075 bytes. JSON: `/tmp/stream-reader-compass-polish-2-lighthouse-home.json`.
- Deployed with `swa deploy dist/site --app-name sf-stream-reader-compass --resource-group sociobot --env production --no-use-keychain`. The deployed app hostname is `yellow-beach-070274510.7.azurestaticapps.net`; the custom domain was cold-checked after deployment.
