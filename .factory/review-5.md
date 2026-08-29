# Adversarial first-read review 5 — Stream Reader Compass

Reviewed 2026-08-29 against <https://stream-reader-compass.sociobot.in> and clean GitHub clone `5aae7d2a1ad2c676fb9770fbe14ec6b4ebfa036e`.

## Verdict: FAIL

One major finding remains. `PASS` requires zero findings and no unlisted claim.

## Cold first read

Fresh Chromium contexts at 390 × 844 and 1440 × 900 had no stored state. Before scrolling, the page answered all three required questions.

| Question | Cold-read answer | Exact first-screen evidence |
| --- | --- | --- |
| What does it do? | It turns long streaming browser chats into a transcript that lets the reader keep their place. | “Read streaming chats without losing your place” and “The reader numbers visible chat messages in their page order.” |
| For whom? | Screen-reader users reading long browser chats. | “For screen-reader users who need stable headings, links, and copy controls in long browser chats.” |
| What should I click first? | **Try it with sample data**. | “Try it with sample data” / “Opens a private sample transcript.” |

The action and all three facts—conversation text stays in the browser, no account, and free use—were visible without scrolling at both sizes. This gate passes.

## Findings

### F-5-1 — Major — privacy storage disclosures are not listed as claims

**Location and exact quotes:**

- Landing, **It reads the page you already opened**: “It stores your enabled sites and saved place.”
- `/privacy`, **What the extension stores**: “Your enabled sites use Chrome sync storage. Chrome also stores the permission you grant for each enabled site. Your saved place uses local extension storage.”
- `README.md`, **Privacy and limits**: “Your enabled sites use Chrome sync storage.” “Chrome stores each granted site permission.” “Your saved place uses local extension storage.”

**Why this fails:** These are privacy-relevant statements a visitor can rely on, but `.factory/claims.json` has no entry for where the extension stores the enabled-site list, browser permission, and saved place. Existing `site-consent`, `resume-marker`, and `no-transcript-storage` tests incidentally inspect parts of this behavior, but none inventories these promises, lists their locations, or asserts the stated storage split. The claims contract requires each claim-like landing/README statement to have its own listed, tagged observable test.

**Concrete fix:** add a `storage-locations` claim covering the landing, privacy notice, and README. Add a fresh-profile packaged-extension test that enables one fixture origin and saves a place, then asserts `enabledOrigins` is only in `chrome.storage.sync`, the `resume:<origin><path>` value is only in `chrome.storage.local`, and neither store contains transcript text. Alternatively, remove the storage-location promises and retain only the existing tested no-transcript-text disclosure.

## Copy audit

Counts treat hyphenated words, URLs, and keyboard chords as one word. No landing or README sentence exceeds 22 words, uses banned marketing language, uses inconsistent visitor terminology, or has a mood/metaphor heading. All visible product controls name their result. F-5-1 is the one claims-inventory flag; it is not a plain-language rewrite issue.

### Landing page

| Sentence | Words | Check |
| --- | ---: | --- |
| Read streaming chats without losing your place. | 8 | Headline: direct, under nine words. |
| For screen-reader users who need stable headings, links, and copy controls in long browser chats. | 15 | Audience and outcome. |
| Opens a private sample transcript. | 5 | `demo-one-click-isolation`. |
| Conversation text stays in your browser. | 6 | `local-processing`. |
| No account is needed. | 5 | `no-account-free`. |
| Free to use. | 3 | `no-account-free`. |
| Loose paper strips align into one ordered newspaper column beside a compass needle. | 13 | Image alt text; describes the art. |
| The reader numbers visible chat messages in their page order. | 10 | `message-headings`. |
| My checkout button works with a mouse, but keyboard focus disappears after the basket opens. | 15 | Realistic sample content. |
| Move focus to the basket heading when it opens. | 9 | Realistic sample content. |
| Return focus to the checkout button when it closes. | 9 | Realistic sample content. |
| Choose the extension on a chat page. | 7 | Instruction. |
| Enable that site only. | 4 | `site-consent`. |
| Select Open transcript reader. | 4 | Instruction. |
| Each visible message gets a heading that stays with that message. | 12 | `message-headings`. |
| Move by heading, save your place, copy a message, or export the transcript. | 13 | Navigation, resume, copy, and export claims. |
| Download the ZIP, extract it, then load the folder from your browser's extensions page. | 14 | Installation instruction. |
| The extension does not call a model or summarize your words. | 11 | `no-remote-services`. |
| It reads visible message groups only after you enable that site. | 11 | `site-consent`. |
| It stores your enabled sites and saved place. | 8 | **F-5-1: unlisted storage claim.** |
| It does not store transcript text. | 6 | `no-transcript-storage`. |
| Read streaming chats without losing your place. | 8 | Footer description. |

Direct headings are **Browser extension for screen-reader users**, **Preview of a stable transcript**, **How to turn a live chat into a transcript**, **Navigate, save, copy, or export**, and **It reads the page you already opened**. Controls include **Try it with sample data**, **Open the working transcript demo**, **Download extension ZIP**, and **Read the full privacy notice**.

