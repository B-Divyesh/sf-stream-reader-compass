# Adversarial first-read review 3 — Stream Reader Compass

Reviewed 2026-08-28 against `https://stream-reader-compass.sociobot.in` and repository base `09b3b768d49b842a28406e443a596832c0820dfa`.

## Verdict: FAIL

There is one blocking finding, three major findings, and four minor findings. `PASS` requires zero findings and no untested claim.

## Findings

### F-3-1 — BLOCKING — closing a paused reader makes the next reader silently miss updates

**Location:** packaged extension, `entrypoints/content.ts`; listed claim `pause-updates`.

**Exact evidence:** the module-level state starts as `let paused = false`, but neither `openReader()` nor `close()` resets it. In a fresh extension profile I opened a two-message transcript, selected **Pause updates**, closed the reader, reopened it, and inserted a third source message. The reopened toolbar said **Pause updates** and its status said “2 messages ready.” After 1.2 seconds it still showed two messages. The reader was actually paused while presenting itself as active.

The registered command `npm test -- --grep @claim:pause-updates` passes because it tests only the website demo and never closes or reopens the packaged extension.

**Why this fails:** the product can silently omit a streaming reply after an ordinary close/reopen sequence. That breaks the core reading job and makes the listed promise “Pauses transcript updates until you resume them” unreliable: the visitor did not resume a paused session, the UI does not disclose the retained state, and the mandatory test does not exercise the shipped implementation.

**Concrete fix:** reset `paused` and the pause button state whenever the extension reader closes or opens. Add a packaged-extension claim test that pauses, closes, reopens, appends a source message, and confirms that the new message appears. Also test the alternative design if pause is meant to persist: the reopened button must say **Resume updates** and the status must announce the paused state.

### F-3-2 — Major — the advertised keyboard command is an unlisted claim

**Location:** landing “How it works”; README installation steps.

**Exact quotes:** “Press Alt+Shift+R.” and “Select **Open transcript reader** or press Alt+Shift+R.”

**Why this fails:** `.factory/claims.json` has no entry for opening the shipped reader with this command. The manifest declares the command and the source handles it, but no tagged test invokes it and confirms that the reader opens on an enabled site.

**Concrete fix:** add an `open-reader-shortcut` claim and a clean packaged-extension test that enables the fixture origin, invokes Alt+Shift+R, and observes the reader dialog. Otherwise remove the keyboard-command promise.

### F-3-3 — Major — “Chrome-compatible” is an unlisted compatibility claim

**Location:** `README.md`, introduction.

**Exact quote:** “Stream Reader Compass is a free Chrome-compatible extension for screen-reader users.”

**Why this fails:** compatibility is a result a visitor can rely on, but no `claims.json` entry names it. Other tagged tests happen to load a rebuilt extension in Chromium; that is not an inventoried compatibility claim and does not check the downloaded live ZIP as the claim's artifact.

**Concrete fix:** add a `chrome-compatible-package` entry and test that downloads or builds the documented ZIP, loads it in the pinned Chromium version, enables a fixture site, and opens the reader. Alternatively say only “Stream Reader Compass is a free browser extension for screen-reader users.”

### F-3-4 — Major — the demo exit and browser Back lose keyboard focus

**Location:** live demo banner, **Exit demo and install extension**; `site/src/main.ts` and `site/src/templates.ts`.

**Exact evidence:** selecting the exit link navigated to `/#install`, scrolled the install block into view, and left `document.activeElement` on `BODY`. Browser Back returned to `/?demo=1` and again left focus on `BODY`. The link does not use the SPA route handler, so neither transition applies the site's h1 focus behavior.

**Why this fails:** a screen-reader user receives no focused page heading after either direction of this advertised demo path. The site-structure requirement explicitly requires focus on route change and usable Back navigation.

**Concrete fix:** route the exit through the same navigation controller and explicitly focus the destination heading, then make `popstate` restore focus to the demo h1. A dedicated `/install` route with its own h1 would satisfy the route-heading rule most directly. Add forward and Back focus assertions for this exact path.

### F-3-5 — Minor — two message-navigation buttons do not use result-naming verbs

**Location:** website demo and extension reader toolbars.

**Exact labels:** “Previous message” and “Next message”.

**Why this fails:** these are noun phrases. They do not state the action in the verb-first form required for buttons.

**Concrete rewrite:** “Go to previous message” and “Go to next message”.

### F-3-6 — Minor — “reading record” introduces a second term for transcript

**Location:** landing How it works heading; README limit sentence.

**Exact quotes:** “Turn a live chat into a reading record” and “This extension does not summarize, record, or send chat content.”

