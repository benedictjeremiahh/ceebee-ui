import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Calendar } from './calendar.js';

const january = new Date(2026, 0, 1);

describe('Calendar', () => {
  it('renders an inline, labelled six-week grid with one roving tab stop', () => {
    const { getByRole, getAllByRole } = render(<Calendar defaultMonth={january} locale="en-GB" />);
    const grid = getByRole('grid', { name: 'January 2026' });

    expect(grid).toBeInTheDocument();
    expect(getAllByRole('row')).toHaveLength(6);
    expect(getAllByRole('gridcell')).toHaveLength(42);
    expect(getAllByRole('button').filter((button) => button.getAttribute('tabindex') === '0')).toHaveLength(1);
  });

  it('moves focus across a month boundary with arrows and selects with Enter', () => {
    const onValueChange = vi.fn();
    const { getByRole } = render(<Calendar defaultMonth={january} locale="en-GB" onValueChange={onValueChange} />);
    const januaryFirst = getByRole('button', { name: 'Thursday, 1 January 2026' });

    fireEvent.focus(januaryFirst);
    fireEvent.keyDown(januaryFirst, { key: 'ArrowLeft' });
    const decemberLast = getByRole('button', { name: 'Wednesday, 31 December 2025' });
    expect(document.activeElement).toBe(decemberLast);
    fireEvent.keyDown(decemberLast, { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith(expect.objectContaining({ getFullYear: expect.any(Function) }));
    expect(onValueChange.mock.calls[0]?.[0]).toEqual(new Date(2025, 11, 31));
  });

  it('keeps controlled selection with its caller while reporting a requested date', () => {
    const onValueChange = vi.fn();
    const { getByRole } = render(<Calendar month={january} value={new Date(2026, 0, 2)} locale="en-GB" onValueChange={onValueChange} />);
    const third = getByRole('button', { name: 'Saturday, 3 January 2026' });

    fireEvent.click(third);
    expect(onValueChange).toHaveBeenCalledWith(new Date(2026, 0, 3));
    expect(getByRole('button', { name: 'Friday, 2 January 2026' })).toHaveAttribute('aria-pressed', 'true');
    expect(third).toHaveAttribute('aria-pressed', 'false');
  });

  it('keeps one enabled day tabbable when a selected date belongs to another displayed month', () => {
    const { getAllByRole } = render(<Calendar month={january} value={new Date(2026, 3, 3)} locale="en-GB" />);
    const dayButtons = getAllByRole('button').filter((button) => button.hasAttribute('data-date-key'));

    expect(dayButtons.filter((button) => button.getAttribute('tabindex') === '0')).toHaveLength(1);
  });

  it('treats unavailable controlled and default selections as unselected', () => {
    const { getByRole, rerender } = render(
      <Calendar defaultMonth={january} defaultValue={new Date(2026, 0, 2)} minDate={new Date(2026, 0, 10)} locale="en-GB" />,
    );
    expect(getByRole('button', { name: 'Friday, 2 January 2026' })).toHaveAttribute('aria-pressed', 'false');

    rerender(
      <Calendar month={january} value={new Date(2026, 0, 2)} minDate={new Date(2026, 0, 10)} locale="en-GB" />,
    );
    expect(getByRole('button', { name: 'Friday, 2 January 2026' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('makes an externally supplied selected day the roving stop when its controlled month enters view', () => {
    const { getByRole, rerender } = render(
      <Calendar month={january} value={new Date(2026, 3, 3)} locale="en-GB" />,
    );
    rerender(<Calendar month={new Date(2026, 3, 1)} value={new Date(2026, 3, 3)} locale="en-GB" />);

    const selected = getByRole('button', { name: 'Friday, 3 April 2026' });
    expect(selected).toHaveAttribute('aria-pressed', 'true');
    expect(selected).toHaveAttribute('tabindex', '0');
  });

  it('changes an uncontrolled month from navigation and reports controlled navigation', () => {
    const onMonthChange = vi.fn();
    const { getByRole } = render(<Calendar month={january} locale="en-GB" onMonthChange={onMonthChange} />);
    fireEvent.click(getByRole('button', { name: 'Next month' }));
    expect(onMonthChange).toHaveBeenCalledWith(new Date(2026, 1, 1));
    expect(getByRole('grid', { name: 'January 2026' })).toBeInTheDocument();
  });

  it('preserves the focused day when Page Down changes month, clamping at month end', () => {
    const { getByRole } = render(<Calendar defaultMonth={new Date(2026, 0, 1)} locale="en-GB" />);
    const januaryLast = getByRole('button', { name: 'Saturday, 31 January 2026' });

    fireEvent.focus(januaryLast);
    fireEvent.keyDown(januaryLast, { key: 'PageDown' });
    expect(document.activeElement).toBe(getByRole('button', { name: 'Saturday, 28 February 2026' }));
  });

  it('does not select disabled dates and keeps disabled Calendar controls inert', () => {
    const onValueChange = vi.fn();
    const { getByRole } = render(<Calendar defaultMonth={january} locale="en-GB" minDate={new Date(2026, 0, 10)} onValueChange={onValueChange} />);
    const blocked = getByRole('button', { name: 'Friday, 2 January 2026' });
    expect(blocked).toBeDisabled();
    fireEvent.click(blocked);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('starts Sunday-first grids on Sunday and uses locale weekday labels', () => {
    const { container, getByRole } = render(<Calendar defaultMonth={january} locale="en-US" weekStartsOn={0} />);
    const firstWeek = container.querySelector('.cb-calendar__week');
    expect(firstWeek?.querySelector('button')).toHaveAccessibleName('Sunday, December 28, 2025');
    expect(container.querySelector('.cb-calendar__weekdays')?.textContent).toContain('Sun');
    expect(getByRole('grid', { name: 'January 2026' })).toBeInTheDocument();
  });

  it('skips unavailable days when keyboard movement crosses them', () => {
    const { getByRole } = render(
      <Calendar defaultMonth={january} locale="en-GB" disabledDate={(date) => date.getDate() === 2 || date.getDate() === 3} />,
    );
    const januaryFirst = getByRole('button', { name: 'Thursday, 1 January 2026' });
    fireEvent.focus(januaryFirst);
    fireEvent.keyDown(januaryFirst, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(getByRole('button', { name: 'Sunday, 4 January 2026' }));
  });

  it('normalizes local days before moving across a daylight-saving month boundary', () => {
    const { getByRole } = render(<Calendar defaultMonth={new Date(2024, 2, 1)} value={new Date(2024, 2, 10, 23)} locale="en-GB" />);
    const marchTenth = getByRole('button', { name: 'Sunday, 10 March 2024' });
    fireEvent.focus(marchTenth);
    fireEvent.keyDown(marchTenth, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(getByRole('button', { name: 'Monday, 11 March 2024' }));
  });

  it('injects day content without changing selection semantics and renders a noninteractive skeleton', () => {
    const { container, getByRole } = render(<Calendar defaultMonth={january} locale="en-GB" renderDay={({ date }) => <span>Day {date.getDate()}</span>} />);
    expect(getByRole('button', { name: 'Thursday, 1 January 2026' })).toHaveTextContent('Day 1');
    const skeleton = render(<Calendar.Skeleton />).container.firstElementChild;
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    expect(skeleton?.querySelector('[role="grid"]')).toBeNull();
    expect(container.querySelectorAll('.cb-calendar__day')).toHaveLength(42);
  });
});
