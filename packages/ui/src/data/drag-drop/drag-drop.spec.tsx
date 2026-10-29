import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DragDropHandle, DragDropProvider, DragDropStatus, DragDropTarget } from './drag-drop.js';
import { Tooltip } from '../../overlay/tooltip.js';
import { dropData } from './types.js';

function Fixture({ disabled = false }: { disabled?: boolean }) {
  return <DragDropProvider canDrop={() => true} onDrop={vi.fn()} labelOf={id => id}>
    <DragDropStatus idle="Ready" />
    <DragDropHandle id="first" label="Move first" disabled={disabled} />
    <DragDropTarget id="second" inside><Tooltip title="Target hint" open><button>Open second</button></Tooltip></DragDropTarget>
  </DragDropProvider>;
}

describe('DragDrop', () => {
  it('keeps ordinary actions interactive without initiating a drag', () => {
    render(<Fixture />);
    fireEvent.click(screen.getByRole('button', { name: 'Open second' }));
    expect(screen.getByText('Ready')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Move first' })).toHaveAttribute('aria-describedby');
  });

  it('starts a keyboard drag, cancels through the runtime and restores focus', async () => {
    render(<Fixture />);
    const handle = screen.getByRole('button', { name: 'Move first' });
    handle.focus();
    const user = userEvent.setup();
    await user.keyboard(' ');
    await waitFor(() => expect(handle).toHaveAttribute('data-dragging', 'true'));
    expect(screen.queryByRole('tooltip', { name: 'Target hint' })).not.toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.getByText('Ready')).toBeVisible());
    await waitFor(() => expect(handle).toHaveFocus());
  });

  it('does not activate disabled handles', () => {
    render(<Fixture disabled />);
    const handle = screen.getByRole('button', { name: 'Move first' });
    expect(handle).toBeDisabled();
    fireEvent.keyDown(handle, { code: 'Space', key: ' ' });
    expect(screen.getByText('Ready')).toBeVisible();
  });

  it('narrows only registered semantic drop metadata', () => {
    expect(dropData({ targetId: 'group', position: 'inside' })).toEqual({ targetId: 'group', position: 'inside' });
    expect(dropData({ targetId: 'group', position: 'replace' })).toBeUndefined();
    expect(dropData({ targetId: 42, position: 'before' })).toBeUndefined();
    expect(dropData(null)).toBeUndefined();
  });
});
