import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Modal } from './modal.js';

describe('Modal.Confirm', () => {
  it('keeps the modal dialog contract and orders cancel before confirm', () => {
    render(
      <Modal.Confirm
        open
        title="Delete project?"
        description="This cannot be undone."
        cancelAction={<button type="button">Cancel</button>}
        confirmAction={<button type="button">Delete</button>}
      />,
    );

    const dialog = screen.getByRole('dialog', { name: 'Delete project?' });
    expect(dialog).toHaveClass('cb-modal', 'cb-modal-confirm', 'cb-modal--sm', 'cb-modal--center');
    expect(dialog).toHaveAccessibleDescription('This cannot be undone.');
    expect(dialog.querySelector('.cb-modal-confirm__icon')).toHaveAttribute('data-tone', 'warning');
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
      'Cancel',
      'Delete',
    ]);
  });

  it('uses Modal dismissal rather than an anchored Popconfirm contract', async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Modal.Confirm
        open
        onOpenChange={onOpenChange}
        title="Publish changes?"
        confirmAction={<button type="button">Publish</button>}
      />,
    );

    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalled();
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(false);
    expect(screen.getByRole('dialog')).not.toHaveClass('cb-popconfirm');
  });
});

describe('Modal.Skeleton', () => {
  it('matches modal size and optional action geometry without dialog semantics', () => {
    const { container } = render(<Modal.Skeleton size="lg" lines={2} withActions />);

    expect(container.firstElementChild).toHaveClass('cb-modal-skeleton', 'cb-modal--lg');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(container.querySelectorAll('.cb-modal__footer .cb-skeleton')).toHaveLength(2);
  });
});
