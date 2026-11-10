import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DragDropHandle, DragDropProvider, DragDropTarget, dragDropAutoScroll } from './drag-drop.js';
import type { DragDropMove } from './types.js';

// jsdom has no layout. Each row is 40px tall at its index in the rendered order; a zone fills its half.
const rowHeight = 40;
const initialRect = Element.prototype.getBoundingClientRect;
function rect(top: number, height: number): DOMRect {
  return { top, height, bottom: top + height, left: 0, right: 200, width: 200, x: 0, y: top, toJSON: () => ({}) };
}
beforeEach(() => {
  Element.prototype.getBoundingClientRect = function measure(this: Element) {
    const row = this.closest('[data-row]');
    const rows = row?.parentElement ? [...row.parentElement.querySelectorAll(':scope > [data-row]')] : [];
    const top = row ? rows.indexOf(row) * rowHeight : 0;
    const position = this.getAttribute('data-position');
    if (position === 'before') return rect(top, rowHeight / 2);
    if (position === 'after') return rect(top + rowHeight / 2, rowHeight / 2);
    return rect(top, rowHeight);
  };
});
afterEach(() => { Element.prototype.getBoundingClientRect = initialRect; });

function Rows({ canDrop, onDrop, onPreview, reorder }: {
  canDrop: (move: DragDropMove) => boolean;
  onDrop: (move: DragDropMove) => void;
  onPreview: (move: DragDropMove | null) => void;
  reorder: boolean;
}) {
  const [preview, setPreview] = useState<DragDropMove | null>(null);
  const committed = ['a', 'b', 'c'];
  // A consumer opens the slot by rendering the projected order; the dragged row stays mounted at its new place.
  const order = reorder && preview?.position === 'after' && preview.targetId === 'b' ? ['b', 'a', 'c'] : committed;
  return <DragDropProvider canDrop={canDrop} onDrop={onDrop} labelOf={id => `Row ${id}`}
    renderOverlay={id => <span>Lifted {id}</span>}
    onPreview={move => { onPreview(move); setPreview(move); }}>
    <div>{order.map(id => <div key={id} data-row={id}>
      <DragDropHandle id={id} label={`Move ${id}`} />
      <DragDropTarget id={id}><span>Row {id}</span></DragDropTarget>
    </div>)}</div>
  </DragDropProvider>;
}

async function pickUp(user: ReturnType<typeof userEvent.setup>, id: string) {
  const handle = screen.getByRole('button', { name: `Move ${id}` });
  handle.focus();
  await user.keyboard(' ');
  await waitFor(() => expect(handle).toHaveAttribute('data-dragging', 'true'));
}

describe('DragDrop preview', () => {
  it('scrolls only at the very edge and gently', () => {
    expect(dragDropAutoScroll.threshold.y).toBeLessThanOrEqual(0.1);
    expect(dragDropAutoScroll.threshold.x).toBe(0);
    expect(dragDropAutoScroll.acceleration).toBeLessThanOrEqual(3);
  });

  it('lifts the consumer row content beside a grip', async () => {
    render(<Rows canDrop={() => true} onDrop={vi.fn()} onPreview={vi.fn()} reorder={false} />);
    const user = userEvent.setup();
    await pickUp(user, 'a');
    const lifted = await screen.findByText('Lifted a');
    expect(lifted.closest('.cb-drag-drop__overlay')).toHaveAttribute('data-lifted');
    expect(lifted.closest('.cb-drag-drop__overlay')?.querySelector('.cb-drag-drop__overlay-grip')).not.toBeNull();
    await user.keyboard('{Escape}');
  });

  it('previews each valid position once, steps over unavailable ones and clears on cancel', async () => {
    const onPreview = vi.fn<(move: DragDropMove | null) => void>();
    const canDrop = (move: DragDropMove) => !(move.targetId === 'c' && move.position === 'before');
    render(<Rows canDrop={canDrop} onDrop={vi.fn()} onPreview={onPreview} reorder={false} />);
    const user = userEvent.setup();
    await pickUp(user, 'a');
    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(onPreview).toHaveBeenLastCalledWith({ sourceId: 'a', targetId: 'b', position: 'before' }));
    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(onPreview).toHaveBeenLastCalledWith({ sourceId: 'a', targetId: 'b', position: 'after' }));
    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(onPreview).toHaveBeenLastCalledWith({ sourceId: 'a', targetId: 'c', position: 'after' }));
    expect(onPreview).toHaveBeenCalledTimes(3);
    expect(onPreview).not.toHaveBeenCalledWith({ sourceId: 'a', targetId: 'c', position: 'before' });
    await user.keyboard('{Escape}');
    await waitFor(() => expect(onPreview).toHaveBeenLastCalledWith(null));
  });

  it('keeps the previewed move while resting on the opened slot and commits it there', async () => {
    const onPreview = vi.fn<(move: DragDropMove | null) => void>();
    const onDrop = vi.fn<(move: DragDropMove) => void>();
    render(<Rows canDrop={() => true} onDrop={onDrop} onPreview={onPreview} reorder />);
    const user = userEvent.setup();
    await pickUp(user, 'a');
    await user.keyboard('{ArrowDown}{ArrowDown}');
    await waitFor(() => expect(onPreview).toHaveBeenLastCalledWith({ sourceId: 'a', targetId: 'b', position: 'after' }));
    // The rows swapped, so the keyboard position now rests on row a's own slot.
    await waitFor(() => expect(screen.getAllByText(/^Row [abc]$/).map(node => node.textContent)).toEqual(['Row b', 'Row a', 'Row c']));
    await new Promise(resolve => setTimeout(resolve, 20));
    expect(onPreview).toHaveBeenLastCalledWith({ sourceId: 'a', targetId: 'b', position: 'after' });
    await user.keyboard(' ');
    await waitFor(() => expect(onDrop).toHaveBeenCalledWith({ sourceId: 'a', targetId: 'b', position: 'after' }));
    expect(onPreview).toHaveBeenLastCalledWith(null);
  });
});
