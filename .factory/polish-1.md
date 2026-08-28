# Perfection-loop polish 1

Polished candidate `892747aa72f383f6816719917a1c38f188caee82` against adversarial review commit `7b791cced23e4914ac5326ef97eb07121d462366`. The only tracked adversarial review is `.factory/review-1.md`; no earlier `.factory/review-*.md` or `.factory/polish-*.md` files exist in history. The earlier findings summarized by that review were also rechecked below.

## Review 1 findings

| Finding | Change made | Automated evidence | Screenshot | Live check |
| --- | --- | --- | --- | --- |
| F-1-1 — broad host permissions | Removed manifest `host_permissions` and manifest content scripts. Added optional HTTP(S) host permissions, current-origin permission requests from **Enable on this site**, on-demand `chrome.scripting` injection, and permission removal on disable. | `@claim:site-consent @claim:no-transcript-storage blocks reading until enablement…` inspects the shipped manifest, proves no receiver exists before enablement, then exercises the reader. The live ZIP has no `host_permissions` or `content_scripts`. | `.factory/evidence/polish-1/extension-reader.png` | `https://stream-reader-compass.sociobot.in/downloads/stream-reader-compass-chrome.zip` returned 200; all 10 extracted files matched the local build. |
| F-1-2 — 23-word README sentence | Split the feature inventory into two direct sentences. Added the result-naming export/save sentence and refreshed the full copy audit. | `plain-language release copy > uses the reviewed README rewrite and result-naming headings`; `.factory/copy-audit.md`. | `.factory/evidence/polish-1/live-home/screenshot-mobile.png` | `/` returned 200 with the reviewed first-screen wording. |
| F-1-3 — unlisted demo and J/K claims | Added `demo-one-click-isolation` and `heading-key-navigation` to `.factory/claims.json`. Each has exactly one tagged observable test. | `@claim:demo-one-click-isolation opens sample data in one click…`; the packaged-reader test tagged `@claim:heading-key-navigation`. All 16 exact claim commands passed from a clean clone. | `.factory/evidence/polish-1/live-demo/screenshot-mobile.png`; `.factory/evidence/polish-1/extension-reader.png` | `/?demo=1` returned 200; live cold flow opened four messages and J/K behavior passed in the packaged extension test. |
| F-1-4 — generic “Start for real” label | Replaced it with **Exit demo and install extension** and adjacent text: “Clears sample data and opens installation steps.” Exit and reset remove only `demo:` keys. | `@claim:demo-one-click-isolation opens sample data in one click…` asserts both strings and storage cleanup. | `.factory/evidence/polish-1/live-demo/screenshot-mobile.png` | Cold `/?demo=1` check found the label/helper, saved `demo:resume`, reset it, and preserved `real:untouched`. |
| F-1-5 — inconsistent 404 header | Both SPA and static 404 now use the shared header/footer templates with Demo, How it works, and Privacy. Static 404 also gained complete favicon and social metadata. | `unknown routes show the designed 404 page`; `legal routes and the static 404 keep the complete site navigation`. | `.factory/evidence/polish-1/not-found-desktop.png` | `/missing-page` returned HTTP 404 with the three standard header links. |
| F-1-6 — metaphorical headings | Replaced the preview heading with **Preview of a stable transcript** and both 404 headings with **Page not found**. | `the first screen states the job…`; `unknown routes show the designed 404 page`; `plain-language release copy…`. | `.factory/evidence/polish-1/home-mobile.png`; `.factory/evidence/polish-1/not-found-desktop.png` | `/` and `/missing-page` exposed the new headings in cold browser checks. |

## Earlier findings rechecked

| Earlier finding from `.factory/verification.md` | Current evidence |
| --- | --- |
| Streaming refresh destroyed focus | Packaged-reader claim test inserts earlier history, waits for refresh, and asserts focus remains inside the same source message. |
| Hidden content was read | The same test includes `HIDDEN PRIVATE SECRET` under `display:none` and asserts it is absent. |
| Saved places and anchors were position-based | The same test saves “Original B target,” inserts a message before it, and asserts the marker remains on the target. |
| Duplicate visible messages were dropped | The same test asserts both identical visible replies remain as separate records. |
| Unit command failed | `npm run test:unit`: 4/4 passed in two files. |
| Reverse Tab escaped the dialog | Packaged-reader test focuses the dialog title, presses Shift+Tab, and asserts focus wraps to a dialog button. |
| Claim tests covered only the website demo | Core behavior tags execute against the packaged MV3 reader; the fixture grants only the local test origin. |
| Export included source controls | Export assertion contains the source message and excludes controls and hidden text. |
| Skip link did not focus main | `skip link moves keyboard focus to the main landmark` passes at desktop and 390 px. |
| Touch targets were below 44 px | `visible controls meet the 44px touch-target baseline` passes across `/`, demo, Privacy, and Terms at desktop and 390 px. |
| Cache, 404, and AVIF deployment defects | Live unknown route is HTTP 404; live AVIF is `image/avif`; hashed assets return `max-age=31536000, immutable`. |
| Development dependency vulnerabilities | Both full and production-only high-severity audits report zero vulnerabilities. |
| Broad browser permission remained | Superseded and closed by F-1-1; the deployed ZIP manifest was inspected after deployment. |

## Final evidence

- Clean-clone claim gate: all 16 commands in `.factory/claims.json` passed individually.
- Clean-clone suite: 45/45 Playwright tests, 4/4 unit tests, lint/typecheck, build, and both audits passed.
- Accessibility: Playwright Axe found zero serious/critical issues on all site routes at desktop and 390 px, the extension popup, and the reader dialog.
- Privacy/offline: the demo emitted only same-origin requests; storage isolation passed; the packaged reader opened and completed its core flow after the browser context was set offline.
- Performance: local Lighthouse 100/100/100/100; live Lighthouse 98 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.3 s, TBT 0 ms, CLS 0, 86 KiB transfer.
- Packaging: two consecutive ZIP builds produced the same SHA-256, `c6f41e571c76a162c2bda40e424793ad22401e758470497d007bfbbbf0008ca9`.
- Factory URL verifier: home and `/?demo=1` each returned 200 with `lang=en`, one `h1`, `<main>`, no missing alt text, no unnamed buttons, and zero console errors.
- Deployment: final Azure Static Web Apps deployment `cbcea438-c3ff-4cfb-a046-f3b612b0d342`; custom domain returned 200 after upload.

No finding from the cumulative review remains open.
