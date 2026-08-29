import AxeBuilder from '@axe-core/playwright';
import { chromium, request } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const baseUrl = new URL(process.argv[2] || 'https://stream-reader-compass.sociobot.in');
const evidenceDir = path.resolve(process.argv[3] || 'test-results/live-verification');
await mkdir(evidenceDir, { recursive: true });

function check(condition, message) {
  if (!condition) throw new Error(message);
}

const routes = [
  ['/', 'Stream Reader Compass — Read streaming chats', 200],
  ['/?demo=1', 'Demo — Stream Reader Compass', 200],
  ['/demo', 'Demo — Stream Reader Compass', 200],
  ['/install', 'Install — Stream Reader Compass', 200],
  ['/privacy', 'Privacy — Stream Reader Compass', 200],
  ['/terms', 'Terms — Stream Reader Compass', 200],
  ['/missing-polish-4', 'Page not found — Stream Reader Compass', 404]
];

const browser = await chromium.launch({ headless: true });
const http = await request.newContext();
const results = [];

try {
  for (const viewport of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const runtimeErrors = [];
    let expectedNavigationStatus = 200;
    page.on('console', (message) => {
      if (message.type() === 'error' && expectedNavigationStatus !== 404) runtimeErrors.push(message.text());
    });
    page.on('pageerror', (error) => runtimeErrors.push(error.message));

    for (const [route, title, status] of routes) {
      expectedNavigationStatus = status;
      const response = await page.goto(new URL(route, baseUrl).href, { waitUntil: 'networkidle' });
      check(response?.status() === status, `${route} returned ${response?.status()}, expected ${status}`);
      check(await page.title() === title, `${route} title did not match`);
      check(await page.locator('html').getAttribute('lang') === 'en', `${route} has no English lang`);
      check(await page.locator('main').count() === 1, `${route} does not have one main`);
      check(await page.locator('h1').count() === 1, `${route} does not have one h1`);
      check(await page.locator('meta[name="description"]').getAttribute('content'), `${route} has no description`);
      check(await page.locator('link[rel="canonical"]').getAttribute('href'), `${route} has no canonical URL`);
      check(await page.locator('meta[property="og:image"]').getAttribute('content'), `${route} has no social image`);
      check(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), `${route} overflows horizontally`);
      const axe = await new AxeBuilder({ page }).analyze();
      const severe = axe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''));
      check(severe.length === 0, `${route} has serious Axe violations: ${severe.map(({ id }) => id).join(', ')}`);
      const undersized = await page.locator('a[href], button').evaluateAll((controls) => controls
        .filter((control) => {
          const style = getComputedStyle(control);
          return style.display !== 'none' && style.visibility !== 'hidden' && control.getClientRects().length > 0;
        })
        .map((control) => {
          const rect = control.getBoundingClientRect();
          return { label: control.textContent?.trim(), width: rect.width, height: rect.height };
        })
        .filter(({ width, height }) => width < 44 || height < 44));
      check(undersized.length === 0, `${route} has undersized controls: ${JSON.stringify(undersized)}`);
    }

    check(runtimeErrors.length === 0, `${viewport.name} emitted errors: ${runtimeErrors.join(' | ')}`);
    await page.goto(new URL('/', baseUrl).href, { waitUntil: 'networkidle' });
    if (viewport.name === 'mobile') {
      check(await page.getByRole('heading', { level: 1 }).textContent() === 'Read streaming chats without losing your place', 'First-screen headline changed');
      check(await page.locator('.hero-art figcaption').textContent() === 'The reader numbers visible chat messages in their page order.', 'Hero result caption changed');
      check(await page.getByRole('heading', { level: 3, name: 'Navigate, save, copy, or export' }).count() === 1, 'Step-three heading changed');
      const firstScreen = await page.locator('.plain-facts li').last().boundingBox();
      check(firstScreen && firstScreen.y + firstScreen.height <= viewport.height, 'The three product facts are not visible on the first screen');
    }
    await page.screenshot({ path: path.join(evidenceDir, `live-home-${viewport.name}.png`), fullPage: true });
    await context.close();
    results.push(`${viewport.name} routes, metadata, Axe, controls, and layout: PASS`);
  }

  const demoContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const demoPage = await demoContext.newPage();
  const offOrigin = [];
  demoPage.on('request', (outgoing) => {
    if (new URL(outgoing.url()).origin !== baseUrl.origin) offOrigin.push(outgoing.url());
  });
  await demoPage.goto(new URL('/', baseUrl).href, { waitUntil: 'networkidle' });
  await demoPage.evaluate(() => localStorage.setItem('real:sentinel', 'keep'));
  await demoPage.getByRole('link', { name: 'Try it with sample data' }).click();
  check(new URL(demoPage.url()).searchParams.get('demo') === '1', 'One-click action did not enter ?demo=1');
  check(await demoPage.getByRole('heading', { level: 1 }).evaluate((heading) => heading === document.activeElement), 'Demo heading did not receive focus');
  check(await demoPage.locator('.demo-message').count() === 4, 'Demo did not open with four messages');
  check((await demoPage.getByRole('region', { name: 'Demo controls' }).textContent())?.includes('Demo — sample data, nothing is saved'), 'Demo banner is missing');
  await demoPage.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await demoPage.screenshot({ path: path.join(evidenceDir, 'live-demo-mobile.png'), fullPage: true });
  await demoPage.getByRole('button', { name: 'Save my place here' }).nth(2).click();
  check(JSON.stringify(await demoPage.evaluate(() => Object.fromEntries(Object.entries(localStorage)))) === JSON.stringify({ 'demo:resume': 'sample-3', 'real:sentinel': 'keep' }), 'Demo wrote outside its namespace');
  await demoPage.getByRole('button', { name: 'Add sample reply' }).click();
  check(await demoPage.locator('.demo-message').count() === 5, 'Demo reply did not appear');
  await demoPage.getByRole('button', { name: 'Reset demo' }).click();
  check(await demoPage.locator('.demo-message').count() === 4, 'Demo reset did not restore four messages');
  check(JSON.stringify(await demoPage.evaluate(() => Object.fromEntries(Object.entries(localStorage)))) === JSON.stringify({ 'real:sentinel': 'keep' }), 'Demo reset touched real storage');
  await demoPage.getByRole('link', { name: 'Exit demo and install extension' }).click();
  check(await demoPage.getByRole('heading', { level: 1, name: 'Install the extension' }).evaluate((heading) => heading === document.activeElement), 'Install heading did not receive focus');
  await demoPage.goBack();
  check(await demoPage.getByRole('heading', { level: 1, name: 'Read this conversation in order' }).evaluate((heading) => heading === document.activeElement), 'Demo Back navigation did not restore heading focus');
  check(offOrigin.length === 0, `Demo made off-origin requests: ${offOrigin.join(', ')}`);
  await demoContext.close();
  results.push('one-click demo, isolated storage, reset, exit, Back focus, and network: PASS');

  const privacyContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const privacyPage = await privacyContext.newPage();
  await privacyPage.goto(new URL('/privacy', baseUrl).href, { waitUntil: 'networkidle' });
  const privacyText = await privacyPage.locator('main').innerText();
  check(privacyText.includes('Disable a site from the extension popup to remove its access.'), 'Tested disable control is absent');
  check(!privacyText.includes('Remove the extension to delete its local data.'), 'Untested uninstall promise remains');
  await privacyPage.screenshot({ path: path.join(evidenceDir, 'live-privacy-desktop.png'), fullPage: true });
  await privacyPage.goto(new URL('/missing-polish-4', baseUrl).href, { waitUntil: 'networkidle' });
  await privacyPage.screenshot({ path: path.join(evidenceDir, 'live-404-desktop.png'), fullPage: true });
  await privacyContext.close();
  results.push('privacy control wording and real 404: PASS');

  const linkPageContext = await browser.newContext();
  const linkPage = await linkPageContext.newPage();
  const hrefs = new Set();
  for (const route of ['/', '/install', '/privacy', '/terms']) {
    await linkPage.goto(new URL(route, baseUrl).href, { waitUntil: 'networkidle' });
    for (const href of await linkPage.locator('a[href]').evaluateAll((links) => links.map((link) => link.href))) hrefs.add(href);
  }
  for (const href of hrefs) {
    if (href.startsWith('mailto:') || new URL(href).origin !== baseUrl.origin) continue;
    const response = await http.get(href);
    check(response.status() < 400, `${href} returned ${response.status()}`);
  }
  await linkPageContext.close();
  results.push(`${hrefs.size} discovered links; all same-origin HTTP targets: PASS`);

  const reducedContext = await browser.newContext({ reducedMotion: 'reduce' });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(new URL('/?demo=1', baseUrl).href, { waitUntil: 'networkidle' });
  const reducedDuration = await reducedPage.locator('.demo-message').first().evaluate((message) => getComputedStyle(message, '::before').animationDuration);
  check(['0.01ms', '1e-05s'].includes(reducedDuration), `Reduced motion is not applied: ${reducedDuration}`);
  await reducedContext.close();
  results.push('reduced-motion treatment: PASS');
} finally {
  await http.dispose();
  await browser.close();
}

for (const result of results) console.log(result);
