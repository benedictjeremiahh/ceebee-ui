import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { textEditor } from 'react-data-grid';
import { FocusRecovery } from '../../focus/focus-recovery/focus-recovery.js';
import { Worksheet } from './worksheet.js';
import type { WorksheetColumn } from './worksheet.types.js';

interface Row { id: string; name: string }
const columns: WorksheetColumn<Row>[] = [
  { key: 'name', name: 'Name', editable: true, renderEditCell: textEditor },
];
const originalScroll = HTMLElement.prototype.scrollIntoView;
beforeAll(() => { HTMLElement.prototype.scrollIntoView = () => undefined; });
afterAll(() => { HTMLElement.prototype.scrollIntoView = originalScroll; });

function Example() {
  const heading = createRef<HTMLHeadingElement>();
  const [rows, setRows] = useState([{ id: 'one', name: 'Original' }]);
  return <FocusRecovery targetRef={heading}>
    <h2 ref={heading} tabIndex={-1}>Sheet section</h2>
    <p>Sheet guidance</p>
    <button onMouseDown={event => event.currentTarget.focus()}>Another action</button>
    <Worksheet label="Editable costs" rows={rows} columns={columns} rowKeyGetter={row => row.id}
      enableVirtualization={false} editOnClick onChange={setRows} />
  </FocusRecovery>;
}

describe('Worksheet editor focus recovery', () => {
  it('returns a removed editor to its cell instead of an outer section heading', async () => {
    render(<Example />);
    fireEvent.click(screen.getByRole('gridcell', { name: 'Original' }));
    const editor = screen.getByDisplayValue('Original');
    expect(editor).toHaveFocus();
    fireEvent.change(editor, { target: { value: 'Changed' } });
    fireEvent.mouseDown(screen.getByText('Sheet guidance'));
    await act(async () => {});
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.getByRole('gridcell', { name: 'Changed' })).toHaveFocus();
    expect(screen.getByRole('heading')).not.toHaveFocus();
  });

  it('does not steal focus from the action that closed the editor', async () => {
    render(<Example />);
    fireEvent.click(screen.getByRole('gridcell', { name: 'Original' }));
    const action = screen.getByRole('button', { name: 'Another action' });
    fireEvent.mouseDown(action);
    await act(async () => {});
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(action).toHaveFocus();
  });
});
