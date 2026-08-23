import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Rate } from './rate.js';

/* What can be wrong: a score nobody can read out, a score nobody can clear, or
   a read-only score that still offers itself as a choice (ADR 0012). */
describe('Rate', () => {
  it('is a radiogroup, one star per score', () => {
    render(<Rate value={3} label="Rating" onValueChange={() => {}} />);

    expect(screen.getByRole('radiogroup', { name: 'Rating' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
    expect(screen.getByRole('radio', { name: '3/5' })).toBeChecked();
  });

  it('clears when the current score is pressed again', async () => {
    const user = userEvent.setup({ delay: null });
    const onValueChange = vi.fn();
    render(<Rate value={4} onValueChange={onValueChange} label="Rating" />);

    /* Nought and one are different answers, and without this there is no way
       back to the first. */
    await user.click(screen.getByRole('radio', { name: '4/5' }));
    expect(onValueChange).toHaveBeenCalledWith(0);

    await user.click(screen.getByRole('radio', { name: '2/5' }));
    expect(onValueChange).toHaveBeenCalledWith(2);
  });

  it('offers nothing to press when it is only showing a score', () => {
    render(<Rate value={2} readOnly label="Rating" />);

    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
    expect(screen.getByRole('img', { name: 'Rating: 2/5' })).toBeInTheDocument();
  });
});
