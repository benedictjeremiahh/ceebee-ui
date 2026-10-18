export interface WorksheetPasteColumn<Row> {
  key: string;
  write?: (row: Row, value: string) => Row;
  canEdit?: (row: Row) => boolean;
}

export type WorksheetPasteFailure = 'malformed' | 'too-large' | 'out-of-range' | 'read-only';
export type WorksheetPasteResult<Row> = { ok: true; rows: Row[] }
  | { ok: false; reason: WorksheetPasteFailure };

const MAX_CELLS = 10000;

/** Parse plain clipboard TSV, including quoted multiline cells emitted by spreadsheet software. */
function parseClipboard(text: string): { ok: true; cells: string[][] }
  | { ok: false; reason: 'malformed' | 'too-large' } {
  const cells: string[][] = [];
  let row: string[] = [], value = '', quoted = false, closed = false, count = 0;
  const cell = () => { row.push(value); value = ''; closed = false; count += 1; };
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character !== '"') value += character;
      else if (text[index + 1] === '"') { value += '"'; index += 1; }
      else { quoted = false; closed = true; }
    } else if (character === '\t') cell();
    else if (character === '\n' || character === '\r') {
      cell(); cells.push(row); row = [];
      if (character === '\r' && text[index + 1] === '\n') index += 1;
    } else if (closed) return { ok: false, reason: 'malformed' };
    else if (character === '"' && value === '') quoted = true;
    else value += character;
    if (count > MAX_CELLS) return { ok: false, reason: 'too-large' };
  }
  if (quoted) return { ok: false, reason: 'malformed' };
  if (value || row.length || !cells.length || closed) { cell(); cells.push(row); }
  if (count > MAX_CELLS) return { ok: false, reason: 'too-large' };
  if (cells.some(candidate => candidate.length !== cells[0]?.length)) return { ok: false, reason: 'malformed' };
  return { ok: true, cells };
}

/** Plan one immutable range update. Protected cells refuse the entire range, including empty values. */
export function planWorksheetPaste<Row extends object>({ rows, columns, start, text, createRow }: {
  rows: readonly Row[];
  columns: readonly WorksheetPasteColumn<Row>[];
  start: { row: number; column: number };
  text: string;
  createRow?: () => Row;
}): WorksheetPasteResult<Row> {
  if (!Number.isSafeInteger(start.row) || !Number.isSafeInteger(start.column)
    || start.row < 0 || start.row > rows.length || start.column < 0 || start.column >= columns.length) {
    return { ok: false, reason: 'out-of-range' };
  }
  const parsed = parseClipboard(text);
  if (!parsed.ok) return parsed;
  const width = parsed.cells[0]?.length ?? 0;
  const endRow = start.row + parsed.cells.length;
  if (start.column + width > columns.length || (endRow > rows.length && !createRow)) {
    return { ok: false, reason: 'out-of-range' };
  }
  const next = [...rows];
  if (createRow) while (next.length < endRow) next.push(createRow());
  // Check every destination before invoking a writer; no protected value is silently skipped.
  for (let rowIndex = start.row; rowIndex < endRow; rowIndex += 1) {
    const row = next[rowIndex];
    if (!row) return { ok: false, reason: 'out-of-range' };
    for (let columnIndex = start.column; columnIndex < start.column + width; columnIndex += 1) {
      const column = columns[columnIndex];
      if (!column?.write || column.canEdit?.(row) === false) return { ok: false, reason: 'read-only' };
    }
  }
  for (const [offset, values] of parsed.cells.entries()) {
    let row = next[start.row + offset];
    if (!row) return { ok: false, reason: 'out-of-range' };
    for (const [columnOffset, value] of values.entries()) {
      const column = columns[start.column + columnOffset];
      if (column?.write) row = column.write(row, value);
    }
    next[start.row + offset] = row;
  }
  return { ok: true, rows: next };
}
