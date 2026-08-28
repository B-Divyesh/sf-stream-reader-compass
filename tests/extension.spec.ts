import { chromium, expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { cp, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

async function fixtureExtensionPath(outputPath: (name: string) => string): Promise<string> {
  const shippedPath = path.resolve('.output/chrome-mv3');
  const fixturePath = outputPath('extension-with-local-fixture-access');
  await cp(shippedPath, fixturePath, { recursive: true });
  const manifestPath = path.join(fixturePath, 'manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  manifest.host_permissions = ['http://127.0.0.1:4173/*'];
  await writeFile(manifestPath, JSON.stringify(manifest));
  return fixturePath;
}

test('@claim:site-consent @claim:no-transcript-storage blocks reading until enablement and keeps message text out of storage', async ({}, testInfo) => {
  const shippedPath = path.resolve('.output/chrome-mv3');
  const extensionPath = await fixtureExtensionPath(testInfo.outputPath.bind(testInfo));
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
    const extensionId = new URL(worker.url()).hostname;
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);
    const popupAxe = await new AxeBuilder({ page: popup as never }).analyze();
    expect(popupAxe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
    await popup.close();
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4173/?demo=1');
    const tabId = await worker.evaluate(async () => {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      return tabs[0]!.id!;
    });
    const manifest = JSON.parse(await readFile(path.join(shippedPath, 'manifest.json'), 'utf8'));
    expect(manifest.host_permissions).toBeUndefined();
    expect(manifest.content_scripts).toBeUndefined();
    expect(manifest.optional_host_permissions).toEqual(['http://*/*', 'https://*/*']);
    expect(manifest.permissions).toContain('scripting');
    expect(await worker.evaluate(async () => chrome.scripting.getRegisteredContentScripts())).toEqual([]);
    const receiverBeforeEnablement = await worker.evaluate(async (id) => {
      try {
        await chrome.tabs.sendMessage(id, { type: 'OPEN_READER' });
        return true;
      } catch {
        return false;
      }
    }, tabId);
    expect(receiverBeforeEnablement).toBe(false);
    await expect(page.locator('#stream-reader-compass-host')).toHaveCount(0);

    await worker.evaluate(async () => chrome.storage.sync.set({ enabledOrigins: ['http://127.0.0.1:4173'] }));
    await worker.evaluate(async (id) => chrome.scripting.executeScript({ target: { tabId: id }, files: ['content-scripts/content.js'] }), tabId);
    const opened = await worker.evaluate(async (id) => chrome.tabs.sendMessage(id, { type: 'OPEN_READER' }), tabId);
    expect(opened).toEqual({ ok: true });
    await expect(page.locator('#stream-reader-compass-host')).toHaveCount(1);
    const headingCount = await page.locator('#stream-reader-compass-host').evaluate((host) => host.shadowRoot!.querySelectorAll('article h2').length);
    expect(headingCount).toBe(4);
    const stored = await worker.evaluate(async () => ({
      local: await chrome.storage.local.get(null),
      sync: await chrome.storage.sync.get(null)
    }));
    expect(JSON.stringify(stored)).not.toContain('checkout button works with a mouse');
    await page.locator('#stream-reader-compass-host').evaluate((host) => (host.shadowRoot!.querySelector('button.close') as HTMLButtonElement).click());
    await page.goto('http://127.0.0.1:4173/privacy');
    const privacyTab = await worker.evaluate(async () => {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      return tabs[0]!.id!;
    });
    await worker.evaluate(async (id) => chrome.scripting.executeScript({ target: { tabId: id }, files: ['content-scripts/content.js'] }), privacyTab);
    await worker.evaluate(async (id) => chrome.tabs.sendMessage(id, { type: 'OPEN_READER' }), privacyTab);
    const emptyHeading = await page.locator('#stream-reader-compass-host').evaluate((host) => host.shadowRoot!.querySelector('.empty h2')?.textContent);
    expect(emptyHeading).toBe('No chat messages found');
  } finally {
    await context.close();
  }
});

test('@claim:local-processing @claim:semantic-record @claim:text-export @claim:copy-controls @claim:link-lists @claim:resume-marker @claim:polite-updates @claim:no-remote-services @claim:escape-close @claim:heading-key-navigation preserves real-reader records and focus while a page streams', async ({}, testInfo) => {
  const extensionPath = await fixtureExtensionPath(testInfo.outputPath.bind(testInfo));
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
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://127.0.0.1:4173' });
    const page = await context.newPage();
    const offOriginRequests: string[] = [];
    page.on('request', (request) => {
      if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') offOriginRequests.push(request.url());
    });
    await page.goto('http://127.0.0.1:4173/?demo=1');
    await page.setContent(`<!doctype html><html lang="en"><head><title>Streaming chat fixture</title></head><body><main>
      <article data-message-author-role="user"><p>Original A</p></article>
      <article data-message-author-role="assistant"><p>Original B target</p><a href="https://www.w3.org/WAI/ARIA/">WAI-ARIA reference</a><button>Copy this message</button><button>Save my place here</button></article>
      <article data-message-author-role="assistant"><p>Same visible reply</p></article>
      <article data-message-author-role="assistant"><p>Same visible reply</p></article>
      <article data-message-author-role="assistant" style="display:none"><p>HIDDEN PRIVATE SECRET</p></article>
    </main></body></html>`);
    await worker.evaluate(async () => chrome.storage.sync.set({ enabledOrigins: ['http://127.0.0.1:4173'] }));
    const tabId = await worker.evaluate(async () => {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      return tabs[0]!.id!;
    });
    await worker.evaluate(async (id) => chrome.scripting.executeScript({ target: { tabId: id }, files: ['content-scripts/content.js'] }), tabId);
    await context.setOffline(true);
    expect(await worker.evaluate(async (id) => chrome.tabs.sendMessage(id, { type: 'OPEN_READER' }), tabId)).toEqual({ ok: true });
    const reader = page.locator('#stream-reader-compass-host');
    await expect(reader).toHaveCount(1);
    const readerAxe = await new AxeBuilder({ page: page as never }).analyze();
    expect(readerAxe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);

    await page.keyboard.press('j');
    expect(await reader.evaluate((host) => host.shadowRoot!.activeElement?.textContent)).toContain('message 1 of 4');
    await page.keyboard.press('j');
    expect(await reader.evaluate((host) => host.shadowRoot!.activeElement?.textContent)).toContain('message 2 of 4');
    await page.keyboard.press('k');
    expect(await reader.evaluate((host) => host.shadowRoot!.activeElement?.textContent)).toContain('message 1 of 4');

    const before = await reader.evaluate((host) => {
      const root = host.shadowRoot!;
      return {
        count: root.querySelectorAll('article').length,
        bodies: Array.from(root.querySelectorAll('.body')).map((body) => body.textContent),
        duplicateCount: Array.from(root.querySelectorAll('.body')).filter((body) => body.textContent === 'Same visible reply').length,
        link: root.querySelector<HTMLAnchorElement>('a[href="https://www.w3.org/WAI/ARIA/"]')?.textContent
      };
    });
    expect(before.count).toBe(4);
    expect(before.duplicateCount).toBe(2);
    expect(before.bodies.join('\n')).not.toContain('HIDDEN PRIVATE SECRET');
    expect(before.bodies.join('\n')).not.toContain('Copy this message');
    expect(before.link).toContain('WAI-ARIA reference');

    await reader.evaluate((host) => {
      const root = host.shadowRoot!;
      const article = Array.from(root.querySelectorAll<HTMLElement>('article')).find((item) => item.textContent?.includes('Original B target'))!;
      article.querySelector<HTMLButtonElement>('[data-copy]')!.click();
    });
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('Original B target');

    await reader.evaluate((host) => {
      const root = host.shadowRoot!;
      const article = Array.from(root.querySelectorAll<HTMLElement>('article')).find((item) => item.textContent?.includes('Original B target'))!;
      article.querySelector<HTMLButtonElement>('[data-resume]')!.click();
    });
    await expect.poll(() => reader.evaluate((host) => host.shadowRoot!.querySelector('.notice')?.textContent)).toContain('Place saved');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      reader.evaluate((host) => (host.shadowRoot!.querySelector('[data-action="export"]') as HTMLButtonElement).click())
    ]);
    const exported = await (await import('node:fs/promises')).readFile(await download.path() as string, 'utf8');
    expect(exported).toContain('Original B target');
    expect(exported).not.toContain('Copy this message');
    expect(exported).not.toContain('HIDDEN PRIVATE SECRET');

    await reader.evaluate((host) => {
      const root = host.shadowRoot!;
      const article = Array.from(root.querySelectorAll<HTMLElement>('article')).find((item) => item.textContent?.includes('Original B target'))!;
      article.querySelector<HTMLElement>('h2')!.focus();
    });
    await page.evaluate(() => {
      document.querySelector('main')!.insertAdjacentHTML('afterbegin', '<article data-message-author-role="user"><p>Inserted before the saved place</p></article>');
    });
    await expect.poll(() => reader.evaluate((host) => host.shadowRoot!.querySelectorAll('article').length)).toBe(5);
    const after = await reader.evaluate((host) => {
      const root = host.shadowRoot!;
      const saved = Array.from(root.querySelectorAll<HTMLElement>('article')).find((item) => item.textContent?.includes('Original B target'))!;
      return {
        saved: saved.classList.contains('saved'),
        activeInSaved: saved.contains(root.activeElement),
        status: root.querySelector('.notice')?.textContent
      };
    });
    expect(after.saved).toBe(true);
    expect(after.activeInSaved).toBe(true);
    expect(after.status).toContain('Your focus stayed in place');

    await reader.evaluate((host) => (host.shadowRoot!.querySelector('#src-title') as HTMLElement).focus());
    await page.keyboard.press('Shift+Tab');
    const trap = await reader.evaluate((host) => ({
      active: host.shadowRoot!.activeElement?.tagName,
      pageActive: document.activeElement?.tagName
    }));
    expect(trap.active).toBe('BUTTON');
    expect(trap.pageActive).toBe('DIV');
    await page.keyboard.press('Escape');
    await expect(reader).toHaveCount(0);
    expect(await worker.evaluate(async (id) => chrome.tabs.sendMessage(id, { type: 'OPEN_READER' }), tabId)).toEqual({ ok: true });
    await expect(reader).toHaveCount(1);
    const reopened = await reader.evaluate((host) => {
      const root = host.shadowRoot!;
      const saved = Array.from(root.querySelectorAll<HTMLElement>('article')).find((item) => item.textContent?.includes('Original B target'))!;
      return saved.classList.contains('saved') && saved.contains(root.activeElement);
    });
    expect(reopened).toBe(true);
    expect(offOriginRequests).toEqual([]);
  } finally {
    await context.close();
  }
});
