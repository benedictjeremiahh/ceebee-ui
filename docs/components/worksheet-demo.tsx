'use client';
import { useState } from 'react';
import { Input, Worksheet, type WorksheetColumn } from '@ceebee/ui/client';

interface Row { id: string; name: string; notes: string }

const columns: WorksheetColumn<Row>[] = [
  { key: 'name', name: 'Name', frozen: true, width: '50%', editable: true,
    write: (row, name) => ({ ...row, name }),
    renderEditCell: ({ row, onRowChange }) => <Input autoFocus aria-label="Name" value={row.name}
      onChange={event => onRowChange({ ...row, name: event.target.value })} /> },
  { key: 'notes', name: 'Notes', editable: true,
    write: (row, notes) => ({ ...row, notes }),
    renderEditCell: ({ row, onRowChange }) => <Input autoFocus aria-label="Notes" value={row.notes}
      onChange={event => onRowChange({ ...row, notes: event.target.value })} /> },
];

export function WorksheetDemo() {
  const [rows, setRows] = useState<Row[]>([
    { id: 'first', name: 'First item', notes: 'Double-click or press Enter to edit' },
    { id: 'second', name: 'Second item', notes: 'Paste a two-column range here' },
  ]);
  const [failure, setFailure] = useState<string>();
  return <>
    <Worksheet label="Example worksheet" rows={rows} columns={columns} rowKeyGetter={row => row.id}
      onChange={next => { setRows(next); setFailure(undefined); }} onPasteRejected={setFailure} />
    {failure ? <p role="alert">Paste refused: {failure}. No cells changed.</p> : null}
  </>;
}