**Why this fails:** the product otherwise calls the ordered output a **transcript**. “Reading record” makes the reader translate a new term, while “does not … record” can sound as if it contradicts the heading.

**Concrete rewrites:** “How to turn a live chat into a transcript” and “This extension does not summarize or send chat content. It does not save transcript text.”

### F-3-7 — Minor — “polite announcements” is implementation jargon

**Location:** `README.md`, introduction.

**Exact quote:** “New messages use polite announcements and do not move focus.”

**Why this fails:** “polite” is an ARIA live-region setting, not a plain description of what a reader hears.

**Concrete rewrite:** “The reader announces new messages without interrupting you or moving focus.”

### F-3-8 — Minor — the dependency claim uses developer shorthand

**Location:** `README.md`, Develop.

**Exact quote:** “The site uses no runtime dependencies or third-party CDN files.”

**Why this fails:** “runtime dependencies” and “CDN” require implementation knowledge. The underlying privacy result can be stated directly.

**Concrete rewrite:** “The website loads scripts, styles, and fonts only from its own domain.” Keep the existing `site-self-contained` claim and test aligned to that wording.

## Cold first read

Fresh Chromium contexts were used at 390 × 844 and 1440 × 900. Before scrolling, I could answer all three questions:

- **What it does:** turns streaming browser chats into a stable reading view that keeps the reader's place.
- **For whom:** screen-reader users reading long browser chats.
- **What to click first:** **Try it with sample data**, followed by “Opens a private sample transcript.”

The exact first-screen text included “Read streaming chats without losing your place” and “For screen-reader users who need stable headings, links, and copy controls in long browser chats.” The primary action and the three privacy/account/price facts were visible without scrolling at both sizes. This gate passes.

## Copy audit

Counts are whitespace-delimited after removing Markdown formatting. Hyphenated terms, URLs, and keyboard chords count as one word. No sentence exceeds 22 words and no banned marketing adjective appears. Findings F-3-5 through F-3-8 cover the remaining button, jargon, and terminology failures.

### Landing page

| Sentence | Words | Result |
| --- | ---: | --- |
| Read streaming chats without losing your place. | 8 | Pass |
| For screen-reader users who need stable headings, links, and copy controls in long browser chats. | 15 | Pass |
| Opens a private sample transcript. | 5 | Pass |
| Conversation text stays in your browser. | 6 | Pass; `local-processing` |
| No account is needed. | 5 | Pass; `no-account-free` |
| Free to use. | 3 | Pass; `no-account-free` |
| Loose paper strips align into one ordered newspaper column beside a compass needle. | 13 | Pass; image alt text |
| Loose chat fragments become one numbered reading order. | 8 | Pass |
| My checkout button works with a mouse, but keyboard focus disappears after the basket opens. | 15 | Pass; sample content |
| Move focus to the basket heading when it opens. | 9 | Pass; sample content |
| Return focus to the checkout button when it closes. | 9 | Pass; sample content |
| Choose the extension on a chat page. | 7 | Pass |
| Enable that site only. | 4 | Pass; `site-consent` |
| Press Alt+Shift+R. | 2 | **F-3-2** |
| Each visible message gets a heading that stays with that message. | 12 | Pass; `message-headings` |
| Move by heading, save your place, copy a message, or export the transcript. | 13 | Pass |
| Download the ZIP, extract it, then load the folder from your browser's extensions page. | 14 | Pass |
| The extension does not call a model or summarize your words. | 11 | Pass; `no-remote-services` |
| It reads visible message groups only after you enable that site. | 11 | Pass; `site-consent` |
| It stores your enabled sites and saved place. | 8 | Pass; storage disclosure |
| It does not store transcript text. | 6 | Pass; `no-transcript-storage` |
| Read streaming chats without losing your place. | 8 | Pass; footer one-line description |

Headings and controls were also checked out of context. “Turn a live chat into a reading record” is F-3-6. “Previous message” and “Next message” are F-3-5. The remaining headings name their sections, and the remaining actions name their results.

### README