### README

| Sentence or complete instruction | Words | Check |
| --- | ---: | --- |
| Read streaming browser chats without losing your place. | 8 | Product job. |
| Stream Reader Compass is a free browser extension for screen-reader users. | 11 | `no-account-free`. |
| It turns visible chat messages into a local transcript with lasting message headings, named links, and copy controls. | 17 | Feature claims. |
| You can export the transcript and save your place. | 9 | `text-export`, `resume-marker`. |
| The reader announces new messages without interrupting you or moving focus. | 11 | `polite-updates`. |
| Conversation text stays in the browser. | 6 | `local-processing`. |
| The extension does not use analytics, accounts, models, or remote APIs. | 11 | `no-account-free`, `no-remote-services`. |
| Each site must be enabled from the extension popup before the reader works there. | 12 | `site-consent`. |
| Open `/?demo=1` or visit the live demo URL. | 8 | Demo instruction. |
| The sample chat opens in one click and uses only `demo:` local storage keys. | 14 | `demo-one-click-isolation`. |
| Reset it from the yellow banner. | 6 | `demo-reset`. |
| Download stream-reader-compass-chrome.zip from the site. | 5 | Installation instruction. |
| Extract the ZIP. | 3 | Installation instruction. |
| Open chrome://extensions or edge://extensions. | 4 | Installation instruction. |
| Turn on developer mode. | 4 | Installation instruction. |
| Choose Load unpacked and select the extracted folder. | 8 | Installation instruction. |
| Open a browser chat, choose the extension, and select Enable on this site. | 12 | `site-consent`. |
| Select Open transcript reader. | 4 | Installation instruction. |
| Inside the reader, press J or K to move between message headings. | 12 | `heading-key-navigation`. |
| Escape closes the reader. | 4 | `escape-close`. |
| Requirements: Node.js 20 or newer and npm. | 7 | Development requirement. |
| The exact production command is npm run build. | 8 | Development instruction; clean-clone build run. |
| The website loads scripts, styles, and fonts only from its own domain. | 11 | `site-self-contained`. |
| The generated hero source and prompt are in assets/src/. | 9 | Repository provenance fact. |
| Run npm run build, then publish dist/site/ to a static host that supports the included routing configuration. | 16 | Deployment instruction. |
| After deployment, run npm run verify:live -- https://your-host.example. | 7 | Deployment instruction. |
| It checks routes, metadata, accessibility, mobile layout, demo isolation, links, and reduced motion. | 13 | Tool-scope description. |
| Your enabled sites use Chrome sync storage. | 7 | **F-5-1: unlisted storage claim.** |
| Chrome stores each granted site permission. | 6 | **F-5-1: unlisted storage claim.** |
| Your saved place uses local extension storage. | 7 | **F-5-1: unlisted storage claim.** |
| Transcript text is never stored. | 5 | `no-transcript-storage`. |
| See /privacy for the full notice and /terms for terms. | 9 | Legal links checked. |
| Websites change. | 2 | Limitation. |
| If a website changes its chat layout, message detection may need an update. | 13 | Limitation. |
| This extension does not summarize or send chat content. | 9 | `no-remote-services`. |
| It does not save transcript text. | 6 | `no-transcript-storage`. |
| MIT. | 1 | License label. |
| See [LICENSE](LICENSE). | 2 | Repository link. |

The terminology table remains consistent: **reader**, **transcript**, **message**, **saved place**, **enabled site**, and **demo**.

## Demo and sandbox

This gate passes on the live site at both viewports.

- One cold click opened `/?demo=1` with four realistic keyboard-support messages already displayed.
- The persistent banner read “Demo — sample data, nothing is saved” and included **Reset demo** and **Exit demo and install extension** with the clear-result helper.
- A seeded `real:review5=untouched` key survived entry, saving a sample place, adding a reply, reset, and return to the landing page.
- Saving sample message three added only `demo:resume=sample-3`; adding a reply created no real-data key.
- Reset restored four messages, removed `demo:resume`, and focused the demo h1.
- The landing-to-demo flow made only same-origin requests and recorded no console or page error.

## Claims and clean-clone verification

Clean clone: `/tmp/stream-reader-compass-review5-clean-tXzTJH` at `5aae7d2a1ad2c676fb9770fbe14ec6b4ebfa036e`. After `npm ci`, every exact command in `.factory/claims.json` passed separately:

| Claim id | Result |
| --- | --- |
| `local-processing` | PASS |
| `message-headings` | PASS |
| `text-export` | PASS |
| `copy-controls` | PASS |
| `link-lists` | PASS |
| `resume-marker` | PASS |
| `polite-updates` | PASS |
| `pause-updates` | PASS |
| `demo-reset` | PASS |
| `demo-one-click-isolation` | PASS |
| `no-account-free` | PASS |
| `site-consent` | PASS |
| `site-disable-removes-access` | PASS |
| `no-transcript-storage` | PASS |
| `no-remote-services` | PASS |
| `escape-close` | PASS |
| `heading-key-navigation` | PASS |
| `site-self-contained` | PASS |

