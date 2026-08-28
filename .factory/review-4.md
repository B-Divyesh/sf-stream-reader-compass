# Adversarial first-read review 4 — Stream Reader Compass

Reviewed 2026-08-28 against <https://stream-reader-compass.sociobot.in> and repository base `d587207bd40225d8e830fc78ef1695b0540f3e78`.

## Verdict: FAIL

There are two major claim-inventory findings and two minor copy findings. No listed claim test failed, but `PASS` requires zero findings and no untested public claim.

## Findings

### F-4-1 — Major — disabling site access is an unlisted privacy claim

**Exact quote/location:** live `/privacy`, under **Your controls**: “Disable a site from the extension popup to remove its access.”

**Why this fails:** this is a privacy result a visitor can rely on. `.factory/claims.json` has no claim for disabling a site, and `@claim:site-consent` only proves rejection before enablement and operation after test setup enables an origin. It never disables an origin or confirms that the optional browser permission and sync entry are removed. Source code calls `chrome.permissions.remove`, but source inspection is not the required sandbox test.

**Concrete fix:** add a `site-disable-removes-access` claim at the privacy notice. Test the packaged extension by enabling a fixture origin through the popup, disabling it, and asserting all three results: the origin leaves `enabledOrigins`, `chrome.permissions.contains` is false, and the reader cannot be injected or opened. Alternatively, remove the sentence.

### F-4-2 — Major — uninstall data deletion is an unlisted privacy claim

**Exact quote/location:** live `/privacy`, under **Your controls**: “Remove the extension to delete its local data.”

**Why this fails:** this promises deletion of saved places and other device-local extension data, but no claim entry or uninstall test covers it. A visitor deciding how to erase data should not have to rely on an unverified browser assumption.

**Concrete fix:** add an `uninstall-deletes-extension-data` claim and a clean browser-profile test that writes local extension data, removes the packaged extension, reinstalls it, and confirms the local data is absent. If the browser cannot support a deterministic sandbox test, remove the sentence and document only the deletion controls the product can prove.

### F-4-3 — Minor — a landing heading is too generic out of context

**Exact quote/location:** landing page, step 3 heading: “Read and act”.

**Why this fails:** a screen-reader heading list does not reveal what “act” means. The phrase could label almost any product and does not name the transcript operations in its section.

**Concrete rewrite:** “Navigate, save, copy, or export”.

### F-4-4 — Minor — the hero caption uses a metaphor instead of the product result

**Exact quote/location:** landing hero figure caption: “Loose chat fragments become one numbered reading order.”

**Why this fails:** “loose chat fragments” continues the paper-collage metaphor. It makes the visitor translate visual lore into behavior even though the concrete result is simple.

**Concrete rewrite:** “The reader numbers visible chat messages in their page order.” Add or align a claim test if this wording is retained as a behavioral promise.

## Cold first read

Fresh Chromium contexts were opened at 390 × 844 and 1440 × 900 without stored state. Before scrolling, I could answer all three required questions:

- **What it does:** turns a streaming browser chat into a transcript that keeps the reader's place.
- **For whom:** screen-reader users reading long browser chats.
- **What to click first:** **Try it with sample data**, which says it opens a private sample transcript.

The exact first-screen text was “Read streaming chats without losing your place”; “For screen-reader users who need stable headings, links, and copy controls in long browser chats.”; and “Try it with sample data” / “Opens a private sample transcript.” The three facts—conversation text stays in the browser, no account, and free use—were also fully visible without scrolling at both sizes. This gate passes.

## Copy audit

Counts are whitespace-delimited after removing Markdown formatting. Hyphenated terms, URLs, and keyboard chords count as one word. The landing average is 8.6 words across 22 sentences; the README average is 7.7 across 36 sentence-like instructions. No sentence exceeds 22 words and no banned marketing adjective appears.

