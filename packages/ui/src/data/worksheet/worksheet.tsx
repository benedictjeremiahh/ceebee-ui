'use client';

import { DataGrid } from 'react-data-grid';
import type { DataGridHandle } from 'react-data-grid';
import type { WorksheetPasteColumn } from './worksheet-paste.js';
import { planWorksheetPaste } from './worksheet-paste.js';
import { useEffect, useMemo, useRef, useState, type ClipboardEvent } from 'react';
import { createCssProbe, watchTokens } from '../../lib/css-probe.js';
import type { WorksheetColumn, WorksheetFocusRequest, WorksheetProps } from './worksheet.types.js';
import './worksheet.css';

interface ActiveCell {
  rowIdx: number;
  columnKey: string;
}

function isEditable<Row extends object>(column: WorksheetColumn<Row>, row: Row): boolean {
  if (!column.renderEditCell || column.editable === false) return false;
  return typeof column.editable === 'function' ? column.editable(row) : true;
}

function isGridCellTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  if (target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return false;
  return target.closest('[role="gridcell"]') !== null;
}

/** A typed worksheet surface that leaves cell navigation and editing to react-data-grid. */
export function Worksheet<Row extends object>({
  label,
  rows,
  columns,
  onChange,
  createRow,
  onPasteRejected,
  focusRequest,
  rowHeight,
  headerRowHeight,
  ...gridOptions
}: WorksheetProps<Row>) {
  const activeCell = useRef<ActiveCell | null>(null);
  const grid = useRef<DataGridHandle | null>(null);
  const focusState = useRef<{
    rows: readonly Row[];
    columns: readonly WorksheetColumn<Row>[];
    request?: WorksheetFocusRequest;
  }>({ rows, columns, request: focusRequest });
  focusState.current = { rows, columns, request: focusRequest };
  const host = useRef<HTMLDivElement>(null);
  const [tokenRowHeight, setTokenRowHeight] = useState<number>();
  const [tokenHeaderRowHeight, setTokenHeaderRowHeight] = useState<number>();

  useEffect(() => {
    const root = host.current;
    if (!root) return;
    const probe = createCssProbe(root);
    const updateHeights = () => {
      setTokenRowHeight(probe.length('--cb-worksheet-row-height'));
      setTokenHeaderRowHeight(probe.length('--cb-worksheet-header-row-height'));
    };
    updateHeights();
    const stopWatchingTokens = watchTokens(updateHeights);
    return () => {
      stopWatchingTokens();
      probe.done();
    };
  }, []);
  useEffect(() => {
    const { rows: currentRows, columns: currentColumns, request } = focusState.current;
    if (!request || !Number.isSafeInteger(request.row) || request.row < 0 || request.row >= currentRows.length) return;
    const idx = currentColumns.findIndex(column => column.key === request.columnKey);
    const currentGrid = grid.current;
    if (idx < 0 || !currentGrid) return;
    currentGrid.scrollToCell({ rowIdx: request.row, idx });
    currentGrid.selectCell({ rowIdx: request.row, idx }, {
      enableEditor: request.edit ?? false,
      shouldFocusCell: true,
    });
  }, [focusRequest?.requestId]);

  const gridColumns = useMemo(
    () => columns.map(column => onChange ? column : { ...column, editable: false }),
    [columns, onChange],
  );
  const pasteColumns = useMemo<WorksheetPasteColumn<Row>[]>(
    () => columns.map(column => ({
      key: column.key,
      write: onChange ? column.write : undefined,
      canEdit: row => Boolean(onChange) && isEditable(column, row) &&
        (typeof column.pasteable === 'function' ? column.pasteable(row) : column.pasteable !== false),
    })),
    [columns, onChange],
  );

  function onPasteCapture(event: ClipboardEvent<HTMLDivElement>) {
    const selected = activeCell.current;
    if (!selected || !isGridCellTarget(event.target)) return;

    event.preventDefault();
    event.stopPropagation();
    const startColumn = columns.findIndex(column => column.key === selected.columnKey);
    const result = planWorksheetPaste({
      rows,
      columns: pasteColumns,
      start: { row: selected.rowIdx, column: startColumn },
      text: event.clipboardData.getData('text/plain'),
      createRow,
    });
    if (result.ok) onChange?.(result.rows);
    else onPasteRejected?.(result.reason);
  }

  return (
    <div ref={host} className="cb-worksheet" onPasteCapture={onPasteCapture}>
      <DataGrid
        {...gridOptions}
        ref={grid}
        aria-label={label}
        rowHeight={rowHeight ?? tokenRowHeight}
        headerRowHeight={headerRowHeight ?? tokenHeaderRowHeight}
        columns={gridColumns}
        rows={rows}
        onRowsChange={onChange}
        onCellKeyDown={(args, event) => {
          if (args.mode === 'SELECT' && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'v') {
            event.preventGridDefault();
          }
        }}
        onSelectedCellChange={({ rowIdx, column }) => {
          activeCell.current = { rowIdx, columnKey: column.key };
        }}
      />
    </div>
  );
}
