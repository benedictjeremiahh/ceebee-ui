import { fireEvent, render, screen } from '@testing-library/react';
import { useEffect, useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useScheduleTableScroll, type ScheduleTableScrollApi } from '../use-schedule-table-scroll.js';

function Harness({ api }: { api: ScheduleTableScrollApi | null }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const apiRef = useRef<ScheduleTableScrollApi | null>(api);
  useEffect(() => {
    apiRef.current = api;
  }, [api]);
  useScheduleTableScroll(rootRef, apiRef, true);

  return (
    <div ref={rootRef}>
      <div className="wx-table-container" data-testid="table" />
      <div data-testid="other" />
    </div>
  );
}

function makeApi(scrollTop: number) {
  return {
    getState: () => ({ scrollTop }),
    exec: vi.fn(async (_action: 'scroll-chart', _params: { top: number }) => undefined),
  } satisfies ScheduleTableScrollApi;
}

describe('Schedule table scroll reconciliation', () => {
  it('moves incidental table vertical scroll into the chart while preserving horizontal scroll', () => {
    const api = makeApi(40);
    render(<Harness api={api} />);
    const table = screen.getByTestId('table');
    table.scrollTop = 18;
    table.scrollLeft = 24;

    fireEvent.scroll(table);

    expect(api.exec).toHaveBeenCalledWith('scroll-chart', { top: 58 });
    expect(table.scrollTop).toBe(0);
    expect(table.scrollLeft).toBe(24);
  });

  it('ignores non-table and zero-offset scroll events', () => {
    const api = makeApi(40);
    render(<Harness api={api} />);
    const other = screen.getByTestId('other');
    const table = screen.getByTestId('table');
    other.scrollTop = 18;

    fireEvent.scroll(other);
    fireEvent.scroll(table);

    expect(api.exec).not.toHaveBeenCalled();
    expect(other.scrollTop).toBe(18);
  });

  it('leaves incidental scroll untouched when the API is unavailable', () => {
    render(<Harness api={null} />);
    const table = screen.getByTestId('table');
    table.scrollTop = 18;

    fireEvent.scroll(table);

    expect(table.scrollTop).toBe(18);
  });

  it('removes the scroll listener when the hook unmounts', () => {
    const api = makeApi(40);
    const { unmount } = render(<Harness api={api} />);
    const table = screen.getByTestId('table');
    unmount();
    table.scrollTop = 18;

    fireEvent.scroll(table);

    expect(api.exec).not.toHaveBeenCalled();
    expect(table.scrollTop).toBe(18);
  });
});
