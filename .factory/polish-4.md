# Perfection-loop polish 4

Completed 2026-08-29 against review commit `23d55f6a517f7f52f69df606f2658aa6ab251970`. Product repair commits: `e9b2302cd2653dc0ff9c42d61b46e8eed828ce96` and `dafa11a20319a7063f01940dafc514feb0f9cc91`. Production: <https://stream-reader-compass.sociobot.in>.

## Round 4 finding map

| Finding | Change made | Automated evidence | Screenshot and live check |
| --- | --- | --- | --- |
| F-4-1 — disabling access was unlisted | Added `site-disable-removes-access` to `.factory/claims.json`. The packaged-extension test uses a fresh browser profile, enables the fixture through the real popup, opens the reader, disables the site through the popup, and verifies removal from `enabledOrigins`, removal of the optional host permission, closure of the reader, and rejection of later script injection. Permission removal now reports an error instead of claiming success if browser access remains. | `@claim:site-disable-removes-access disables a site through the popup and removes its permission`; passed alone, in the 53-test suite, and from the clean clone. | `.factory/evidence/polish-4/live-privacy-desktop.png`; live `/privacy` retains the tested sentence and the deployed ZIP hash matches the clean build. |
| F-4-2 — uninstall deletion was unlisted | Removed “Remove the extension to delete its local data.” The product does not claim control over browser-owned uninstall cleanup. The privacy page now lists only controls the product proves. | `plain-language release copy` rejects the removed sentence; live verifier asserts that it is absent. | `.factory/evidence/polish-4/live-privacy-desktop.png`; cold live `/privacy` contains no uninstall guarantee. |
| F-4-3 — generic “Read and act” heading | Replaced it with **Navigate, save, copy, or export**. | `plain-language release copy`; live verifier checks the exact heading. | `.factory/evidence/polish-4/live-home-mobile.png`; cold live `/` exposes the direct heading. |
| F-4-4 — metaphorical hero caption | Replaced the caption with “The reader numbers visible chat messages in their page order.” Aligned `message-headings` to that result and strengthened the packaged reader test to assert numbered headings and source order. | `@claim:message-headings preserves real-reader records and focus while a page streams`; `plain-language release copy`. | `.factory/evidence/polish-4/live-home-desktop.png`; the live caption and package behavior match. |

## Earlier numbered findings rechecked

