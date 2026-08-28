# Adversarial first-read review 1 — Stream Reader Compass

Reviewed 2026-08-28 against `https://stream-reader-compass.sociobot.in` and repository commit `14b6af72038c7af6f00f88196a87138a2b406b2f`.

## Verdict: FAIL

There is one blocking finding and five minor findings. `PASS` requires zero findings.

## Cold read

Fresh, logged-out Chromium contexts were used at 390 × 844 and 1440 × 900. Before scrolling, the first screen communicated:

- **What it does:** turns a long streaming browser chat into a stable transcript so the reader does not lose their place.
- **For whom:** screen-reader users reading long browser chats.
- **What to click first:** **Try it with sample data**, which says it opens a private sample transcript.

This part passes. The exact first-screen text is: “Read streaming chats without losing your place”; “For screen-reader users who need stable headings, links, and copy controls in long browser chats.”; and “Try it with sample data” / “Opens a private sample transcript.” The action was visible without scrolling at both sizes.

## Findings

### F-1-1 — BLOCKING — the earlier broad-host-permissions finding is still unfixed

**Location:** downloaded live `stream-reader-compass-chrome.zip`, `manifest.json`; source `wxt.config.ts`.

**Exact evidence:**

```json
"host_permissions":["http://*/*","https://*/*"]
```

The live manifest also injects the content script on `"http://*/*"` and `"https://*/*"`.

**Why this fails:** The prior independent verification recorded this as “extension permissions are broader than the product's site allow-list.” The current extension still receives browser-level access and runs its content script on every HTTP(S) page before a visitor has enabled any site. The in-script `enabledOrigins` guard stops reader extraction, but it does not make browser permission per-site. That does not meet the brief's explicit per-site enablement/privacy boundary and is an unfixed earlier finding; under this review's history rule it is blocking again.

**Concrete fix:** remove universal `host_permissions`/universal `content_scripts`. Use `optional_host_permissions` plus a user-visible permission request for the current origin when **Enable on this site** is selected, then inject the script with `chrome.scripting` only for granted origins. Add a tagged extension test that checks the manifest permissions and verifies no content script is present on an unenabled origin.

### F-1-2 — Minor — README copy exceeds the 22-word hard limit

**Location:** `README.md`, introduction.

**Exact text:** “It turns visible chat messages into a local transcript with headings, stable anchors, link lists, copy controls, text export, and a saved place.” (23 words)

**Why this fails:** The required plain-words cap is 22 words. This packs the product's full feature inventory into a first-paragraph sentence, which makes a cold read denser than necessary.

**Concrete rewrite:** “It turns visible chat messages into a local transcript with headings, stable anchors, link lists, and copy controls. You can export the transcript and save your place.”

### F-1-3 — Minor — README makes behavioural promises without matching claim entries

**Location:** `README.md`, “Try the sandbox” and “Install the packaged extension”.

**Exact text:** “The sample chat is ready in one click and uses only `demo:` local storage keys.” and “Inside the reader, press J or K to move between message headings.”

**Why this fails:** Both are visitor-reliable behaviours, but neither has its own entry in `.factory/claims.json` nor a test tagged with a matching claim id. The existing `demo-reset` test checks cleanup, and an untagged accessibility test checks J/K, but the claims contract requires every relied-on claim to be listed and tested from the specified sandbox.

**Concrete fix:** add `demo-one-click-isolation` (fresh context, enter `/demo`, assert four messages and only `demo:` keys through save/reset) and `heading-key-navigation` (fresh extension reader, press J/K and assert focus movement) to `claims.json`, then tag their observable Playwright tests. Alternatively, remove these promises from README.

### F-1-4 — Minor — “Start for real” does not name its result

**Location:** live `/demo` persistent banner.

**Exact text:** “Start for real”.

**Why this fails:** The control actually discards the demo and takes the visitor to installation instructions. “Start for real” does not say either result, so it is a generic action label rather than a result-naming verb.

**Concrete rewrite:** “Exit demo and install extension”, with adjacent helper text “Clears sample data and opens installation steps.”

### F-1-5 — Minor — the delivered 404 has a different header from normal routes

**Location:** live `/missing-page` (HTTP 404); `site/404.html`.

**Exact evidence:** normal routes expose **Demo**, **How it works**, and **Privacy**. The static 404 source contains only `<a href="/demo">Demo</a><a href="/privacy">Privacy</a>`.

**Why this fails:** The structure contract requires a consistent header on every route. A visitor following a bad link loses the normal “How it works” navigation even though the styled 404 otherwise renders correctly.

**Concrete fix:** generate the 404 header from the same header template, or add the same wordmark, Demo, How it works, and Privacy links to `site/404.html`.