### Landing page sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Read streaming chats without losing your place. | 7 | Pass; direct headline. |
| For screen-reader users who need stable headings, links, and copy controls in long browser chats. | 15 | Pass; audience and result. |
| Opens a private sample transcript. | 5 | Pass; `demo-one-click-isolation` / `local-processing`. |
| Conversation text stays in your browser. | 6 | Pass; `local-processing`. |
| No account is needed. | 4 | Pass; `no-account-free`. |
| Free to use. | 3 | Pass; `no-account-free`. |
| Loose paper strips align into one ordered newspaper column beside a compass needle. | 13 | Pass as descriptive image alt text. |
| Loose chat fragments become one numbered reading order. | 8 | **F-4-4**; metaphorical caption. |
| My checkout button works with a mouse, but keyboard focus disappears after the basket opens. | 15 | Pass; sample content. |
| Move focus to the basket heading when it opens. | 9 | Pass; sample content. |
| Return focus to the checkout button when it closes. | 9 | Pass; sample content. |
| Choose the extension on a chat page. | 7 | Pass; setup instruction. |
| Enable that site only. | 4 | Pass; `site-consent`. |
| Select Open transcript reader. | 4 | Pass; setup instruction. |
| Each visible message gets a heading that stays with that message. | 11 | Pass; `message-headings`. |
| Move by heading, save your place, copy a message, or export the transcript. | 13 | Pass; navigation, resume, copy, and export claims. |
| Download the ZIP, extract it, then load the folder from your browser's extensions page. | 14 | Pass; installation instruction. |
| The extension does not call a model or summarize your words. | 11 | Pass; `no-remote-services`. |
| It reads visible message groups only after you enable that site. | 11 | Pass; `site-consent`. |
| It stores your enabled sites and saved place. | 8 | Pass; storage disclosure confirmed by the packaged-reader tests. |
| It does not store transcript text. | 6 | Pass; `no-transcript-storage`. |
| Read streaming chats without losing your place. | 7 | Pass; footer description. |

### README sentences and complete instructions

| Sentence or instruction | Words | Result |
| --- | ---: | --- |
| Read streaming browser chats without losing your place. | 8 | Pass. |
| Stream Reader Compass is a free browser extension for screen-reader users. | 11 | Pass; audience / `no-account-free`. |
| It turns visible chat messages into a local transcript with lasting message headings, named links, and copy controls. | 18 | Pass; listed feature claims. |
| You can export the transcript and save your place. | 9 | Pass; `text-export` / `resume-marker`. |
| The reader announces new messages without interrupting you or moving focus. | 11 | Pass; `polite-updates`. |
| Conversation text stays in the browser. | 6 | Pass; `local-processing`. |
| The extension does not use analytics, accounts, models, or remote APIs. | 11 | Pass; `no-account-free` / `no-remote-services`. |
| Each site must be enabled from the extension popup before the reader works there. | 14 | Pass; `site-consent`. |
| Open `/?demo=1` or visit <https://stream-reader-compass.sociobot.in/?demo=1>. | 5 | Pass; demo instruction. |
| The sample chat opens in one click and uses only `demo:` local storage keys. | 14 | Pass; `demo-one-click-isolation`. |
| Reset it from the yellow banner. | 6 | Pass; `demo-reset`. |
| Download `stream-reader-compass-chrome.zip` from the site. | 5 | Pass; install instruction. |
| Extract the ZIP. | 3 | Pass. |
| Open `chrome://extensions` or `edge://extensions`. | 4 | Pass; install instruction. |
| Turn on developer mode. | 4 | Pass. |
| Choose Load unpacked and select the extracted folder. | 8 | Pass. |
| Open a browser chat, choose the extension, and select Enable on this site. | 13 | Pass; `site-consent`. |
| Select Open transcript reader. | 4 | Pass. |
| Inside the reader, press J or K to move between message headings. | 12 | Pass; `heading-key-navigation`. |
| Escape closes the reader. | 4 | Pass; `escape-close`. |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass; development requirement. |
| The exact production command is `npm run build`. | 8 | Pass; verified in the clean clone. |
| It creates: | 2 | Pass as the introduction to the artifact list. |
| The website loads scripts, styles, and fonts only from its own domain. | 12 | Pass; `site-self-contained`. |
| The generated hero source and prompt are in `assets/src/`. | 9 | Pass; files exist and provenance is recorded. |
| Your enabled sites use Chrome sync storage. | 7 | Pass; verified in the packaged extension. |
| Chrome stores each granted site permission. | 6 | Pass; permission design inspected in the live package. |
| Your saved place uses local extension storage. | 7 | Pass; `resume-marker`. |
| Transcript text is never stored. | 5 | Pass; `no-transcript-storage`. |
| See `/privacy` for the full notice and `/terms` for terms. | 10 | Pass; both links return 200. |
| Websites change. | 2 | Pass; limitation. |
| If a website changes its chat layout, message detection may need an update. | 13 | Pass; limitation. |
| This extension does not summarize or send chat content. | 9 | Pass; `no-remote-services`. |
| It does not save transcript text. | 6 | Pass; `no-transcript-storage`. |
| MIT. | 1 | Pass; `LICENSE` exists. |
| See `[LICENSE](LICENSE)`. | 2 | Pass; repository link resolves. |

