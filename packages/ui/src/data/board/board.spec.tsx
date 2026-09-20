import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Board } from './board.js';
import type { BoardColumn } from './board.types.js';

/* Pointer dragging is dnd-kit's and depends on layout and pointer events jsdom does not have; it is
   proven in a browser. These specs cover what this library adds on top: the keyboard path, the single
   validated move, the rollback and its reason, the announcements, and the lane rendering. */

const columns = (): BoardColumn[] => [
  { id: 'todo', name: 'To do', cards: [{ id: 'a', title: 'Pour the slab' }, { id: 'b', title: 'Order cement' }] },
  { id: 'doing', name: 'Doing', cards: [], empty: 'Nothing in progress' },
  { id: 'done', name: 'Done', cards: [{ id: 'c', title: 'Survey', disabled: true, disabledReason: 'this job is closed' }] },
];

/* dnd-kit renders its own role="status" region, so the board's announcements are read from the
   board's own region rather than by role. */
let root: HTMLElement;

const board = (props: Partial<React.ComponentProps<typeof Board>> = {}) => {
  const onMove = props.onMove ?? vi.fn();
  const { container } = render(<Board columns={columns()} onMove={onMove} layout="board" {...props} />);
  root = container;
  return { onMove };
};

const card = (title: string) => screen.getByText(title).closest('li') as HTMLElement;

/** The move the consumer was asked about. Indexing a call list does not guarantee there was one. */
const moveAt = (onMove: ReturnType<typeof vi.fn>, index: number) => {
  const call = onMove.mock.calls[index];
  if (!call) throw new Error(`the consumer was not asked about a move at ${index}`);
  return call[0];
};
const live = () => root.querySelector('.cb-board__live') as HTMLElement;

