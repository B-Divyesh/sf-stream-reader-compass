# Adversarial first-read review 2 — Stream Reader Compass

Reviewed 2026-08-28 against `https://stream-reader-compass.sociobot.in` and repository base `414c0f661148df2f03a287ef87bc78e5e93cbb63`.

## Verdict: FAIL

There is one blocking finding, one claim-inventory finding, and five copy findings. `PASS` requires zero findings and no untested claim.

## Findings

### F-2-1 — BLOCKING — the demo animation temporarily drops text below required contrast

**Location:** live `/?demo=1` and `/demo` immediately after client-side entry; `site/src/styles.css:101,116`.

**Exact evidence:** `.demo-message { animation: press-line 220ms ease both; }` applies `opacity: 0` to the complete message card at the start of `press-line`. Immediately after selecting **Try it with sample data**, the first card had computed opacity `0.18878`; it reached `1` after 300 ms. Axe caught a serious `color-contrast` violation during that transition. Examples include:

- `#sample-1 > h3 > span`: 2.40:1;
- `#sample-1 > p`: 3.63:1;
- `button[data-copy-message="sample-1"]`: 3.41:1.

The same failure affects all four message bodies, folios, heading suffixes, reference links, and message buttons. It reproduces on both demo URLs after a cached client-side navigation. The current Axe test is timing-dependent and usually runs after the 220 ms animation ends, so `npm test` can pass while the transient violation remains.

**Why this fails:** the product is specifically for screen-reader users, including people who also use magnification or retain partial sight. Required text and controls must retain 4.5:1 contrast while visible, not only after an entrance effect finishes. This fails the non-negotiable accessibility baseline and the repository's contrast gate.

**Concrete fix:** do not animate opacity on `.demo-message` or the extension's message articles. Animate only the top rule or a small transform while leaving text at full opacity. Add an Axe assertion immediately after client-side demo entry and after **Reset demo**, before waiting for animation completion.

### F-2-2 — Major — the README contains an unlisted website privacy/dependency claim

**Location:** `README.md`, Develop.

**Exact quote:** “The site uses no runtime dependencies or third-party CDN files.”

**Why this fails:** `.factory/claims.json` has no website claim for this sentence. `no-remote-services` is explicitly about the extension and its test observes the packaged reader after loading a local fixture. The untagged demo request-log test does not supply the required one-to-one claim entry. The live request log happened to confirm same-origin loads, but an unlisted claim is still outside the mandatory gate.

**Concrete fix:** add a `site-self-contained` claim with this README location and one tagged test that records the complete landing/demo request log and rejects off-origin requests. The test should also assert that the served page has no external script, stylesheet, or font URL. Otherwise remove the sentence.

### F-2-3 — Minor — the first-screen eyebrow is a subjective slogan

**Location:** landing first screen.

**Exact quote:** “A steadier browser chat reader”

**Why this fails:** “steadier” is an unmeasured adjective, and the line adds no concrete fact beyond the headline below it.

**Concrete rewrite:** “Browser extension for screen-reader users”.

### F-2-4 — Minor — “stable anchor” is unexplained web jargon

**Locations:** landing How it works; README introduction; `semantic-record` claim.

**Exact quotes:** “Each visible message gets a heading and stable anchor.” and “It turns visible chat messages into a local transcript with headings, stable anchors, link lists, and copy controls.”

**Why this fails:** a first-time user should not need to know the HTML meaning of “anchor” to understand what remains stable.

**Concrete rewrites:** “Each visible message gets a heading that stays with that message.” and “It turns visible chat messages into a local transcript with lasting message headings, named links, and copy controls.” Rename the claim to match the plain result.

### F-2-5 — Minor — the same concepts use several terms

**Locations:** landing boundaries, demo eyebrow, and README.

**Exact quotes:** “Try the sandbox”; “Sample support chat · local sandbox”; “resume marker”; “saved message identifier”; “saved place”; “enabled origins”; and “enabled site”.

**Why this fails:** the interface otherwise calls the sample experience a **demo**, the return point a **saved place**, and a permitted website an **enabled site**. Switching to sandbox, resume marker, identifier, and origin makes the user translate implementation terms.

**Concrete rewrites:** “Try the demo”; “Sample support chat · demo”; “It stores your enabled sites and saved place.”; and “Your enabled sites use Chrome sync storage. Your saved place uses local extension storage.”

