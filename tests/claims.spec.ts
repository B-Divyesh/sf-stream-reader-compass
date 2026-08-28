import { expect, test } from '@playwright/test';

test('demo keeps the complete sample flow on the same origin', async ({ page }) => {
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

test('@claim:demo-one-click-isolation opens sample data in one click and keeps only demo keys', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('real:untouched', 'keep'));
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL('/?demo=1');
  await expect(page.getByRole('region', { name: 'Demo controls' })).toContainText('Demo — sample data, nothing is saved');
  await expect(page.getByRole('link', { name: 'Exit demo and install extension' })).toBeVisible();
  await expect(page.getByText('Clears sample data and opens installation steps.')).toBeVisible();
  await expect(page.locator('.demo-message')).toHaveCount(4);
  await page.getByRole('button', { name: 'Save my place here' }).first().click();
  expect(await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)))).toEqual({
    'demo:resume': 'sample-1',
    'real:untouched': 'keep'
  });
  await page.getByRole('button', { name: 'Reset demo' }).click();
  expect(await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)))).toEqual({ 'real:untouched': 'keep' });
  await expect(page.locator('.demo-message')).toHaveCount(4);
});

test('demo exposes one stable heading and anchor per message', async ({ page }) => {
  await page.goto('/demo');
  const messages = page.locator('.demo-message');
  await expect(messages).toHaveCount(4);
  await expect(page.locator('.demo-message[id] h3')).toHaveCount(4);
  await expect(page.getByRole('heading', { level: 3 }).first()).toContainText('message 1 of 4');
});

test('demo downloads every sample message as a text file', async ({ page }) => {
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

test('demo copies one message or the complete transcript', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://127.0.0.1:4173' });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Copy this message' }).first().click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('checkout button works with a mouse');
  await page.getByRole('button', { name: 'Copy all messages' }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('1. You');
  expect(copied).toContain('4. Support response');
});

test('demo exposes named links from their source messages', async ({ page }) => {
  await page.goto('/demo');
  const link = page.locator('#sample-2').getByRole('link', { name: /WAI-ARIA dialog pattern/ });
  await expect(link).toHaveAttribute('href', 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/');
});

test('demo returns focus to the saved message after reload', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Save my place here' }).nth(2).click();
  await page.reload();
  await expect(page.getByRole('status').filter({ hasText: 'Returned to your saved message' })).toBeVisible();
  await expect(page.locator('#sample-3 h3')).toBeFocused();
  await expect(page.locator('#sample-3')).toHaveClass(/marked/);
});

test('demo announces a new reply without moving focus', async ({ page }) => {
  await page.goto('/demo');
  const add = page.getByRole('button', { name: 'Add sample reply' });
  await add.focus();
  await add.click();
  await expect(page.getByRole('status').filter({ hasText: 'One new message added' })).toBeVisible();
  await expect(add).toBeFocused();
  await expect(page.locator('.demo-message')).toHaveCount(5);
});

test('@claim:pause-updates keeps the transcript fixed until updates resume', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Pause updates' }).click();
  await page.getByRole('button', { name: 'Add sample reply' }).click();
  await expect(page.locator('.demo-message')).toHaveCount(4);
  await expect(page.getByRole('status').filter({ hasText: 'updates are paused' })).toBeVisible();
  await page.getByRole('button', { name: 'Resume updates' }).click();
  await page.getByRole('button', { name: 'Add sample reply' }).click();
  await expect(page.locator('.demo-message')).toHaveCount(5);
});

test('@claim:demo-reset removes sandbox changes and restores the sample', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Save my place here' }).first().click();
  await page.getByRole('button', { name: 'Add sample reply' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('.demo-message')).toHaveCount(4);
  await expect(page.locator('.demo-message.marked')).toHaveCount(0);
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('demo:')))).toEqual([]);
});

test('@claim:no-account-free presents the full demo without sign-in or payment', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Read this conversation in order');
  await expect(page.locator('input[type="email"], input[type="password"]')).toHaveCount(0);
  await page.goto('/');
  await expect(page.getByText('No account is needed.')).toBeVisible();
  await expect(page.getByText('Free to use.')).toBeVisible();
});
