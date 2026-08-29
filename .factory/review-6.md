# Adversarial first-read review 6 — Stream Reader Compass

Reviewed 2026-08-29 against <https://stream-reader-compass.sociobot.in> and clean-clone commit `9383460f035cddd1cdb8faf229341783e8160dad`.

## Verdict: PASS

There are zero findings, no failed claim test, and no untested public claim.

## Cold first read

Fresh Chromium contexts at 390 × 844 and 1440 × 900 had no prior site state. I did not scroll before recording these answers.

| Question | First-read answer | Exact first-screen text |
| --- | --- | --- |
| What does it do? | It makes a numbered transcript of a streaming browser chat and keeps a saved reading position. | “Read streaming chats without losing your place.” |
| For whom? | Screen-reader users reading long browser chats. | “Browser extension for screen-reader users” and “For screen-reader users who need stable headings, links, and copy controls in long browser chats.” |
| What should I click first? | **Try it with sample data**. | “Try it with sample data” and “Opens a private sample transcript.” |

The primary action and all three facts—conversation text stays in the browser, no account, and free use—were fully visible before scrolling at both sizes. The page had no horizontal overflow or console error. This gate passes.

## Findings

None.

## Copy audit

Counts are whitespace-delimited after removing Markdown formatting. Hyphenated terms, URLs, and keyboard chords count as one word. No sentence exceeds 22 words. No banned marketing adjective, unexplained jargon, inconsistent product term, metaphorical heading, or non-result-naming product action remains.

### Landing page

| Sentence | Words | Result |
| --- | ---: | --- |
| Read streaming chats without losing your place. | 7 | Pass; direct job headline. |
| For screen-reader users who need stable headings, links, and copy controls in long browser chats. | 15 | Pass; audience and result. |
| Opens a private sample transcript. | 5 | Pass; `demo-one-click-isolation` and `local-processing`. |
| Conversation text stays in your browser. | 6 | Pass; `local-processing`. |
| No account is needed. | 4 | Pass; `no-account-free`. |
| Free to use. | 3 | Pass; `no-account-free`. |
| Loose paper strips align into one ordered newspaper column beside a compass needle. | 13 | Pass; descriptive image alternative. |
| The reader numbers visible chat messages in their page order. | 10 | Pass; `message-headings`. |
| My checkout button works with a mouse, but keyboard focus disappears after the basket opens. | 15 | Pass; realistic preview content. |
| Move focus to the basket heading when it opens. | 9 | Pass; realistic preview content. |
| Return focus to the checkout button when it closes. | 9 | Pass; realistic preview content. |
| Choose the extension on a chat page. | 7 | Pass; setup instruction. |
| Enable that site only. | 4 | Pass; `site-consent`. |
| Select Open transcript reader. | 4 | Pass; setup instruction. |
| Each visible message gets a heading that stays with that message. | 11 | Pass; `message-headings`. |
| Move by heading, save your place, copy a message, or export the transcript. | 13 | Pass; navigation, resume, copy, and export results. |
| Download the ZIP, extract it, then load the folder from your browser's extensions page. | 14 | Pass; installation instruction. |
| The extension does not call a model or summarize your words. | 11 | Pass; `no-remote-services`. |
| It reads visible message groups only after you enable that site. | 11 | Pass; `site-consent`. |
| It stores your enabled sites and saved place. | 8 | Pass; `storage-locations`. |
| It does not store transcript text. | 6 | Pass; `no-transcript-storage`. |
| Read streaming chats without losing your place. | 7 | Pass; footer description. |

Landing headings identify their content: **Preview of a stable transcript**, **How to turn a live chat into a transcript**, **Enable one site**, **Open the reader**, **Navigate, save, copy, or export**, **Install the unpacked extension**, and **It reads the page you already opened**. The first-screen eyebrow identifies the artifact and audience.

Landing and demo actions name their result: **Try it with sample data**, **Open the working transcript demo**, **Download extension ZIP**, **Read the full privacy notice**, **Reset demo**, **Exit demo and install extension**, **Copy all messages**, **Export text file**, **Go to previous message**, **Go to next message**, **Add sample reply**, **Pause updates**, **Copy this message**, and **Save my place here**.

### README

