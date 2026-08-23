import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Badge } from './badge.js';
import { Tag } from './tag.js';

/* Badge and Tag share a look and differ in what they are, so what can be wrong
   is the difference going missing: a label that announces itself as pressable
   when nothing happens, or a control that announces itself as a label (ADR 0014). */
describe('Tag', () => {
  it('is a label until something can be done to it', () => {
    const { rerender } = render(<Tag>Indonesian</Tag>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('Indonesian')).toBeInTheDocument();

    rerender(<Tag onClick={() => {}}>Indonesian</Tag>);
    expect(screen.getByRole('button', { name: 'Indonesian' })).toBeInTheDocument();
  });

  it('reports whether a pressable tag is on', async () => {
    const user = userEvent.setup({ delay: null });
    const onClick = vi.fn();
    render(<Tag onClick={onClick} pressed>Japanese</Tag>);

    const tag = screen.getByRole('button', { name: 'Japanese' });
    expect(tag).toHaveAttribute('aria-pressed', 'true');
    await user.click(tag);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('keeps removing separate from pressing, and does not nest one in the other', async () => {
    const user = userEvent.setup({ delay: null });
    const onClose = vi.fn();
    render(<Tag onClose={onClose}>Thai</Tag>);

    /* One control, and the tag itself is not one — a button inside a button is
       invalid, and the row would have two answers to one press. */
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0]!.closest('button')).toBe(buttons[0]);

    await user.click(buttons[0]!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('wears the same look as Badge rather than a second copy of it', () => {
    const { rerender } = render(<Badge tone="brand" variant="soft">A</Badge>);
    const badge = screen.getByText('A');
    expect(badge).toHaveClass('cb-badge', 'cb-badge--soft');

    rerender(<Tag tone="brand" variant="soft">A</Tag>);
    expect(screen.getByText('A').closest('.cb-badge')).toHaveClass('cb-badge', 'cb-badge--soft');
  });
});
