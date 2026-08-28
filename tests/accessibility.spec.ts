import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const route of ['/', '/?demo=1', '/demo', '/privacy', '/terms', '/missing-page', '/404.html']) {
  test(`${route} has one h1, landmarks, and no serious accessibility issues`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
    expect(errors).toEqual([]);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow).toBe(false);
  });
}

test('unknown routes show the designed 404 page', async ({ page }) => {
  await page.goto('/missing-page');
  await expect(page).toHaveTitle('Page not found — Stream Reader Compass');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link').allTextContents()).resolves.toEqual(['Demo', 'How it works', 'Privacy']);
  await expect(page.getByRole('link', { name: 'Return to the front page' })).toBeVisible();
});

test('J and K move through transcript headings', async ({ page }) => {
  await page.goto('/demo');
  await page.keyboard.press('j');
  await expect(page.locator('#sample-1 h3')).toBeFocused();
  await page.keyboard.press('j');
  await expect(page.locator('#sample-2 h3')).toBeFocused();
  await page.keyboard.press('k');
  await expect(page.locator('#sample-1 h3')).toBeFocused();
});

test('demo text keeps full contrast immediately after entry and reset', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL('/?demo=1');
  const afterEntry = await new AxeBuilder({ page: page as never }).analyze();
  expect(afterEntry.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
  expect(await page.locator('.demo-message').evaluateAll((messages) => messages.map((message) => getComputedStyle(message).opacity))).toEqual(['1', '1', '1', '1']);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  const afterReset = await new AxeBuilder({ page: page as never }).analyze();
  expect(afterReset.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
  expect(await page.locator('.demo-message').evaluateAll((messages) => messages.map((message) => getComputedStyle(message).opacity))).toEqual(['1', '1', '1', '1']);
});

test('route navigation moves focus to the new page heading', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL('/?demo=1');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
});

test('the first screen states the job, audience, action, outcome, and three facts', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Read streaming chats without losing your place');
  await expect(page.getByText('For screen-reader users who need stable headings, links, and copy controls in long browser chats.')).toBeVisible();
  const action = page.getByRole('link', { name: 'Try it with sample data' });
  await expect(action).toBeVisible();
  expect((await action.boundingBox())!.y).toBeLessThan(844);
  await expect(page.getByText('Opens a private sample transcript.')).toBeVisible();
  await expect(page.locator('.plain-facts li')).toHaveCount(3);
  await expect(page.getByRole('heading', { level: 2, name: 'Preview of a stable transcript' })).toBeVisible();
});

test('skip link moves keyboard focus to the main landmark', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('visible controls meet the 44px touch-target baseline', async ({ page }) => {
  for (const route of ['/', '/demo', '/privacy', '/terms']) {
    await page.goto(route);
    const undersized = await page.locator('a[href], button').evaluateAll((controls) => controls
      .filter((control) => {
        const style = getComputedStyle(control);
        return style.display !== 'none' && style.visibility !== 'hidden' && control.getClientRects().length > 0;
      })
      .map((control) => {
        const rect = control.getBoundingClientRect();
        return { label: (control.textContent || '').trim(), width: rect.width, height: rect.height };
      })
      .filter((control) => control.width < 44 || control.height < 44));
    expect(undersized, `${route} has undersized visible controls`).toEqual([]);
  }
});

test('internal site links resolve', async ({ page, request }) => {
  await page.goto('/');
  const hrefs = await page.locator('a[href]').evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).getAttribute('href')!));
  for (const href of [...new Set(hrefs)].filter((href) => href.startsWith('/'))) {
    const response = await request.get(href);
    expect(response.ok(), `${href} should resolve`).toBeTruthy();
  }
});

test('every route sets its own title, canonical URL, and social metadata', async ({ page }) => {
  const routes: Array<[string, string, string]> = [
    ['/', 'Stream Reader Compass — Read streaming chats', '/'],
    ['/?demo=1', 'Demo — Stream Reader Compass', '/?demo=1'],
    ['/privacy', 'Privacy — Stream Reader Compass', '/privacy'],
    ['/terms', 'Terms — Stream Reader Compass', '/terms'],
    ['/missing-page', 'Page not found — Stream Reader Compass', '/404']
  ];
  for (const [route, title, canonical] of routes) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://stream-reader-compass.sociobot.in${canonical}`);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', title);
  }
});

test('legal routes and the static 404 keep the complete site navigation', async ({ page }) => {
  for (const route of ['/privacy', '/terms', '/404.html']) {
    await page.goto(route);
    await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link').allTextContents()).resolves.toEqual(['Demo', 'How it works', 'Privacy']);
    await expect(page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link', { name: 'Privacy' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Footer navigation' }).getByRole('link', { name: 'Terms' })).toBeVisible();
  }
});