| Sentence or complete instruction | Words | Result |
| --- | ---: | --- |
| Read streaming browser chats without losing your place. | 8 | Pass. |
| Stream Reader Compass is a free browser extension for screen-reader users. | 11 | Pass; audience and `no-account-free`. |
| It turns visible chat messages into a local transcript with lasting message headings, named links, and copy controls. | 18 | Pass; listed feature claims. |
| You can export the transcript and save your place. | 9 | Pass; `text-export` and `resume-marker`. |
| The reader announces new messages without interrupting you or moving focus. | 11 | Pass; `polite-updates`. |
| Conversation text stays in the browser. | 6 | Pass; `local-processing`. |
| The extension does not use analytics, accounts, models, or remote APIs. | 11 | Pass; `no-account-free` and `no-remote-services`. |
| Each site must be enabled from the extension popup before the reader works there. | 14 | Pass; `site-consent`. |
| Open `/?demo=1` or visit <https://stream-reader-compass.sociobot.in/?demo=1>. | 5 | Pass; demo instruction. |
| The sample chat opens in one click and uses only `demo:` local storage keys. | 14 | Pass; `demo-one-click-isolation`. |
| Reset it from the yellow banner. | 6 | Pass; `demo-reset`. |
| Download `stream-reader-compass-chrome.zip` from the site. | 5 | Pass; installation instruction. |
| Extract the ZIP. | 3 | Pass. |
| Open `chrome://extensions` or `edge://extensions`. | 4 | Pass; installation instruction. |
| Turn on developer mode. | 4 | Pass. |
| Choose Load unpacked and select the extracted folder. | 8 | Pass. |
| Open a browser chat, choose the extension, and select Enable on this site. | 13 | Pass; `site-consent`. |
| Select Open transcript reader. | 4 | Pass. |
| Inside the reader, press J or K to move between message headings. | 12 | Pass; `heading-key-navigation`. |
| Escape closes the reader. | 4 | Pass; `escape-close`. |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass; development requirement. |
| The exact production command is `npm run build`. | 8 | Pass; verified in the clean clone. |
| The website loads scripts, styles, and fonts only from its own domain. | 12 | Pass; `site-self-contained`. |
| The generated hero source and prompt are in `assets/src/`. | 9 | Pass; repository provenance verified. |
| Run `npm run build`, then publish `dist/site/` to a static host that supports the included routing configuration. | 17 | Pass; deployment instruction. |
| After deployment, run `npm run verify:live -- https://your-host.example`. | 8 | Pass; verification instruction. |
| It checks routes, metadata, accessibility, mobile layout, demo isolation, links, and reduced motion. | 13 | Pass; script scope verified. |
| Your enabled sites use Chrome sync storage. | 7 | Pass; `storage-locations`. |
| Chrome stores each granted site permission. | 6 | Pass; `storage-locations`. |
| Your saved place uses local extension storage. | 7 | Pass; `storage-locations`. |
| Transcript text is never stored. | 5 | Pass; `no-transcript-storage`. |
| See `/privacy` for the full notice and `/terms` for terms. | 10 | Pass; both routes resolve. |
| Websites change. | 2 | Pass; limitation. |
| If a website changes its chat layout, message detection may need an update. | 13 | Pass; direct limitation. |
| This extension does not summarize or send chat content. | 9 | Pass; `no-remote-services`. |
| It does not save transcript text. | 6 | Pass; `no-transcript-storage`. |
| MIT. | 1 | Pass; `LICENSE` exists. |
| See [LICENSE](LICENSE). | 2 | Pass; repository link resolves. |

The fragment “It creates:” introduces three build-artifact bullets and is not a sentence. The README headings—**Try the demo**, **Install the packaged extension**, **Develop**, **Deploy**, **Privacy and limits**, and **License**—make sense out of context. Terminology stays consistent: **reader**, **transcript**, **message**, **saved place**, **enabled site**, and **demo**.

## Demo and sandbox

The demo gate passes on the deployed site at both viewports.

- One click from the landing page opened `/?demo=1` with four realistic keyboard-support messages already rendered.
- The persistent banner said “Demo — sample data, nothing is saved” and exposed **Reset demo** and **Exit demo and install extension** with its clearing/install explanation.
- A seeded `real:review6=untouched` key survived entry, saving message three, adding the fifth sample reply, and reset.
- Saving message three created only `demo:resume=sample-3`; adding a reply created no additional storage key.
- Reset restored four messages, removed `demo:resume`, retained the non-demo key, and focused **Read this conversation in order**.
- The add-reply action retained its focus while the fifth message appeared.
- The entire landing-to-demo flow emitted only same-origin requests and no console or page error.

## Claims and clean-clone verification

The clean clone was `/tmp/src-review6-clean-DOXSRT` at commit `9383460f035cddd1cdb8faf229341783e8160dad`. After `npm ci`, every exact command in `.factory/claims.json` was run separately.

