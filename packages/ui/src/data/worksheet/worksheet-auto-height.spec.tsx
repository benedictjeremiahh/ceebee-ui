import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Worksheet } from './worksheet.js';
import type { WorksheetColumn } from './worksheet.types.js';
import { measureWorksheetRowHeight, WorksheetCellHeightCache } from './worksheet-cell-height.js';

interface Row {
  id: string;
  text: string;
}

const rows: readonly Row[] = [{ id: 'one', text: 'A wrapped line' }, { id: 'two', text: '' }];
const columns: readonly WorksheetColumn<Row>[] = [
  { key: 'text-a', name: 'First', headerGroup: { key: 'shared', name: 'Group' }, renderCell: ({ row }) => <span>{row.text}</span> },
  { key: 'text-b', name: 'Second', headerGroup: { key: 'shared', name: 'Group' }, renderCell: ({ row }) => <button type="button">{row.text}</button> },
];
const animationFrames: FrameRequestCallback[] = [];

function stubAnimationFrames() {
  animationFrames.length = 0;
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    animationFrames.push(callback);
    return animationFrames.length;
  });
  vi.stubGlobal('cancelAnimationFrame', () => undefined);
}

function flushAnimationFrames() {
  const callbacks = animationFrames.splice(0);
  for (const callback of callbacks) callback(0);
}

class TestResizeObserver implements ResizeObserver {
  static instances: TestResizeObserver[] = [];
  disconnected = false;
  readonly observed: Element[] = [];

  constructor(private readonly callback: ResizeObserverCallback) {
    TestResizeObserver.instances.push(this);
  }

  observe(target: Element): void { this.observed.push(target); }
  unobserve(): void {}
  disconnect(): void { this.disconnected = true; }
  notify(): void {
    const size = { blockSize: 0, inlineSize: 0 } satisfies ResizeObserverSize;
    const entries = this.observed.map(target => ({
      target,
      contentRect: new DOMRect(),
      borderBoxSize: [size],
      contentBoxSize: [size],
      devicePixelContentBoxSize: [size],
    } satisfies ResizeObserverEntry));
    this.callback(entries, this);
  }
}

afterEach(() => {
  vi.unstubAllGlobals();
  animationFrames.length = 0;
  TestResizeObserver.instances = [];
});

