# Perfection-loop polish 3

Completed 2026-08-28 against review commit `2f820e2e4c2d3a3aa58f8e991d5aa3e454f77ddf`. Deployment: `7f9b24c6-c358-4a49-b189-b645ddbea284` at <https://stream-reader-compass.sociobot.in>.

## Round 3 finding map

| Finding | Change made | Automated evidence | Screenshot and live check |
| --- | --- | --- | --- |
| F-3-1 — pause survives close | `openReader()` and `close()` now reset pause state. The `pause-updates` claim moved from the website-only demo test to the packaged MV3 reader test, which pauses, closes, reopens, appends a source message, and observes it. | `@claim:pause-updates` in `preserves real-reader records and focus while a page streams`; passed alone and in the 52-test suite. | `.factory/evidence/polish-3/live-extension-reader.png`; the downloaded live ZIP reopened with **Pause updates**, then showed five messages and “1 new message added.” |
| F-3-2 — untested Alt+Shift+R promise | Removed the keyboard-command promise from the landing page, install instructions, and README. The extension may still expose its manifest shortcut, but public instructions now name the tested popup action. | `plain-language release copy` rejects the old sentence; `.factory/claims.json` inventory guard confirms each remaining claim has one tag. | `.factory/evidence/polish-3/live-home/screenshot-mobile.png` and `live-install/screenshot-mobile.png`; `/` and `/install` contain only **Open transcript reader** instructions. |
| F-3-3 — untested Chrome compatibility promise | Replaced “Chrome-compatible extension” with “browser extension.” Kept concrete Chrome/Edge unpacked-install steps without a blanket compatibility promise. Added a non-claim smoke test that extracts the documented ZIP and loads its popup in pinned Chromium. | `the documented ZIP loads in the pinned Chromium browser`; `plain-language release copy`. | `.factory/evidence/polish-3/live-install/screenshot-mobile.png`; live ZIP SHA-256 matched local: `3cde1dfcc220f2c112421122b4fcc9b1f821ca4e90b3c8514238771da08c1a01`. |
| F-3-4 — demo exit and Back lose focus | Added a real `/install` route with its own title, canonical URL, h1, content, sitemap entry, and SWA rewrite. Demo exit uses SPA navigation; forward and Back focus their route h1 and announce the title. Demo keys are cleared while non-demo keys remain. | `exiting the demo and going Back both move focus to the route heading` passes at desktop and 390 px; route metadata and navigation tests include `/install`. | `.factory/evidence/polish-3/live-demo/screenshot-mobile.png` and `live-install/screenshot-mobile.png`; cold live run recorded `exitFocus: Install the extension` and `backFocus: Read this conversation in order`. |
| F-3-5 — noun-only message buttons | Renamed both website and extension controls to **Go to previous message** and **Go to next message**. | `plain-language release copy`; full browser suite. | `.factory/evidence/polish-3/live-demo/screenshot-mobile.png` and `live-extension-reader.png`; both labels are present live. |
| F-3-6 — “reading record” term conflict | Rewrote the heading as **How to turn a live chat into a transcript**. README now says the extension does not summarize or send content and does not save transcript text. | `plain-language release copy`; `.factory/copy-audit.md`. | `.factory/evidence/polish-3/live-home/screenshot-mobile.png`; live `/` contains “transcript” and no “reading record.” |
| F-3-7 — “polite announcements” jargon | Rewrote README copy as “The reader announces new messages without interrupting you or moving focus.” | `plain-language release copy`; `@claim:polite-updates`. | `.factory/evidence/polish-3/live-extension-reader.png`; the live reader reports the new message without moving focus. |
| F-3-8 — dependency/CDN jargon | Rewrote the claim as “The website loads scripts, styles, and fonts only from its own domain,” and aligned `site-self-contained`. | `@claim:site-self-contained` records landing/demo requests and rejects off-origin assets. | `.factory/evidence/polish-3/live-home/screenshot-mobile.png`; cold live request log contained no off-origin request. |

## Earlier numbered findings rechecked