| Sentence or complete instruction | Words | Result |
| --- | ---: | --- |
| Read streaming browser chats without losing your place. | 8 | Pass |
| Stream Reader Compass is a free Chrome-compatible extension for screen-reader users. | 11 | **F-3-3** |
| It turns visible chat messages into a local transcript with lasting message headings, named links, and copy controls. | 17 | Pass |
| You can export the transcript and save your place. | 9 | Pass |
| New messages use polite announcements and do not move focus. | 9 | **F-3-7** |
| Conversation text stays in the browser. | 6 | Pass |
| The extension does not use analytics, accounts, models, or remote APIs. | 11 | Pass |
| Each site must be enabled from the extension popup before the reader works there. | 12 | Pass |
| Open `/?demo=1` or visit `https://stream-reader-compass.sociobot.in/?demo=1`. | 5 | Pass |
| The sample chat opens in one click and uses only `demo:` local storage keys. | 14 | Pass |
| Reset it from the yellow banner. | 6 | Pass |
| Download `stream-reader-compass-chrome.zip` from the site. | 5 | Pass |
| Extract the ZIP. | 3 | Pass |
| Open `chrome://extensions` or `edge://extensions`. | 4 | Pass |
| Turn on developer mode. | 4 | Pass |
| Choose Load unpacked and select the extracted folder. | 8 | Pass |
| Open a browser chat, choose the extension, and select Enable on this site. | 12 | Pass |
| Select Open transcript reader or press Alt+Shift+R. | 7 | **F-3-2** |
| Inside the reader, press J or K to move between message headings. | 12 | Pass; `heading-key-navigation` |
| Escape closes the reader. | 4 | Pass; `escape-close` |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass |
| The exact production command is `npm run build`. | 8 | Pass; verified |
| It creates: | 2 | Pass; introduces the build-output list |
| The site uses no runtime dependencies or third-party CDN files. | 10 | **F-3-8** |
| The generated hero source and prompt are in `assets/src/`. | 9 | Pass; provenance |
| Your enabled sites use Chrome sync storage. | 7 | Pass; storage disclosure |
| Chrome stores each granted site permission. | 6 | Pass; storage disclosure |
| Your saved place uses local extension storage. | 7 | Pass; storage disclosure |
| Transcript text is never stored. | 5 | Pass; `no-transcript-storage` |
| See `/privacy` for the full notice and `/terms` for terms. | 9 | Pass |
| Websites change. | 2 | Pass; limitation |
| If a website changes its chat layout, message detection may need an update. | 13 | Pass; limitation |
| This extension does not summarize, record, or send chat content. | 10 | **F-3-6** |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

README headings are direct and understandable out of context. Its bold installation controls are verb-led. Build-output bullets are fragments naming artifacts rather than sentences.

## Demo and sandbox

The one-click demo gate passes. From the live landing page, one selection opened `/?demo=1` with four realistic keyboard-support messages already visible. The persistent banner said “Demo — sample data, nothing is saved” and exposed **Reset demo** and **Exit demo and install extension**.

In a fresh mobile context, I seeded `real:sentinel=keep`, added the fifth reply, and saved message three. Only `demo:resume` was added. Reset restored four messages, removed `demo:resume`, preserved `real:sentinel`, focused the demo h1, and produced no serious/critical Axe result. Every observed request was same-origin. F-3-4 concerns the exit/Back focus path, not storage isolation.

## Claims audit

All 17 exact commands from `.factory/claims.json` were run separately after `npm ci` in clean clone `/tmp/stream-reader-review3-clean-ZwTiss`:

| Claim id | Result |
| --- | --- |
| `local-processing` | PASS |
| `message-headings` | PASS |
| `text-export` | PASS |
| `copy-controls` | PASS |
| `link-lists` | PASS |
| `resume-marker` | PASS |
| `polite-updates` | PASS |
| `pause-updates` | PASS, but incomplete; **F-3-1** |
| `demo-reset` | PASS |
| `demo-one-click-isolation` | PASS |
| `no-account-free` | PASS |
| `site-consent` | PASS |
| `no-transcript-storage` | PASS |
| `no-remote-services` | PASS |
| `escape-close` | PASS |
| `heading-key-navigation` | PASS |
| `site-self-contained` | PASS |

The live and packaged request logs were same-origin, and the packaged-reader test opened and exercised the reader after its browser context was set offline. The product makes no public offline claim. F-3-2 and F-3-3 are the two unlisted claim-like statements found on the landing page/README. No quantitative claim is untested.

## Earlier findings rechecked