The three build-output bullets are noun fragments naming paths and artifacts, not sentences. They were checked against the successful build.

### Headings, terms, and controls

Landing headings are direct except **Read and act** (F-4-3). The remaining headings identify the job, transcript preview, setup steps, installation, or page-reading boundary. README headings—**Try the demo**, **Install the packaged extension**, **Develop**, **Privacy and limits**, and **License**—make sense out of context.

Visitor terminology is consistent: **reader**, **transcript**, **message**, **saved place**, **enabled site**, and **demo**. Public copy contains none of the earlier “sandbox,” “resume marker,” “reading record,” “polite announcements,” dependency/CDN shorthand, broad compatibility wording, or keyboard-command promise.

All landing and demo controls use result-naming verbs: **Try it with sample data**, **Open the working transcript demo**, **Download extension ZIP**, **Read the full privacy notice**, **Reset demo**, **Exit demo and install extension**, **Copy all messages**, **Export text file**, **Go to previous message**, **Go to next message**, **Add sample reply**, **Pause updates**, **Copy this message**, and **Save my place here**.

## Demo and sandbox

The demo gate passes at both viewports.

- One click from the cold landing page opened `/?demo=1` with four realistic keyboard-support messages already rendered.
- The persistent banner said “Demo — sample data, nothing is saved” and exposed **Reset demo** and **Exit demo and install extension**.
- A seeded `real:sentinel=keep` value survived entry, save, reset, exit, and Back.
- Saving message three created only `demo:resume=sample-3`; adding a reply created no additional key.
- Reset restored four messages, removed `demo:resume`, focused the demo h1, and retained the seeded real key.
- Exit removed demo state, focused **Install the extension**, and Back focused **Read this conversation in order** with a fresh four-message sample.
- The complete landing/demo interaction emitted only same-origin requests. There were no console or page errors.
- Immediate message opacity was `1`; immediate Axe checks found no serious or critical issue.

## Claims audit

Clean clone: `/tmp/stream-reader-compass-review4-clean-fVvbwv` at `d587207bd40225d8e830fc78ef1695b0540f3e78`. After `npm ci`, every exact command in `.factory/claims.json` was run separately.

