import { expect, test } from '@playwright/test';

/* A multiple Select holds tags that wrap onto new lines. Its frame must grow with them, or the wrapped tags
   spill over whatever sits below — the control height is its floor, not its height. */

test('a multiple Select grows with its wrapped tags instead of spilling them', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/data-entry/select');
  const selects = page.locator('.ant-select-multiple');
  await expect(selects.first()).toBeVisible();
  const count = await selects.count();
  let checked = 0;
  for (let i = 0; i < count; i += 1) {
    const select = selects.nth(i);
    if (!(await select.isVisible())) continue;
    const frame = await select.boundingBox();
    const content = await select.locator('.ant-select-content').boundingBox();
    if (!frame || !content) continue;
    // Every tag line sits inside the frame the border draws.
    expect(content.y + content.height, `multiple Select #${i} spills its tags`).toBeLessThanOrEqual(frame.y + frame.height + 1);
    checked += 1;
  }
  expect(checked).toBeGreaterThan(0);
});
