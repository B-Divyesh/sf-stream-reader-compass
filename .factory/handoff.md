# Stream Reader Compass — polish 5 handoff

## Outcome

Release candidate `5aae7d2a1ad2c676fb9770fbe14ec6b4ebfa036e` is repaired and deployed. Repair commits `3feedb43aec3ef98654c893ceb0078df4ee34481` and `5d3d0b69147e560f995f62b4e9bb86723d93bc33` add the missing `storage-locations` claim and a real shipped-ZIP extension assertion for the disclosed storage split. They also refresh the copy audit, live privacy verification, and verb-first catalog description.

The site is deployed through the static work-order configuration to <https://stream-reader-compass.sociobot.in>. Azure Static Web Apps deployment: `c4d87c1c-4339-4981-a57c-d0d049c71903`.

## How to run and verify

```sh
npm ci
npm test
npm run test:unit
npm run typecheck
npm run lint
npm run build
npm run verify:live -- https://stream-reader-compass.sociobot.in .factory/evidence/polish-5
```

For the claims contract, run every exact command in `.factory/claims.json`; all 19 commands passed independently from a clean clone at `5d3d0b69147e560f995f62b4e9bb86723d93bc33` in `/tmp/stream-reader-compass-polish5-final-clean-Yc8dAO`.

## Evidence

- Clean clone: `npm test` passed 53/53; `npm run test:unit` passed 5/5; typecheck, lint, build, and both high-severity audit modes passed with zero vulnerabilities.
- The build produced `dist/site/` and the extension ZIP. Local, built, and live ZIPs match SHA-256 `ef45cf975dd8e9086cdb99812b6353430c9c26149acec6a7c09dd47581efb9cc`.
- Cold live verification passed at 1440 × 900 and 390 × 844: all routes/titles/metadata, one-click `?demo=1` isolation and reset, focus management, 404, legal links, mobile layout, same-origin requests, reduced motion, and serious/critical Axe checks.
- Factory URL smoke checks passed for home, demo, install, privacy, and terms with no console errors, `lang=en`, one h1, one main, and image alt text.
- Mobile Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; FCP 768 ms, LCP 1,204 ms, TBT 2 ms, CLS 0. Evidence is under `.factory/evidence/polish-5/`.

## Known gaps and next steps

None. Every finding in reviews 1–5 is mapped and rechecked in `.factory/polish-5.md`.
