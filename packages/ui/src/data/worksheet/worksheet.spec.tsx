import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { textEditor } from 'react-data-grid';
import { Worksheet } from './worksheet.js';
import type { WorksheetColumn } from './worksheet.types.js';
import type { WorksheetPasteFailure } from './worksheet-paste.js';

interface Row {
  id: string;
  name: string;
  quantity: string;
}

const columns: readonly WorksheetColumn<Row>[] = [
  { key: 'name', name: 'Name', frozen: true, editable: true, renderEditCell: textEditor,
    write: (row, value) => ({ ...row, name: value }) },
  { key: 'quantity', name: 'Quantity', editable: true, renderEditCell: textEditor,
    write: (row, value) => ({ ...row, quantity: value }) },
  { key: 'id', name: 'Identifier' },
];

const initialRows: readonly Row[] = [{ id: 'row-1', name: 'Alpha', quantity: '2' }];

function dispatchPaste(target: Element, text: string): Event {
  const event = new Event('paste', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'clipboardData', {
    value: { getData: (type: string) => type === 'text/plain' ? text : '' },
  });
  target.dispatchEvent(event);
  return event;
}

function renderWorksheet({ rows = initialRows, withRowFactory = false, focusRequest, rowClass }: {
  rows?: readonly Row[];
  withRowFactory?: boolean;
  focusRequest?: { row: number; columnKey: string; requestId: number; edit?: boolean };
  rowClass?: (row: Row, rowIdx: number) => string | undefined;
} = {}) {
  const onChange = vi.fn<(next: Row[]) => void>();
  const onPasteRejected = vi.fn<(reason: WorksheetPasteFailure) => void>();
  render(
    <>
      <input aria-label="Ordinary input" />
      <Worksheet
        label="Planning worksheet"
        rows={rows}
        columns={columns}
        onChange={onChange}
        onPasteRejected={onPasteRejected}
        focusRequest={focusRequest}
        rowClass={rowClass}
        rowKeyGetter={row => row.id}
        createRow={withRowFactory ? () => ({ id: 'new-row', name: '', quantity: '' }) : undefined}
      />
    </>,
  );
  return { onChange, onPasteRejected };
}