describe('Worksheet automatic row height', () => {
  it('keeps the native grid row height function contract and includes grouped headers in content height', () => {
    render(<Worksheet label="Wrapped rows" rows={rows} columns={columns} rowHeight="auto" headerRowHeight={72} />);
    const grid = screen.getByRole('grid', { name: 'Wrapped rows' });
    const host = grid.parentElement;
    expect(host?.getAttribute('data-row-height')).toBe('auto');
    expect(host?.style.getPropertyValue('--cb-worksheet-content-height')).toContain('var(--cb-space-3)');
    expect(host?.style.getPropertyValue('--cb-worksheet-content-height')).toContain('144px');
    expect(screen.getAllByRole('row')).toHaveLength(4);
  });

  it('preserves numeric and function row-height overrides', () => {
    const numeric = render(<Worksheet label="Numeric" rows={rows} columns={columns} rowHeight={72} />);
    expect(screen.getByRole('grid', { name: 'Numeric' }).style.gridTemplateRows).toContain('72px');
    numeric.unmount();

    render(<Worksheet label="Function" rows={rows} columns={columns} rowHeight={row => row.id === 'one' ? 72 : 48} />);
    expect(screen.getByRole('grid', { name: 'Function' }).style.gridTemplateRows).toContain('72px 48px');
  });

  it('renders a frozen column before a non-frozen column declared earlier', () => {
    const reorderedColumns: readonly WorksheetColumn<Row>[] = columns.map((column, index) => ({
      ...column,
      frozen: index === 1,
      renderCell: ({ row }) => <span>{`${index === 1 ? 'Frozen' : 'Regular'} ${row.text}`}</span>,
    }));
    render(<Worksheet label="Frozen order" rows={rows} columns={reorderedColumns} />);
    const frozenCell = screen.getByText('Frozen A wrapped line').closest('[role="gridcell"]');
    expect(frozenCell?.getAttribute('aria-colindex')).toBe('1');
  });

  it('measures rendered child geometry and keeps the token height as a minimum', () => {
    const cell = document.createElement('div');
    const child = document.createElement('span');
    cell.style.paddingBlockStart = '3px';
    cell.style.borderBlockEndWidth = '2px';
    cell.append(child);
    vi.spyOn(child, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 40, 64));
    expect(measureWorksheetRowHeight(cell, 48)).toBe(69);
    expect(measureWorksheetRowHeight(cell, 72)).toBe(72);
  });

  it('updates and prunes heights by stable row and column identity', () => {
    const cache = new WorksheetCellHeightCache<Row>();
    const row = { id: 'cache-row', text: '' };
    cache.set(row, 'frozen-column', 84);
    cache.set(row, 'regular-column', 40);
    expect(cache.getRowHeight(row, 35)).toBe(84);
    expect(cache.set(row, 'regular-column', 100)).toBe(true);
    expect(cache.get(row, 'regular-column')).toBe(100);
    expect(cache.set(row, 'regular-column', 40)).toBe(true);
    expect(cache.get(row, 'frozen-column')).toBe(84);
    expect(cache.prune([row], new Set(['frozen-column']))).toBe(true);
    expect(cache.get(row, 'regular-column')).toBeUndefined();
    expect(cache.getRowHeight(row, 35)).toBe(84);
  });

  it('remeasures visible rows after resize and disconnects observers on cleanup', () => {
    vi.stubGlobal('ResizeObserver', TestResizeObserver);
    stubAnimationFrames();
    const { unmount } = render(<Worksheet label="Measured rows" rows={rows} columns={columns} rowHeight="auto" />);
    const grid = screen.getByRole('grid', { name: 'Measured rows' });
    const child = grid.querySelector<HTMLElement>('[aria-rowindex="4"] span');
    if (!child) throw new Error('Expected the second grouped data row');
    vi.spyOn(child, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 90, 84));
    const observer = TestResizeObserver.instances.find(instance => instance.observed.includes(child));
    act(() => { observer?.notify(); flushAnimationFrames(); });
    expect(grid.style.gridTemplateRows.trim().split(/\s+/)[3]).toBe('84px');
    unmount();
    expect(observer?.disconnected).toBe(true);
  });

  it('retains a tall offscreen column and remeasures the visible column when its width changes', async () => {
    vi.stubGlobal('ResizeObserver', TestResizeObserver);
    stubAnimationFrames();
    const reorderedColumns: readonly WorksheetColumn<Row>[] = columns.map((column, index) => ({
      ...column,
      frozen: index === 1,
      renderCell: ({ row }) => <span>{`${index === 1 ? 'Frozen' : 'Regular'} ${row.text}`}</span>,
    }));
    render(<Worksheet label="Horizontal rows" rows={rows} columns={reorderedColumns} rowHeight="auto" />);
    const grid = screen.getByRole('grid', { name: 'Horizontal rows' });
    const row = grid.querySelector<HTMLElement>('[aria-rowindex="3"]');
    const tallCell = row?.querySelector<HTMLElement>('[role="gridcell"]');
    const tallChild = tallCell?.querySelector<HTMLElement>('span');
    if (!row || !tallCell || !tallChild) throw new Error('Expected a visible worksheet cell');
    expect(tallCell.getAttribute('aria-colindex')).toBe('1');
    let contentHeight = 84;
    vi.spyOn(tallChild, 'getBoundingClientRect').mockImplementation(() => new DOMRect(0, 0, 90, contentHeight));
    const observer = TestResizeObserver.instances.find(instance => instance.observed.includes(tallChild));
    act(() => { observer?.notify(); flushAnimationFrames(); });
    expect(grid.style.gridTemplateRows.trim().split(/\s+/)[2]).toBe('84px');

    const shortCell = document.createElement('div');
    shortCell.classList.add('rdg-cell');
    shortCell.setAttribute('role', 'gridcell');
    shortCell.setAttribute('aria-colindex', '2');
    const shortChild = document.createElement('span');
    shortCell.append(shortChild);
    contentHeight = 40;
    vi.spyOn(shortChild, 'getBoundingClientRect').mockImplementation(() => new DOMRect(0, 0, 90, contentHeight));
    await act(async () => {
      tallCell.remove();
      row.append(shortCell);
      await Promise.resolve();
      flushAnimationFrames();
    });
    expect(grid.style.gridTemplateRows.trim().split(/\s+/)[2]).toBe('84px');

    contentHeight = 100;
    act(() => { observer?.notify(); flushAnimationFrames(); });
    const widenedHeight = grid.style.gridTemplateRows.trim().split(/\s+/)[2];
    expect(widenedHeight).toBe('100px');
    contentHeight = 40;
    act(() => { observer?.notify(); flushAnimationFrames(); });
    expect(grid.style.gridTemplateRows.trim().split(/\s+/)[2]).toBe('84px');
  });

  it('remeasures visible cell content after a text mutation', async () => {
    vi.stubGlobal('ResizeObserver', TestResizeObserver);
    stubAnimationFrames();
    render(<Worksheet label="Changed rows" rows={rows} columns={columns} rowHeight="auto" />);
    const grid = screen.getByRole('grid', { name: 'Changed rows' });
    const child = screen.getAllByText('A wrapped line')[0];
    if (!(child instanceof HTMLElement)) throw new Error('Expected rendered worksheet text');
    let contentHeight = 40;
    vi.spyOn(child, 'getBoundingClientRect').mockImplementation(() => new DOMRect(0, 0, 90, contentHeight));
    await act(async () => {
      child.textContent = 'A longer changed line';
      contentHeight = 92;
      await Promise.resolve();
      flushAnimationFrames();
    });
    expect(grid.style.gridTemplateRows.trim().split(/\s+/)[2]).toBe('92px');
  });
});
