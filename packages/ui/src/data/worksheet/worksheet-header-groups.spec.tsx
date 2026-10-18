import { fireEvent, render, screen } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { textEditor } from 'react-data-grid';
import { Worksheet } from './worksheet.js';
import type { WorksheetColumn } from './worksheet.types.js';

const initialScrollIntoView = HTMLElement.prototype.scrollIntoView;
beforeAll(() => { HTMLElement.prototype.scrollIntoView = () => undefined; });
afterAll(() => { HTMLElement.prototype.scrollIntoView = initialScrollIntoView; });

interface Row {
  id: string;
  name: string;
  quantity: string;
  status: string;
}

const rows: readonly Row[] = [{ id: 'row-1', name: 'Alpha', quantity: '2', status: 'Open' }];
const columns: readonly WorksheetColumn<Row>[] = [
  { key: 'name', name: 'Name', headerGroup: { key: 'details', name: 'Details' }, frozen: true,
    editable: true, renderEditCell: textEditor, write: (row, value) => ({ ...row, name: value }) },
  { key: 'quantity', name: 'Quantity', headerGroup: { key: 'details', name: 'Details' },
    editable: true, renderEditCell: textEditor, write: (row, value) => ({ ...row, quantity: value }) },
  { key: 'status', name: 'Status' },
];

function dispatchPaste(target: Element, text: string): Event {
  const event = new Event('paste', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'clipboardData', {
    value: { getData: (type: string) => type === 'text/plain' ? text : '' },
  });
  target.dispatchEvent(event);
  return event;
}

describe('Worksheet grouped headers', () => {
  it('renders one group heading above its leaf headers and exposes two header rows', () => {
    render(
      <Worksheet
        label="Planning worksheet"
        rows={rows}
        columns={columns}
        rowKeyGetter={row => row.id}
        enableVirtualization={false}
      />,
    );

    expect(screen.getByRole('columnheader', { name: 'Details' })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: 'Quantity' })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: 'Status' })).toBeTruthy();
    expect(screen.getByRole('grid').parentElement?.getAttribute('data-header-rows')).toBe('2');
  });

  it('keeps repeated group keys separate when another column breaks the run', () => {
    const separatedGroups: readonly WorksheetColumn<Row>[] = [
      { key: 'name', name: 'Name', headerGroup: { key: 'details', name: 'Details' }, frozen: true },
      { key: 'status', name: 'Status' },
      { key: 'quantity', name: 'Quantity', headerGroup: { key: 'details', name: 'Details' } },
    ];
    render(
      <Worksheet
        label="Planning worksheet"
        rows={rows}
        columns={separatedGroups}
        rowKeyGetter={row => row.id}
        enableVirtualization={false}
      />,
    );

    expect(screen.getAllByRole('columnheader', { name: 'Details' })).toHaveLength(2);
  });

  it('keeps paste and focus indexes mapped to flat leaf columns', () => {
    const scrollIntoView = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = () => undefined;
    try {
      const onChange = vi.fn<(next: Row[]) => void>();
      render(
        <Worksheet
          label="Planning worksheet"
          rows={rows}
          columns={columns}
          onChange={onChange}
          rowKeyGetter={row => row.id}
          focusRequest={{ row: 0, columnKey: 'quantity', requestId: 1, edit: true }}
        />,
      );

      expect(screen.getByDisplayValue('2')).toBeTruthy();
      fireEvent.keyDown(screen.getByDisplayValue('2'), { key: 'Escape' });
      const nameCell = screen.getByRole('gridcell', { name: 'Alpha' });
      expect(nameCell.classList.contains('rdg-cell-frozen')).toBe(true);
      fireEvent.mouseDown(nameCell);
      const event = dispatchPaste(nameCell, 'Changed\t9');

      expect(event.defaultPrevented).toBe(true);
      expect(onChange).toHaveBeenCalledWith([{ ...rows[0], name: 'Changed', quantity: '9' }]);
    } finally {
      HTMLElement.prototype.scrollIntoView = scrollIntoView;
    }
  });

  it('keeps uneditable leaf columns protected from external paste', () => {
    const onChange = vi.fn<(next: Row[]) => void>();
    const onPasteRejected = vi.fn();
    render(
      <Worksheet
        label="Planning worksheet"
        rows={rows}
        columns={columns}
        onChange={onChange}
        onPasteRejected={onPasteRejected}
        rowKeyGetter={row => row.id}
      />,
    );
    const quantityCell = screen.getByRole('gridcell', { name: '2' });
    fireEvent.mouseDown(quantityCell);

    const event = dispatchPaste(quantityCell, '9\tClosed');

    expect(event.defaultPrevented).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
    expect(onPasteRejected).toHaveBeenCalledWith('read-only');
  });
});
