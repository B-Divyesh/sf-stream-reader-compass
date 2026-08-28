# Stream Reader Compass

Read streaming browser chats without losing your place.

Stream Reader Compass is a free browser extension for screen-reader users. It turns visible chat messages into a local transcript with lasting message headings, named links, and copy controls. You can export the transcript and save your place. The reader announces new messages without interrupting you or moving focus.

Conversation text stays in the browser. The extension does not use analytics, accounts, models, or remote APIs. Each site must be enabled from the extension popup before the reader works there.

## Try the demo

Open `/?demo=1` or visit <https://stream-reader-compass.sociobot.in/?demo=1>. The sample chat opens in one click and uses only `demo:` local storage keys. Reset it from the yellow banner.

## Install the packaged extension

1. Download `stream-reader-compass-chrome.zip` from the site.
2. Extract the ZIP.
3. Open `chrome://extensions` or `edge://extensions`.
4. Turn on developer mode.
5. Choose **Load unpacked** and select the extracted folder.
6. Open a browser chat, choose the extension, and select **Enable on this site**.
7. Select **Open transcript reader**.

Inside the reader, press J or K to move between message headings. Escape closes the reader.

## Develop

Requirements: Node.js 20 or newer and npm.

```sh
npm install
npm run dev             # landing site on localhost
npm run dev:extension   # WXT extension development
npm test                # Playwright claims and accessibility checks
npm run test:unit       # focused TypeScript unit checks
npm run lint            # TypeScript lint/type check
npm run build           # extension, ZIP, and static site
```

The exact production command is `npm run build`. It creates:

- `.output/chrome-mv3/` — unpacked Manifest V3 extension
- `dist/site/` — deployable static site with `index.html` at its root
- `dist/site/downloads/stream-reader-compass-chrome.zip` — packaged extension

The website loads scripts, styles, and fonts only from its own domain. The generated hero source and prompt are in `assets/src/`.

## Privacy and limits

Your enabled sites use Chrome sync storage. Chrome stores each granted site permission. Your saved place uses local extension storage. Transcript text is never stored. See `/privacy` for the full notice and `/terms` for terms.

Websites change. If a website changes its chat layout, message detection may need an update. This extension does not summarize or send chat content. It does not save transcript text.

## License

MIT. See [LICENSE](LICENSE).
