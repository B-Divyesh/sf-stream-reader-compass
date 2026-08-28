import { chromium, expect, test } from '@playwright/test';
import path from 'node:path';

test('@claim:site-consent blocks reading until the current origin is enabled', async ({}, testInfo) => {
  const extensionPath = path.resolve('.output/chrome-mv3');
  const context = await chromium.launchPersistentContext(testInfo.outputPath('profile'), {
    headless: false,
    args: [
      '--headless=new',
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`
    ]
  });
  try {
    let worker = context.serviceWorkers()[0];
    if (!worker) worker = await context.waitForEvent('serviceworker');
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4173/demo');
    const tabId = await worker.evaluate(async () => {
      const tabs = await chrome.tabs.query({ url: 'http://127.0.0.1:4173/demo' });
      return tabs[0].id!;
    });
    const blocked = await worker.evaluate(async (id) => chrome.tabs.sendMessage(id, { type: 'OPEN_READER' }), tabId);
    expect(blocked).toEqual({ ok: false, error: 'Enable the reader for this site first.' });
    await expect(page.locator('#stream-reader-compass-host')).toHaveCount(0);

    await worker.evaluate(async () => chrome.storage.sync.set({ enabledOrigins: ['http://127.0.0.1:4173'] }));
    const opened = await worker.evaluate(async (id) => chrome.tabs.sendMessage(id, { type: 'OPEN_READER' }), tabId);
    expect(opened).toEqual({ ok: true });
    await expect(page.locator('#stream-reader-compass-host')).toHaveCount(1);
    const headingCount = await page.locator('#stream-reader-compass-host').evaluate((host) => host.shadowRoot!.querySelectorAll('article h2').length);
    expect(headingCount).toBe(4);
  } finally {
    await context.close();
  }
});