| Claim id | Result | Observable evidence |
| --- | --- | --- |
| `local-processing` | PASS | Packaged reader ran offline; request observer found no remote request. |
| `message-headings` | PASS | One heading per visible fixture message; saved target stayed with its source after insertion. |
| `text-export` | PASS | Download contained fixture messages and source link, without source controls. |
| `copy-controls` | PASS | One-message and all-message clipboard contents were inspected. |
| `link-lists` | PASS | Named WAI-ARIA source link retained its URL. |
| `resume-marker` | PASS | Saved message survived insertion, close, and reopen. |
| `polite-updates` | PASS | Streamed reply appeared without moving focused message content. |
| `pause-updates` | PASS | Pause reset on close/reopen and the next streamed message appeared. |
| `demo-reset` | PASS | Four messages restored and all demo keys removed. |
| `demo-one-click-isolation` | PASS | One-click URL, four messages, demo-only storage, and real-key preservation passed. |
| `no-account-free` | PASS | Complete demo contained no account/payment fields and exposed the free copy. |
| `site-consent` | PASS | Shipped manifest had optional permissions only; no receiver existed before test enablement. |
| `no-transcript-storage` | PASS | Local and sync extension stores contained no sample transcript text. |
| `no-remote-services` | PASS | Packaged reader emitted no off-origin request. |
| `escape-close` | PASS | Escape removed the reader host. |
| `heading-key-navigation` | PASS | J/J/K moved heading focus forward, forward, and back. |
| `site-self-contained` | PASS | Landing/demo assets and requests were same-origin; runtime dependencies were absent. |

F-4-1 and F-4-2 are public privacy statements with no claim entries. No listed claim test failed.

The product makes no public offline claim. As additional privacy evidence, the core packaged-reader test sets the browser context offline before opening and using the reader, and the live landing/demo request log remained same-origin.

## Earlier finding verification

Every earlier numbered review finding and every defect carried in the polish, verification, and handoff history was checked against the live site plus current code or the byte-identical live package.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 broad host permissions | Fixed. Live `manifest.json` has no required `host_permissions` or automatic `content_scripts`; optional HTTP(S) permissions and runtime injection remain. |
| F-1-2 overlong README introduction | Fixed. Current feature sentences are 18 and 9 words. |
| F-1-3 unlisted demo and J/K claims | Fixed. Both claim entries exist once and both exact commands pass. |
| F-1-4 “Start for real” | Fixed. The result-naming exit label and clearing/install helper are live. |
| F-1-5 inconsistent 404 header | Fixed. The HTTP 404 keeps Demo, How it works, Privacy, and the complete footer. |
| F-1-6 metaphorical preview/404 headings | Fixed. The headings are **Preview of a stable transcript** and **Page not found**. |
| F-2-1 transient demo contrast | Fixed. Text opacity remains `1`; immediate entry/reset Axe checks pass. |
| F-2-2 unlisted self-contained-site claim | Fixed. `site-self-contained` exists and passes. |
| F-2-3 subjective eyebrow | Fixed. It reads **Browser extension for screen-reader users**. |
| F-2-4 “stable anchor” jargon | Fixed. Visitor copy says the heading stays with its message. |
| F-2-5 inconsistent terms | Fixed. Public copy consistently uses demo, saved place, and enabled site. |
| F-2-6 editorial-lore labels | Fixed. Preview, demo, and 404 labels name their content directly. |
| F-2-7 detector/adapter jargon | Fixed. The README states the layout-change limit in user terms. |
| F-3-1 paused reader silently missing updates | Fixed. The packaged-reader test pauses, closes, reopens active, and receives the next message. |
| F-3-2 untested Alt+Shift+R promise | Fixed. It is absent from public copy. |
| F-3-3 untested Chrome compatibility promise | Fixed. The blanket promise is absent; the ZIP has a separate pinned-Chromium smoke test. |
| F-3-4 demo exit/Back focus loss | Fixed live at both viewports; each transition focuses the route h1. |
| F-3-5 noun-only navigation buttons | Fixed. Both controls begin with **Go to**. |
| F-3-6 “reading record” conflict | Fixed. Public copy uses **transcript**. |
| F-3-7 “polite announcements” jargon | Fixed. README describes the audible result and retained focus. |
| F-3-8 dependency/CDN jargon | Fixed. README says the site loads scripts, styles, and fonts from its own domain. |
| Streaming refresh destroyed focus | Fixed. Source captures message/key focus and the packaged streaming test restores it. |
| Hidden content was read | Fixed. Rendered-content filtering excludes the hidden fixture. |
| Saved places were position-based | Fixed. Source identity/fingerprint anchors retain the saved target after insertion. |
| Duplicate messages were dropped | Fixed. Both identical visible fixture messages remain. |
| Unit test command failed | Fixed. `npm run test:unit` passes 5/5. |
| Reverse Tab escaped the dialog | Fixed. The packaged-reader focus trap includes the initially focused title. |
| Core claims exercised only the website demo | Fixed for the prior claims. Current core claim tags exercise the packaged MV3 reader. |
| Export contained source controls | Fixed. Copy/export omit fixture controls and hidden text. |
| Skip link did not focus main | Fixed live; activation focuses `MAIN`. |
| Touch targets were below 44 px | Fixed. No visible link or button failed at 390 px or desktop. |
| Cache, 404, and AVIF delivery were wrong | Fixed live: immutable one-year hashed assets, HTTP 404, and `image/avif`. |
| Development dependencies had high/critical vulnerabilities | Fixed. Both clean-clone audits report zero vulnerabilities. |

