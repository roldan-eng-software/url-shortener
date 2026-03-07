import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('URL Shortening', () => {
  test('TC001: Validation error shown for invalid URL format', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('input[placeholder*="Cole seu link"]', 'not-a-url');
    await page.click('button:has-text("Encurtar")');
    await expect(page.locator('.bg-red-50, .bg-red-900')).toBeVisible({ timeout: 5000 });
  });

  test('TC002: Validation error when URL input is empty', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('button:has-text("Encurtar")');
    await expect(page.locator('text=insira uma URL')).toBeVisible({ timeout: 5000 });
  });

  test('TC010: Invalid short code shows error page', async ({ page }) => {
    await page.goto(`${BASE_URL}/this-short-code-should-not-exist-999999`);
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
    const content = await page.content();
    const has404 = content.includes('404') || content.includes('Não encontrado') || content.includes('Not Found');
    expect(has404).toBeTruthy();
  });
});

test.describe('Premium Subscription', () => {
  test('TC015: Access Premium page and view available plans', async ({ page }) => {
    await page.goto(`${BASE_URL}/premium`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Navigation', () => {
  test('Landing page loads', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Login page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible({ timeout: 10000 });
  });

  test('Register page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('URL Redirect', () => {
  test('Invalid short code does not redirect away', async ({ page }) => {
    await page.goto(`${BASE_URL}/definitely-invalid-code-abc-123-xyz`);
    await expect(page).toHaveURL(/definitely-invalid-code-abc-123-xyz/);
  });
});
