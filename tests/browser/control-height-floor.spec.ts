import { expect, test } from '@playwright/test';

/**
 * The control ladder has two floors, and which one applies is the pointer's, not the viewport's.
 * A mouse hovers, so 32px is enough; a finger cannot, so a coarse pointer needs 44px. The system
 * states that as `--cb-control-floor-fine` / `--cb-control-floor-coarse` and a
 * `@media (pointer: coarse)` rule that lifts the ladder to the coarse floor.
 *
 * These tests measure rendered controls rather than the token, because the consumer-visible
 * promise is a target a finger can hit — a token that computes to 44px inside a control Ant draws
 * at 40px would satisfy the token and fail the reader.
 */

const POINTERS = [
  { name: 'fine pointer', context: {}, floor: 32, coarse: false },
  {
    name: 'coarse pointer',
    context: { hasTouch: true, viewport: { width: 390, height: 844 } },
    floor: 44,
    coarse: true,
  },
] as const;

/** The controls a form is built from, each on a page that renders it at the default size. */
const CONTROLS = [
  { name: 'Input', page: '/data-entry/input', selector: '.ant-input' },
  { name: 'Button', page: '/form/button', selector: '.ant-btn' },
  { name: 'Select', page: '/data-entry/select', selector: '.ant-select' },
] as const;

for (const pointer of POINTERS) {
  test(`every default form control reaches its ${pointer.name} floor`, async ({ browser }) => {
    const context = await browser.newContext(pointer.context);
    const page = await context.newPage();

    for (const control of CONTROLS) {
      await page.goto(control.page);
      const target = page.locator(control.selector).first();
      await expect(target, control.name).toBeVisible();

      const measured = await target.evaluate((element) => ({
        height: element.getBoundingClientRect().height,
        coarse: window.matchMedia('(pointer: coarse)').matches,
      }));

      expect(measured.coarse, `${control.name} pointer`).toBe(pointer.coarse);
      expect(measured.height, `${control.name} height`).toBeGreaterThanOrEqual(pointer.floor);
    }

    await context.close();
  });
}

test('the coarse ladder raises every step to the coarse floor and leaves lg at 48px', async ({ browser }) => {
  /* `max()` resolves at used-value time, not when the custom property is read, so the ladder is
     measured through a probe element rather than by reading the token text back. */
  const ladder = async (context: Parameters<typeof browser.newContext>[0]) => {
    const scoped = await browser.newContext(context);
    const page = await scoped.newPage();
    await page.goto('/data-entry/input');
    const heights = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.position = 'fixed';
      document.body.append(probe);
      const measured = ['sm', 'md', 'lg'].map((step) => {
        probe.style.height = `var(--cb-control-height-${step})`;
        return getComputedStyle(probe).height;
      });
      probe.remove();
      return measured;
    });
    await scoped.close();
    return heights;
  };

  expect(await ladder({})).toEqual(['32px', '40px', '48px']);
  expect(await ladder({ hasTouch: true, viewport: { width: 390, height: 844 } })).toEqual([
    '44px',
    '44px',
    '48px',
  ]);
});

test('a density scale cannot shrink a control under its pointer floor', async ({ browser }) => {
  /* The acceptance criterion is not "the default is 44px" but "nothing can take it under 44px".
     A consumer retunes the preferred ladder step — the documented density seam — to something
     smaller than the floor, and the resolved height has to stay at the floor. */
  const resolved = async (context: Parameters<typeof browser.newContext>[0], preferred: string) => {
    const scoped = await browser.newContext(context);
    const page = await scoped.newPage();
    await page.goto('/data-entry/input');
    const height = await page.evaluate((step) => {
      document.documentElement.style.setProperty('--cb-control-height-base-md', step);
      const probe = document.createElement('div');
      probe.style.position = 'fixed';
      probe.style.height = 'var(--cb-control-height-md)';
      document.body.append(probe);
      const measured = getComputedStyle(probe).height;
      probe.remove();
      return measured;
    }, preferred);
    await scoped.close();
    return height;
  };

  expect(await resolved({}, '1rem')).toBe('32px');
  expect(await resolved({ hasTouch: true, viewport: { width: 390, height: 844 } }, '1rem')).toBe('44px');
});
