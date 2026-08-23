'use client';

import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { Skeleton } from '../feedback/skeleton.js';
import { ariaSortFor, nextSort, type SortState } from './table-sort.js';

export interface Column<Row> {
  key: string;
  header: ReactNode;
  /** Cell content. Given the row, so a column can render a Badge or an Avatar. */
  cell: (row: Row) => ReactNode;
  align?: 'start' | 'end';
  width?: string;
  sortable?: boolean;
  /** Hides the column below 720px — for the ones a phone can live without. */
  secondary?: boolean;
  /** Clips overflowing text with an ellipsis instead of widening the column. */
  truncate?: boolean;
}

export interface DataTableProps<Row> {
  columns: Array<Column<Row>>;
  rows: Row[];
  rowKey: (row: Row) => string;
  /** Accessible name for the table. */
  label: string;
  sort?: SortState | null;
  onSortChange?: (sort: SortState | null) => void;
  onRowClick?: (row: Row) => void;
  /** Rendered in place of the body when there are no rows — an Empty, usually. */
  empty?: ReactNode;
  className?: string;
}

/**
 * A table, not a grid: no virtualisation, no column resizing, no editing. It renders rows and
 * sorts by a column, and anything past that is a product feature rather than a design system one.
 */
export function Table<Row>({
  columns,
  rows,
  rowKey,
  label,
  sort = null,
  onSortChange,
  onRowClick,
  empty,
  className,
}: DataTableProps<Row>) {
  if (rows.length === 0 && empty) {
    return <div className={cn('cb-table__empty', className)}>{empty}</div>;
  }

  return (
    <div className={cn('cb-table__scroll', className)}>
      <table className="cb-table" aria-label={label}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                style={column.width ? { width: column.width } : undefined}
                data-align={column.align}
                data-secondary={column.secondary || undefined}
                aria-sort={column.sortable ? ariaSortFor(sort, column.key) : undefined}
              >
                {column.sortable && onSortChange ? (
                  <button
                    type="button"
                    className="cb-table__sort"
                    onClick={() => onSortChange(nextSort(sort, column.key))}
                  >
                    {column.header}
                    <SortIcon state={sort} column={column.key} />
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              data-clickable={onRowClick ? '' : undefined}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  data-align={column.align}
                  data-secondary={column.secondary || undefined}
                  data-truncate={column.truncate || undefined}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SortIcon({ state, column }: { state: SortState | null; column: string }) {
  if (!state || state.column !== column) return <ChevronsUpDown size={13} className="cb-table__sort-idle" />;
  return state.direction === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />;
}

export interface DataTableSkeletonProps {
  columns: number;
  rows?: number;
  className?: string;
}

/** Same row height and column count as the real table, so the page does not jump (ADR 0009). */
function DataTableSkeleton({ columns, rows = 5, className }: DataTableSkeletonProps) {
  return (
    <div className={cn('cb-table__scroll', className)} aria-hidden="true">
      <table className="cb-table">
        <thead>
          <tr>
            {Array.from({ length: columns }, (_, index) => (
              <th key={index}>
                <Skeleton width="60%" height="0.75rem" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }, (_, cellIndex) => (
                <td key={cellIndex}>
                  <Skeleton width={cellIndex === 0 ? '70%' : '45%'} height="0.875rem" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Table.Skeleton = DataTableSkeleton;