describe('Worksheet', () => {
  it('forwards caller row classes to the matching grid row', () => {
    renderWorksheet({ rowClass: row => `section-${row.id}` });

    const row = screen.getByRole('row', { name: /Alpha/ });
    expect(row.classList.contains('section-row-1')).toBe(true);
  });

  it('uses the grid active-cell API to atomically paste a TSV range and append requested rows', () => {
    const { onChange } = renderWorksheet({ withRowFactory: true });
    screen.getByRole('grid', { name: 'Planning worksheet' });
    const activeCell = screen.getByRole('gridcell', { name: '2' });
    fireEvent.mouseDown(activeCell);
    const keyEvent = new KeyboardEvent('keydown', {
      key: 'v', code: 'KeyV', keyCode: 86, ctrlKey: true, bubbles: true, cancelable: true,
    });
    activeCell.dispatchEvent(keyEvent);
    expect(keyEvent.defaultPrevented).toBe(false);
    expect(screen.queryByDisplayValue('2')).toBeNull();

    const event = dispatchPaste(activeCell, '8\n5');

    expect(event.defaultPrevented).toBe(true);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith([
      { id: 'row-1', name: 'Alpha', quantity: '8' },
      { id: 'new-row', name: '', quantity: '5' },
    ]);
  });

  it('rejects a range that reaches a read-only column without applying a partial update', () => {
    const { onChange, onPasteRejected } = renderWorksheet();
    const nameCell = screen.getByRole('gridcell', { name: 'Alpha' });
    fireEvent.mouseDown(nameCell);

    const event = dispatchPaste(nameCell, 'Changed\t9\trow-1');

    expect(event.defaultPrevented).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
    expect(onPasteRejected).toHaveBeenCalledTimes(1);
    expect(onPasteRejected).toHaveBeenCalledWith('read-only');
  });

  it.each([
    { pasteable: false },
    { pasteable: (_row: Row) => false },
  ])('rejects paste into a cell protected by its paste permission while keeping it editable', ({ pasteable }) => {
    const scrollIntoView = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = () => undefined;
    try {
      const onChange = vi.fn<(next: Row[]) => void>();
      const onPasteRejected = vi.fn<(reason: WorksheetPasteFailure) => void>();
      const protectedColumns: readonly WorksheetColumn<Row>[] = [
        { key: 'name', name: 'Name', editable: true, renderEditCell: textEditor, pasteable,
          write: (row, value) => ({ ...row, name: value }) },
      ];
      render(
        <Worksheet
          label="Planning worksheet"
          rows={initialRows}
          columns={protectedColumns}
          onChange={onChange}
          onPasteRejected={onPasteRejected}
          focusRequest={{ row: 0, columnKey: 'name', requestId: 1, edit: true }}
          rowKeyGetter={row => row.id}
        />,
      );

      expect(screen.getByDisplayValue('Alpha')).toBeTruthy();
      const editor = screen.getByDisplayValue('Alpha');
      fireEvent.keyDown(editor, { key: 'Escape' });
      const cell = screen.getByRole('gridcell', { name: 'Alpha' });
      const event = dispatchPaste(cell, 'Changed');

      expect(event.defaultPrevented).toBe(true);
      expect(onChange).not.toHaveBeenCalled();
      expect(onPasteRejected).toHaveBeenCalledWith('read-only');
    } finally {
      HTMLElement.prototype.scrollIntoView = scrollIntoView;
    }
  });

  it('focuses and edits the requested cell through the grid handle', () => {
    const scrollIntoView = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = () => undefined;
    try {
      renderWorksheet({ focusRequest: { row: 0, columnKey: 'quantity', requestId: 1, edit: true } });

      const editor = screen.getByDisplayValue('2');
      expect(document.activeElement).toBe(editor);
    } finally {
      HTMLElement.prototype.scrollIntoView = scrollIntoView;
    }
  });

  it('preserves user selection when rows and columns rerender with the same request id', () => {
    const scrollIntoView = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = () => undefined;
    try {
      const focusRequest = { row: 0, columnKey: 'name', requestId: 1 };
      const view = render(
        <Worksheet label="Planning worksheet" rows={initialRows} columns={columns} focusRequest={focusRequest} />,
      );
      const quantityCell = screen.getByRole('gridcell', { name: '2' });
      fireEvent.mouseDown(quantityCell);

      view.rerender(
        <Worksheet label="Planning worksheet" rows={[...initialRows]} columns={[...columns]} focusRequest={focusRequest} />,
      );

      expect(screen.getByRole('gridcell', { name: '2' }).getAttribute('aria-selected')).toBe('true');
    } finally {
      HTMLElement.prototype.scrollIntoView = scrollIntoView;
    }
  });

  it.each([
    { row: 8, columnKey: 'quantity', requestId: 1 },
    { row: 0, columnKey: 'missing', requestId: 2 },
  ])('ignores an invalid focus request without writing', (focusRequest) => {
    const { onChange } = renderWorksheet({ focusRequest });

    expect(screen.getByRole('grid', { name: 'Planning worksheet' })).toBeTruthy();
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByDisplayValue('2')).toBeNull();
  });

  it('leaves paste in the active cell editor to the browser', () => {
    const scrollIntoView = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = () => undefined;
    try {
      const { onChange, onPasteRejected } = renderWorksheet({
        focusRequest: { row: 0, columnKey: 'quantity', requestId: 9, edit: true },
      });
      const editor = screen.getByDisplayValue('2');
      const event = dispatchPaste(editor, 'Native editor paste');

      expect(event.defaultPrevented).toBe(false);
      expect(onChange).not.toHaveBeenCalled();
      expect(onPasteRejected).not.toHaveBeenCalled();
    } finally {
      HTMLElement.prototype.scrollIntoView = scrollIntoView;
    }
  });

  it('leaves paste in an ordinary focused input to the browser', () => {
    const { onChange, onPasteRejected } = renderWorksheet();
    const input = screen.getByRole('textbox', { name: 'Ordinary input' });

    const event = dispatchPaste(input, 'Keep native input paste');

    expect(event.defaultPrevented).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
    expect(onPasteRejected).not.toHaveBeenCalled();
  });
});