### F-1-6 — Minor — two headings are metaphorical rather than self-explanatory

**Location:** landing preview and live 404.

**Exact text:** “A transcript that holds still” and “This page is off the record”.

**Why this fails:** Heard alone in a heading list, neither says what section/page it is. The first relies on a metaphor for stability; the second makes a missing-page state less direct.

**Concrete rewrites:** “Preview of a stable transcript” and “Page not found”.

## Copy audit

Word counts treat a hyphenated term as one word. Headings and button labels without sentence punctuation are assessed in the findings where relevant; the tables below list every prose sentence on the landing page and README.

### Landing page

| Sentence | Words | Result |
| --- | ---: | --- |
| Read streaming chats without losing your place. | 8 | Pass |
| For screen-reader users who need stable headings, links, and copy controls in long browser chats. | 15 | Pass |
| Opens a private sample transcript. | 5 | Pass |
| Conversation text stays in your browser. | 6 | Pass; `local-processing` |
| No account is needed. | 5 | Pass; `no-account-free` |
| Free to use. | 3 | Pass; `no-account-free` |
| Loose chat fragments become one numbered reading order. | 8 | Pass |
| My checkout button works with a mouse, but keyboard focus disappears after the basket opens. | 15 | Pass |
| Move focus to the basket heading when it opens. | 9 | Pass |
| Return focus to the checkout button when it closes. | 9 | Pass |
| Choose the extension on a chat page. | 7 | Pass |
| Enable that site only. | 4 | Pass |
| Press Alt+Shift+R. | 2 | Pass |
| Each visible message gets a heading and stable anchor. | 9 | Pass; `semantic-record` |
| Move by heading, save your place, copy a message, or export the transcript. | 13 | Pass |
| Download the ZIP, extract it, then load the folder from your browser's extensions page. | 14 | Pass |
| The extension does not call a model or summarize your words. | 11 | Pass; `no-remote-services` |
| It reads visible message groups only after you enable that site. | 11 | Pass; `site-consent` |
| It stores the enabled site list and your resume marker. | 10 | Pass |
| It does not store transcript text. | 6 | Pass; `no-transcript-storage` |
| Read streaming chats without losing your place. | 8 | Pass |

No landing sentence exceeds 22 words or uses a banned marketing adjective. Terms are generally consistent: **reader**, **transcript**, **message**, **saved place**, **enabled site**, and **demo**. F-1-4 and F-1-6 are the remaining label/heading issues.

### README

| Sentence or complete instruction | Words | Result |
| --- | ---: | --- |
| Read streaming browser chats without losing your place. | 8 | Pass |
| Stream Reader Compass is a free Chrome-compatible extension for screen-reader users. | 11 | Pass |
| It turns visible chat messages into a local transcript with headings, stable anchors, link lists, copy controls, text export, and a saved place. | 23 | **F-1-2** |
| New messages use polite announcements and do not move focus. | 9 | Pass; `polite-updates` |
| Conversation text stays in the browser. | 6 | Pass; `local-processing` |
| The extension does not use analytics, accounts, models, or remote APIs. | 11 | Pass; `no-account-free` / `no-remote-services` |
| Each site must be enabled from the extension popup before the reader works there. | 12 | Pass; `site-consent` |
| Open `/demo` or visit the demo URL. | 7 | Pass |
| The sample chat is ready in one click and uses only `demo:` local storage keys. | 15 | **F-1-3** |
| Reset it from the yellow banner. | 6 | Pass |
| Download `stream-reader-compass-chrome.zip` from the site. | 5 | Pass |
| Extract the ZIP. | 3 | Pass |
| Open `chrome://extensions` or `edge://extensions`. | 4 | Pass |
| Turn on developer mode. | 5 | Pass |
| Choose **Load unpacked** and select the extracted folder. | 8 | Pass |
| Open a browser chat, choose the extension, and select **Enable on this site**. | 12 | Pass |
| Select **Open transcript reader** or press Alt+Shift+R. | 8 | Pass |
| Inside the reader, press J or K to move between message headings. | 12 | **F-1-3** |
| Escape closes the reader. | 4 | Pass; `escape-close` |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass |
| The exact production command is `npm run build`. | 8 | Pass |
| It creates: | 2 | Pass |
| The site uses no runtime dependencies or third-party CDN files. | 10 | Pass; supported by network check |
| The generated hero source and prompt are in `assets/src/`. | 9 | Pass |
| Enabled origins use extension sync storage. | 6 | Pass |
| A saved message identifier uses local extension storage. | 8 | Pass |
| Transcript text is never stored. | 5 | Pass; `no-transcript-storage` |
| See `/privacy` for the full notice and `/terms` for terms. | 9 | Pass |
| Websites change. | 2 | Pass |
| The generic detector may need a new adapter for a changed chat layout. | 12 | Pass; limitation, not a promise |
| This extension does not summarize, record, or send chat content. | 10 | Pass; `no-remote-services` / `no-transcript-storage` |
| MIT. | 1 | Pass |
| See [LICENSE](LICENSE). | 2 | Pass |

