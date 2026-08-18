import { describe, expect, it } from 'vitest';
import { ariaSortFor, nextSort, pageRange } from './table-sort.js';

describe('nextSort', () => {
  it('cycles ascending, descending, off — so there is a way back to the server order', () => {
    const first = nextSort(null, 'name');
    expect(first).toEqual({ column: 'name', direction: 'asc' });
    const second = nextSort(first, 'name');
    expect(second).toEqual({ column: 'name', direction: 'desc' });
    expect(nextSort(second, 'name')).toBeNull();
  });

  it('starts a different column ascending rather than inheriting the old direction', () => {
    expect(nextSort({ column: 'name', direction: 'desc' }, 'created')).toEqual({
      column: 'created',
      direction: 'asc',
    });
  });
});

describe('ariaSortFor', () => {
  it('reports the sort only on the column that carries it', () => {
    const sort = { column: 'name', direction: 'asc' } as const;
    expect(ariaSortFor(sort, 'name')).toBe('ascending');
    expect(ariaSortFor(sort, 'created')).toBe('none');
    expect(ariaSortFor(null, 'name')).toBe('none');
  });
});

describe('pageRange', () => {
  it('counts the rows on this page, one-based, for the summary', () => {
    const { from, to, totalPages } = pageRange(2, 20, 137);
    expect([from, to, totalPages]).toEqual([21, 40, 7]);
  });

  it('reports an empty set as 0 rather than 1–0', () => {
    const { from, to, totalPages } = pageRange(1, 20, 0);
    expect([from, to, totalPages]).toEqual([0, 0, 1]);
  });

  it('does not run past the end on the last, partly filled page', () => {
    expect(pageRange(7, 20, 137).to).toBe(137);
  });

  it('always keeps the first and last page reachable', () => {
    const { items } = pageRange(10, 10, 300);
    expect(items[0]).toBe(1);
    expect(items[items.length - 1]).toBe(30);
    expect(items).toContain(null);
  });

  it('spells out a single skipped page instead of hiding it behind an ellipsis', () => {
    const { items } = pageRange(3, 10, 50);
    expect(items).toEqual([1, 2, 3, 4, 5]);
  });

  it('clamps a page number outside the range instead of rendering an empty page', () => {
    expect(pageRange(99, 10, 25).from).toBe(21);
    expect(pageRange(0, 10, 25).from).toBe(1);
  });
});
