import { expect, test } from '@playwright/test';

/* The substrate measures the DOM to lay its grid out, which jsdom has not — so the drawn rows are
   proved here, in a real browser, driving the docs demo rather than a fixture. */

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/data/schedule');
});

test('a plan reads against a time axis, with today marked', async ({ page }) => {
  const schedule = page.locator('.cb-schedule').first();
  await expect(schedule.getByText('Pour the slab')).toBeVisible();
  await expect(schedule.getByText('First-fix wiring')).toBeVisible();
  // Today keeps its machine-readable date but is written for a person above the axis.
  await expect(schedule.locator('.cb-schedule__today time')).toHaveAttribute('datetime', '2026-01-19');
  await expect(schedule.locator('.cb-schedule__today time')).toHaveText('Jan 19, 2026');
  await expect(schedule).toHaveAttribute('data-today-on-axis', '');
  const marker = await schedule.locator('.wx-area').evaluate((element) => {
    const area = element.getBoundingClientRect();
    const chart = element.closest('.wx-chart')?.getBoundingClientRect();
    const style = getComputedStyle(element, '::after');
    return { x: area.x + Number.parseFloat(style.left), chartLeft: chart?.left ?? 0, width: Number.parseFloat(style.width) };
  });
  expect(marker.x).toBeGreaterThan(marker.chartLeft);
  expect(marker.width).toBeGreaterThan(0);
});

test('the work-item grid shares visible row rules and an aligned header with the time axis', async ({ page }) => {
  const schedule = page.locator('.cb-schedule').first();
  const header = schedule.locator('.wx-header .wx-cell').first();
  const firstRow = schedule.locator('.wx-body .wx-row').first();
  const grid = schedule.locator('.wx-table-container');
  await expect(header).toContainText('Work item');
  const borderWidths = await Promise.all([
    header.evaluate((element) => Number.parseFloat(getComputedStyle(element).borderBottomWidth)),
    firstRow.evaluate((element) => Number.parseFloat(getComputedStyle(element).borderBottomWidth)),
    grid.evaluate((element) => Number.parseFloat(getComputedStyle(element).borderRightWidth)),
  ]);
  expect(borderWidths.every((width) => width > 0)).toBe(true);
  const headerX = await schedule.locator('.wx-header .wx-text').first().evaluate((element) => element.getBoundingClientRect().x);
  const rowX = await schedule.locator('.wx-body .wx-row .wx-text').first().evaluate((element) => element.getBoundingClientRect().x);
  expect(Math.abs(headerX - rowX)).toBeLessThanOrEqual(4);
  await expect(schedule.locator('.wx-header .wx-cell.wx-col-progressText')).toContainText('Actual');
  const progressCells = schedule.locator('.wx-body .wx-cell.wx-col-progressText');
  await expect(progressCells.first()).toContainText('100%');
  await expect(progressCells.last()).toContainText('Not reported');
  const lastReading = progressCells.last();
  expect(await lastReading.evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    const style = getComputedStyle(element);
    return range.getBoundingClientRect().width - (element.clientWidth - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight));
  }), 'Unreported text must not be clipped').toBeLessThanOrEqual(1);
});

