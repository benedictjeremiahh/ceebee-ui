import { expect, test } from '@playwright/test';

test('a long Select option remains inside a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/data-entry/select');

  const basicUsage = page.locator('.demo').filter({
    has: page.getByRole('heading', { level: 3, name: 'Basic Usage', exact: true }),
  });
  const select = basicUsage.locator('.ant-select').first();
  await select.click();

  const option = page.getByRole('option', {
    name: 'Warehouse · Jakarta · Building C · Floor 4 · Aisle 12 · Shelf 08',
  });
  await expect(option).toBeVisible();
  const optionLabel = option.locator('.cb-select__option-label');
  await expect(optionLabel).toBeVisible();
  const labelSize = await optionLabel.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
    clientHeight: element.clientHeight,
    lineHeight: Number.parseFloat(getComputedStyle(element).lineHeight),
  }));
  expect(labelSize.scrollWidth).toBeLessThanOrEqual(labelSize.clientWidth);
  expect(labelSize.clientHeight).toBeGreaterThan(labelSize.lineHeight);
  const popup = page.locator('.ant-select-dropdown:visible').last();
  const bounds = await popup.boundingBox();
  const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(bounds).not.toBeNull();
  expect(bounds?.x).toBeGreaterThanOrEqual(0);
  expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(viewportWidth);

  const combobox = select.getByRole('combobox');
  await combobox.press('ArrowUp');
  await combobox.press('Enter');
  await expect(select).toContainText('Jack');
  await combobox.press('ArrowDown');
  await expect(popup).toBeVisible();
  await combobox.press('Escape');
  await expect(popup).toBeHidden();

  await page.setViewportSize({ width: 1440, height: 1000 });
  await select.click();
  const desktopPopup = page.locator('.ant-select-dropdown:visible').last();
  const desktopBounds = await desktopPopup.boundingBox();
  const selectBounds = await select.boundingBox();
  expect(desktopBounds).not.toBeNull();
  expect(selectBounds).not.toBeNull();
  expect(desktopBounds?.width).toBeGreaterThan(selectBounds?.width ?? 0);
});
