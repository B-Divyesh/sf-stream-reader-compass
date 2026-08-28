import { expect, test } from '@playwright/test';

test('@claim:local-processing keeps the complete demo flow on the same origin', async ({ page }) => {
  const offOrigin: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') offOrigin.push(request.url());
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Add sample reply' }).click();
  await page.getByRole('button', { name: 'Save my place here' }).first().click();
  await expect(page.getByRole('status').filter({ hasText: 'Place saved' })).toBeVisible();
  expect(offOrigin).toEqual([]);
});

test('@claim:semantic-record exposes one stable heading and anchor per message', async ({ page }) => {
  await page.goto('/demo');
  const messages = page.locator('.demo-message');
  await expect(messages).toHaveCount(4);
  await expect(page.locator('.demo-message[id] h3')).toHaveCount(4);
  await expect(page.getByRole('heading', { level: 3 }).first()).toContainText('message 1 of 4');
});

test('@claim:text-export downloads every sample message as a text file', async ({ page }) => {
  await page.goto('/demo');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Export text file' }).click()
  ]);
  const text = await (await import('node:fs/promises')).readFile(await download.path() as string, 'utf8');
  expect(text).toContain('1. You');
  expect(text).toContain('4. Support response');
  expect(text).toContain('WAI-ARIA dialog pattern: https://www.w3.org/');
});

test('@claim:resume-marker returns focus to the saved message after reload', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Save my place here' }).nth(2).click();
  await page.reload();
  await expect(page.getByRole('status').filter({ hasText: 'Returned to your saved message' })).toBeVisible();
  await expect(page.locator('#sample-3 h3')).toBeFocused();
  await expect(page.locator('#sample-3')).toHaveClass(/marked/);
});

test('@claim:polite-updates announces a new reply without moving focus', async ({ page }) => {
  await page.goto('/demo');
  const add = page.getByRole('button', { name: 'Add sample reply' });
  await add.focus();
  await add.click();
  await expect(page.getByRole('status').filter({ hasText: 'One new message added' })).toBeVisible();
  await expect(add).toBeFocused();
  await expect(page.locator('.demo-message')).toHaveCount(5);
});

test('@claim:no-account-free presents the full demo without sign-in or payment', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Read this conversation in order');
  await expect(page.locator('input[type="email"], input[type="password"]')).toHaveCount(0);
  await page.goto('/');
  await expect(page.getByText('No account is needed.')).toBeVisible();
  await expect(page.getByText('Free to use.')).toBeVisible();
});
