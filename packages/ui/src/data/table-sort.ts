/** Sorting and pagination arithmetic, kept pure so the off-by-ones are asserted (ADR 0012). */

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  column: string;
  direction: SortDirection;
}

/**
 * What clicking a header does. Sorting a new column starts ascending; clicking the sorted
 * column flips it; clicking a descending column clears the sort — three states, because
 * "back to the order the server gave me" is a state people look for.
 */
export function nextSort(current: SortState | null, column: string): SortState | null {
  if (!current || current.column !== column) return { column, direction: 'asc' };
  if (current.direction === 'asc') return { column, direction: 'desc' };
  return null;
}

export function ariaSortFor(current: SortState | null, column: string): 'ascending' | 'descending' | 'none' {
  if (!current || current.column !== column) return 'none';
  return current.direction === 'asc' ? 'ascending' : 'descending';
}

export interface PageRange {
  /** Page numbers to render; `null` is an ellipsis. */
  items: Array<number | null>;
  totalPages: number;
  /** 1-based index of the first and last row on this page, for "1–20 of 137". */
  from: number;
  to: number;
}

/**
 * The page list, with ellipses. `siblings` is how many pages flank the current one; first and
 * last are always shown, because jumping to the end is the second most common thing people do.
 */
export function pageRange(page: number, pageSize: number, total: number, siblings = 1): PageRange {
  const totalPages = Math.max(Math.ceil(total / Math.max(pageSize, 1)), 1);
  const current = Math.min(Math.max(page, 1), totalPages);

  const from = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, total);

  const pages = new Set<number>([1, totalPages]);
  for (let offset = -siblings; offset <= siblings; offset += 1) {
    const candidate = current + offset;
    if (candidate >= 1 && candidate <= totalPages) pages.add(candidate);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const items: Array<number | null> = [];
  sorted.forEach((value, index) => {
    const previous = sorted[index - 1];
    // A single skipped page is spelled out; an ellipsis that hides one page wastes the same width.
    if (previous !== undefined && value - previous === 2) items.push(previous + 1);
    else if (previous !== undefined && value - previous > 2) items.push(null);
    items.push(value);
  });

  return { items, totalPages, from, to };
}