### F-2-6 — Minor — editorial labels add lore instead of identifying content

**Locations:** landing preview and boundaries, demo masthead, and 404.

**Exact quotes:** “Reader specimen · 04 messages”; “Clear boundaries”; “The daily transcript · sample edition”; and “Edition 404”.

**Why this fails:** “specimen” and “edition” carry the visual theme but do not help a visitor use the product. “Reader specimen · 04 messages” is also imprecise because the landing preview renders only two of the four messages.

**Concrete rewrites:** “Transcript preview · first 2 of 4 messages”; delete “Clear boundaries” because the `h2` names the section; “Sample transcript · 4 messages”; and delete “Edition 404”.

### F-2-7 — Minor — the README limitation uses implementation jargon

**Location:** `README.md`, Privacy and limits.

**Exact quote:** “The generic detector may need a new adapter for a changed chat layout.”

**Why this fails:** “generic detector” and “adapter” describe implementation details, not the consequence a user needs to know.

**Concrete rewrite:** “If a website changes its chat layout, message detection may need an update.”

## Cold first read

Fresh Chromium contexts were used at 390 × 844 and 1440 × 900. Before scrolling, my first-read answers were:

- **What it does:** turns a streaming browser chat into a stable reading view so the reader can keep their place.
- **For whom:** screen-reader users reading long browser chats.
- **What to click first:** **Try it with sample data**, which says it opens a private sample transcript.

This gate passes. The exact visible text was “Read streaming chats without losing your place”; “For screen-reader users who need stable headings, links, and copy controls in long browser chats.”; and “Try it with sample data” / “Opens a private sample transcript.” The action and three facts were above the fold at both sizes. Screenshots were captured at `/tmp/review-2-mobile.png` and `/tmp/review-2-desktop.png`.

## Copy audit

Counts are whitespace-delimited after removing Markdown formatting. Hyphenated terms, URLs, and keyboard chords count as one word. No sentence exceeds 22 words and no banned marketing word appears. Findings F-2-3 through F-2-7 cover the remaining jargon, inconsistency, and decorative labels. All action buttons name their result.

### Landing page

| Sentence | Words | Result |
| --- | ---: | --- |
| Read streaming chats without losing your place. | 8 | Pass |
| For screen-reader users who need stable headings, links, and copy controls in long browser chats. | 15 | Pass |
| Opens a private sample transcript. | 5 | Pass |
| Conversation text stays in your browser. | 6 | Pass |
| No account is needed. | 5 | Pass |
| Free to use. | 3 | Pass |
| Loose paper strips align into one ordered newspaper column beside a compass needle. | 13 | Pass; image alt text |
| Loose chat fragments become one numbered reading order. | 8 | Pass |
| My checkout button works with a mouse, but keyboard focus disappears after the basket opens. | 15 | Pass; sample content |
| Move focus to the basket heading when it opens. | 9 | Pass; sample content |
| Return focus to the checkout button when it closes. | 9 | Pass; sample content |
| Choose the extension on a chat page. | 7 | Pass |
| Enable that site only. | 4 | Pass |
| Press Alt+Shift+R. | 2 | Pass |
| Each visible message gets a heading and stable anchor. | 9 | **F-2-4** |
| Move by heading, save your place, copy a message, or export the transcript. | 13 | Pass |
| Download the ZIP, extract it, then load the folder from your browser's extensions page. | 14 | Pass |
| The extension does not call a model or summarize your words. | 11 | Pass |
| It reads visible message groups only after you enable that site. | 11 | Pass |
| It stores the enabled site list and your resume marker. | 10 | **F-2-5** |
| It does not store transcript text. | 6 | Pass |
| Read streaming chats without losing your place. | 8 | Pass; footer repetition |

### README

