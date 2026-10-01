import { expect, test } from '@playwright/test';

test('a dialog opened from a drawer paints above it, traps Escape, and returns focus', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/feedback/modal');

  const demo = page
    .getByRole('heading', { level: 3, name: 'Modal in a drawer', exact: true })
    .locator(
      'xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " docs__demo ")][1]',
    );
  await demo.getByRole('button', { name: 'Open invoice drawer' }).click();
  await page.getByRole('button', { name: 'Record nested payment' }).click();

  const dialog = page.getByRole('dialog', { name: 'Record payment' });
  await expect(dialog).toBeVisible();

  const layers = await page.evaluate(() => {
    const drawer = document.querySelector('.ant-drawer.ant-drawer-open') as HTMLElement | null;
    const dialogWrap = document.querySelector('.ant-modal-wrap.cb-modal--above-drawer') as HTMLElement | null;
    const dialogMask = document.querySelector('.ant-modal-mask.cb-modal--above-drawer-backdrop') as HTMLElement | null;
    const style = (element: HTMLElement | null) => (element ? getComputedStyle(element).zIndex : 'missing');
    return {
      drawer: style(drawer),
      dialog: style(dialogWrap),
      dialogMask: style(dialogMask),
      focusIsInDialog: document.activeElement?.closest('.ant-modal') !== null,
    };
  });
  expect(Number(layers.dialog)).toBeGreaterThan(Number(layers.drawer));
  expect(Number(layers.dialogMask)).toBeGreaterThan(Number(layers.drawer));
  expect(layers.focusIsInDialog).toBe(true);

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.locator('.ant-drawer.ant-drawer-open')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Record nested payment' })).toBeFocused();
});
