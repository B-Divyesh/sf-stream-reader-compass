# Review-1 handoff — Stream Reader Compass

## Status

**FAIL.** This reviewer changed no product code. The review is recorded in `.factory/review-1.md`.

## Work completed

- Cold-read live checks at 390 px and desktop; full demo/sandbox and request-log checks; live metadata, routing, 404, link, and downloaded-extension-manifest checks.
- Clean `npm ci`; all 14 exact claims commands; `npm test` (34 tests); `npm run test:unit`; `npm run typecheck`; `npm run lint`; and `npm run build` all passed.
- Read prior verification/handoff records and checked each earlier finding in live code/site.

## Remaining work

The release blocker is the unchanged broad extension manifest permission: the live ZIP still grants and injects on every HTTP(S) site. Convert to optional per-origin permission and user-triggered injection, then repair the README claim inventory/copy and 404/header copy findings recorded in the review.

## Verification commands

```sh
npm ci
npm test
npm run test:unit
npm run typecheck
npm run lint
npm run build
```