The live ZIP and clean-clone ZIP have the same SHA-256: `3cde1dfcc220f2c112421122b4fcc9b1f821ca4e90b3c8514238771da08c1a01`. This ties the packaged-extension confirmations to the deployed download rather than source alone.

## Structure, routing, accessibility, and identity

- `/`, `/?demo=1`, `/demo`, `/install`, `/privacy`, `/terms`, and the unknown-route 404 were checked in fresh browser contexts.
- Titles follow the product/result or route/product pattern and stay under 60 characters. Every route has one h1, one main, `lang=en`, a plain description, canonical URL, OG/Twitter metadata, SVG favicon, 180 px touch icon, and the 1200 × 630 product social image.
- The unknown route returns HTTP 404 and renders the designed **Page not found** view with the normal header/footer and a way home.
- Home → demo, demo → install, browser Back, and normal SPA navigation focus the new h1. The in-page `/#how` link resolves. The skip link focuses main.
- Every crawled internal, download, W3C, MDN, and Param Factory HTTP link returned 200; email links are explicit `mailto:` links.
- Fresh 390 px and desktop pages had no horizontal overflow, console/page errors, serious/critical Axe result, or visible control below 44 × 44 CSS px. Reduced motion changes the demo animation to `0.01ms`.
- Factory `verify-url.sh` passed home, demo, install, privacy, and terms. Standalone Axe CLI reported zero violations on the same five live pages.
- Initial JavaScript is 18,106 bytes raw and 5,947 bytes gzip. Hashed assets use immutable one-year caching. CSP and other security headers match observed loads.
- The monochrome broadsheet layout, warm paper, black rules, yellow saved-place marker, original editorial art, square controls, and numbered folios are recognizably product-specific. It is not a generic SaaS template.

## Missed leverage

No missed-leverage finding. Text export is present. Enabled-site preferences use browser sync without syncing conversation text. Import is not implied because the job is to read the currently open chat. Remote transcript sync would conflict with the local-first boundary. An AI step is neither needed for reading/navigation nor compatible with the explicit no-model behavior; no provider key or AI endpoint is embedded.

## Verification summary

- Every one of the 17 exact claim commands: PASS separately.
- `npm test`: PASS, 52/52.
- `npm run test:unit`: PASS, 5/5.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run build`: PASS; extension, ZIP, and `dist/site/` produced.
- `npm audit --audit-level=high`: PASS, zero vulnerabilities.
- `npm audit --omit=dev --audit-level=high`: PASS, zero vulnerabilities.
- Live request log: same-origin only; no console/page errors.
- Live route/link/metadata/touch-target/reduced-motion/404 checks: PASS.
- Factory URL verifier and standalone Axe CLI on five routes: PASS.

## What would make this perfect

Inventory and test the two privacy-control claims, or remove the promises. Replace **Read and act** with a heading that names its operations, and replace the paper metaphor with the literal numbering result. Then rerun the complete clean-clone claim suite and cold live review. Only zero remaining findings should produce `PASS`.
