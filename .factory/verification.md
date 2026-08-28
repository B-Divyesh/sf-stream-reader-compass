# Independent product verification — FAIL

Verified 2026-08-28 against candidate commit `8798729145686f7efe294c7d8ccefe14ee288799` and `https://stream-reader-compass.sociobot.in`.

## Decision

**FAIL. Do not release this candidate.** The deployed artifacts match the candidate, but the real extension breaks the central promise of preserving a screen-reader user's place while a conversation streams. The claim tests pass only because the focus and semantic-record claims are exercised in the website demo rather than against the extension behavior they also promise.

## Release-blocking findings

### High — a streaming update removes focus while announcing that focus stayed put

In a clean Chromium extension profile, I enabled a local fixture origin, opened the reader, focused the second message heading, then appended a fourth message to the source conversation. After the 700 ms observer refresh:

- the reader contained four messages;
- the live region said `1 new message added. Your focus stayed in place.`;
- `shadowRoot.activeElement` was `null`.

The refresh replaces the complete message subtree at `entrypoints/content.ts:99-109`, so a focused message heading, action, or link is destroyed. This directly fails the researched job-to-be-done and the `polite-updates` claim for the shipped extension.

### High — the extension reads hidden page content despite its visible-content boundary

I injected three semantic message nodes before opening the extension: two visible messages and one `display:none` message containing `HIDDEN PRIVATE SECRET`. The reader rendered all three and exposed the hidden secret as message 2. `extractTranscript` queries matching elements and reads `textContent` without checking rendered visibility (`shared/transcript.ts:30-58`).

This contradicts the landing, privacy page, README, and brief statements that the extension reads visible message content only. It also makes the privacy boundary materially broader than described.

### High — saved places and anchors are position-based, not stable

I saved `Original B target`, which was `message-2`, then inserted a new message before the transcript. After the automatic refresh, the yellow saved marker moved to `Original A`; the original target became `message-3`.

IDs are assigned from the current array index (`shared/transcript.ts:54`). The saved value is then reapplied after every full render (`entrypoints/content.ts:99-104`). Loading earlier history, DOM virtualization, or any insertion before the target therefore moves the user's saved place to the wrong message. This fails the `semantic-record` and `resume-marker` promises in the real extension.

### High — not every visible message gets a heading

With three visible semantic messages whose text was `Same visible reply`, `Same visible reply`, and `Different visible reply`, the extension produced two transcript messages. The de-duplication key is only message text (`shared/transcript.ts:40-46`), so legitimate repeated turns are removed. This directly contradicts the listed claim, “Each visible message gets a heading and stable anchor.”

### High — the declared unit-test command fails

`npm run test:unit` exits nonzero. Vitest collects all three Playwright files and reports `Playwright Test did not expect test() to be called here`; zero unit tests run. The repository advertises this script in `package.json:16`, so the requested all-test gate is not green.

### High — keyboard focus can escape the modal reader

The reader initially focuses its programmatic `h1`. Pressing Shift+Tab at that point moved `document.activeElement` to an underlying page link and left `shadowRoot.activeElement` null. The trap at `entrypoints/content.ts:189-203` wraps only when a user is already on the first or last element in its button/link list; it does not handle the initially focused heading. This violates modal focus management for the product's primary audience.

## Other findings

### Medium — claim tests do not prove the shipped extension behavior

`@claim:polite-updates`, `@claim:semantic-record`, `@claim:text-export`, `@claim:copy-controls`, `@claim:link-lists`, and `@claim:resume-marker` operate on `/demo`. Only consent and transcript-storage claims load the MV3 extension, and that extension test checks just the message count and storage. This is why the central focus, hidden-content, duplicate-message, stable-anchor, and noisy-extraction defects all escape the mandatory suite.

The README also contains visitor-reliable claims without matching entries in `.factory/claims.json`, including Escape closing the reader, common-selector detection, the clear empty state, and no analytics/models/remote APIs. This violates the supplied claims contract.

### Medium — extracted and exported messages include the source page's controls

I loaded the distributed extension over the live four-message demo and copied/saved/exported through the real reader. A captured message body included its source folio, heading, `Copy this message`, and `Save my place here` controls. The exported file likewise contained that page chrome. The demo claim tests export their pre-cleaned in-memory sample instead of content extracted by the extension, so they do not catch this degraded real output.

### Medium — the skip link changes the URL but not keyboard focus

On the live 390 px page, the first Tab correctly exposed a designed 3 px focus ring on “Skip to main content.” Activating it changed the URL to `#main`, but `document.activeElement` became `BODY`, not `MAIN`. The target has no focus handling, so keyboard focus does not actually skip to the main landmark.

### Medium — several live touch targets are shorter than 44 px

At 390 px, the preview link was 281×25 px, both demo reference links were 173×17 px and 130×17 px, and privacy/terms email links were 17 px tall. The supplied accessibility and design contracts require at least 44×44 CSS px touch targets.

### Medium — deployment caching and 404 behavior miss the site contract

- Hashed JavaScript, CSS, and image assets return `Cache-Control: public, must-revalidate, max-age=30`, not long-lived immutable caching.
- `GET /missing-page` returns HTTP 200, although the rendered SPA view is a designed 404. This is not a real HTTP 404 response.
- AVIF assets return `Content-Type: application/octet-stream` rather than `image/avif`.

### Medium — development dependencies contain known high/critical vulnerabilities

