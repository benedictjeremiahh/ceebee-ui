import { expect, test } from '@playwright/test';

/* Edges are controlled by the caller and never marked selected in React Flow's own state, so its selection
   change never reports one. Clicking an edge must still put it in the inspector — a consumer attaches rules
   to a connection there. This needs real layout, so it runs in a browser against the docs demo. */

test('clicking a connection shows it in the inspector', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/data-display/diagram-editor');
  const editor = page.locator('.cb-diagram--editor').first();
  const inspector = editor.getByRole('complementary', { name: 'Selection' });
  await expect(inspector).toContainText('Select a node or a connection.');
  const edge = editor.locator('.react-flow__edge').filter({ has: page.locator('[aria-label], path') }).first();
  const path = editor.locator('.react-flow__edge-interaction').first();
  await expect(path).toBeAttached();
  const box = await path.boundingBox();
  if (!box) throw new Error('the first connection has no box to click');
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect(inspector).toContainText('→');
  await expect(edge).toBeAttached();
});
