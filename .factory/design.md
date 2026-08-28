# Stream Reader Compass — visual thesis

## Direction

**Monochrome typographic broadsheet.** A long chat becomes a calm, numbered edition that can be scanned like a newspaper column. The style avoids chat bubbles and app chrome. Heavy rules mark major sections, hairlines separate messages, and large folio numbers make position tangible. This fits the product because the interface turns an unstable stream into a durable reading record.

The single-mode palette is deliberate. A warm paper field reduces glare while near-black ink preserves strong contrast. A single safety-yellow “marker” color identifies the reader's saved place without becoming decorative.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#f2efe6` | page background |
| `--paper-raised` | `#fffdf7` | reader surface |
| `--ink` | `#171713` | primary text, 15.4:1 on paper |
| `--ink-soft` | `#55554e` | supporting text, 6.7:1 on paper |
| `--rule` | `#76766d` | non-text rules and boundaries |
| `--marker` | `#f0c94d` | saved-place highlight |
| `--marker-ink` | `#171713` | text on marker |
| `--danger` | `#8a2921` | errors, 7.1:1 on paper |
| `--success` | `#245f3e` | confirmations, 6.7:1 on paper |

## Type and spacing

- Display: Georgia, Cambria, `Times New Roman`, serif. The familiar editorial shapes make headings easy to distinguish without a font download.
- Body and controls: Arial, Helvetica, sans-serif. Its neutral forms keep operational copy direct.
- Data and folios: `ui-monospace`, SFMono-Regular, Consolas, monospace with tabular figures.
- Scale: 14, 16, 19, 24, 36, and clamp(48–80) px.
- Measure: prose stays below 68 characters. Transcript text stays below 72 characters.
- Spacing uses an 8 px base: 4, 8, 16, 24, 32, 48, 64, 96.

## Layout and shape

The landing page reads as a front page: masthead, oversized lead story, adjacent illustration, then a full-width reader specimen. Sections alternate between open paper and ruled columns. Corners stay square. Buttons resemble edition labels with two-pixel ink borders and a slight offset shadow. Links remain underlined.

The extension reader is an inset broadsheet. Each message has an edition number, a heading, stable anchor, and copy control. A yellow left rule marks the resume point. No meaning depends on color.

At 390 px, columns stack, folio numbers shrink, and secondary masthead copy disappears. No controls are removed. Touch targets remain at least 44 px.

## Interaction grammar

- Primary actions are ink-filled rectangular labels.
- Secondary actions are underlined text or paper buttons with ink borders.
- Focus uses a 3 px ink outline plus a 3 px paper gap.
- Status changes use concise polite live announcements.
- Route changes focus the new `h1`; back and forward restore route state.
- New transcript messages enter under a moving horizontal rule, like a line added by a compositor.

## Motion policy

The signature motion is a 220 ms “press line”: a new message fades in and rises 6 px while its top rule draws left to right. Controls move only through pressed shadows. With `prefers-reduced-motion: reduce`, transforms and rule drawing stop; content appears immediately with a brief background tint. Nothing loops or flashes.

## Original asset plan and provenance

- Hero: an original editorial still life showing long paper strips aligned into a navigable column, produced as a monochrome ink-and-paper collage. It explains turning a loose stream into stable reading order.
- Social preview: a deterministic crop/composition derived from the same original art, with live HTML metadata supplying all readable words.
- Product icons and wordmark: hand-authored CSS/SVG geometric marks based on a compass notch and horizontal reading rules.

### Generation prompt sheet

Use case: stylized-concept. Asset type: wide landing hero and social crop. Subject: an abstract stream of narrow paper transcript strips being aligned by a small brass compass needle into one orderly newspaper column. World: an editorial printmaker's table. Materials: fibrous newsprint, black letterpress ink, a single muted yellow registration mark. Light: soft raking studio light with tactile shadows. Lens/composition: wide overhead view, strong negative space, clear left-to-right flow. Palette words: warm ivory, charcoal black, muted registration yellow. Negative list: no people, no hands, no screens, no logos, no readable text, no letters, no watermark, no gradients, no blue or purple, no glossy 3D render.

Generated on 2026-08-28 with the factory image deployment using `/opt/fleet/lib/gen-image.sh`. Generated work is original to this product. Source PNG and prompt sidecar live in `assets/src/`; responsive AVIF and WebP files plus a JPEG fallback ship with the site.

## Accessibility rationale

The paper treatment is explicit rather than theme-dependent. Text contrast exceeds 4.5:1, large serif headings differ by both size and family, visible labels accompany every icon, and rules never carry meaning alone. The visual concept supports rather than replaces semantic headings, landmarks, links, lists, and live regions.