`npm audit --audit-level=high` reports 12 vulnerabilities: 4 critical, 6 high, and 2 moderate. Affected tools include Vitest, Vite, WXT transitive dependencies, Sharp, and `shell-quote`. `npm audit --omit=dev --audit-level=high` passes with zero production vulnerabilities, so this is a build-chain rather than runtime finding.

### Low — extension permissions are broader than the product's site allow-list

The packaged manifest requests `http://*/*` and `https://*/*` host access and installs a content script on every HTTP(S) page. The extension's own `enabledOrigins` check prevents transcript extraction until enablement, which worked, but browser-level permissions are not granted per site. Optional host permissions or user-triggered script injection would better match the privacy posture.

## Mandatory claims

`.factory/claims.json` exists and contains 12 entries. The commands were first attempted before dependencies were present and correctly could not import `@playwright/test`; after the required clean install with `npm ci`, every exact listed command passed:

| Claim | Result after install |
| --- | --- |
| `local-processing` | PASS — 1 test |
| `semantic-record` | PASS — 1 test |
| `text-export` | PASS — 1 test |
| `copy-controls` | PASS — 1 test |
| `link-lists` | PASS — 1 test |
| `resume-marker` | PASS — 1 test |
| `polite-updates` | PASS — 1 test |
| `pause-updates` | PASS — 1 test |
| `demo-reset` | PASS — 1 test |
| `no-account-free` | PASS — 1 test |
| `site-consent` | PASS — 1 test |
| `no-transcript-storage` | PASS — 1 test |

The passing results do not override the independently reproduced false claims above.

## First-read and demo gate

**PASS.** On a fresh 1440×900 browser page, the first screen says:

- what: “Read streaming chats without losing your place”;
- for whom: “For screen-reader users who need stable headings, links, and copy controls in long browser chats”;
- first action: “Try it with sample data,” with “Opens a private sample transcript” beside it.

The action was visible above the fold. One click opened `/demo`, already populated with four realistic support messages. The persistent banner said “Demo — sample data, nothing is saved” and offered “Reset demo” and “Start for real.”

## Build and automated gates

| Command | Result |
| --- | --- |
| `npm ci` | PASS; 505 packages installed |
| `npm test` | PASS; 29/29 Playwright tests |
| `npm run test:unit` | **FAIL**; 3 suites fail during collection, zero tests run |
| `npx tsc --noEmit` | PASS |
| lint | N/A; no lint command or configuration exists |
| `npm run build` | PASS; extension, ZIP, and `dist/site/` produced |
| `npm audit --omit=dev --audit-level=high` | PASS; 0 production vulnerabilities |
| `npm audit --audit-level=high` | FAIL; 12 development dependency vulnerabilities |

Build output stayed within the supplied budgets: initial site JavaScript is 16.98 KB raw / 5.81 KB gzip plus a 0.71 KB module preload; CSS is 9.99 KB raw / 3.03 KB gzip; there are no downloaded fonts; the 600 px AVIF hero is 24.3 KB. The extension is 24.3 KB unpacked and about 14 KB zipped.

## Live site, accessibility, privacy, and performance

- Fresh desktop and 390×844 Chromium runs covered `/`, `/demo`, `/privacy`, `/terms`, and an unknown route.
- Every rendered route had `lang=en`, one `h1`, one `main`, no horizontal overflow, no console/page errors, and no failed resource requests.
- Axe found zero serious or critical violations on all five routes at both viewport sizes. Axe also found zero serious/critical violations in the extension popup and in the open reader dialog.
- The real reader dialog focused its title on open, closed with Escape, and restored prior page focus. Its reverse-tab trap fails as described above.
- Reduced-motion mode reduced the site message animation to 0.01 ms; the extension disables it.
- During the complete live page/demo load, every request was same-origin. No analytics, remote fonts, third-party scripts, or model/API calls were observed.
- The live CSP, HSTS, `nosniff`, referrer policy, and permissions policy were present. The CSP matched observed loads.
- All documented internal routes and the W3C, MDN, and Param Factory outbound links returned HTTP 200.
- Lighthouse 12.8.2 mobile against the live home page: Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 0.8 s, LCP 1.4 s, TBT 140 ms, CLS 0, total transfer 100 KiB.
- The product has no server-side API, unlock call, sign-in, service worker, or PWA behavior. Rate-limit, Entra authority, API concurrency, and offline-update checks are not applicable.

## Packaged extension and deployment identity

The live ZIP was downloaded, extracted, and loaded into a fresh Chromium profile. Before enablement, `OPEN_READER` returned `Enable the reader for this site first`; after enabling only the live origin it opened four headings. Extension storage contained only the enabled origin until a place was explicitly saved, and no transcript text was stored.

Candidate and live SHA-256 hashes matched for `index.html`, the main JS and CSS, the hero, social image, robots file, and sitemap. The rebuilt and live ZIP container hashes differ because ZIP timestamps are nondeterministic, but hashes of every meaningful inner file checked (`manifest.json`, background script, content script, popup script/CSS/HTML) match exactly. The live deployment therefore contains the candidate implementation; this is not a stale-deployment failure.

## Required repair before re-verification

Preserve focused message/link/action nodes across updates; derive persistent message IDs from stable source identity rather than array position; filter non-rendered/hidden content; retain legitimate duplicate messages; and run those claims against the actual packaged extension. Then repair the unit-test configuration, skip-link focus, touch targets, cache/404 policy, and claims inventory before requesting another verification.
