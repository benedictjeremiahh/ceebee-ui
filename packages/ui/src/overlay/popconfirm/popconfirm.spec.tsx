import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Popconfirm } from './popconfirm.js';

describe('Popconfirm', () => {
  it('uses an anchored popover confirmation and returns focus after confirming', async () => {
    const confirm = vi.fn();
    render(
      <Popconfirm
        trigger={<button type="button">Delete item</button>}
        title="Delete this item?"
        description="This cannot be undone."
        cancelAction={<button type="button">Cancel</button>}
        confirmAction={<button type="button" onClick={confirm}>Delete</button>}
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Delete item' });
    fireEvent.click(trigger);
    expect(await screen.findByRole('heading', { name: 'Delete this item?' })).toBeVisible();
    expect(screen.getByText('This cannot be undone.')).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(confirm).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('heading', { name: 'Delete this item?' })).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('dismisses with Escape without invoking either action', async () => {
    const cancel = vi.fn();
    const confirm = vi.fn();
    render(
      <Popconfirm
        defaultOpen
        trigger={<button type="button">Archive</button>}
        title="Archive item?"
        cancelAction={<button type="button" onClick={cancel}>Keep</button>}
        confirmAction={<button type="button" onClick={confirm}>Archive now</button>}
      />,
    );

    expect(await screen.findByRole('heading', { name: 'Archive item?' })).toBeVisible();
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('heading', { name: 'Archive item?' })).not.toBeInTheDocument());
    expect(cancel).not.toHaveBeenCalled();
    expect(confirm).not.toHaveBeenCalled();
  });

  it('dismisses after an outside interaction and leaves focus on its native target', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button type="button">Outside target</button>
        <Popconfirm
          trigger={<button type="button">Remove</button>}
          title="Remove item?"
          confirmAction={<button type="button">Remove now</button>}
        />
      </div>,
    );

    await user.click(screen.getByRole('button', { name: 'Remove' }));
    expect(await screen.findByRole('heading', { name: 'Remove item?' })).toBeVisible();
    const outside = screen.getByRole('button', { name: 'Outside target' });
    await user.click(outside);
    await waitFor(() => expect(screen.queryByRole('heading', { name: 'Remove item?' })).not.toBeInTheDocument());
    expect(outside).toHaveFocus();
  });

  it('supports controlled open state and a static motion-off rendering', async () => {
    const onOpenChange = vi.fn();
    render(
      <Popconfirm
        open
        onOpenChange={onOpenChange}
        motion={false}
        trigger={<button type="button">Reset</button>}
        title="Reset settings?"
        confirmAction={<button type="button">Reset now</button>}
      />,
    );

    const popup = (await screen.findByRole('heading', { name: 'Reset settings?' })).closest('.cb-popconfirm');
    expect(popup).toHaveAttribute('data-motion', 'off');
    fireEvent.click(screen.getByRole('button', { name: 'Reset now' }));
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it('ships matching non-interactive Skeleton anatomy', () => {
    render(<Popconfirm.Skeleton />);
    expect(document.querySelector('.cb-popconfirm--skeleton')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('removes decorative icon geometry when icon is null', async () => {
    render(
      <Popconfirm
        defaultOpen
        icon={null}
        trigger={<button type="button">Open</button>}
        title="Continue?"
        confirmAction={<button type="button">Continue</button>}
      />,
    );

    const popup = (await screen.findByRole('heading', { name: 'Continue?' })).closest('.cb-popconfirm');
    expect(popup).toHaveAttribute('data-icon', 'none');
    expect(popup?.querySelector('.cb-popconfirm__icon')).not.toBeInTheDocument();
  });
});
