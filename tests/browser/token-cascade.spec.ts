import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

async function css(path: string): Promise<string> {
  return readFile(path, 'utf8');
}

test('high contrast remains stronger than a later Skin stylesheet', async ({ page }) => {
  const session = await page.context().newCDPSession(page);
  await session.send('Emulation.setEmulatedMedia', {
    features: [
      { name: 'prefers-color-scheme', value: 'light' },
      { name: 'prefers-contrast', value: 'more' },
    ],
  });

  const [base, astra] = await Promise.all([
    css('packages/ui/src/tokens/skin.css'),
    css('packages/ui/src/skins/astra.css'),
  ]);
  await page.setContent(`<style>${base}</style><style>${astra}</style>`);
  await page.locator('html').evaluate((root) => root.setAttribute('data-theme', 'light'));

  const border = await page.locator('html').evaluate((root) =>
    getComputedStyle(root).getPropertyValue('--cb-border').trim(),
  );
  expect(border).toBe('oklch(0.7 0.014 280)');
});
