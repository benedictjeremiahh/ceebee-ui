import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { textEditor } from 'react-data-grid';
import { Worksheet } from './worksheet.js';
import type { WorksheetColumn } from './worksheet.types.js';

interface Row { id: string; name: string; quantity: string }
const initial = [{ id: 'a', name: 'Alpha', quantity: '2' }, { id: 'b', name: 'Beta', quantity: '3' }];
const columns: WorksheetColumn<Row>[] = [
  { key: 'name', name: 'Name', editable: true, renderEditCell: textEditor, write: (row, name) => ({ ...row, name }) },
  { key: 'quantity', name: 'Quantity', editable: row => row.id === 'a', renderEditCell: textEditor,
    write: (row, quantity) => ({ ...row, quantity }) },
  { key: 'id', name: 'Identifier' },
];
const originalScroll = HTMLElement.prototype.scrollIntoView;
beforeAll(() => { HTMLElement.prototype.scrollIntoView = () => undefined; });
afterAll(() => { HTMLElement.prototype.scrollIntoView = originalScroll; });

function paste(element: Element, text: string) {
  const event = new Event('paste', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'clipboardData', { value: { getData: () => text } });
  fireEvent(element, event);
  return event;
}

function Example({ enabled = true, readOnly = false, onRejected = vi.fn() }: {
  enabled?: boolean; readOnly?: boolean; onRejected?: () => void;
}) {
  const [rows, setRows] = useState(initial);
  return <Worksheet label="Example" rows={rows} columns={columns} rowKeyGetter={row => row.id} enableVirtualization={false}
    editOnClick={enabled} onChange={readOnly ? undefined : setRows} onPasteRejected={onRejected} />;
}

describe('Worksheet pointer editing', () => {
  it('opens and focuses the editor on one plain click', () => {
    render(<Example />);
    fireEvent.click(screen.getByRole('gridcell', { name: 'Alpha' }));
    expect(document.activeElement).toBe(screen.getByDisplayValue('Alpha'));
  });

  it('keeps selection-only behavior when the option is disabled', () => {
    render(<Example enabled={false} />);
    fireEvent.click(screen.getByRole('gridcell', { name: 'Alpha' }));
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('never opens protected, row-disabled or globally read-only cells', () => {
    const view = render(<Example />);
    fireEvent.click(screen.getByRole('gridcell', { name: 'a' }));
    fireEvent.click(screen.getByRole('gridcell', { name: '3' }));
    expect(screen.queryByRole('textbox')).toBeNull();
    view.rerender(<Example readOnly />);
    fireEvent.click(screen.getByRole('gridcell', { name: 'Alpha' }));
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('leaves modified clicks and embedded controls alone', () => {
    const action = vi.fn();
    render(<Worksheet label="Example" rows={initial.slice(0, 1)} onChange={vi.fn()} editOnClick columns={[
      { key: 'name', name: 'Name', editable: true, renderEditCell: textEditor,
        renderCell: () => <button onClick={action}>Open details</button> },
    ]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open details' }));
    expect(action).toHaveBeenCalledOnce();
    expect(screen.queryByRole('textbox')).toBeNull();
    fireEvent.click(screen.getByRole('gridcell'), { ctrlKey: true });
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('keeps Tab commit and Escape cancellation owned by the grid', () => {
    render(<Example />);
    fireEvent.click(screen.getByRole('gridcell', { name: 'Alpha' }));
    fireEvent.change(screen.getByDisplayValue('Alpha'), { target: { value: 'Changed' } });
    fireEvent.keyDown(screen.getByDisplayValue('Changed'), { key: 'Tab' });
    expect(screen.getByRole('gridcell', { name: 'Changed' })).toBeTruthy();
    fireEvent.click(screen.getByRole('gridcell', { name: 'Changed' }));
    fireEvent.change(screen.getByDisplayValue('Changed'), { target: { value: 'Discarded' } });
    fireEvent.keyDown(screen.getByDisplayValue('Discarded'), { key: 'Escape' });
    expect(screen.getByRole('gridcell', { name: 'Changed' })).toBeTruthy();
  });

  it('maps rectangular clipboard data from an active editor without losing native single-cell paste', () => {
    render(<Example />);
    fireEvent.click(screen.getByRole('gridcell', { name: 'Alpha' }));
    const editor = screen.getByDisplayValue('Alpha');
    expect(paste(editor, 'plain text').defaultPrevented).toBe(false);
    expect(paste(editor, 'First\nSecond').defaultPrevented).toBe(true);
    expect(screen.getByRole('gridcell', { name: 'First' })).toBeTruthy();
    expect(screen.getByRole('gridcell', { name: 'Second' })).toBeTruthy();
  });

  it('rejects a protected range atomically while its editor remains active', () => {
    const rejected = vi.fn();
    render(<Example onRejected={rejected} />);
    fireEvent.click(screen.getByRole('gridcell', { name: '2' }));
    expect(paste(screen.getByDisplayValue('2'), '4\ta').defaultPrevented).toBe(true);
    expect(rejected).toHaveBeenCalledWith('read-only');
    expect(screen.getByDisplayValue('2')).toBeTruthy();
    expect(screen.getByRole('gridcell', { name: 'Alpha' })).toBeTruthy();
  });
});
