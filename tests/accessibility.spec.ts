import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const route of ['/', '/demo', '/privacy', '/terms', '/missing-page']) {
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
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page is off the record');
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

test('route navigation moves focus to the new page heading', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL('/demo');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
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
