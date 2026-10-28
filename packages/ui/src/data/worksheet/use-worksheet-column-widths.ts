import { useCallback, useLayoutEffect, useMemo, useState, type RefObject } from 'react';
import type { ColumnWidths } from 'react-data-grid';
import type { WorksheetColumn } from './worksheet.types.js';

interface WidthState {
  geometry: string;
  neighbors: string | undefined;
  widths: ColumnWidths;
}

function resizedWidths(widths: ColumnWidths): ColumnWidths {
  return new Map([...widths].filter(([, entry]) => entry.type === 'resized'));
}

function sameWidths(left: ColumnWidths, right: ColumnWidths): boolean {
  return left.size === right.size && [...left].every(([key, entry]) => {
    const other = right.get(key);
    return other?.type === entry.type && other.width === entry.width;
  });
}

/** Keep explicit resizes; settle fractional tracks after their measured neighbors are known. */
export function useWorksheetColumnWidths<Row extends object>(
  columns: readonly WorksheetColumn<Row>[],
  host: RefObject<HTMLElement | null>,
) {
  const [hostWidth, setHostWidth] = useState(0);
  useLayoutEffect(() => {
    const root = host.current;
    if (!root) return;
    const update = () => setHostWidth(root.clientWidth);
    update();
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update);
    observer?.observe(root);
    return () => observer?.disconnect();
  }, [host]);

  const geometry = JSON.stringify([hostWidth, columns.map(column => [
    column.key, column.width, column.minWidth, column.maxWidth, column.frozen,
  ])]);
  const [state, setState] = useState<WidthState>(() => ({ geometry, neighbors: undefined, widths: new Map() }));
  const columnWidths = useMemo(() => state.geometry === geometry ? state.widths : resizedWidths(state.widths), [state, geometry]);
  const onColumnWidthsChange = useCallback((incoming: ColumnWidths) => {
    setState(current => {
      const visible = new Set(columns.map(column => column.key));
      const next = new Map(incoming);
      // A hidden column may be shown again; its deliberate width still belongs to the user.
      for (const [key, entry] of current.widths) {
        if (!visible.has(key) && entry.type === 'resized') next.set(key, entry);
      }
      const fractional = columns.filter(column => typeof column.width === 'string' && /\d(?:\.\d+)?fr\b/i.test(column.width));
      const flexibleKeys = new Set(fractional.map(column => column.key));
      const neighbors = JSON.stringify(columns.filter(column => !flexibleKeys.has(column.key) || next.get(column.key)?.type === 'resized')
        .map(column => [column.key, next.get(column.key)?.type, next.get(column.key)?.width ?? column.width]));
      if (current.geometry !== geometry || current.neighbors !== neighbors) {
        // One extra pass uses settled neighbors. Its own fractional result does not invalidate itself.
        for (const column of fractional) if (next.get(column.key)?.type === 'measured') next.delete(column.key);
      }
      if (current.geometry === geometry && current.neighbors === neighbors && sameWidths(current.widths, next)) return current;
      return { geometry, neighbors, widths: next };
    });
  }, [columns, geometry]);

  return { columnWidths, onColumnWidthsChange };
}
