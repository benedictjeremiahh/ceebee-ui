import { expect, test, type Page } from '@playwright/test';

/* Opening a card is a different affordance from moving one, so it gets its own file: opening by pointer,
   opening by keyboard, and proof that a drag does not open. It drives the docs demo, so it proves the
   published component rather than a fixture. */

const boardNamed = (page: Page, name: string) => page.getByRole('group', { name });

const cardIn = (page: Page, board: string, column: string, title: string) =>
  boardNamed(page, board).locator('.cb-board__column', { hasText: column }).locator('.cb-board__card', { hasText: title });

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/data/board');
});

test('a card opens by pointer on its title', async ({ page }) => {
  const board = 'Work with details';
  const card = cardIn(page, board, 'To do', 'Pour the slab');
  await expect(card).toBeVisible();

  await card.getByRole('button', { name: 'Pour the slab', exact: true }).click();
  await expect(page.getByText('Opened “Pour the slab”.')).toBeVisible();
  // And the card did not move while being opened.
  await expect(cardIn(page, board, 'To do', 'Pour the slab')).toBeVisible();
});

test('a card opens by keyboard', async ({ page }) => {
  const board = 'Work with details';
  const card = cardIn(page, board, 'To do', 'Order cement');
  await expect(card).toBeVisible();

  await card.getByRole('button', { name: 'Order cement', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Opened “Order cement”.')).toBeVisible();
});

test('dragging a card by its handle moves it and does not open it', async ({ page }) => {
  const board = 'Work with details';
  const card = cardIn(page, board, 'To do', 'Pour the slab');
  await expect(card).toBeVisible();

  // The grab is the handle, so the title — the open affordance — is never pressed.
  const grab = card.locator('.cb-board__handle');
  const doing = boardNamed(page, board).locator('.cb-board__column', { hasText: 'Doing' });
  await card.scrollIntoViewIfNeeded();
  const from = await grab.boundingBox();
  const to = await doing.boundingBox();
  if (!from || !to) throw new Error('the board did not lay out');
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(from.x + from.width / 2 + 24, from.y + from.height / 2 + 12, { steps: 6 });
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 14 });
  await page.mouse.up();

  await expect(cardIn(page, board, 'Doing', 'Pour the slab')).toBeVisible();
  await expect(page.getByText('Opened “Pour the slab”.')).toHaveCount(0);
});
