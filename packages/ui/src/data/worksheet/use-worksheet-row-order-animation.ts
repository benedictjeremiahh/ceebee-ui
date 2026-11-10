'use client';

import { useLayoutEffect, useRef, type Key, type RefObject } from 'react';

const movingClass = 'cb-worksheet__row--moving';

/** The vertical offset of a transform the browser reports, mid-transition included. */
function translateYOf(element: HTMLElement): number {
  const value = window.getComputedStyle(element).transform;
  const match = /^matrix(3d)?\((.+)\)$/.exec(value);
  if (!match?.[2]) return 0;
  const parts = match[2].split(',').map(Number);
  const offset = match[1] ? parts[13] : parts[5];
  return offset !== undefined && Number.isFinite(offset) ? offset : 0;
}

function prefersReducedMotion(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Animates body rows from where they were to where a reorder put them (first, last, invert, play). Rows are
 * matched by their key, so only a row that exists before and after moves; a virtualised row that scrolls in
 * simply appears. Under reduced motion rows reorder instantly.
 */
export function useWorksheetRowOrderAnimation<Row extends object>({ host, rows, rowKey, headerRows, enabled }: {
  host: RefObject<HTMLDivElement | null>;
  rows: readonly Row[];
  rowKey: ((row: Row) => Key) | undefined;
  headerRows: number;
  enabled: boolean;
}): void {
  const positions = useRef(new Map<Key, number>());
  useLayoutEffect(() => {
    const root = host.current;
    const grid = root?.querySelector<HTMLElement>('.rdg');
    if (!enabled || !rowKey || !root || !grid || prefersReducedMotion()) {
      positions.current.clear();
      return;
    }
    const origin = grid.getBoundingClientRect().top - grid.scrollTop;
    const previous = positions.current;
    const next = new Map<Key, number>();
    const moves: { element: HTMLElement; offset: number }[] = [];
    for (const element of grid.querySelectorAll<HTMLElement>('.rdg-row[aria-rowindex]')) {
      const row = rows[Number(element.getAttribute('aria-rowindex')) - headerRows - 1];
      if (!row) continue;
      const key = rowKey(row);
      // Where the row is drawn now, including a move that is still in flight, is where it starts from.
      const drawnOffset = translateYOf(element);
      element.classList.remove(movingClass);
      element.style.removeProperty('transform');
      const top = element.getBoundingClientRect().top - origin;
      next.set(key, top);
      const before = previous.get(key);
      if (before !== undefined && before + drawnOffset !== top) moves.push({ element, offset: before + drawnOffset - top });
    }
    positions.current = next;
    if (!moves.length) return;
    for (const { element, offset } of moves) element.style.transform = `translateY(${offset}px)`;
    void grid.offsetHeight;
    for (const { element } of moves) {
      element.classList.add(movingClass);
      element.style.removeProperty('transform');
      const settle = (event: TransitionEvent) => {
        if (event.target !== element || event.propertyName !== 'transform') return;
        element.classList.remove(movingClass);
        element.removeEventListener('transitionend', settle);
      };
      element.addEventListener('transitionend', settle);
    }
  });
}
