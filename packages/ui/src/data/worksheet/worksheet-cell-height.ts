export function measureWorksheetRowHeight(cell: HTMLElement, minimum: number): number {
  let contentHeight = 0;
  const range = document.createRange();
  range.selectNodeContents(cell);
  if (typeof range.getBoundingClientRect === 'function') contentHeight = range.getBoundingClientRect().height;
  for (const child of cell.children) {
    contentHeight = Math.max(contentHeight, child.getBoundingClientRect().height);
  }
  const style = getComputedStyle(cell);
  const verticalEdges = [
    style.paddingBlockStart,
    style.paddingBlockEnd,
    style.borderBlockStartWidth,
    style.borderBlockEndWidth,
  ].reduce((sum, value) => sum + (Number.parseFloat(value) || 0), 0);
  return Math.max(minimum, Math.ceil(contentHeight + verticalEdges));
}

export class WorksheetCellHeightCache<Row extends object> {
  private readonly heights = new Map<Row, Map<string, number>>();

  set(row: Row, columnKey: string, height: number): boolean {
    let rowHeights = this.heights.get(row);
    if (!rowHeights) {
      rowHeights = new Map();
      this.heights.set(row, rowHeights);
    }
    if (rowHeights.get(columnKey) === height) return false;
    rowHeights.set(columnKey, height);
    return true;
  }

  get(row: Row, columnKey: string): number | undefined {
    return this.heights.get(row)?.get(columnKey);
  }

  getRowHeight(row: Row, minimum: number): number {
    const rowHeights = this.heights.get(row)?.values();
    return rowHeights ? Math.max(minimum, ...rowHeights) : minimum;
  }

  prune(rows: readonly Row[], columnKeys: ReadonlySet<string>): boolean {
    let changed = false;
    const currentRows = new Set(rows);
    for (const [row, rowHeights] of this.heights) {
      if (!currentRows.has(row)) {
        this.heights.delete(row);
        changed = true;
        continue;
      }
      for (const columnKey of rowHeights.keys()) {
        if (columnKeys.has(columnKey)) continue;
        rowHeights.delete(columnKey);
        changed = true;
      }
    }
    return changed;
  }
}