| Claim id | Result | Observable evidence |
| --- | --- | --- |
| `local-processing` | PASS | The packaged reader was used offline and emitted no off-origin request. |
| `message-headings` | PASS | Numbered headings followed source order and retained the saved source after insertion. |
| `text-export` | PASS | The downloaded text contained fixture messages and link and excluded source controls. |
| `copy-controls` | PASS | One-message and complete-transcript clipboard contents were inspected. |
| `link-lists` | PASS | The named WAI-ARIA link retained its source URL. |
| `resume-marker` | PASS | The saved source message survived insertion, close, and reopen. |
| `polite-updates` | PASS | A streamed reply appeared without moving focused message content. |
| `pause-updates` | PASS | Close/reopen reset pause state and the next streamed message appeared. |
| `demo-reset` | PASS | Reset restored four messages and removed all demo-prefixed keys. |
| `demo-one-click-isolation` | PASS | The landing action, URL, sample, demo-only key, reset, and non-demo-key preservation passed. |
| `no-account-free` | PASS | The complete demo had no account/payment input and the free copy was present. |
| `site-consent` | PASS | The shipped manifest had no required hosts or automatic content script; reading was blocked before enablement. |
| `site-disable-removes-access` | PASS | The popup removed the sync entry and browser permission, closed the reader, and blocked reinjection. |
| `storage-locations` | PASS | Enabled sites, permissions, and saved places occupied only their disclosed stores. |
| `no-transcript-storage` | PASS | Neither extension store contained fixture conversation text. |
| `no-remote-services` | PASS | The packaged reader made no off-origin request. |
| `escape-close` | PASS | Escape removed the reader host. |
| `heading-key-navigation` | PASS | J, J, K moved heading focus forward, forward, and back. |
| `site-self-contained` | PASS | Landing and demo requests and script/style/font assets were same-origin. |

Each claim id occurs in exactly one tagged test. The live landing, demo, install, privacy, terms, and README copy were cross-checked against the inventory. No claim-like sentence is unlisted. There is no quantitative claim without a test. The product makes no public offline promise; offline use of the already-loaded packaged reader nevertheless passed as privacy/local-processing evidence.

## Earlier-history verification

Every earlier review, polish report, verification report, and the prior handoff was read. Each numbered finding was then checked against the current live site and current code or the byte-identical deployed package.

| Earlier finding | Current verification |
| --- | --- |
| F-1-1 broad host permissions | Fixed: the live manifest has no required `host_permissions` or `content_scripts`; optional per-origin permission and runtime injection remain. |
| F-1-2 overlong README sentence | Fixed: the replacement sentences are 18 and 9 words. |
| F-1-3 unlisted demo and J/K claims | Fixed: both claims exist once and their exact tests pass. |
| F-1-4 generic “Start for real” | Fixed: the banner uses **Exit demo and install extension** and states the clearing/install result. |
| F-1-5 inconsistent 404 header | Fixed: the live HTTP 404 has Demo, How it works, Privacy, and the complete footer. |
| F-1-6 metaphorical preview and 404 headings | Fixed: **Preview of a stable transcript** and **Page not found** are live. |
| F-2-1 transient contrast failure | Fixed: message opacity is `1` immediately after entry/reset; immediate Axe checks pass. |
| F-2-2 unlisted website self-containment claim | Fixed: `site-self-contained` is listed and passes. |
| F-2-3 subjective first-screen slogan | Fixed: the eyebrow says **Browser extension for screen-reader users**. |
| F-2-4 “stable anchor” jargon | Fixed: visitor copy says a heading stays with its message. |
| F-2-5 inconsistent terms | Fixed: public copy consistently uses demo, saved place, and enabled site. |
| F-2-6 editorial lore labels | Fixed: preview, demo, and 404 labels name their content. |
| F-2-7 detector/adapter jargon | Fixed: the README states the layout-change limit in user terms. |
| F-3-1 paused reader silently misses updates | Fixed: packaged-reader open/close resets pause, and the claim test receives the next reply. |
| F-3-2 unlisted keyboard-command promise | Fixed: Alt+Shift+R is not advertised in public copy. |
| F-3-3 unlisted Chrome-compatibility promise | Fixed: public copy says **browser extension**; the package separately loads in pinned Chromium. |
| F-3-4 demo exit and Back lose focus | Fixed: `/install` is a real route; exit and Back focus their destination h1 and preserve non-demo storage. |
| F-3-5 noun-only navigation buttons | Fixed: both controls begin with **Go to**. |
| F-3-6 “reading record” term conflict | Fixed: public copy consistently uses **transcript**. |
| F-3-7 “polite announcements” jargon | Fixed: README states the audible, focus-preserving result. |
| F-3-8 dependency/CDN jargon | Fixed: README names scripts, styles, fonts, and the site domain directly. |
| F-4-1 unlisted site-disable claim | Fixed: `site-disable-removes-access` is listed and passes against the packaged popup. |
| F-4-2 unlisted uninstall-deletion claim | Fixed: the unsupported deletion promise is absent. |
| F-4-3 generic “Read and act” heading | Fixed: the live heading is **Navigate, save, copy, or export**. |
| F-4-4 metaphorical hero caption | Fixed: the caption states the numbered page-order result and `message-headings` proves it. |
| F-5-1 unlisted storage-location claims | Fixed: `storage-locations` is listed and passes against the shipped ZIP. |

