import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AutoComplete, type ComboboxOption } from './autocomplete.js';

const ROWS: ComboboxOption[] = [
  { value: 'id', label: 'Indonesia' },
  { value: 'sg', label: 'Singapore' },
];

/* `delay: null` throughout: user-event's default paces keystrokes with timers
   that never settle around this popup, and the wait is not what any of these
   are measuring. */
const type = () => userEvent.setup({ delay: null });

/* Typing is what opens this popup under jsdom; pressing the trigger does not,
   because Base UI opens it from pointer events jsdom does not produce. Every
   spec that needs the list on screen gets there the way a person would. */
const open = async (user: ReturnType<typeof type>) =>
  user.type(screen.getByPlaceholderText('Search'), 'a');

afterEach(() => {
  vi.useRealTimers();
});

/* What can be wrong in async mode is never the markup — it is which reply wins,
   how often the loader is asked, and whether an answer is claimed before one has
   arrived. None of the three is visible in a screenshot (ADR 0012). */
describe('AutoComplete async mode', () => {
  it('asks once for a burst of typing rather than once per keystroke', async () => {
    vi.useFakeTimers();
    const loadItems = vi.fn().mockResolvedValue(ROWS);

    render(<AutoComplete loadItems={loadItems} loadDelay={50} placeholder="Search" />);
    await vi.advanceTimersByTimeAsync(100);
    loadItems.mockClear();                       // the mount's own empty query

    const input = screen.getByPlaceholderText('Search');
    for (const value of ['s', 'si', 'sin']) {
      fireEvent.change(input, { target: { value } });
      await vi.advanceTimersByTimeAsync(10);     // still inside the window
    }
    await vi.advanceTimersByTimeAsync(200);

    expect(loadItems).toHaveBeenCalledTimes(1);
    expect(loadItems.mock.calls[0]?.[0]).toBe('sin');
  });

  it('does not let a slow earlier reply overwrite a newer one', async () => {
    const user = type();
    let settleFirst: (rows: ComboboxOption[]) => void = () => {};
    const loadItems = vi.fn()
      .mockImplementationOnce(() => new Promise<ComboboxOption[]>((resolve) => { settleFirst = resolve; }))
      .mockResolvedValue([{ value: 'sg', label: 'Singapore' }]);

    render(<AutoComplete loadItems={loadItems} loadDelay={0} placeholder="Search" />);
    await waitFor(() => expect(loadItems).toHaveBeenCalledTimes(1));

    await user.type(screen.getByPlaceholderText('Search'), 's');
    await waitFor(() => expect(loadItems).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(screen.getByText('Singapore')).toBeInTheDocument());

    /* The stale one lands last, carrying a list nobody is asking for any more. */
    settleFirst([{ value: 'stale', label: 'Stale row' }]);
    await waitFor(() => expect(screen.getByText('Singapore')).toBeInTheDocument());
    expect(screen.queryByText('Stale row')).not.toBeInTheDocument();
  });

  it('says it is searching rather than saying nothing matched', async () => {
    const user = type();
    const loadItems = vi.fn(() => new Promise<ComboboxOption[]>(() => {}));   // never settles

    render(
      <AutoComplete
        loadItems={loadItems}
        loadDelay={0}
        placeholder="Search"
        loadingMessage="Searching…"
        emptyMessage="Nothing matched"
      />,
    );
    await open(user);

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Searching…'));
    expect(screen.queryByText('Nothing matched')).not.toBeInTheDocument();
  });

  it('keeps every row the loader returned, including ones the query does not spell', async () => {
    const user = type();
    /* A server matching on a synonym, an id or an alias returns rows whose label
       does not contain what was typed. Matching the reply again would drop them. */
    const loadItems = vi.fn().mockResolvedValue([{ value: 'id', label: 'Indonesia' }]);

    render(<AutoComplete loadItems={loadItems} loadDelay={0} placeholder="Search" />);
    await user.type(screen.getByPlaceholderText('Search'), 'jakarta');

    await waitFor(() => expect(screen.getByText('Indonesia')).toBeInTheDocument());
  });

  it('reports a failed search instead of an empty list', async () => {
    const user = type();
    const loadItems = vi.fn().mockRejectedValue(new Error('offline'));

    render(
      <AutoComplete loadItems={loadItems} loadDelay={0} placeholder="Search" errorMessage="Could not search" />,
    );
    await open(user);

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Could not search'));
  });

  it('keeps showing what was chosen after the list moves on beneath it', async () => {
    const user = type();
    const loadItems = vi.fn()
      .mockResolvedValueOnce([{ value: 'id', label: 'Indonesia' }])
      .mockResolvedValue([{ value: 'sg', label: 'Singapore' }]);

    render(<AutoComplete loadItems={loadItems} loadDelay={0} placeholder="Search" />);
    await open(user);
    await waitFor(() => expect(screen.getByText('Indonesia')).toBeInTheDocument());
    await user.click(screen.getByText('Indonesia'));

    expect(screen.getByPlaceholderText('Search')).toHaveValue('Indonesia');
  });
});

describe('AutoComplete static mode', () => {
  it('still matches in the browser when it holds the whole list', async () => {
    const user = type();
    render(<AutoComplete items={ROWS} placeholder="Search" />);

    await user.type(screen.getByPlaceholderText('Search'), 'Sing');
    await waitFor(() => expect(screen.getByText('Singapore')).toBeInTheDocument());
    expect(screen.queryByText('Indonesia')).not.toBeInTheDocument();
  });

  it('never asks a loader it was not given', async () => {
    const user = type();
    render(<AutoComplete items={ROWS} placeholder="Search" />);
    await user.type(screen.getByPlaceholderText('Search'), 'Indo');

    await waitFor(() => expect(screen.getByText('Indonesia')).toBeInTheDocument());
    /* Base UI gives its own empty message a live region, so the tell is the
       wording: a static list is never "searching". */
    expect(screen.queryByText('Searching…')).not.toBeInTheDocument();
  });
});