Every numbered finding in reviews 1 and 2 and every defect carried through their polish/handoff history was checked live and in current source or the downloaded extension. The downloaded live ZIP matches the clean build file-for-file.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 broad host permissions | Fixed. The live manifest has no `host_permissions` or automatic `content_scripts`; it uses optional host permissions and user-triggered injection. |
| F-1-2 overlong README introduction | Fixed. The current split sentences contain 17 and 9 words. |
| F-1-3 unlisted demo/J-K claims | Fixed. Both entries exist exactly once and their commands pass. |
| F-1-4 “Start for real” | Fixed. The live result-naming exit text and clearing/install helper remain. |
| F-1-5 inconsistent 404 header | Fixed. The HTTP 404 has the standard three-link header and full footer. |
| F-1-6 metaphorical preview/404 headings | Fixed. The live headings are “Preview of a stable transcript” and “Page not found”. |
| F-2-1 transient contrast failure | Fixed. Only the top rule animates; immediate entry/reset Axe checks found no serious/critical issue. |
| F-2-2 unlisted self-contained-site claim | Fixed. `site-self-contained` exists and passes. |
| F-2-3 subjective first-screen eyebrow | Fixed. It now says “Browser extension for screen-reader users”. |
| F-2-4 “stable anchor” jargon | Fixed. Visitor copy now says the heading stays with the message. |
| F-2-5 inconsistent demo/saved-place/enabled-site terms | Fixed in visitor copy. |
| F-2-6 editorial lore labels | Fixed. Preview, sample transcript, and 404 labels remain direct. |
| F-2-7 detector/adapter jargon | Fixed. The README now states the user-facing layout-change limit. |
| Streaming refresh removed focus | Fixed for an open reader; the packaged-reader insertion test passes. F-3-1 is a separate close/reopen state defect. |
| Hidden content was read | Fixed by rendered-content filtering; packaged and unit tests pass. |
| Saved places were position-based | Fixed by source identity/fingerprint anchors; insertion and reopen tests pass. |
| Duplicate messages were dropped | Fixed; duplicate visible fixture messages remain separate. |
| Unit command failed | Fixed; 4/4 unit tests pass. |
| Reverse Tab escaped the dialog | Fixed; packaged reader wraps focus. |
| Core claims exercised only the website demo | Fixed for the claims named by the earlier defect. The still-demo-only pause test is recorded separately as F-3-1. |
| Export included source controls | Fixed; packaged export excludes controls and hidden text. |
| Skip link did not focus main | Fixed on normal routes. |
| Touch targets were below 44 px | Fixed in the desktop/mobile suite. |
| Cache, AVIF, and HTTP 404 defects | Fixed live: immutable one-year asset caching, `image/avif`, and HTTP 404 were confirmed. |
| Development dependency vulnerabilities | Fixed; clean `npm ci` reports zero vulnerabilities. |

No earlier numbered finding regressed.

## Structure, routing, accessibility, and links

- Home, Demo, Privacy, Terms, and Page not found have route-specific titles under 60 characters, `lang="en"`, one h1, one main, descriptions, canonical URLs, OG/Twitter metadata, SVG favicon, and a 180 px touch icon.
- The social image is a real 1200 × 630 product image. The delivered 404 is designed, returns HTTP 404, and provides a route home.
- Normal SPA navigation and Back focus the new h1. The demo exit/Back exception is F-3-4.
- Every navigable HTTP link across home, demo, legal, and 404 pages returned 200, except the deliberate current 404 document; its same-document `#main` target exists. Mail links are explicit. The ZIP and external W3C, MDN, and Param Factory links returned 200.
- Fresh desktop and mobile pages had no console/page errors, no horizontal overflow, and no serious/critical Axe result. Reduced-motion and 44 px target checks pass in the suite.
- The broadsheet layout, warm paper palette, black rules, yellow saved-place marker, original paper-strip art, square controls, and numbered folios are recognizably product-specific rather than a generic SaaS template.
- First-load JavaScript is 16.96 KB raw / 5.72 KB gzip. Security headers and CSP match observed loads.

## Missed leverage

No missed-leverage finding. Text export is present, enabled-site preferences use browser sync, and remote transcript sync would conflict with the local-first privacy boundary. An AI step is not implied by the reading/navigation job and would conflict with the explicit no-model behavior. No provider key or AI endpoint is embedded.

## Verification summary

- `npm ci`: PASS; zero reported vulnerabilities.
- All 17 exact claim commands: PASS individually, with the coverage defect in F-3-1.
- `npm test`: PASS; 47/47 Playwright tests.
- `npm run test:unit`: PASS; 4/4 tests.
- `npm run lint`: PASS.
- `npm run build`: PASS; extension, ZIP, and `dist/site/` produced.
- Fresh live mobile/desktop request log: same-origin only.
- Fresh live link crawl, metadata, storage isolation, reset, immediate Axe, headers, and downloaded-manifest checks: completed as described above.
- Additional packaged-extension pause/close/reopen probe: FAIL; F-3-1.

## What would make this perfect

Reset or accurately restore pause state across reader sessions and test that claim against the packaged extension. Inventory and test the keyboard command and Chrome compatibility claims. Preserve focus through the demo exit and browser Back path. Replace the two noun-only navigation buttons, standardize **transcript**, and rewrite the two README jargon phrases. Then rerun this full checklist from a fresh context; only zero findings should produce `PASS`.