| Sentence or complete instruction | Words | Result |
| --- | ---: | --- |
| Read streaming browser chats without losing your place. | 8 | Pass |
| Stream Reader Compass is a free Chrome-compatible extension for screen-reader users. | 11 | Pass |
| It turns visible chat messages into a local transcript with headings, stable anchors, link lists, and copy controls. | 18 | **F-2-4** |
| You can export the transcript and save your place. | 9 | Pass |
| New messages use polite announcements and do not move focus. | 9 | Pass |
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
| Select Open transcript reader or press Alt+Shift+R. | 7 | Pass |
| Inside the reader, press J or K to move between message headings. | 12 | Pass |
| Escape closes the reader. | 4 | Pass |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass |
| The exact production command is `npm run build`. | 8 | Pass |
| The site uses no runtime dependencies or third-party CDN files. | 10 | **F-2-2** |
| The generated hero source and prompt are in `assets/src/`. | 9 | Pass |
| Enabled origins use extension sync storage. | 6 | **F-2-5** |
| Chrome stores each granted site permission. | 6 | Pass |
| A saved message identifier uses local extension storage. | 8 | **F-2-5** |
| Transcript text is never stored. | 5 | Pass |
| See `/privacy` for the full notice and `/terms` for terms. | 10 | Pass |
| Websites change. | 2 | Pass |
| The generic detector may need a new adapter for a changed chat layout. | 12 | **F-2-7** |
| This extension does not summarize, record, or send chat content. | 10 | Pass |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

### Labels, headings, terms, and actions

- F-2-3 flags the first-screen slogan.
- F-2-5 flags **demo / sandbox**, **saved place / resume marker / saved message identifier**, and **enabled site / enabled origin**.
- F-2-6 flags the decorative editorial labels. Semantic headings such as “Preview of a stable transcript”, “Turn a live chat into a reading record”, and “Page not found” pass out of context.
- Landing and demo actions pass: **Try it with sample data**, **Open the working transcript demo**, **Download extension ZIP**, **Reset demo**, **Exit demo and install extension**, **Copy all messages**, **Export text file**, **Previous message**, **Next message**, **Add sample reply**, **Pause updates**, **Copy this message**, and **Save my place here**.

## Demo and sandbox behavior

The demo gate passes apart from F-2-1:

- one click from the landing page opened `/?demo=1`;
- the first demo screen already showed four realistic keyboard-support messages;
- the persistent banner said “Demo — sample data, nothing is saved” and exposed reset and exit actions;
- adding a reply produced five messages;
- saving a place created only `demo:resume`;
- reset restored four unmarked messages and removed `demo:resume`;
- a seeded `real:sentinel=keep` value survived entry, changes, and reset;
- every observed request during landing and the demo flow was same-origin;
- no console error occurred on landing or demo.

The demo screenshot is `/tmp/review-2-demo.png`.

## Claims audit

Every exact `test` command in `.factory/claims.json` was run separately after `npm ci`. All 16 commands passed from the clean base checkout:

| Claim id | Result | Observable coverage |
| --- | --- | --- |
| `local-processing` | PASS | Packaged reader; off-origin request list empty |
| `semantic-record` | PASS | Packaged reader headings and stable source identity |
| `text-export` | PASS | Download contents checked |
| `copy-controls` | PASS | Clipboard contents checked |
| `link-lists` | PASS | Named source link and URL checked |
| `resume-marker` | PASS | Saved source message survives insertion and reopen |
| `polite-updates` | PASS | New message announced; focus retained |
| `pause-updates` | PASS | Count remains four while paused and becomes five after resume |
| `demo-reset` | PASS | Four messages restored; demo keys removed |
| `demo-one-click-isolation` | PASS | One-click URL, four messages, isolated keys, reset |
| `no-account-free` | PASS | Complete demo available without account or payment fields |
| `site-consent` | PASS | No pre-enable receiver; optional-permission manifest checked |
| `no-transcript-storage` | PASS | Extension local/sync stores contain no sample text |
| `no-remote-services` | PASS | Packaged reader emitted no off-origin page request |
| `escape-close` | PASS | Escape removes the reader host |
| `heading-key-navigation` | PASS | J/J/K moved heading focus forward, forward, and back |

F-2-2 is the only claim-like sentence without a corresponding inventory entry. There is no quantitative claim without a test.

## Earlier findings rechecked

Every finding in `.factory/review-1.md`, `.factory/polish-1.md`, `.factory/verification.md`, `.factory/verification-2.md`, and the prior handoff was checked again. Earlier findings remain fixed; F-2-1 is a newly isolated timing case.

