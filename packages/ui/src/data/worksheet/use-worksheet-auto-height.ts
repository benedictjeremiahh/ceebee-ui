import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { SELECT_COLUMN_KEY } from 'react-data-grid';
import type { WorksheetColumn } from './worksheet.types.js';
import { measureWorksheetRowHeight, WorksheetCellHeightCache } from './worksheet-cell-height.js';

function runtimeColumnOrder<Row extends object>(columns: readonly WorksheetColumn<Row>[]): WorksheetColumn<Row>[] {
  // Mirrors the pinned grid order: selection column first, then frozen columns, stable within each group.
  return [...columns].sort((left, right) => {
    if (left.key === SELECT_COLUMN_KEY) return -1;
    if (right.key === SELECT_COLUMN_KEY) return 1;
    if (left.frozen) return right.frozen ? 0 : -1;
    return right.frozen ? 1 : 0;
  });
}

export function useWorksheetAutoHeight<Row extends object>({
  host,
  rows,
  columns,
  minimum,
  headerHeight,
  headerRows,
  enabled,
}: {
  host: RefObject<HTMLDivElement | null>;
  rows: readonly Row[];
  columns: readonly WorksheetColumn<Row>[];
  minimum: number | undefined;
  headerHeight: number | undefined;
  headerRows: number;
  enabled: boolean;
}) {
  const heights = useRef(new WorksheetCellHeightCache<Row>());
  const [revision, setRevision] = useState(0);
  const minimumHeight = minimum ?? 35;
  const runtimeColumns = useMemo(() => runtimeColumnOrder(columns), [columns]);

  useEffect(() => {
    const root = host.current;
    if (!enabled || !root) return;
    const resizeObserver = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(schedule);
    const mutationObserver = typeof MutationObserver === 'undefined' ? undefined : new MutationObserver(schedule);
    const observed = new Set<Element>();
    let frame = 0;
    let closed = false;

    function measure() {
      if (closed || !root) return;
      let changed = false;
      const currentTargets = new Set<Element>();
      const currentColumnKeys = new Set(runtimeColumns.map(column => column.key));
      changed = heights.current.prune(rows, currentColumnKeys);
      const observe = (element: Element) => {
        currentTargets.add(element);
        if (observed.has(element)) return;
        observed.add(element);
        resizeObserver?.observe(element);
      };
      for (const rowElement of root.querySelectorAll<HTMLElement>('.rdg-row[aria-rowindex]')) {
        const rawIndex = rowElement.getAttribute('aria-rowindex');
        const rowIndex = rawIndex === null ? -1 : Number(rawIndex) - headerRows - 1;
        const row = rows[rowIndex];
        if (!row) continue;
        for (const cell of rowElement.querySelectorAll<HTMLElement>('.rdg-cell')) {
          observe(cell);
          for (const child of cell.children) observe(child);
          const rawColumnIndex = cell.getAttribute('aria-colindex');
          const columnIndex = rawColumnIndex === null ? -1 : Number(rawColumnIndex) - 1;
          const column = runtimeColumns[columnIndex];
          if (!column) continue;
          const height = measureWorksheetRowHeight(cell, minimumHeight);
          changed = heights.current.set(row, column.key, height) || changed;
        }
      }
      for (const element of observed) {
        if (currentTargets.has(element)) continue;
        resizeObserver?.unobserve(element);
        observed.delete(element);
      }
      if (changed) setRevision(value => value + 1);
    }

    function schedule() {
      if (closed || frame !== 0) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    }

    measure();
    mutationObserver?.observe(root, { childList: true, characterData: true, subtree: true });
    return () => {
      closed = true;
      if (frame !== 0) cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [enabled, headerRows, minimumHeight, rows, runtimeColumns, host]);

  const getCachedRowHeight = useCallback((row: Row) => heights.current.getRowHeight(row, minimumHeight), [minimumHeight]);
  const getRowHeight = useCallback((row: Row) => getCachedRowHeight(row), [getCachedRowHeight, revision]);
  const contentHeight = useMemo(() => {
    const body = rows.reduce((sum, row) => sum + getCachedRowHeight(row), 0);
    return `calc(${body}px + ${(headerHeight ?? 35) * headerRows}px + var(--cb-space-3))`;
  }, [getCachedRowHeight, headerHeight, headerRows, revision, rows]);

  return { getRowHeight, contentHeight };
}
