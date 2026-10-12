import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import type { GetRef } from 'antd';
import { useRef } from 'react';
import { DatePicker as AntDatePicker } from 'antd';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker } from './date-picker.js';

function RefDatePicker() {
  const ref = useRef<GetRef<typeof DatePicker>>(null);
  return (
    <>
      <DatePicker ref={ref} aria-label="Date" />
      <button type="button" onClick={() => ref.current?.focus()}>Focus date</button>
    </>
  );
}

describe('DatePicker Enter behavior', () => {
  it('confirms the unchanged date without submitting its parent form', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault());
    const onKeyDown = vi.fn();

    render(
      <form onSubmit={onSubmit}>
        <DatePicker
          aria-label="Date"
          defaultValue={dayjs('2026-10-11')}
          format="D MMM YYYY"
          needConfirm
          onKeyDown={onKeyDown}
        />
        <button type="submit">Save</button>
      </form>,
    );

    const input = screen.getByRole('textbox', { name: 'Date' });
    await user.click(input);
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    await user.keyboard('{Enter}');

    expect(screen.queryByRole('button', { name: 'OK' })).toBeNull();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(input).toHaveFocus();
    expect(onKeyDown.mock.calls[0]?.[0]?.defaultPrevented).toBe(true);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('confirms a changed date without submitting its parent form', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault());
    const onChange = vi.fn();

    render(
      <form onSubmit={onSubmit}>
        <DatePicker aria-label="Date" defaultValue={dayjs('2026-10-11')} format="D MMM YYYY" needConfirm onChange={onChange} />
        <button type="submit">Save</button>
      </form>,
    );

    const input = screen.getByRole('textbox', { name: 'Date' });
    await user.click(input);
    await user.click(screen.getByTitle('2026-10-12'));
    await user.click(input);
    await user.keyboard('{Enter}');

    expect(onChange.mock.calls[0]?.[0]?.format('YYYY-MM-DD')).toBe('2026-10-12');
    expect(onSubmit).not.toHaveBeenCalled();
    expect(input).toHaveFocus();
  });

  it('keeps the explicit submit button keyboard-operable', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault());

    render(
      <form onSubmit={onSubmit}>
        <DatePicker aria-label="Date" defaultValue={dayjs('2026-10-11')} format="D MMM YYYY" />
        <button type="submit">Save</button>
      </form>,
    );

    const input = screen.getByRole('textbox', { name: 'Date' });
    const button = screen.getByRole('button', { name: 'Save' });
    await user.click(input);
    await user.keyboard('{Enter}');
    await user.tab();
    await user.tab();

    expect(button).toHaveFocus();
    await user.keyboard('{Enter}');

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('still sends the keyboard event to the caller', async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn();

    render(<DatePicker aria-label="Date" defaultValue={dayjs('2026-10-11')} format="D MMM YYYY" onKeyDown={onKeyDown} />);

    const input = screen.getByRole('textbox', { name: 'Date' });
    await user.click(input);
    await user.keyboard('{Enter}');

    expect(onKeyDown).toHaveBeenCalled();
    expect(onKeyDown.mock.calls[0]?.[0]?.key).toBe('Enter');
    expect(onKeyDown.mock.calls[0]?.[0]?.defaultPrevented).toBe(true);
  });

  it('preserves the Ant picker ref and static picker members', async () => {
    const user = userEvent.setup();
    render(<RefDatePicker />);

    await user.click(screen.getByRole('button', { name: 'Focus date' }));

    expect(screen.getByRole('textbox', { name: 'Date' })).toHaveFocus();
    expect(DatePicker.RangePicker).toBe(AntDatePicker.RangePicker);
    expect(DatePicker.MonthPicker).toBe(AntDatePicker.MonthPicker);
    expect(DatePicker.WeekPicker).toBe(AntDatePicker.WeekPicker);
    expect(DatePicker.YearPicker).toBe(AntDatePicker.YearPicker);
  });
});