| Earlier finding | Live and code confirmation |
| --- | --- |
| F-1-1 broad host permissions | Fixed. The live ZIP manifest has no `host_permissions` or `content_scripts`; it has optional HTTP(S) permissions plus `storage`, `activeTab`, and `scripting`. Source requests the current origin on explicit enablement. |
| F-1-2 overlong README introduction | Fixed. It is split into 18- and 9-word sentences. |
| F-1-3 unlisted demo/J-K claims | Fixed. Both ids exist exactly once in tests and their exact commands pass. |
| F-1-4 “Start for real” | Fixed live as “Exit demo and install extension”, with the clearing/install outcome beside it. |
| F-1-5 incomplete 404 header | Fixed. Live unknown routes and `/404.html` have Demo, How it works, and Privacy. |
| F-1-6 metaphorical preview/404 headings | Fixed. Live headings are “Preview of a stable transcript” and “Page not found”. F-2-6 concerns remaining decorative labels, not this regression. |
| Streaming refresh destroyed focus | Fixed in `captureMessageFocus` / `restoreMessageFocus`; packaged-reader test passes. |
| Hidden content was read | Fixed by `isRendered` and `visibleText`; packaged-reader and unit tests pass. |
| Saved places and anchors were position-based | Fixed by source identity/fingerprint anchors; insertion test passes. |
| Duplicate visible messages were dropped | Fixed by duplicate occurrence tracking; packaged-reader and unit tests retain both. |
| Unit command failed | Fixed; 4/4 unit tests pass. |
| Reverse Tab escaped the dialog | Fixed; packaged-reader focus-wrap assertion passes. |
| Claims exercised only the website demo | Fixed for extension claims; the packaged MV3 reader now exercises the core claims. |
| Export included source controls | Fixed; export includes source text and excludes buttons and hidden text. |
| Skip link did not focus main | Fixed live; activation focused `MAIN`. |
| Touch targets were below 44 px | Fixed live; no visible link or button was below 44 × 44 on `/`, demo, Privacy, or Terms at 390 px. |
| Cache, 404, and AVIF deployment defects | Fixed live; hashed assets are immutable for one year, unknown routes return HTTP 404, and AVIF is `image/avif`. |
| Development dependency vulnerabilities | Fixed; both high-severity audits report zero vulnerabilities. |

## Structure, routing, and visual identity

- Titles pass the route pattern: home, Demo, Privacy, Terms, and Page not found each set a specific title under 60 characters.
- Every checked route has `lang="en"`, one `h1`, one `main`, a description, canonical URL, Open Graph/Twitter metadata, SVG favicon, 180 px apple-touch icon, and the product's 1200 × 630 social image.
- The designed 404 returns HTTP 404, says “Page not found”, keeps the normal header/footer, and links home.
- The home-to-demo transition and browser Back both focused the new route's `h1`. The `/#how` deep link scrolled to the section after render.
- All crawled internal routes, the ZIP, W3C reference, MDN reference, and Param Factory link returned HTTP 200. Mail links are explicit `mailto:` links.
- The header and footer are consistent across routes and expose Privacy and Terms.
- The broadsheet layout, warm paper palette, black rules, yellow marker, original paper-strip art, square controls, and numbered folios are product-specific. It does not resemble a generic gradient-card SaaS template.
- Security headers and CSP are present and match observed loads. First-load JavaScript is 17.17 KB raw / 5.83 KB gzip.

## Missed leverage

No missed-leverage finding. Text export is present, enabled-site settings use browser sync, and an AI feature would conflict with the brief's local, no-model reading aid rather than complete an implied job. No provider key or AI endpoint is embedded.

## Verification summary

- `npm ci`: PASS; zero reported vulnerabilities.
- All 16 exact claim commands: PASS.
- `npm test`: PASS; 45/45 Playwright tests.
- `npm run test:unit`: PASS; 4/4 tests.
- `npm run lint`: PASS.
- `npm run build`: PASS; extension, reproducible ZIP, and `dist/site/` produced.
- `npm audit --audit-level=high`: PASS; zero vulnerabilities.
- `npm audit --omit=dev --audit-level=high`: PASS; zero vulnerabilities.
- Fresh live request log: landing/demo same-origin only.
- Fresh live link crawl: no dead HTTP link.
- Fresh live Axe after settled load: no serious/critical finding; immediate client-side demo entry: serious transient contrast finding F-2-1.

## What would make this perfect

Remove opacity from the message-entry animation and add an immediate post-navigation/reset contrast test. Register and test the README's website self-containment claim. Replace the remaining subjective, technical, inconsistent, and editorial-lore copy with the proposed plain terms. Re-run the complete review from a fresh context; only zero findings should produce `PASS`.