## Demo and sandbox

**Pass.** From the landing page, one click on **Try it with sample data** opened `/demo`, already showing four concrete keyboard-access support-chat messages and link lists. The persistent banner read “Demo — sample data, nothing is saved” and supplied **Reset demo** and **Start for real**.

In a fresh live context, the demo began with no local-storage keys; saving a place and adding a reply produced only `demo:resume`; **Reset demo** restored four messages and removed all `demo:` keys. The request log contained only the product origin and its own JS/CSS. No real extension storage was read or written by the demo. F-1-4 is a copy issue, not a sandbox isolation failure.

## Claims

`.factory/claims.json` contains 14 entries. After `npm ci`, each exact listed `npm test -- --grep @claim:<id>` command was run from this clean dependency state and passed:

| Claim id | Result |
| --- | --- |
| local-processing | PASS |
| semantic-record | PASS |
| text-export | PASS |
| copy-controls | PASS |
| link-lists | PASS |
| resume-marker | PASS |
| polite-updates | PASS |
| pause-updates | PASS |
| demo-reset | PASS |
| no-account-free | PASS |
| site-consent | PASS |
| no-transcript-storage | PASS |
| no-remote-services | PASS |
| escape-close | PASS |

The full `npm test` suite also passed (34 Playwright tests); `npm run test:unit`, `npm run typecheck`, `npm run lint`, and `npm run build` passed. The first combined quality-gate invocation had a transient demo-download failure while another Playwright loop was active; the test passed immediately in isolation and the subsequent full suite passed, so it is not recorded as a product failure.

## Structure, routing, accessibility, and links

Normal live routes `/`, `/demo`, `/privacy`, and `/terms` each loaded with the correct route title, one `h1`, one `main`, `lang="en"`, description, canonical URL, favicon, OG/Twitter metadata, no console errors, and no horizontal overflow at 390 px. Browser back navigation restored the route and focused its `h1`; the skip link moved focus to `main`. The normal internal/download links and the linked Param Factory, W3C, and MDN pages returned successfully; mail links are explicit `mailto:` links.

The real HTTP 404 has a designed page and a way home. Its title, metadata, and visible page are correct after JavaScript loads; F-1-5 and F-1-6 record its remaining header/copy defects. The broadsheet visual system is distinct from a generic SaaS template and matches `.factory/design.md`. No missed AI, import/export, or sync feature was found: copy and text export are present, and the brief does not imply an AI step or remote sync.

## Earlier-review history check

Every finding from `.factory/verification.md`, `.factory/verification-2.md`, and the prior handoff was rechecked in the live code/site rather than accepted from its status marker.

| Earlier finding | Confirmation |
| --- | --- |
| Streaming refresh destroyed focus | Fixed: `captureMessageFocus` / `restoreMessageFocus`; extension claim test passes. |
| Hidden content was read | Fixed: `isRendered` filters hidden ancestors; extension test excludes the hidden fixture. |
| Anchors were position-based | Fixed for tested source/message identities; extension test retains the saved unique message after an insertion. |
| Duplicate messages were dropped | Fixed: duplicate visible fixture messages remain separate. |
| Unit command failed | Fixed: `npm run test:unit` passes 2 tests. |
| Modal reverse-Tab escaped | Fixed: initial title is included in the focus trap; extension claim test passes. |
| Claims exercised only the website demo | Fixed for core reader behaviours: current tagged extension test opens the packaged extension and checks records, copy/export, resume, update focus, links, and Escape. |
| Export contained page controls | Fixed: extension export fixture excludes source control text. |
| Skip link did not focus main | Fixed: live and automated check focus `main`. |
| Touch targets were under 44 px | Fixed: live mobile automated check passes. |
| Cache/404/AVIF deployment issues | Fixed: live unknown route returns 404; current deployed asset checks passed in the earlier verification. |
| Development high/critical audit findings | Fixed in this clean install: `npm ci` reports zero vulnerabilities. |
| Broad extension host permissions | **Unfixed: F-1-1.** |

## What would make this perfect

Request browser permission only for sites the visitor explicitly enables; then remove the three remaining copy/claim gaps and make the 404 use the exact normal header and plain-language heading. Re-run all claim commands, the full Playwright suite, and a fresh downloaded-manifest inspection after that change.