| Finding | Preserved change | Evidence and live check |
| --- | --- | --- |
| F-1-1 | No required host permissions or automatic content scripts; one-origin optional permission and runtime injection remain. | `@claim:site-consent` and `@claim:site-disable-removes-access`; live ZIP manifest and byte match. |
| F-1-2 | README feature copy remains split into short sentences. | `plain-language release copy`; `.factory/copy-audit.md`; `.factory/evidence/polish-4/live-home-mobile.png`. |
| F-1-3 | One-click demo isolation and J/K movement remain inventoried once and tested on their real surfaces. | `@claim:demo-one-click-isolation`; `@claim:heading-key-navigation`; `.factory/evidence/polish-4/live-demo-mobile.png`. |
| F-1-4 | Demo exit keeps the result-naming label and clearing/install explanation. | Demo isolation test and live verification; `.factory/evidence/polish-4/live-demo-mobile.png`. |
| F-1-5 | Static and SPA 404 pages keep Demo, How it works, Privacy, and the complete footer. | `unknown routes show the designed 404 page`; live unknown URL returned HTTP 404; `.factory/evidence/polish-4/live-404-desktop.png`. |
| F-1-6 | Preview and missing-page headings remain literal. | First-screen and 404 tests; live `/` and live unknown route. |
| F-2-1 | Only the top rule animates; message opacity remains 1 during entry and reset. | `demo text keeps full contrast immediately after entry and reset`; desktop/mobile Axe checks. |
| F-2-2 | The website self-containment statement remains listed and tested with a same-origin request log. | `@claim:site-self-contained`; live demo network check. |
| F-2-3 | The eyebrow remains **Browser extension for screen-reader users**. | `the first screen states the job, audience, action, outcome, and three facts`; live mobile screenshot. |
| F-2-4 | Visitor copy says a heading stays with its message; the claim now also proves numbering and page order. | `@claim:message-headings`; live home and packaged reader. |
| F-2-5 | Visitor terms remain **demo**, **saved place**, and **enabled site**. | Copy audit, demo isolation, resume, and consent tests. |
| F-2-6 | Preview, demo, and 404 labels identify their content directly. | Plain-language unit test and live home/demo/404 screenshots. |
| F-2-7 | README describes layout changes and message detection in user terms. | `plain-language release copy`; `.factory/copy-audit.md`. |
| F-3-1 | Opening and closing the reader reset pause state; a reopened reader receives the next message. | `@claim:pause-updates` in the packaged-reader streaming test. |
| F-3-2 | Public site, README, and popup instructions do not advertise the untested shortcut. | `plain-language release copy`; packaged popup inspection. |
| F-3-3 | Public copy says browser extension rather than claiming blanket Chrome compatibility. | `the documented ZIP loads in the pinned Chromium browser`; copy unit test. |
| F-3-4 | Demo exit uses `/install`; exit and Back focus their route h1 and preserve non-demo storage. | `exiting the demo and going Back both move focus to the route heading`; live demo flow. |
| F-3-5 | Both reader implementations retain **Go to previous message** and **Go to next message**. | Copy unit test and complete browser suite. |
| F-3-6 | Public copy consistently uses **transcript**. | Copy unit test and copy audit. |
| F-3-7 | README describes the audible, focus-preserving result instead of ARIA jargon. | `@claim:polite-updates`; copy unit test. |
| F-3-8 | README says scripts, styles, and fonts load only from the site's domain. | `@claim:site-self-contained`; cold live request log. |

## Earlier unnumbered findings rechecked

The packaged-reader claim test still proves focus retention during streaming, hidden-content filtering, source-identity saved places, duplicate preservation, clean copy/export, reverse-Tab containment, Escape close, offline reader use, and no transcript storage or remote request. Site tests still prove skip-link focus, 44 px targets, immediate contrast, reduced motion, route titles/canonicals/social metadata, legal links, mobile overflow absence, real 404 behavior, correct AVIF delivery, and immutable hashed-asset caching. The popup now also honors its `hidden` control state and its privacy link meets the 44 px target baseline.

## Verification evidence

- Clean remote clone: `/tmp/stream-reader-compass-polish4-clean-8HWzBX` at `750a0d1570ee73f0de4a60668e46741a31857bf3`.
- Every one of the 18 exact commands in `.factory/claims.json`: PASS separately.
- `npm test`: PASS, 53/53 across desktop and 390 px mobile.
- `npm run test:unit`: PASS, 5/5. `npm run typecheck`, `npm run lint`, and `npm run build`: PASS.
- `npm audit --audit-level=high` and `npm audit --omit=dev --audit-level=high`: zero vulnerabilities.
- Two consecutive packages had SHA-256 `ef45cf975dd8e9086cdb99812b6353430c9c26149acec6a7c09dd47581efb9cc`.
- The downloaded production ZIP has the same SHA-256.
- Live verifier: desktop/mobile route, metadata, Axe, touch-target, layout, demo, privacy, focus, network, links, 404, and reduced-motion checks all passed.
- Factory `verify-url.sh`: PASS on `/`, `/?demo=1`, `/install`, `/privacy`, and `/terms`; all had zero console errors, `lang=en`, one h1, one main, and no missing alt text.
- Live Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.276 s, TBT 4 ms, CLS 0, total transfer 88,595 bytes.
- Initial assets: 18,084-byte JS (5,943 gzip), 10,592-byte CSS (3,164 gzip), no web fonts, and 19,746-byte mobile AVIF.
- Deployment completed 2026-08-29 to Azure Static Web Apps app `sf-stream-reader-compass`; the default environment reports `Ready`. The custom domain was cold-checked after upload.

No finding from reviews 1–4 or the earlier verification reports remains open.