test('the calendar grid uses the skin border color after a live theme change', async ({ page }) => {
  const schedule = page.locator('.cb-schedule').first();
  await page.evaluate(() => { document.documentElement.dataset.theme = 'light'; });
  await expect.poll(() => schedule.evaluate((element) =>
    getComputedStyle(element).getPropertyValue('--wx-gantt-border').trim(),
  )).toMatch(/#[\da-f]{6,8}\b/i);
  const light = await schedule.evaluate((element) => getComputedStyle(element).getPropertyValue('--wx-gantt-border').trim());

  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await expect.poll(() => schedule.evaluate((element) =>
    getComputedStyle(element).getPropertyValue('--wx-gantt-border').trim(),
  )).toMatch(/#[\da-f]{6,8}\b/i);
  const dark = await schedule.evaluate((element) => getComputedStyle(element).getPropertyValue('--wx-gantt-border').trim());
  expect(dark).not.toBe(light);

  await schedule.locator('..').evaluate((element) => {
    element instanceof HTMLElement && element.style.setProperty('--cb-border', '#11aa33');
  });
  await expect.poll(() => schedule.evaluate((element) =>
    getComputedStyle(element).getPropertyValue('--wx-gantt-border').trim(),
  )).toContain('#11aa33ff');
});

test('the narrow time axis survives a live theme change', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  const schedule = page.locator('.cb-schedule').first();
  const chart = schedule.locator('.wx-chart');
  await expect.poll(() => chart.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(150);
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await expect.poll(() => chart.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(150);
  await page.evaluate(() => { document.documentElement.dataset.theme = 'light'; });
  await expect.poll(() => chart.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(150);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
});

test('a bar that is behind and unfinished reads as late', async ({ page }) => {
  const schedule = page.locator('.cb-schedule').first();
  // Only "Pour the slab" ends before today (2026-01-19) and is under 100%.
  await expect(schedule.locator('.cb-schedule__bar[data-late]')).toHaveCount(1);
});

test('the substrate does not paint over the planned outline and actual span', async ({ page }) => {
  const schedule = page.locator('.cb-schedule').first();
  const bar = schedule.locator('.cb-schedule__bar[data-actual]').first();
  await expect(bar.locator('.cb-schedule__bar-planned')).toBeVisible();
  await expect(bar.locator('.cb-schedule__bar-actual')).toBeVisible();
  const native = bar.locator('..');
  expect(await native.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
  expect(await native.locator('.wx-progress-wrapper').evaluate((element) => getComputedStyle(element).display)).toBe('none');
});

test('the third-party chart hydrates without a server/client markup mismatch', async ({ page }) => {
  const hydrationWarnings: string[] = [];
  page.on('console', (message) => {
    if (message.text().includes('A tree hydrated but some attributes')) hydrationWarnings.push(message.text());
  });
  await page.reload();
  await expect(page.locator('.cb-schedule').getByText('Pour the slab')).toBeVisible();
  expect(hydrationWarnings).toEqual([]);
});

test('a narrow schedule gives the time axis room and explains how to see later dates', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  const schedule = page.locator('.cb-schedule').first();
  await expect(schedule.getByText('Swipe the timeline to see later dates.')).toBeVisible();
  const chart = schedule.locator('.wx-chart');
  await expect(chart).toBeVisible();
  expect(await chart.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(150);
  await expect(schedule.locator('.cb-schedule__mobile-items')).toContainText('Pour the slab');
  await expect(schedule.locator('.cb-schedule__mobile-items')).toContainText('Not reported');
  for (const selector of ['.cb-schedule__pan', '.cb-schedule__mobile-items', '.cb-schedule__today']) {
    const fontSize = await schedule.locator(selector).evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).fontSize),
    );
    expect(fontSize, `${selector} must remain legible on a narrow screen`).toBeGreaterThanOrEqual(14);
  }
  await page.setViewportSize({ width: 320, height: 800 });
  await expect(schedule.getByText('Swipe the timeline to see later dates.')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test('the time axis remains visible in a constrained desktop panel and after viewport resize', async ({ page }) => {
  const schedule = page.locator('.cb-schedule').first();
  await schedule.evaluate((element) => { element.style.width = '616px'; });
  const chart = schedule.locator('.wx-chart');
  await expect.poll(() => chart.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(150);
  await expect(schedule.locator('.cb-schedule__mobile-items')).toContainText('Pour the slab');

  await page.setViewportSize({ width: 375, height: 812 });
  await schedule.evaluate((element) => { element.style.width = '100%'; });
  await expect.poll(() => chart.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(150);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await schedule.evaluate((element) => { element.style.width = '100%'; });
  await expect.poll(() => schedule.locator('.wx-table-container').evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(150);
});

test('the physical calendar survives repeated viewport changes and a live theme change', async ({ page }) => {
  const schedule = page.locator('.cb-schedule[data-mode="physical"]');
  const chart = schedule.locator('.wx-chart');
  const grid = schedule.locator('.wx-table-container');
  const expectCalendarVisible = async () => {
    await expect.poll(() => chart.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(150);
  };
  const expectReadingsVisible = async () => {
    await expect(schedule.locator('.cb-schedule__mobile-items')).toContainText('Kitchen fit-out');
    await expect(schedule.locator('.cb-schedule__mobile-progress').first()).toBeVisible();
    await expect(schedule.locator('.cb-schedule__mobile-progress').first()).toHaveText(/\S/);
  };

  await expect(schedule).toBeVisible();
  await expect.poll(() => grid.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(150);

  await page.setViewportSize({ width: 360, height: 800 });
  await expectCalendarVisible();
  await expectReadingsVisible();
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await expectCalendarVisible();

  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect.poll(() => grid.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(150);
  await page.setViewportSize({ width: 360, height: 800 });
  await expectCalendarVisible();
  await expectReadingsVisible();
  await page.evaluate(() => { document.documentElement.dataset.theme = 'light'; });
  await expectCalendarVisible();
});

test('grouped rows start collapsed, disclose from the parent, and label an undated child', async ({ page }) => {
  const schedule = page.locator('.cb-schedule').nth(1);
  await expect(schedule.getByText('Kitchen fit-out')).toBeVisible();
  await expect(schedule.getByText('Cabinets')).toHaveCount(0);
  const toggle = schedule.getByRole('button', { name: 'Show items: Kitchen fit-out (3)' });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(schedule.getByText('1 of 3 items dated')).toHaveCount(0);
  await toggle.click();
  await expect(schedule.getByRole('button', { name: 'Hide items: Kitchen fit-out (3)' })).toHaveAttribute('aria-expanded', 'true');
  await expect(schedule.getByText('Cabinets')).toBeVisible();
  await expect(schedule.getByText('Paint')).toBeVisible();
  await expect(schedule.getByText('Not scheduled')).toBeVisible();
  // The undated row occupies a grid slot but draws no bar.
  await expect(schedule.locator('.cb-schedule__bar[aria-label^="Paint"]')).toHaveCount(0);
  await expect(schedule.locator('.cb-schedule__bar[aria-label^="Cabinets"]')).toHaveCount(1);
  // A child has no labelled action of its own; its name is the way in.
  await expect(schedule.getByRole('button', { name: 'Details: Kitchen fit-out', exact: true })).toHaveCount(1);
  await expect(schedule.getByRole('button', { name: 'Item details: Cabinets' })).toHaveCount(1);
  await expect(schedule.getByRole('button', { name: 'Details: Cabinets', exact: true })).toHaveCount(0);
});
