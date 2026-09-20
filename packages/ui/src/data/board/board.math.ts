import type { BoardMove, BoardPosition, BoardShape } from './board.types.js';

/**
 * The board's movement rules, as pure functions over ids and order.
 *
 * Everything a move decides is here rather than inside a pointer handler, because the keyboard path and
 * the drag path must reach the *same* answer — two implementations of "where does this card land" is how
 * a board ends up behaving differently depending on which hand you used.
 */

/** Where a card currently is, or null when the board does not hold it. */
export function locate(columns: readonly BoardShape[], cardId: string): BoardPosition | null {
  for (const column of columns) {
    const index = column.cards.findIndex((card) => card.id === cardId);
    if (index !== -1) return { columnId: column.id, index };
  }
  return null;
}

const columnOf = (columns: readonly BoardShape[], columnId: string) => columns.find((c) => c.id === columnId);

/** Whether a card may be picked up at all. A disabled card stays visible and refuses to move. */
export function canPickUp(columns: readonly BoardShape[], cardId: string): boolean {
  const at = locate(columns, cardId);
  if (!at) return false;
  return !columnOf(columns, at.columnId)?.cards.find((c) => c.id === cardId)?.disabled;
}

/**
 * Why a move is refused, or null when it is allowed. Ordering matters: a card that cannot move is
 * refused before the destination is even considered, so the reason names the real cause.
 */
export function refusalFor(columns: readonly BoardShape[], move: BoardMove): string | null {
  if (!canPickUp(columns, move.cardId)) return 'this card cannot be moved';
  const target = columnOf(columns, move.to.columnId);
  if (!target) return 'that column is not on the board';
  if (target.accepts === false) return 'that column does not take cards';
  return null;
}

/** True when a move would change nothing — the same column, the same place. */
export function isNoop(move: BoardMove): boolean {
  return move.from.columnId === move.to.columnId && move.from.index === move.to.index;
}

/**
 * The board with the move applied, immutably. Removing before inserting matters within one column:
 * dropping a card two places down is measured against the list it left, not the list it was still in.
 */
export function applyMove<T extends BoardShape>(columns: readonly T[], move: BoardMove): T[] {
  const card = columnOf(columns, move.from.columnId)?.cards[move.from.index];
  if (!card || card.id !== move.cardId) return [...columns];
  return columns.map((column) => {
    if (column.id === move.from.columnId && column.id === move.to.columnId) {
      const rest = column.cards.filter((_, i) => i !== move.from.index);
      rest.splice(clamp(move.to.index, rest.length), 0, card);
      return { ...column, cards: rest };
    }
    if (column.id === move.from.columnId) {
      return { ...column, cards: column.cards.filter((_, i) => i !== move.from.index) };
    }
    if (column.id === move.to.columnId) {
      const next = [...column.cards];
      next.splice(clamp(move.to.index, next.length), 0, card);
      return { ...column, cards: next };
    }
    return column;
  });
}

const clamp = (value: number, max: number) => Math.max(0, Math.min(value, max));

export type BoardDirection = 'left' | 'right' | 'up' | 'down';

/**
 * Where an arrow key takes a held card, or null when it cannot go that way.
 *
 * Left and right cross columns and keep the card's depth where the new column is long enough, so moving
 * across a board does not silently send a card to the top. Up and down move within the column. Columns
 * that take no cards are stepped over rather than landed on — the keyboard should not offer a
 * destination the drop would refuse.
 */
export function nextTarget(
  columns: readonly BoardShape[],
  held: BoardPosition,
  direction: BoardDirection,
): BoardPosition | null {
  const at = columns.findIndex((c) => c.id === held.columnId);
  const current = columns[at];
  if (!current) return null;

  if (direction === 'up' || direction === 'down') {
    const size = current.cards.length;
    const index = held.index + (direction === 'down' ? 1 : -1);
    return index < 0 || index > size - 1 ? null : { columnId: held.columnId, index };
  }

  const step = direction === 'right' ? 1 : -1;
  for (let i = at + step; i >= 0 && i < columns.length; i += step) {
    const column = columns[i];
    if (!column || column.accepts === false) continue;
    // The card is leaving its column, so the destination has one more place than it has cards.
    return { columnId: column.id, index: clamp(held.index, column.cards.length) };
  }
  return null;
}

/** How full a column is against its limit, for the count beside its name. */
export function columnLoad(column: BoardShape & { limit?: number }): { count: number; over: boolean } {
  const count = column.cards.length;
  return { count, over: typeof column.limit === 'number' && count > column.limit };
}
