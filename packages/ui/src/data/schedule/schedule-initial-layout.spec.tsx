import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Schedule } from './schedule.js';

vi.mock('./use-schedule-grid-color.js', () => ({ useScheduleGridColor: () => '#cccccc' }));
vi.mock('@svar-ui/react-gantt', () => ({
  Gantt: ({ displayMode, gridWidth }: { displayMode: string; gridWidth: number }) => (
    <div data-testid="schedule-substrate">{displayMode}, {gridWidth}</div>
  ),
}));

afterEach(() => vi.unstubAllGlobals());

describe('Schedule initial layout', () => {
  it('waits for the measured pane and starts in chart mode when the pane is narrow', async () => {
    let measure: ((width: number) => void) | undefined;
    vi.stubGlobal('ResizeObserver', class {
      constructor(private readonly callback: ResizeObserverCallback) {}
      observe(element: Element) {
        if (!element.classList.contains('cb-schedule')) return;
        measure = width => {
          const entry: ResizeObserverEntry = {
            target: element,
            contentRect: new DOMRect(0, 0, width, 400),
            borderBoxSize: [],
            contentBoxSize: [],
            devicePixelContentBoxSize: [],
          };
          this.callback([entry], this);
        };
      }
      unobserve() {}
      disconnect() {}
    });

    render(<Schedule mode="physical" items={[{ id: 'work', label: 'Work', start: '2026-01-05', end: '2026-04-25' }]} />);
    expect(screen.queryByTestId('schedule-substrate')).not.toBeInTheDocument();
    if (!measure) throw new Error('Expected the Schedule pane to be observed');
    act(() => measure?.(360));
    expect(await screen.findByTestId('schedule-substrate')).toHaveTextContent('chart, 112');
    expect(screen.getByRole('button', { name: 'Full schedule' })).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: 'Time scale' })).toBeInTheDocument();
  });
});
