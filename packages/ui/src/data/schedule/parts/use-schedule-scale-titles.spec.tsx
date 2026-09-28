import { render, screen, waitFor } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it } from 'vitest';
import { useScheduleScaleTitles } from './use-schedule-scale-titles.js';

function Axis({ label, enabled = true }: { label: string; enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useScheduleScaleTitles(ref, enabled);
  return (
    <div ref={ref}>
      <div className="wx-scale"><div className="wx-cell"><span>{label}</span></div></div>
      <div className="wx-table"><div className="wx-cell">Unrelated row</div></div>
    </div>
  );
}

describe('Schedule scale full-text access', () => {
  it('keeps complete calendar labels available when CSS truncates a partial period', async () => {
    const { rerender } = render(<Axis label="August 2026" />);
    await waitFor(() => expect(screen.getByText('August 2026').parentElement).toHaveAttribute('title', 'August 2026'));
    expect(screen.getByText('Unrelated row')).not.toHaveAttribute('title');
    rerender(<Axis label="September 2026" />);
    await waitFor(() => expect(screen.getByText('September 2026').parentElement).toHaveAttribute('title', 'September 2026'));
  });

  it('does not decorate the axis while disabled', () => {
    render(<Axis label="August 2026" enabled={false} />);
    expect(screen.getByText('August 2026').parentElement).not.toHaveAttribute('title');
  });
});