| Finding | Preserved change | Evidence and live check |
| --- | --- | --- |
| F-1-1 | Optional host permissions and explicit per-site injection remain; there are no automatic content scripts or required host permissions. | `@claim:site-consent`; live ZIP manifest inspection; `.factory/evidence/polish-3/live-extension-reader.png`. |
| F-1-2 | README feature inventory remains split into short sentences. | `plain-language release copy`; `.factory/copy-audit.md`; live home screenshot. |
| F-1-3 | Demo isolation and J/K behavior remain listed once and tested against their real surfaces. | `@claim:demo-one-click-isolation`; `@claim:heading-key-navigation`; live demo screenshot. |
| F-1-4 | Banner keeps **Exit demo and install extension** plus its clearing/install result. | `@claim:demo-one-click-isolation`; live demo screenshot and cold exit check. |
| F-1-5 | SPA and static 404 retain Demo, How it works, Privacy, and the full footer. | `unknown routes show the designed 404 page`; `install, legal, and static 404 routes keep the complete site navigation`; `.factory/evidence/polish-3/live-404/screenshot-mobile.png`; live unknown route returned 404. |
| F-1-6 | Preview and missing-page headings remain **Preview of a stable transcript** and **Page not found**. | `the first screen states the job, audience, action, outcome, and three facts`; 404 test; live home/404 screenshots. |
| F-2-1 | Only the rule animates; text opacity stays at 1 during demo entry/reset. | `demo text keeps full contrast immediately after entry and reset`; axe CLI reported zero live violations; live demo screenshot. |
| F-2-2 | The self-contained-site statement remains an inventoried claim with a same-origin request test. | `@claim:site-self-contained`; cold live request list was empty for off-origin requests. |
| F-2-3 | First-screen eyebrow remains **Browser extension for screen-reader users**. | `the first screen states the job, audience, action, outcome, and three facts`; live home screenshot. |
| F-2-4 | Visitor copy says each heading stays with its message. | `@claim:message-headings`; live home screenshot. |
| F-2-5 | Copy consistently uses **demo**, **saved place**, and **enabled site**. | `.factory/copy-audit.md`; demo isolation and resume claim tests; live demo screenshot. |
| F-2-6 | Preview, demo, and 404 labels identify their content directly. | `plain-language release copy`; live home/demo/404 screenshots. |
| F-2-7 | README describes website layout changes and message detection in user terms. | `plain-language release copy`; `.factory/copy-audit.md`; source check at pushed commit. |

## Earlier unnumbered findings rechecked

The packaged reader test still covers focus-preserving streamed updates, hidden-content filtering, identity-based saved places, duplicate messages, clean copy/export, reverse-Tab containment, Escape close, and no transcript storage or remote requests. The site suite still covers real skip-link focus, 44 px targets, reduced motion, route metadata, legal links, mobile overflow, cache policy, AVIF MIME, and real HTTP 404 behavior. Both dependency audits report zero vulnerabilities.

## Verification evidence

- Clean clone: `/tmp/stream-reader-compass-polish3-clean-L7Uhyc`.
- Every one of the 17 exact commands in `.factory/claims.json` passed separately after `npm ci`.
- Clean-clone `npm test`: 52/52 passed across desktop and 390 px mobile.
- `npm run test:unit`: 5/5 passed; `npm run typecheck`, `npm run lint`, and `npm run build` passed.
- `npm audit --audit-level=high` and `npm audit --omit=dev --audit-level=high`: zero vulnerabilities.
- Standalone axe CLI 4.10.3: zero violations on live `/`, `/?demo=1`, `/install`, `/privacy`, and `/terms`.
- Live Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.2 s, TBT 0 ms, CLS 0, transfer 87 KiB.
- Initial site assets: 18.11 KB JS raw / 5.93 KB gzip, 10.59 KB CSS raw / 3.15 KB gzip, no web fonts, 19.75 KB mobile AVIF.
- Live headers: restrictive CSP, HSTS, `nosniff`, referrer policy, permissions policy, immutable one-year asset caching, and `image/avif` MIME.
- Link crawl: all internal, download, W3C, MDN, and Param Factory HTTP links returned 200; mail links use `mailto:`.
- Factory verifier evidence: `.factory/evidence/polish-3/live-{home,demo,install,privacy,terms}/`.

No finding from reviews 1–3 or the earlier verification reports remains open.
