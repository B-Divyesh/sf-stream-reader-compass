# Perfection-loop polish 5

Completed 2026-08-29 from release candidate `5aae7d2a1ad2c676fb9770fbe14ec6b4ebfa036e` and review commit `924f1f7ee72242c48f47081e186c3429f35e964c`. Repair commits: `3feedb43aec3ef98654c893ceb0078df4ee34481` and `5d3d0b69147e560f995f62b4e9bb86723d93bc33`. Production deploy: Azure Static Web Apps deployment `c4d87c1c-4339-4981-a57c-d0d049c71903` at <https://stream-reader-compass.sociobot.in>.

## Finding map

| Finding | Change made or preserved | Evidence and cold live check |
| --- | --- | --- |
| F-1-1 | Kept optional HTTP(S) host permissions, explicit popup consent, runtime injection, and permission removal. No automatic content script or required host permission exists. | `@claim:site-consent`, `@claim:site-disable-removes-access`; deployed ZIP SHA-256 matched local. [Live home](https://stream-reader-compass.sociobot.in/) and downloaded manifest checked. |
| F-1-2 | Kept the README feature inventory as two short sentences. | `plain-language release copy`; [live home mobile](.factory/evidence/polish-5/live-home-mobile.png). |
| F-1-3 | Kept one-click demo isolation and J/K navigation as individually inventoried claims. | `@claim:demo-one-click-isolation`, `@claim:heading-key-navigation`; [live demo](https://stream-reader-compass.sociobot.in/?demo=1), [demo screenshot](.factory/evidence/polish-5/live-demo-mobile.png). |
| F-1-4 | Kept **Exit demo and install extension** and its clearing/install explanation. | `@claim:demo-one-click-isolation`; [live demo](https://stream-reader-compass.sociobot.in/?demo=1). |
| F-1-5 | Kept the shared header and footer on SPA and static 404 pages. | `unknown routes show the designed 404 page`; [live unknown route](https://stream-reader-compass.sociobot.in/missing-polish-5), [404 screenshot](.factory/evidence/polish-5/live-404-desktop.png). |
| F-1-6 | Kept literal **Preview of a stable transcript** and **Page not found** headings. | First-screen and 404 browser tests; [live home](https://stream-reader-compass.sociobot.in/) and [live 404](https://stream-reader-compass.sociobot.in/missing-polish-5). |
| F-2-1 | Kept top-rule-only motion; transcript text remains fully opaque on entry and reset. | `demo text keeps full contrast immediately after entry and reset`; live Axe in `verify:live`; [demo screenshot](.factory/evidence/polish-5/live-demo-mobile.png). |
| F-2-2 | Kept the self-contained-site claim and same-origin request assertion. | `@claim:site-self-contained`; cold [live home](https://stream-reader-compass.sociobot.in/) and demo request checks. |
| F-2-3 | Kept the direct first-screen eyebrow **Browser extension for screen-reader users**. | First-screen browser test; [mobile screenshot](.factory/evidence/polish-5/live-home-mobile.png). |
| F-2-4 | Kept visitor wording that each heading stays with its message. | `@claim:message-headings`; [live how-it-works section](https://stream-reader-compass.sociobot.in/#how). |
| F-2-5 | Kept visitor terms **demo**, **saved place**, and **enabled site**; refreshed the copy audit. | `@claim:demo-one-click-isolation`, `@claim:resume-marker`; [live demo](https://stream-reader-compass.sociobot.in/?demo=1). |
| F-2-6 | Kept direct preview, demo, and 404 labels without editorial lore. | `plain-language release copy`; [home](https://stream-reader-compass.sociobot.in/), [demo](https://stream-reader-compass.sociobot.in/?demo=1), and [404](https://stream-reader-compass.sociobot.in/missing-polish-5). |
| F-2-7 | Kept the README limitation in user terms about changed chat layouts. | `plain-language release copy`; [live install route](https://stream-reader-compass.sociobot.in/install). |
| F-3-1 | Kept pause reset on close and packaged-reader update delivery after reopen. | `@claim:pause-updates`; packaged MV3 reader browser test. |
| F-3-2 | Kept the untested public Alt+Shift+R instruction removed. | `plain-language release copy`; [live install](https://stream-reader-compass.sociobot.in/install), [install screenshot](.factory/evidence/polish-5/verify-install/screenshot-mobile.png). |
| F-3-3 | Kept public wording as **browser extension**, without a blanket Chrome-compatibility promise. | `the documented ZIP loads in the pinned Chromium browser`; [live install](https://stream-reader-compass.sociobot.in/install). |
| F-3-4 | Kept the real `/install` route and h1 focus on demo exit and browser Back. | `exiting the demo and going Back both move focus to the route heading`; [live demo](https://stream-reader-compass.sociobot.in/?demo=1). |
| F-3-5 | Kept result-naming **Go to previous message** and **Go to next message** labels. | `plain-language release copy`; [live demo](https://stream-reader-compass.sociobot.in/?demo=1). |
| F-3-6 | Kept **transcript** as the only public term for the ordered reader output. | `plain-language release copy`; [live home](https://stream-reader-compass.sociobot.in/). |
| F-3-7 | Kept the README description of audible new-message feedback and retained focus. | `@claim:polite-updates`; packaged-reader test. |
| F-3-8 | Kept the plain statement that site scripts, styles, and fonts load only from its domain. | `@claim:site-self-contained`; [live home](https://stream-reader-compass.sociobot.in/). |
| F-4-1 | Kept the listed and tested site-disable privacy control. | `@claim:site-disable-removes-access`; [live privacy](https://stream-reader-compass.sociobot.in/privacy), [privacy screenshot](.factory/evidence/polish-5/live-privacy-desktop.png). |
| F-4-2 | Kept the untestable uninstall-deletion guarantee absent. | `plain-language release copy`, live verifier absence assertion; [live privacy](https://stream-reader-compass.sociobot.in/privacy). |
| F-4-3 | Kept **Navigate, save, copy, or export** as the step-three heading. | `plain-language release copy`; [live home](https://stream-reader-compass.sociobot.in/#how). |
| F-4-4 | Kept the literal page-order caption and its assertion. | `@claim:message-headings`; [home screenshot](.factory/evidence/polish-5/live-home-desktop.png). |
| F-5-1 | Added the `storage-locations` claim and expanded the real shipped-ZIP popup test. It unpacks the package, enables a fixture site through the popup, verifies Chrome permission and `enabledOrigins` only in sync storage, saves a reader place, verifies the resume key only in local storage, and rejects transcript text in both stores. The copy audit and live verifier now inventory/check the disclosure. | `@claim:storage-locations`; [live privacy](https://stream-reader-compass.sociobot.in/privacy), [privacy screenshot](.factory/evidence/polish-5/live-privacy-desktop.png), deployed ZIP SHA-256 `ef45cf975dd8e9086cdb99812b6353430c9c26149acec6a7c09dd47581efb9cc`. |

## Verification

- Clean clone: `/tmp/stream-reader-compass-polish5-final-clean-Yc8dAO` at `5d3d0b69147e560f995f62b4e9bb86723d93bc33` after `npm ci`.
- All 19 exact claim commands listed in `.factory/claims.json` passed independently, including the new `@claim:storage-locations` command.
- Clean clone quality gates passed: `npm test` (53/53), `npm run test:unit` (5/5), `npm run typecheck`, `npm run lint`, `npm run build`, `npm audit --audit-level=high`, and `npm audit --omit=dev --audit-level=high` (zero vulnerabilities). The build produced `dist/site/` and a byte-identical packaged ZIP.
- Post-deploy `npm run verify:live -- https://stream-reader-compass.sociobot.in .factory/evidence/polish-5` passed desktop/mobile routes, metadata, Axe, 44 px controls, responsive layout, one-click demo isolation/reset/exit/Back focus, privacy copy, real 404, same-origin links, and reduced motion.
- Factory `verify-url.sh` passed `/`, `/?demo=1`, `/install`, `/privacy`, and `/terms`: each was HTTP 200 with no console errors, `lang=en`, one h1, one main, and no missing image alt text.
- Mobile Lighthouse JSON at `.factory/evidence/polish-5/lighthouse-mobile.json`: performance 100, accessibility 100, best practices 100, SEO 100; FCP 768 ms, LCP 1,204 ms, TBT 2 ms, CLS 0.

No finding from reviews 1–5 remains unresolved.
