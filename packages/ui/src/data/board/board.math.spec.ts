import { describe, expect, it } from 'vitest';
import { applyMove, canPickUp, columnLoad, hiddenEdges, isNoop, locate, nextTarget, refusalFor } from './board.math.js';
import type { BoardShape } from './board.types.js';

/** Card ids of one column, by id — indexing an array is not guaranteed to find one. */
const ids = (columns: BoardShape[], columnId: string) =>
  columns.find((c) => c.id === columnId)?.cards.map((c) => c.id) ?? [];

const board = (): BoardShape[] => [
  { id: 'todo', cards: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] },
  { id: 'doing', cards: [{ id: 'd' }] },
  { id: 'done', cards: [{ id: 'e', disabled: true }], accepts: false },
];

describe('locate', () => {
  it('finds a card by id, with its place in the column', () => {
    expect(locate(board(), 'b')).toEqual({ columnId: 'todo', index: 1 });
    expect(locate(board(), 'd')).toEqual({ columnId: 'doing', index: 0 });
  });

  it('is null for a card the board does not hold', () => {
    expect(locate(board(), 'nope')).toBeNull();
  });
});

describe('canPickUp / refusalFor', () => {
  it('refuses a disabled card before it looks at where it was going', () => {
    expect(canPickUp(board(), 'e')).toBe(false);
    const refusal = refusalFor(board(), { cardId: 'e', from: { columnId: 'done', index: 0 }, to: { columnId: 'todo', index: 0 } });
    expect(refusal).toBe('this card cannot be moved');
  });

  it('refuses a column that takes no cards', () => {
    expect(refusalFor(board(), { cardId: 'a', from: { columnId: 'todo', index: 0 }, to: { columnId: 'done', index: 0 } }))
      .toBe('that column does not take cards');
  });

  it('refuses a column that is not on the board', () => {
    expect(refusalFor(board(), { cardId: 'a', from: { columnId: 'todo', index: 0 }, to: { columnId: 'ghost', index: 0 } }))
      .toBe('that column is not on the board');
  });

  it('allows an ordinary move', () => {
    expect(refusalFor(board(), { cardId: 'a', from: { columnId: 'todo', index: 0 }, to: { columnId: 'doing', index: 0 } })).toBeNull();
  });
});

describe('isNoop', () => {
  it('knows a move that changes nothing', () => {
    expect(isNoop({ cardId: 'a', from: { columnId: 'todo', index: 0 }, to: { columnId: 'todo', index: 0 } })).toBe(true);
    expect(isNoop({ cardId: 'a', from: { columnId: 'todo', index: 0 }, to: { columnId: 'todo', index: 1 } })).toBe(false);
  });
});

describe('applyMove', () => {
  it('moves a card to another column at the place asked for', () => {
    const next = applyMove(board(), { cardId: 'a', from: { columnId: 'todo', index: 0 }, to: { columnId: 'doing', index: 1 } });
    expect(ids(next, 'todo')).toEqual(['b', 'c']);
    expect(ids(next, 'doing')).toEqual(['d', 'a']);
  });

  it('reorders within one column against the list the card left', () => {
    // 'a' moved to index 2 lands last: the list it is measured against is ['b','c'].
    const next = applyMove(board(), { cardId: 'a', from: { columnId: 'todo', index: 0 }, to: { columnId: 'todo', index: 2 } });
    expect(ids(next, 'todo')).toEqual(['b', 'c', 'a']);
  });

  it('clamps a place past the end rather than losing the card', () => {
    const next = applyMove(board(), { cardId: 'a', from: { columnId: 'todo', index: 0 }, to: { columnId: 'doing', index: 99 } });
    expect(ids(next, 'doing')).toEqual(['d', 'a']);
  });

  it('leaves the board alone when the card is not where the move says it was', () => {
    const before = board();
    const next = applyMove(before, { cardId: 'a', from: { columnId: 'doing', index: 0 }, to: { columnId: 'todo', index: 0 } });
    expect(next.map((c) => c.cards.map((x) => x.id))).toEqual(before.map((c) => c.cards.map((x) => x.id)));
  });

  it('does not mutate what it was given', () => {
    const before = board();
    applyMove(before, { cardId: 'a', from: { columnId: 'todo', index: 0 }, to: { columnId: 'doing', index: 0 } });
    expect(ids(before, 'todo')).toEqual(['a', 'b', 'c']);
  });
});

describe('nextTarget', () => {
  it('moves within a column, and stops at its ends', () => {
    expect(nextTarget(board(), { columnId: 'todo', index: 0 }, 'down')).toEqual({ columnId: 'todo', index: 1 });
    expect(nextTarget(board(), { columnId: 'todo', index: 0 }, 'up')).toBeNull();
    expect(nextTarget(board(), { columnId: 'todo', index: 2 }, 'down')).toBeNull();
  });

  it('keeps the card’s depth when it crosses to a column long enough to hold it', () => {
    // 'doing' holds one card, so a card arriving from depth 2 lands at 1 — the end, not the top.
    expect(nextTarget(board(), { columnId: 'todo', index: 2 }, 'right')).toEqual({ columnId: 'doing', index: 1 });
    expect(nextTarget(board(), { columnId: 'todo', index: 0 }, 'right')).toEqual({ columnId: 'doing', index: 0 });
  });

  it('steps over a column that takes no cards rather than offering it', () => {
    // Right of 'doing' is 'done', which accepts nothing, and there is nothing beyond it.
    expect(nextTarget(board(), { columnId: 'doing', index: 0 }, 'right')).toBeNull();
  });

  it('stops at the edges of the board', () => {
    expect(nextTarget(board(), { columnId: 'todo', index: 0 }, 'left')).toBeNull();
  });

  it('is null for a column the board does not have', () => {
    expect(nextTarget(board(), { columnId: 'ghost', index: 0 }, 'right')).toBeNull();
  });
});

describe('columnLoad', () => {
  it('counts, and marks a column past its limit without blocking it', () => {
    expect(columnLoad({ id: 'todo', cards: [{ id: 'a' }, { id: 'b' }] })).toEqual({ count: 2, over: false });
    expect(columnLoad({ id: 'todo', cards: [{ id: 'a' }, { id: 'b' }], limit: 1 })).toEqual({ count: 2, over: true });
    expect(columnLoad({ id: 'todo', cards: [{ id: 'a' }], limit: 1 })).toEqual({ count: 1, over: false });
  });
});

describe('hiddenEdges', () => {
  it('says nothing when every column fits', () => {
    expect(hiddenEdges({ scrollLeft: 0, clientWidth: 1200, scrollWidth: 1200 })).toBeNull();
  });

  it('names the edge the columns are hidden past', () => {
    expect(hiddenEdges({ scrollLeft: 0, clientWidth: 600, scrollWidth: 1800 })).toBe('end');
    expect(hiddenEdges({ scrollLeft: 1200, clientWidth: 600, scrollWidth: 1800 })).toBe('start');
  });

  it('names both while the board is mid-scroll — columns are hidden each way', () => {
    expect(hiddenEdges({ scrollLeft: 600, clientWidth: 600, scrollWidth: 1800 })).toBe('both');
  });

  it('does not offer a scroll that moves nothing: a fractional layout leaves it a hair short', () => {
    expect(hiddenEdges({ scrollLeft: 1199.5, clientWidth: 600, scrollWidth: 1800 })).toBe('start');
    expect(hiddenEdges({ scrollLeft: 0, clientWidth: 1200, scrollWidth: 1201 })).toBeNull();
  });
});
