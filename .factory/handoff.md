# Stream Reader Compass — adversarial review 4 handoff

## Outcome

Adversarial review 4 is complete against production and commit `d587207bd40225d8e830fc78ef1695b0540f3e78`. Verdict: **FAIL** with four findings in `.factory/review-4.md`.

No product code was modified. The remaining work is:

- add claims and packaged-extension tests for disabling site access and uninstall data deletion, or remove those privacy statements;
- replace the generic **Read and act** heading;
- replace “Loose chat fragments become one numbered reading order” with literal product copy.

## Verification performed

- Fresh mobile 390 × 844 and desktop 1440 × 900 cold reads.
- One-click demo entry, realistic sample, banner, reset, exit, Back focus, storage isolation, and same-origin request logging.
- Every one of the 17 `.factory/claims.json` commands separately from clean clone `/tmp/stream-reader-compass-review4-clean-fVvbwv`.
- Full clean-clone suite: 52/52 Playwright tests and 5/5 unit tests.
- Typecheck, lint, build, and full/production dependency audits.
- Live route metadata, one-h1/main/lang checks, link crawl, touch targets, reduced motion, console errors, HTTP 404, security headers, and asset delivery.
- Factory `verify-url.sh` and standalone Axe CLI on home, demo, install, privacy, and terms.
- Live ZIP comparison against the clean build; both SHA-256 values are `3cde1dfcc220f2c112421122b4fcc9b1f821ca4e90b3c8514238771da08c1a01`.
- All findings from reviews 1–3 and earlier verification reports were rechecked live and in current code or the byte-identical package; none regressed.

## Reproduce

```sh
npm ci
npm test
npm run test:unit
npm run typecheck
npm run lint
npm run build
npm audit --audit-level=high
npm audit --omit=dev --audit-level=high
```

Run each `test` command in `.factory/claims.json` separately from a clean clone. Use `https://stream-reader-compass.sociobot.in/?demo=1` for the live sandbox.

## Known gaps

The four review findings remain open. All listed claim tests and technical quality gates pass, but the two privacy-control promises are outside the claim inventory, so the release cannot receive a zero-finding verdict.
