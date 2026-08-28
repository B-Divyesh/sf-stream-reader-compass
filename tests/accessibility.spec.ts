import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const route of ['/', '/demo', '/privacy', '/terms']) {
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

test('route navigation moves focus to the new page heading', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL('/demo');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
});

test('internal site links resolve', async ({ page, request }) => {
  await page.goto('/');
  const hrefs = await page.locator('a[href]').evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).getAttribute('href')!));
  for (const href of [...new Set(hrefs)].filter((href) => href.startsWith('/'))) {
    const response = await request.get(href);
    expect(response.ok(), `${href} should resolve`).toBeTruthy();
  }
});