`npm test` (53 Playwright tests), `npm run test:unit`, `npm run typecheck`, `npm run lint`, and `npm run build` all passed in that clone; the build produced `dist/site/` and the packaged ZIP. The live download and the repository ZIP have the same SHA-256: `ef45cf975dd8e9086cdb99812b6353430c9c26149acec6a7c09dd47581efb9cc`.

## Earlier-history verification

Every earlier numbered finding was checked against current live behavior and current source/package rather than accepted from a status marker.

| Earlier finding | Current verification |
| --- | --- |
| F-1-1 broad host permissions | Fixed: downloaded manifest has no `host_permissions` or automatic content script; it has optional HTTP(S) permissions and runtime injection. |
| F-1-2 overlong README copy | Fixed: the former feature sentence is now split into 17- and 9-word sentences. |
| F-1-3 unlisted demo and J/K claims | Fixed: both entries and tagged tests exist and passed. |
| F-1-4 generic demo-exit control | Fixed: **Exit demo and install extension** states the result. |
| F-1-5 inconsistent 404 header | Fixed: live HTTP 404 has the normal wordmark, Demo, How it works, Privacy, and footer. |
| F-1-6 metaphorical headings | Fixed: **Preview of a stable transcript** and **Page not found** are live. |
| F-2-1 transient contrast failure | Fixed: immediate demo text opacity is `1`; current accessibility tests cover entry and reset. |
| F-2-2 self-contained-site claim | Fixed: `site-self-contained` is listed and passed. |
| F-2-3 subjective eyebrow | Fixed: it says **Browser extension for screen-reader users**. |
| F-2-4 stable-anchor jargon | Fixed: visitor copy says the heading stays with its message. |
| F-2-5 inconsistent terms | Fixed: live visitor copy consistently uses demo, saved place, and enabled site. |
| F-2-6 editorial-lore labels | Fixed: preview, demo, and 404 labels identify their content. |
| F-2-7 implementation jargon | Fixed: the README explains layout changes in user terms. |
| F-3-1 paused reader misses updates after reopen | Fixed: the packaged-reader claim test pauses, closes, reopens, and receives the next reply. |
| F-3-2 untested keyboard shortcut promise | Fixed: the public Alt+Shift+R promise is absent. |
| F-3-3 broad Chrome-compatibility promise | Fixed: the blanket public promise is absent. |
| F-3-4 demo exit/Back focus loss | Fixed: live exit and Back focus their destination h1. |
| F-3-5 non-result navigation buttons | Fixed: both controls use **Go to**. |
| F-3-6 second term for transcript | Fixed: public copy uses **transcript**. |
| F-3-7 ARIA jargon | Fixed: README describes the focus-preserving outcome. |
| F-3-8 dependency shorthand | Fixed: README plainly says scripts, styles, and fonts load from the site domain. |
| F-4-1 unlisted site-disable privacy claim | Fixed: `site-disable-removes-access` is listed and passed with the packaged popup. |
| F-4-2 unlisted uninstall-deletion claim | Fixed: the promise is absent. |
| F-4-3 generic Read and act heading | Fixed: it reads **Navigate, save, copy, or export**. |
| F-4-4 metaphorical hero caption | Fixed: it states the numbered page-order result and `message-headings` proves it. |

The prior unnumbered verification defects were also confirmed fixed: hidden source content is excluded, duplicate messages remain distinct, saved places retain their source after insertion, source controls are omitted from copy/export, the skip link focuses `main`, reverse Tab stays in the reader, touch controls meet 44 px, the designed HTTP 404 works, and no high/critical accessibility violation appeared in the clean suite.

## Structure, links, identity, and missed leverage

- `/`, `/?demo=1`, `/demo`, `/install`, `/privacy`, `/terms`, `/404.html`, and an unknown URL were opened fresh. The unknown URL returned HTTP 404 and showed the designed page.
- Routes had one h1 and one main, exact route titles, descriptions, canonicals, OG/Twitter metadata, favicon, `lang=en`, focus-to-h1 route changes, and the consistent header/footer.
- The landing links, download, legal links, sitemap, robots file, and external Param Factory link resolved; W3C reference links are explicit external links. No dead product link was found.
- Mobile and desktop had no horizontal overflow or console error. The warm-paper, black-rule, yellow-marker broadsheet system and original editorial artwork match `.factory/design.md` and are distinct from a generic SaaS template.
- No missed AI, import, export, or sync feature was found. Text export is already present; importing is not implied by reading the page already open, remote sync conflicts with the local-first boundary, and an AI step would not improve this navigation job.

## What would make this perfect

Add and pass the one storage-location claim test described in F-5-1 (or remove those storage-location promises), then repeat the clean-clone claim loop and cold live audit. No other product change is indicated by this review.
