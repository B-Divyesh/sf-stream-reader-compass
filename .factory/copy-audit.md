# Copy audit

Checked 2026-08-28 after polish round 4. Counts treat hyphenated terms, URLs, and keyboard chords as one word. No sentence exceeds 22 words. No sentence uses a banned marketing word.

## Landing page

| Sentence | Words | Claim or result |
| --- | ---: | --- |
| Read streaming chats without losing your place. | 8 | Headline passes the nine-word limit. |
| For screen-reader users who need stable headings, links, and copy controls in long browser chats. | 15 | Audience and outcome are direct. |
| Opens a private sample transcript. | 5 | `demo-one-click-isolation` |
| Conversation text stays in your browser. | 6 | `local-processing` |
| No account is needed. | 5 | `no-account-free` |
| Free to use. | 3 | `no-account-free` |
| Loose paper strips align into one ordered newspaper column beside a compass needle. | 13 | Image alt text explains the art. |
| The reader numbers visible chat messages in their page order. | 10 | `message-headings` |
| My checkout button works with a mouse, but keyboard focus disappears after the basket opens. | 15 | Sample content. |
| Move focus to the basket heading when it opens. | 9 | Sample content. |
| Return focus to the checkout button when it closes. | 9 | Sample content. |
| Choose the extension on a chat page. | 7 | Setup instruction. |
| Enable that site only. | 4 | `site-consent` |
| Select Open transcript reader. | 4 | Setup instruction. |
| Each visible message gets a heading that stays with that message. | 12 | `message-headings` |
| Move by heading, save your place, copy a message, or export the transcript. | 13 | `heading-key-navigation`, `resume-marker`, `copy-controls`, `text-export` |
| Download the ZIP, extract it, then load the folder from your browser's extensions page. | 14 | Install instruction. |
| The extension does not call a model or summarize your words. | 11 | `no-remote-services` |
| It reads visible message groups only after you enable that site. | 11 | `site-consent` |
| It stores your enabled sites and saved place. | 8 | Storage disclosure. |
| It does not store transcript text. | 6 | `no-transcript-storage` |
| Read streaming chats without losing your place. | 8 | Footer description. |

Labels and headings are direct: “Browser extension for screen-reader users,” “Preview of a stable transcript,” “How to turn a live chat into a transcript,” “Navigate, save, copy, or export,” and “It reads the page you already opened.” Controls use result-naming verbs, including “Go to previous message” and “Go to next message.”

## Privacy controls and extension popup

| Sentence | Words | Claim or result |
| --- | ---: | --- |
| Disable a site from the extension popup to remove its access. | 11 | `site-disable-removes-access` |
| Reset the demo from its top banner. | 7 | `demo-reset` |
| Content stays in this browser. | 5 | `local-processing` |
| Enable this site before opening the reader. | 7 | `site-consent` |

The untestable sentence “Remove the extension to delete its local data” was removed. Browser-owned uninstall cleanup is no longer presented as a product guarantee.

## Install route

| Sentence | Words | Result |
| --- | ---: | --- |
| Download the ZIP, extract it, then load its folder from your browser's extensions page. | 14 | Installation outcome. |
| Open chrome://extensions or edge://extensions. | 4 | Installation instruction. |
| Turn on developer mode. | 4 | Installation instruction. |
| Choose Load unpacked and select the extracted folder. | 8 | Installation instruction. |
| Open a browser chat, choose Stream Reader Compass, then select Enable on this site. | 13 | `site-consent` |
| Select Open transcript reader from the extension popup. | 8 | Installation instruction. |

The route has the direct heading “Install the extension.” Public copy does not promise a browser keyboard shortcut or broad Chrome compatibility.

## README

| Sentence or complete instruction | Words | Claim or result |
| --- | ---: | --- |
| Read streaming browser chats without losing your place. | 8 | Product job. |
| Stream Reader Compass is a free browser extension for screen-reader users. | 11 | `no-account-free` |
| It turns visible chat messages into a local transcript with lasting message headings, named links, and copy controls. | 17 | `message-headings`, `link-lists`, `copy-controls` |
| You can export the transcript and save your place. | 9 | `text-export`, `resume-marker` |
| The reader announces new messages without interrupting you or moving focus. | 11 | `polite-updates` |
| Conversation text stays in the browser. | 6 | `local-processing` |
| The extension does not use analytics, accounts, models, or remote APIs. | 11 | `no-account-free`, `no-remote-services` |
| Each site must be enabled from the extension popup before the reader works there. | 12 | `site-consent` |
| Open /?demo=1 or visit the live demo URL. | 8 | Demo instruction. |
| The sample chat opens in one click and uses only demo-prefixed local storage keys. | 14 | `demo-one-click-isolation` |
| Reset it from the yellow banner. | 6 | `demo-reset` |
| Download stream-reader-compass-chrome.zip from the site. | 5 | Install instruction. |
| Extract the ZIP. | 3 | Install instruction. |
| Open chrome://extensions or edge://extensions. | 4 | Install instruction. |
| Turn on developer mode. | 4 | Install instruction. |
| Choose Load unpacked and select the extracted folder. | 8 | Install instruction. |
| Open a browser chat, choose the extension, and select Enable on this site. | 12 | `site-consent` |
| Select Open transcript reader. | 4 | Usage instruction. |
| Inside the reader, press J or K to move between message headings. | 12 | `heading-key-navigation` |
| Escape closes the reader. | 4 | `escape-close` |
| Requirements: Node.js 20 or newer and npm. | 7 | Development requirement. |
| The exact production command is npm run build. | 8 | Build instruction. |
| The website loads scripts, styles, and fonts only from its own domain. | 11 | `site-self-contained` |
| The generated hero source and prompt are in assets/src/. | 9 | Asset provenance. |
| Your enabled sites use Chrome sync storage. | 7 | Storage disclosure. |
| Chrome stores each granted site permission. | 6 | Storage disclosure. |
| Your saved place uses local extension storage. | 7 | Storage disclosure. |
| Transcript text is never stored. | 5 | `no-transcript-storage` |
| See /privacy for the full notice and /terms for terms. | 9 | Legal links. |
| Websites change. | 2 | Limitation. |
| If a website changes its chat layout, message detection may need an update. | 13 | Limitation. |
| This extension does not summarize or send chat content. | 9 | `no-remote-services` |
| It does not save transcript text. | 6 | `no-transcript-storage` |

## First-screen read-aloud check

“Read streaming chats without losing your place. For screen-reader users who need stable headings, links, and copy controls in long browser chats. Try it with sample data.”

The job, audience, and first action fit in one breath.

## Terminology

| Concept | One term used |
| --- | --- |
| Semantic reading surface | reader |
| Ordered local output | transcript |
| One speaker turn | message |
| Stored return position | saved place |
| Permitted web origin | enabled site |
| Isolated sample experience | demo |