describe('Board', () => {
  it('renders each column with its name and how many cards it holds', () => {
    board();
    expect(screen.getByText('To do')).toBeTruthy();
    const heading = screen.getByText('To do').closest('header');
    expect(heading?.textContent).toContain('2');
  });

  it('invites a card into an empty column rather than showing nothing', () => {
    board();
    expect(screen.getByText('Nothing in progress')).toBeTruthy();
  });

  it('moves a card by keyboard, and reports the move once', async () => {
    const onMove = vi.fn();
    board({ onMove });
    const a = card('Pour the slab');
    a.focus();
    fireEvent.keyDown(a, { key: ' ' });           // pick up
    fireEvent.keyDown(a, { key: 'ArrowRight' });  // To do -> Doing
    fireEvent.keyDown(a, { key: ' ' });           // drop
    await waitFor(() => expect(onMove).toHaveBeenCalledTimes(1));
    expect(moveAt(onMove, 0)).toEqual({
      cardId: 'a',
      from: { columnId: 'todo', index: 0 },
      to: { columnId: 'doing', index: 0 },
    });
  });

  it('announces the pick-up and the drop by the card’s name, not its id', async () => {
    board();
    const a = card('Pour the slab');
    a.focus();
    fireEvent.keyDown(a, { key: ' ' });
    expect(live().textContent).toContain('Picked up');
    fireEvent.keyDown(a, { key: 'ArrowRight' });
    fireEvent.keyDown(a, { key: ' ' });
    await waitFor(() => expect(live().textContent).toContain('Pour the slab moved to Doing'));
  });

  it('cancels on Escape and asks the consumer for nothing', () => {
    const onMove = vi.fn();
    board({ onMove });
    const a = card('Pour the slab');
    a.focus();
    fireEvent.keyDown(a, { key: ' ' });
    fireEvent.keyDown(a, { key: 'ArrowRight' });
    fireEvent.keyDown(a, { key: 'Escape' });
    expect(live().textContent).toContain('cancelled');
    expect(onMove).not.toHaveBeenCalled();
  });

  it('rolls back a refused move and says why', async () => {
    const onMove = vi.fn().mockResolvedValue({ refused: 'a Decision is answered, not moved' });
    board({ onMove });
    const a = card('Pour the slab');
    a.focus();
    fireEvent.keyDown(a, { key: ' ' });
    fireEvent.keyDown(a, { key: 'ArrowRight' });
    fireEvent.keyDown(a, { key: ' ' });
    await waitFor(() => expect(live().textContent).toContain('a Decision is answered, not moved'));
    // The card is back where it started: 'To do' still holds both of its cards.
    const todo = screen.getByText('To do').closest('section');
    expect(todo?.textContent).toContain('Pour the slab');
  });

  it('rolls back when the consumer throws, and surfaces the message', async () => {
    const onMove = vi.fn().mockRejectedValue(new Error('the network is gone'));
    board({ onMove });
    const a = card('Pour the slab');
    a.focus();
    fireEvent.keyDown(a, { key: ' ' });
    fireEvent.keyDown(a, { key: 'ArrowRight' });
    fireEvent.keyDown(a, { key: ' ' });
    await waitFor(() => expect(live().textContent).toContain('the network is gone'));
  });

  it('refuses to pick up a card that cannot move, and gives that card’s own reason', () => {
    const onMove = vi.fn();
    board({ onMove });
    const c = card('Survey');
    c.focus();
    fireEvent.keyDown(c, { key: ' ' });
    expect(live().textContent).toContain('this job is closed');
    expect(onMove).not.toHaveBeenCalled();
  });

  it('offers an undo after a move, and the undo is an ordinary move back', async () => {
    const onMove = vi.fn();
    board({ onMove });
    const a = card('Pour the slab');
    a.focus();
    fireEvent.keyDown(a, { key: ' ' });
    fireEvent.keyDown(a, { key: 'ArrowRight' });
    fireEvent.keyDown(a, { key: ' ' });
    await waitFor(() => expect(onMove).toHaveBeenCalledTimes(1));
    fireEvent.click(await screen.findByRole('button', { name: 'Undo' }));
    await waitFor(() => expect(onMove).toHaveBeenCalledTimes(2));
    expect(moveAt(onMove, 1).to).toEqual({ columnId: 'todo', index: 0 });
  });

  it('renders lanes rather than a squeezed board when asked', () => {
    board({ layout: 'lanes' });
    expect(screen.getByRole('tablist')).toBeTruthy();
    // One column at a time: 'Doing' is not rendered until its lane is chosen.
    expect(screen.queryByText('Nothing in progress')).toBeNull();
    fireEvent.click(screen.getByRole('tab', { name: /Doing/ }));
    expect(screen.getByText('Nothing in progress')).toBeTruthy();
  });

  it('marks a column past its limit without refusing it', () => {
    render(
      <Board
        layout="board"
        onMove={vi.fn()}
        columns={[{ id: 'wip', name: 'WIP', limit: 1, cards: [{ id: 'x', title: 'One' }, { id: 'y', title: 'Two' }] }]}
      />,
    );
    expect(screen.getByText('2/1')).toBeTruthy();
    expect(screen.getByText(/over the limit/)).toBeTruthy();
  });

  it('lets a card carry its own actions, and a click on one is not a drag', () => {
    const acted = vi.fn();
    render(
      <Board
        layout="board"
        onMove={vi.fn()}
        columns={[
          {
            id: 'todo',
            name: 'To do',
            cards: [{ id: 'a', title: 'Pour the slab', meta: <button type="button" onClick={acted}>Edit</button> }],
          },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(acted).toHaveBeenCalledTimes(1);
  });

  it('puts the grab on a handle when asked, so a card’s own buttons stay reachable', () => {
    const acted = vi.fn();
    const { container } = render(
      <Board
        layout="board"
        handle
        onMove={vi.fn()}
        columns={[
          {
            id: 'todo',
            name: 'To do',
            cards: [{ id: 'a', title: 'Pour the slab', meta: <button type="button" onClick={acted}>Edit</button> }],
          },
        ]}
      />,
    );
    // The card is plain markup now — it is not itself a control, so its children stay in the tree.
    const cardEl = screen.getByText('Pour the slab').closest('li') as HTMLElement;
    expect(cardEl.getAttribute('role')).toBeNull();
    expect(container.querySelector('.cb-board__handle')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(acted).toHaveBeenCalledTimes(1);
  });

  it('moves by keyboard from the handle, so the keyboard path survives the handle', async () => {
    const onMove = vi.fn();
    render(
      <Board
        layout="board"
        handle
        onMove={onMove}
        columns={[
          { id: 'todo', name: 'To do', cards: [{ id: 'a', title: 'Pour the slab' }] },
          { id: 'doing', name: 'Doing', cards: [] },
        ]}
      />,
    );
    const grab = screen.getByRole('button', { name: 'Move Pour the slab' });
    grab.focus();
    fireEvent.keyDown(grab, { key: ' ' });
    fireEvent.keyDown(grab, { key: 'ArrowRight' });
    fireEvent.keyDown(grab, { key: ' ' });
    await waitFor(() => expect(onMove).toHaveBeenCalledTimes(1));
    expect(moveAt(onMove, 0).to.columnId).toBe('doing');
  });

  it('names a column whose header is a node, and announces it by that name', async () => {
    const onMove = vi.fn();
    render(
      <Board
        layout="board"
        onMove={onMove}
        columns={[
          { id: 'todo', name: <span>To do <em>2</em></span>, label: 'To do', cards: [{ id: 'a', title: 'Pour the slab' }] },
          { id: 'doing', name: <span>Doing</span>, label: 'Doing', cards: [] },
        ]}
      />,
    );
    expect(screen.getByRole('region', { name: 'To do' }) ?? screen.getByLabelText('To do')).toBeTruthy();
    const a = screen.getByText('Pour the slab').closest('li') as HTMLElement;
    a.focus();
    fireEvent.keyDown(a, { key: ' ' });
    fireEvent.keyDown(a, { key: 'ArrowRight' });
    fireEvent.keyDown(a, { key: ' ' });
    await waitFor(() => expect(onMove).toHaveBeenCalledTimes(1));
  });

  it('ships a Skeleton built from the same anatomy', () => {
    const { container } = render(<Board.Skeleton columns={2} cards={2} />);
    expect(container.querySelectorAll('.cb-board__column')).toHaveLength(2);
    expect(container.querySelectorAll('.cb-board__ghost-card')).toHaveLength(4);
  });
});
