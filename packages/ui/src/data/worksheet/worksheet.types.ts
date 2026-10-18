import type { DataGridProps, Column, RenderCellProps, RenderEditCellProps } from 'react-data-grid';
import type { WorksheetPasteFailure } from './worksheet-paste.js';

export type WorksheetCellProps<Row extends object> = RenderCellProps<Row>;
export type WorksheetEditCellProps<Row extends object> = RenderEditCellProps<Row>;

export interface WorksheetFocusRequest {
  row: number;
  columnKey: string;
  requestId: number;
  edit?: boolean;
}

export interface WorksheetColumn<Row extends object> extends Column<Row> {
  /** Groups adjacent columns under a shared header without changing their flat indexes. */
  headerGroup?: { key: string; name: Column<Row>['name'] };
  /** Updates this cell for a validated external paste. */
  write?: (row: Row, value: string) => Row;
  /** Allows external range paste independently of direct cell editing. Defaults to true. */
  pasteable?: boolean | ((row: Row) => boolean);
}

type WorksheetGridOptions<Row extends object> = Pick<
  Omit<
    DataGridProps<Row>,
    | 'aria-label'
    | 'aria-labelledby'
    | 'columns'
    | 'onCellPaste'
    | 'onRowsChange'
    | 'onSelectedCellChange'
    | 'role'
    | 'rows'
  >,
  'aria-description' | 'aria-describedby' | 'data-cy' | 'data-testid' | 'enableVirtualization' |
  'headerRowHeight' | 'rowHeight' | 'rowKeyGetter' | 'rowClass'
>;

export type WorksheetProps<Row extends object> = WorksheetGridOptions<Row> & {
  label: string;
  rows: readonly Row[];
  columns: readonly WorksheetColumn<Row>[];
  onChange?: (rows: Row[]) => void;
  createRow?: () => Row;
  onPasteRejected?: (reason: WorksheetPasteFailure) => void;
  focusRequest?: WorksheetFocusRequest;
};
