# Demo sandbox

- URL: `https://stream-reader-compass.sociobot.in/?demo=1` (local: `http://127.0.0.1:4173/?demo=1`). The `/demo` route remains a supported alias.
- Sample: four messages from a realistic keyboard-access support chat, including two external reference links. A fifth sample reply can be added to test polite updates.
- Reset: choose **Reset demo** in the persistent yellow banner.
- Leave: choose **Exit demo and install extension**. This removes demo keys before opening the install section.
- Storage: the demo reads and writes only local storage keys prefixed with `demo:`. The current version uses `demo:resume`. It never reads extension storage or real page data.
- Network: all demo code, styles, images, and sample content are same-origin. Tests reject off-origin requests during the demo flow.
