import { act, renderHook } from '@testing-library/react';
import type { ColumnWidths } from 'react-data-grid';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useWorksheetColumnWidths } from './use-worksheet-column-widths.js';
import type { WorksheetColumn } from './worksheet.types.js';

interface Row { id: string }
const columns: readonly WorksheetColumn<Row>[] = [
  { key: 'label', name: 'Label', width: 'minmax(10rem, 1fr)', frozen: true },
  { key: 'quantity', name: 'Quantity', width: 'calc(2rem * 4)' },
];
const measured = (label: number, quantity = 160): ColumnWidths => new Map([
  ['label', { type: 'measured', width: label }],
  ['quantity', { type: 'measured', width: quantity }],
]);

class TestResizeObserver implements ResizeObserver {
  static instances: TestResizeObserver[] = [];
  readonly disconnect = vi.fn();
  readonly observe = vi.fn();
  readonly unobserve = vi.fn();
  constructor(private readonly callback: ResizeObserverCallback) { TestResizeObserver.instances.push(this); }
  notify() { this.callback([], this); }
}

function fixture() {
  let width = 600;
  const element = document.createElement('div');
  Object.defineProperty(element, 'clientWidth', { get: () => width });
  return { host: { current: element }, resize: (next: number) => {
    width = next;
    act(() => TestResizeObserver.instances.forEach(observer => observer.notify()));
  } };
}

beforeEach(() => { TestResizeObserver.instances = []; vi.stubGlobal('ResizeObserver', TestResizeObserver); });
afterEach(() => { vi.unstubAllGlobals(); });

describe('worksheet measured column convergence', () => {
  it('remeasures a fractional track after neighboring CSS widths settle, then converges', () => {
    const f = fixture();
    const { result } = renderHook(() => useWorksheetColumnWidths(columns, f.host));
    act(() => result.current.onColumnWidthsChange(measured(160)));
    expect(result.current.columnWidths.has('label')).toBe(false);
    expect(result.current.columnWidths.get('quantity')?.width).toBe(160);
    act(() => result.current.onColumnWidthsChange(measured(440)));
    expect(result.current.columnWidths.get('label')?.width).toBe(440);
    const settled = result.current.columnWidths;
    act(() => result.current.onColumnWidthsChange(measured(440)));
    expect(result.current.columnWidths).toBe(settled);
  });

  it('keeps an explicit resize and reflows only measured fractional neighbors', () => {
    const f = fixture();
    const { result } = renderHook(() => useWorksheetColumnWidths(columns, f.host));
    act(() => result.current.onColumnWidthsChange(measured(160)));
    act(() => result.current.onColumnWidthsChange(measured(440)));
    const resized: ColumnWidths = new Map([
      ['label', { type: 'measured', width: 440 }],
      ['quantity', { type: 'resized', width: 200 }],
    ]);
    act(() => result.current.onColumnWidthsChange(resized));
    expect(result.current.columnWidths.has('label')).toBe(false);
    expect(result.current.columnWidths.get('quantity')).toEqual({ type: 'resized', width: 200 });
    act(() => result.current.onColumnWidthsChange(new Map([...resized, ['label', { type: 'measured', width: 400 }]])));
    expect(result.current.columnWidths.get('label')?.width).toBe(400);
  });

  it('preserves a manually sized fractional column across container resize', () => {
    const f = fixture();
    const { result } = renderHook(() => useWorksheetColumnWidths(columns, f.host));
    act(() => result.current.onColumnWidthsChange(new Map([
      ['label', { type: 'resized', width: 300 }],
      ['quantity', { type: 'measured', width: 160 }],
    ])));
    f.resize(800);
    expect(result.current.columnWidths.get('label')).toEqual({ type: 'resized', width: 300 });
    expect(result.current.columnWidths.has('quantity')).toBe(false);
  });

  it('invalidates measured geometry when columns change and remembers hidden user resizes', () => {
    const f = fixture();
    const { result, rerender } = renderHook(({ visible }) => useWorksheetColumnWidths(visible, f.host), {
      initialProps: { visible: columns },
    });
    act(() => result.current.onColumnWidthsChange(new Map([
      ['label', { type: 'measured', width: 440 }],
      ['quantity', { type: 'resized', width: 200 }],
    ])));
    rerender({ visible: columns.slice(0, 1) });
    expect(result.current.columnWidths.has('label')).toBe(false);
    expect(result.current.columnWidths.get('quantity')?.type).toBe('resized');
    act(() => result.current.onColumnWidthsChange(new Map([['label', { type: 'measured', width: 600 }]])));
    rerender({ visible: columns });
    expect(result.current.columnWidths.get('quantity')).toEqual({ type: 'resized', width: 200 });
    expect(result.current.columnWidths.has('label')).toBe(false);
  });

  it('starts with no columns and settles the populated geometry without retaining old measurements', () => {
    const f = fixture();
    const empty: readonly WorksheetColumn<Row>[] = [];
    const { result, rerender } = renderHook(({ visible }) => useWorksheetColumnWidths(visible, f.host), {
      initialProps: { visible: empty },
    });
    act(() => result.current.onColumnWidthsChange(new Map()));
    rerender({ visible: columns });
    act(() => result.current.onColumnWidthsChange(measured(160)));
    expect(result.current.columnWidths.has('label')).toBe(false);
    act(() => result.current.onColumnWidthsChange(measured(440)));
    expect(result.current.columnWidths.get('label')?.width).toBe(440);
  });

  it('invalidates measurements when a declared width changes but does not discard a user resize', () => {
    const f = fixture();
    const { result, rerender } = renderHook(({ visible }) => useWorksheetColumnWidths(visible, f.host), {
      initialProps: { visible: columns },
    });
    act(() => result.current.onColumnWidthsChange(new Map([
      ['label', { type: 'measured', width: 400 }],
      ['quantity', { type: 'resized', width: 200 }],
    ])));
    rerender({ visible: columns.map(column => column.key === 'label' ? { ...column, width: '2fr' } : column) });
    expect(result.current.columnWidths.has('label')).toBe(false);
    expect(result.current.columnWidths.get('quantity')?.width).toBe(200);
  });

  it('observes only its host and disconnects on unmount', () => {
    const f = fixture();
    const { unmount } = renderHook(() => useWorksheetColumnWidths(columns, f.host));
    expect(TestResizeObserver.instances).toHaveLength(1);
    const observer = TestResizeObserver.instances[0];
    expect(observer?.observe).toHaveBeenCalledWith(f.host.current);
    unmount();
    expect(observer?.disconnect).toHaveBeenCalledOnce();
  });
});
