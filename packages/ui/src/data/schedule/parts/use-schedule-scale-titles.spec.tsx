import { act, render, screen, waitFor } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useScheduleScaleTitles } from './use-schedule-scale-titles.js';

class MockResizeObserver implements ResizeObserver {
  readonly callback: ResizeObserverCallback;
  disconnected = false;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe() {}
  unobserve() {}
  disconnect() {
    this.disconnected = true;
  }
  fire() {
    this.callback([], this);
  }
}

const observers: MockResizeObserver[] = [];

function Axis({ label, enabled = true }: { label: string; enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const clippedLabels = useScheduleScaleTitles(ref, enabled);
  return (
    <div ref={ref} data-testid="axis-root">
      <div className="wx-scale">
        <div className="wx-cell"><span>{label}</span></div>
      </div>
      <div data-testid="clipped-labels">{clippedLabels.join('|')}</div>
      <div className="wx-table"><div className="wx-cell">Unrelated row</div></div>
    </div>
  );
}

function setClipping(element: HTMLElement, clipped: boolean) {
  Object.defineProperties(element, {
    scrollWidth: { configurable: true, value: clipped ? 120 : 40 },
    clientWidth: { configurable: true, value: 40 },
  });
}

afterEach(() => {
  observers.length = 0;
  vi.unstubAllGlobals();
});

describe('Schedule scale full-text access', () => {
  it('returns only clipped axis labels and keeps native titles', async () => {
    vi.stubGlobal('ResizeObserver', class extends MockResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        super(callback);
        observers.push(this);
      }
    });
    const { container } = render(<Axis label="August 2026" />);
    const span = container.querySelector('.wx-scale .wx-cell > span');
    if (!(span instanceof HTMLElement)) throw new Error('Expected a scale label span');
    setClipping(span, true);

    act(() => observers[0]?.fire());
    await waitFor(() => expect(screen.getByTestId('clipped-labels')).toHaveTextContent('August 2026'));
    expect(span.parentElement).toHaveAttribute('title', 'August 2026');
    expect(screen.getByText('Unrelated row')).not.toHaveAttribute('title');

    setClipping(span, false);
    act(() => observers[0]?.fire());
    await waitFor(() => expect(screen.getByTestId('clipped-labels')).toBeEmptyDOMElement());
  });

  it('updates labels after virtualized replacement and deduplicates equal full labels', async () => {
    vi.stubGlobal('ResizeObserver', class extends MockResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        super(callback);
        observers.push(this);
      }
    });
    const { container } = render(<Axis label="August 2026" />);
    const axis = container.querySelector('.wx-scale');
    if (!(axis instanceof HTMLElement)) throw new Error('Expected a calendar scale');
    const first = axis.querySelector('span');
    if (!(first instanceof HTMLElement)) throw new Error('Expected an initial scale label');
    setClipping(first, true);
    act(() => observers[0]?.fire());
    await waitFor(() => expect(screen.getByTestId('clipped-labels')).toHaveTextContent('August 2026'));

    const replacement = document.createElement('div');
    replacement.className = 'wx-cell';
    const duplicate = document.createElement('span');
    duplicate.textContent = 'August 2026';
    replacement.append(duplicate);
    const nextCell = document.createElement('div');
    nextCell.className = 'wx-cell';
    const nextLabel = document.createElement('span');
    nextLabel.textContent = 'September 2026';
    nextCell.append(nextLabel);
    const duplicateCell = document.createElement('div');
    duplicateCell.className = 'wx-cell';
    const repeatedLabel = document.createElement('span');
    repeatedLabel.textContent = 'August 2026';
    duplicateCell.append(repeatedLabel);
    axis.replaceChildren(replacement, nextCell, duplicateCell);
    const replacementLabels = axis.querySelectorAll('span');
    replacementLabels.forEach((label) => setClipping(label, true));

    await waitFor(() => expect(replacement).toHaveAttribute('title', 'August 2026'));
    expect(nextCell).toHaveAttribute('title', 'September 2026');
    expect(duplicateCell).toHaveAttribute('title', 'August 2026');
    expect(screen.getByTestId('clipped-labels')).toHaveTextContent('August 2026|September 2026');
  });

  it('clears and disconnects observers when disabled or unmounted', async () => {
    vi.stubGlobal('ResizeObserver', class extends MockResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        super(callback);
        observers.push(this);
      }
    });
    const { rerender, unmount, container } = render(<Axis label="August 2026" />);
    const span = container.querySelector('.wx-scale span');
    if (!(span instanceof HTMLElement)) throw new Error('Expected a scale label');
    setClipping(span, true);
    act(() => observers[0]?.fire());
    await waitFor(() => expect(screen.getByTestId('clipped-labels')).toHaveTextContent('August 2026'));

    rerender(<Axis label="August 2026" enabled={false} />);
    await waitFor(() => expect(screen.getByTestId('clipped-labels')).toBeEmptyDOMElement());
    expect(observers[0]?.disconnected).toBe(true);

    rerender(<Axis label="August 2026" />);
    const activeObserver = observers.at(-1);
    unmount();
    expect(activeObserver?.disconnected).toBe(true);
  });

  it('keeps measurements scoped to independent roots', async () => {
    vi.stubGlobal('ResizeObserver', class extends MockResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        super(callback);
        observers.push(this);
      }
    });
    const { container } = render(<><Axis label="August 2026" /><Axis label="September 2026" /></>);
    const spans = container.querySelectorAll('.wx-scale span');
    spans.forEach((span, index) => {
      if (span instanceof HTMLElement) setClipping(span, index === 1);
    });
    act(() => observers.forEach((observer) => observer.fire()));
    await waitFor(() => expect(screen.getAllByTestId('clipped-labels')[0]).toBeEmptyDOMElement());
    expect(screen.getAllByTestId('clipped-labels')[1]).toHaveTextContent('September 2026');
  });
});
