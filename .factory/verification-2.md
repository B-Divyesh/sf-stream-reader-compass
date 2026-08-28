# Independent product verification — PASS

Verified 2026-08-28 against candidate commit `892747aa72f383f6816719917a1c38f188caee82` and production URL `https://stream-reader-compass.sociobot.in`.

## Decision

**PASS. Release approved.** The live site and the downloadable Manifest V3 extension match the candidate build and satisfy the researched browser-extension job: screen-reader users can explicitly enable one site, open a local semantic record, move through message headings, copy/export, preserve a resume point, and receive streaming updates without focus being moved.

## Mandatory gates

Fresh clone setup used `npm ci`. Before other QA, every exact command in `.factory/claims.json` was run through the shipped test/demo entry point and passed:

| Claim | Result |
| --- | --- |
| `local-processing` | PASS |
| `semantic-record` | PASS |
| `text-export` | PASS |
| `copy-controls` | PASS |
| `link-lists` | PASS |
| `resume-marker` | PASS |
| `polite-updates` | PASS |
| `pause-updates` | PASS |
| `demo-reset` | PASS |
| `no-account-free` | PASS |
| `site-consent` | PASS |
| `no-transcript-storage` | PASS |
| `no-remote-services` | PASS |
| `escape-close` | PASS |

The full automated set also passed:

| Command | Evidence |
| --- | --- |
| `npm test` | PASS — 34 Playwright tests |
| `npm run test:unit` | PASS — 2 tests |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS — MV3 extension, ZIP, and `dist/site/` created |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |
| `npm audit --omit=dev --audit-level=high` | PASS — 0 vulnerabilities |

## Cold read and demo

On a fresh desktop visit, the above-the-fold screen plainly states what it does: “Read streaming chats without losing your place”; for whom: screen-reader users in long browser chats; and what to do first: the visible **Try it with sample data** control, accompanied by “Opens a private sample transcript.” It opens `/demo` with four realistic support-chat messages. The persistent banner says “Demo — sample data, nothing is saved” and supplies **Reset demo** and **Start for real**. This passes the first-read and one-click demo gate.

## End-to-end extension verification

I downloaded the live extension ZIP, extracted it into a new Chromium profile, and used it against the live `/demo` route.

- Before enabling the live origin, the reader answered `Enable the reader for this site first.`
- After enabling only `https://stream-reader-compass.sociobot.in`, it opened a modal reader with four message headings.
- Escape removed the reader; no page or extension errors were captured.
- The empty-state path on `/privacy` said what happened and directed the user to open a chat with at least two messages.
- The packaged-extension test suite additionally verifies hidden content exclusion, duplicate visible messages, cleaned copy/export, inserted-history resume anchors, focus restoration during updates, reverse-Tab modal containment, storage boundaries, and no outbound reader requests.

## Live browser, accessibility, privacy, and headers

Fresh Playwright checks covered desktop and 390 × 844 mobile `/`, `/demo`, `/privacy`, `/terms`, and the designed 404.

- Every normal route had `lang="en"`, exactly one `h1`, exactly one `main`, no horizontal overflow, no serious/critical Axe findings, and no application console or page errors.
- Keyboard-only checks passed: skip link focused `<main>`; J/K moved demo message headings; pause held at four messages and resume added the fifth; the visible skip-link ring was a designed 3 px `#171713` outline.
- Mobile found no visible controls under 44 × 44 CSS px. Reduced-motion media reduced animation duration to 0.01 ms; the extension disables animation under the same preference.
- During the full live demo flow, all outgoing requests were same-origin. No analytics, remote fonts, scripts, models, or APIs were requested. The extension test separately observes no reader request after opening and using the packaged extension.
- Production responses include CSP limited to `'self'`, HSTS, `nosniff`, strict-origin referrer policy, and a restrictive permissions policy. Hashed JS/CSS/image assets have `public, max-age=31536000, immutable`; the 600 px AVIF has `Content-Type: image/avif`; unknown routes return HTTP 404 and render the styled 404. The browser's expected network console entry for that deliberate HTTP 404 is not an application error.

## Performance and deployment identity

The production site initial JavaScript is 17,264 bytes raw (5.87 KB gzip) plus a 711-byte preload module; CSS is 10,075 bytes raw (3.04 KB gzip); no web fonts load. The mobile hero AVIF is 19,746 bytes. These are within the static-product budgets.

After rebuilding from the candidate, SHA-256 and byte comparisons matched live `index.html`, `assets/index-CGRJZqJV.js`, and `assets/styles-1Qqkp1YZ.css`. The ZIP containers differed only because ZIP timestamps are non-deterministic; every extracted extension file hash matched, including `manifest.json`, background/content scripts, popup assets, and icons. The live deployment is therefore this candidate, not a stale deployment.

There is no backend endpoint, sign-in, payment/unlock call, service worker, or PWA behavior, so rate-limit, Entra tenant, API concurrency, and offline-update checks are not applicable.

## Defects by severity

- **Critical:** none.
- **High:** none.
- **Medium:** none.
- **Low:** none.

## Known product limits

As documented, the generic visible-message detector may need an adapter when a chat surface changes, uses closed shadow DOM, cross-origin frames, or virtualizes messages that are not currently mounted. This is an explicit product limitation, not a defect in the tested scope.