Earlier unnumbered findings also remain fixed:

| Earlier defect | Current verification |
| --- | --- |
| Streaming refresh destroyed focus | The packaged-reader test inserts an earlier message and keeps focus in the same source message. |
| Hidden content was read | Rendered-content filtering and the packaged fixture exclude the hidden secret. |
| Saved places were position-based | Source identity/fingerprint anchors keep the marker on the saved message after insertion. |
| Duplicate visible messages were dropped | Both identical visible fixture replies remain separate. |
| Unit-test command failed | `npm run test:unit` passes 5/5. |
| Reverse Tab escaped the modal | Shift+Tab from the reader title wraps inside the dialog. |
| Core claims exercised only the website demo | Core reader claims run against the packaged MV3 extension. |
| Export included source controls | Copy/export omit source controls and hidden text. |
| Skip link did not focus main | Activation focuses `main`. |
| Touch targets were below 44 px | The desktop and 390 px checks find no undersized visible control. |
| Cache, 404, and AVIF delivery were wrong | Hashed assets are immutable for one year; unknown routes return 404; AVIF uses `image/avif`. |
| Development dependencies had high/critical vulnerabilities | Both clean-clone high-severity audits report zero vulnerabilities. |
| Popup hidden controls remained exposed | The popup honors hidden state, and its privacy link meets the touch-target baseline. |

## Structure, accessibility, links, and identity

- `/`, `/?demo=1`, `/demo`, `/install`, `/privacy`, `/terms`, `/404.html`, and an unknown route were opened fresh. The unknown route returned HTTP 404 and showed the designed page.
- Each rendered route had its route-specific title, one h1, one main, `lang=en`, a plain description, canonical URL, OG/Twitter metadata, SVG favicon, 180 px touch icon, and the 1200 × 630 product social image.
- Home-to-demo, demo-to-install, browser Back, and ordinary SPA navigation focused the destination h1 and updated the polite route announcement. The `/#how` deep link resolves, and the skip link focuses `main`.
- The normal header/footer remain consistent on the landing, demo, install, privacy, terms, SPA 404, and static 404 views. Privacy and Terms are available in the footer.
- All internal routes, the ZIP, W3C, MDN, and Param Factory links returned 200. Mail links are explicit. The deliberate missing route is the only 404.
- Fresh desktop and 390 px runs had no horizontal overflow, application console/page error, serious/critical Axe result, missing image alternative, or visible control under 44 × 44 CSS px. Reduced-motion behavior is present.
- Production sends CSP, HSTS, `nosniff`, referrer, and permissions-policy headers. CSP is header-based and matches observed loads.
- The initial site JavaScript is 18,084 bytes raw and 5,943 bytes gzip, with no web fonts. The build produced `dist/site/`.
- The warm-paper broadsheet, black rules, safety-yellow marker, square offset controls, numbered folios, and original editorial paper-strip art match `.factory/design.md` and are recognizably product-specific rather than a generic SaaS template.

The factory URL verifier passed `/`, `/?demo=1`, `/install`, `/privacy`, and `/terms`. The repository live verifier passed desktop/mobile metadata, Axe, 44 px controls, responsive layout, demo isolation/reset/exit/Back focus, privacy copy, link checks, the real 404, and reduced motion.

## Missed leverage

No missed-leverage finding. Text export is present. Enabled-site preferences use browser sync while conversation text remains local. Import is not implied because the job concerns the currently open chat, and remote transcript sync would conflict with the stated local boundary. An AI step is not needed for navigation and would conflict with the explicit no-model behavior. No provider key, model endpoint, or decorative AI feature is present.

## Verification summary

- All 19 exact claim commands: PASS separately.
- `npm test`: PASS, 53/53.
- `npm run test:unit`: PASS, 5/5.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run build`: PASS; extension, deterministic ZIP, and `dist/site/` produced.
- `npm audit --audit-level=high`: PASS, zero vulnerabilities.
- `npm audit --omit=dev --audit-level=high`: PASS, zero vulnerabilities.
- `npm run verify:live -- https://stream-reader-compass.sociobot.in /tmp/review6-live-evidence`: PASS.
- Factory URL verification on five public routes: PASS after providing its required evidence directories.
- Live ZIP, repository ZIP, and clean-build ZIP SHA-256: `ef45cf975dd8e9086cdb99812b6353430c9c26149acec6a7c09dd47581efb9cc`.

## What would make this perfect

Nothing remains to change from this review. Preserve the current claim inventory, isolated demo, per-site permission model, direct copy, route focus behavior, and clean verification gates in future releases.
