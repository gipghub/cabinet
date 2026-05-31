import { test, expect } from '@playwright/test';

test.describe('Cabinet PWA', () => {
  test('boots into the cabinet and shows the shelves', async ({ page }) => {
    await page.goto('./');
    // Splash fades, then the home shelves are visible.
    await expect(page.getByText('Daily')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Allergy & Cold')).toBeVisible();
    await expect(page.getByText('Pain & Fever')).toBeVisible();
  });

  test('navigates between tabs', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByText('Daily')).toBeVisible({ timeout: 10_000 });

    await page.getByRole('button', { name: 'Trends' }).click();
    await expect(page.getByRole('heading', { name: 'Most-used' })).toBeVisible();

    await page.getByRole('button', { name: 'Alerts' }).click();
    await expect(page.getByText('Action needed')).toBeVisible();
  });

  test('serves a web manifest with the Cabinet identity', async ({ page }) => {
    await page.goto('./');
    const href = await page.getAttribute('link[rel="manifest"]', 'href');
    expect(href).toBeTruthy();
    const manifest = await page.evaluate(async (url: string) => {
      const res = await fetch(url);
      return res.json();
    }, href!);
    expect(manifest.name).toContain('Cabinet');
    expect(manifest.theme_color).toBe('#1b3f37');
    expect(manifest.background_color).toBe('#eef4f3');
    const maskable = (manifest.icons as Array<{ purpose?: string; sizes: string }>).find(
      (i) => i.purpose?.includes('maskable'),
    );
    expect(maskable?.sizes).toBe('512x512');
  });

  test('registers a service worker', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByText('Daily')).toBeVisible({ timeout: 10_000 });
    const hasSW = await page.evaluate(() => 'serviceWorker' in navigator);
    expect(hasSW).toBe(true);
  });
});
