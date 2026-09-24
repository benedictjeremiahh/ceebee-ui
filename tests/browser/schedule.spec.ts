import { expect, test } from '@playwright/test';

/* The substrate measures the DOM to lay its grid out, which jsdom has not — so the drawn rows are
   proved here, in a real browser, driving the docs demo rather than a fixture. */

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/data/schedule');
});

test('a plan reads against a time axis, with today marked', async ({ page }) => {
  const schedule = page.locator('.cb-schedule');
  await expect(schedule.getByText('Pour the slab')).toBeVisible();
  await expect(schedule.getByText('First-fix wiring')).toBeVisible();
  // Today (2026-01-19) is named above the axis.
  await expect(schedule.locator('.cb-schedule__today time')).toHaveText('2026-01-19');
});

test('a bar that is behind and unfinished reads as late', async ({ page }) => {
  const schedule = page.locator('.cb-schedule');
  // Only "Pour the slab" ends before today (2026-01-19) and is under 100%.
  await expect(schedule.locator('.cb-schedule__bar[data-late]')).toHaveCount(1);
});
