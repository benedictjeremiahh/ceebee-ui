import { describe, expect, it } from 'vitest';
import { planWorksheetPaste } from './worksheet-paste.js';

interface Row { name: string; quantity: string; locked?: boolean }
const columns = [
  { key: 'name', write: (row: Row, name: string) => ({ ...row, name }) },
  { key: 'quantity', canEdit: (row: Row) => !row.locked,
    write: (row: Row, quantity: string) => ({ ...row, quantity }) },
  { key: 'total' },
];
const rows: Row[] = [{ name: 'Original', quantity: '1' }, { name: 'Other', quantity: '2' }];

describe('worksheet paste planning', () => {
  it('pastes an external rectangular range without mutating the source', () => {
    const result = planWorksheetPaste({ rows, columns, start: { row: 0, column: 0 },
      text: 'First\t12\r\nSecond\t4\r\n' });
    expect(result).toEqual({ ok: true, rows: [
      { name: 'First', quantity: '12' }, { name: 'Second', quantity: '4' },
    ] });
    expect(rows[0]).toEqual({ name: 'Original', quantity: '1' });
  });

  it('preserves quoted tabs, newlines, escaped quotes and empty trailing cells', () => {
    const result = planWorksheetPaste({ rows, columns, start: { row: 0, column: 0 },
      text: '"First\tline\ncontinued ""quote"""\t\nSecond\t3' });
    expect(result).toEqual({ ok: true, rows: [
      { name: 'First\tline\ncontinued "quote"', quantity: '' }, { name: 'Second', quantity: '3' },
    ] });
  });

  it('appends only explicitly provided blank rows', () => {
    expect(planWorksheetPaste({ rows: [], columns, start: { row: 0, column: 0 }, text: 'A\t1\nB\t2',
      createRow: () => ({ name: '', quantity: '' }) })).toEqual({ ok: true,
      rows: [{ name: 'A', quantity: '1' }, { name: 'B', quantity: '2' }] });
    expect(planWorksheetPaste({ rows, columns, start: { row: 1, column: 0 }, text: 'A\nB' }))
      .toEqual({ ok: false, reason: 'out-of-range' });
  });

  it('rejects the whole paste when one destination is protected', () => {
    const locked: Row[] = [{ name: 'Original', quantity: '1' }, { name: 'Locked', quantity: '2', locked: true }];
    expect(planWorksheetPaste({ rows: locked, columns, start: { row: 0, column: 0 }, text: 'A\t1\nB\t2' }))
      .toEqual({ ok: false, reason: 'read-only' });
    expect(locked[0]).toEqual(rows[0]);
    expect(planWorksheetPaste({ rows, columns, start: { row: 0, column: 1 }, text: '1\t999' }))
      .toEqual({ ok: false, reason: 'read-only' });
  });

  it('refuses malformed, ragged, oversized and out-of-range input without partial writes', () => {
    for (const text of ['"Unclosed', '"Closed"suffix\t1', 'A\t1\nB']) {
      expect(planWorksheetPaste({ rows, columns, start: { row: 0, column: 0 }, text }))
        .toEqual({ ok: false, reason: 'malformed' });
    }
    expect(planWorksheetPaste({ rows, columns, start: { row: 0, column: 0 }, text: 'a\t'.repeat(10000) }))
      .toEqual({ ok: false, reason: 'too-large' });
    for (const start of [{ row: -1, column: 0 }, { row: 0, column: 0.5 }, { row: 0, column: 3 }]) {
      expect(planWorksheetPaste({ rows, columns, start, text: 'a' }))
        .toEqual({ ok: false, reason: 'out-of-range' });
    }
  });
});
