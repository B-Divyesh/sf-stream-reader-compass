# Stream Reader Compass verification handoff

## Release status

**PASS — release approved.** Independent verification completed on 2026-08-28 for candidate `892747aa72f383f6816719917a1c38f188caee82` at `https://stream-reader-compass.sociobot.in`.

## What was verified

- A clean `npm ci`, all 14 exact `.factory/claims.json` commands, `npm test` (34 Playwright tests), `npm run test:unit` (2 tests), typecheck, lint, production build, and both high-severity audit commands all passed.
- The live first screen gives a plain-language job, audience, and visible one-click **Try it with sample data** action. `/demo` is a separate `demo:` local-storage sandbox with the persistent reset/start-for-real banner.
- In a fresh Chromium profile, the exact downloaded live extension rejected reading before per-site enablement, opened four local semantic message headings after enabling the live origin, and closed with Escape. Packaged tests cover streaming focus preservation, stable resume anchors, hidden-content exclusion, duplicate messages, clean export, and modal keyboard containment.
- Live desktop and 390 px mobile checks found no serious/critical Axe issues, no normal-route console/page errors, no horizontal overflow, and no visible controls under 44 px. Keyboard skip, J/K navigation, pause/resume, focus styling, and reduced motion passed.
- Live demo requests were all same-origin. CSP and security headers were present; immutable caching and AVIF content type were correct. The live HTML/JS/CSS byte-match the candidate build; all extracted extension files match despite ZIP timestamp metadata differences.

## How to run

```sh
npm ci
npm test
npm run test:unit
npm run typecheck
npm run lint
npm run build
```

For the full evidence, including claim-by-claim results and headers, see `.factory/verification-2.md`.

## Known limits and next steps

The reader intentionally covers currently mounted, visible generic chat markup. Closed shadow roots, cross-origin frames, and aggressively virtualized chat history may require an adapter. Store signing and Firefox packaging remain release-pipeline work. No release-blocking defects were found.
