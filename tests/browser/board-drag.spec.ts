import { expect, test, type Page } from '@playwright/test';

/* Pointer dragging needs layout and real pointer events, which jsdom has neither of — the unit specs
   cover the keyboard path and the validated move, and this covers the affordance the board is named
   for. It drives the docs demos, so it proves the published component rather than a fixture.

   The page holds two boards, so every locator is scoped to one by its accessible name. */

const boardNamed = (page: Page, name: string) => page.getByRole('group', { name });

/* The announcement region is a sibling of the columns, not inside the labelled group, so it is reached
   through the root that contains that group. */
const rootOf = (page: Page, name: string) => page.locator('.cb-board').filter({ has: page.getByRole('group', { name }) });

const cardIn = (page: Page, board: string, column: string, title: string) =>
  boardNamed(page, board).locator('.cb-board__column', { hasText: column }).locator('.cb-board__card', { hasText: title });

async function dragOnto(page: Page, card: ReturnType<typeof cardIn>, target: ReturnType<typeof cardIn>) {
  // The mouse works in viewport coordinates, so a board below the fold has to be brought into view
  // before it is measured — otherwise the drag is aimed at a point that is not on screen.
  await card.scrollIntoViewIfNeeded();
  const from = await card.boundingBox();
  const to = await target.boundingBox();
  if (!from || !to) throw new Error('the board did not lay out');
  // dnd-kit's PointerSensor needs movement past its activation distance, in more than one step.
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(from.x + from.width / 2 + 24, from.y + from.height / 2 + 12, { steps: 6 });
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 14 });
  await page.mouse.up();
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/data/board');
});

test('a card is dragged from one column into another, and stays there', async ({ page }) => {
  const board = 'Site work';
  const card = cardIn(page, board, 'To do', 'Pour the slab');
  await expect(card).toBeVisible();

  const doing = boardNamed(page, board).locator('.cb-board__column', { hasText: 'Doing' });
  await dragOnto(page, card, doing);

  await expect(cardIn(page, board, 'Doing', 'Pour the slab')).toBeVisible();
  await expect(cardIn(page, board, 'To do', 'Pour the slab')).toHaveCount(0);
});

test('a refused move puts the card back and says why', async ({ page }) => {
  const board = 'A board that refuses';
  const card = cardIn(page, board, 'To do', 'Pour the slab');
  await expect(card).toBeVisible();

  const doing = boardNamed(page, board).locator('.cb-board__column', { hasText: 'Doing' });
  await dragOnto(page, card, doing);

  // The consumer refuses every move into Doing: the card is back, and the reason was announced.
  await expect(cardIn(page, board, 'To do', 'Pour the slab')).toBeVisible();
  await expect(cardIn(page, board, 'Doing', 'Pour the slab')).toHaveCount(0);
  await expect(rootOf(page, board).locator('.cb-board__live')).toContainText('someone else is already on that');
});
