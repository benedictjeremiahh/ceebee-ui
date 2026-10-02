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

  // A popup opened from inside the nested dialog resolves above the dialog itself, not
  // wedged between the drawer and the dialog.
  await dialog.getByPlaceholder('Received on').click();
  const picker = page.locator('.ant-picker-dropdown');
  await expect(picker).toBeVisible();
  const paint = await page.evaluate(() => {
    const panel = document.querySelector('.ant-picker-dropdown') as HTMLElement | null;
    const wrap = document.querySelector('.ant-modal-wrap.cb-modal--above-drawer') as HTMLElement | null;
    if (!panel || !wrap) return { picker: 'missing', dialog: 'missing', topmost: 'missing' };
    const box = panel.getBoundingClientRect();
    const hit = document.elementFromPoint(box.x + box.width / 2, Math.min(box.y + 40, box.y + box.height - 8));
    return {
      picker: getComputedStyle(panel).zIndex,
      dialog: getComputedStyle(wrap).zIndex,
      topmost: hit?.closest('.ant-picker-dropdown') ? 'picker' : (hit?.className?.toString().slice(0, 60) ?? 'none'),
    };
  });
  expect(Number(paint.picker)).toBeGreaterThan(Number(paint.dialog));
  expect(paint.topmost).toBe('picker');

  const focusIsInDialog = () => page.evaluate(
    () => document.activeElement?.closest('.ant-modal') !== null,
  );
  // Escape is handled by whichever layer holds focus: settle focus inside the dialog first, so the
  // keypress below can only dismiss the dialog — never the drawer behind it.
  await dialog.getByText('Confirm this focused payment').click();
  await expect.poll(focusIsInDialog).toBe(true);
  await page.keyboard.press('Escape');
  await expect(picker).toBeHidden();
  await expect(dialog).toBeVisible();

  await expect.poll(focusIsInDialog).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.locator('.ant-drawer.ant-drawer-open')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Record nested payment' })).toBeFocused();
});
