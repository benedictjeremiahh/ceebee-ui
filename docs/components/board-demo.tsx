'use client';

import { Board, type BoardColumn, type BoardMove } from '@ceebee/ui/client';
import { useState } from 'react';
import { Demo } from './demo';

const START: BoardColumn[] = [
  {
    id: 'todo',
    name: 'To do',
    cards: [
      { id: 'slab', title: 'Pour the slab', meta: '3 days · Budi' },
      { id: 'cement', title: 'Order cement', meta: 'due Friday' },
    ],
    empty: 'Nothing waiting',
  },
  {
    id: 'doing',
    name: 'Doing',
    limit: 2,
    cards: [{ id: 'wiring', title: 'First-fix wiring', meta: 'blocked · waiting on parts' }],
    empty: 'Drop work here',
  },
  {
    id: 'done',
    name: 'Done',
    cards: [{ id: 'survey', title: 'Survey', meta: 'closed', disabled: true, disabledReason: 'a finished job cannot move' }],
    accepts: false,
    refusal: 'Finished work is closed here',
  },
];

const apply = (columns: BoardColumn[], move: BoardMove): BoardColumn[] => {
  const card = columns.find((c) => c.id === move.from.columnId)?.cards[move.from.index];
  if (!card) return columns;
  return columns.map((column) => {
    if (column.id === move.from.columnId && column.id === move.to.columnId) {
      const rest = column.cards.filter((_, i) => i !== move.from.index);
      rest.splice(move.to.index, 0, card);
      return { ...column, cards: rest };
    }
    if (column.id === move.from.columnId) return { ...column, cards: column.cards.filter((_, i) => i !== move.from.index) };
    if (column.id === move.to.columnId) {
      const next = [...column.cards];
      next.splice(move.to.index, 0, card);
      return { ...column, cards: next };
    }
    return column;
  });
};

export function BoardDemo() {
  const [columns, setColumns] = useState(START);
  const [opened, setOpened] = useState('');

  // A card carries its own actions on a real board. A click on one must stay a click.
  const withAction = (cols: BoardColumn[]): BoardColumn[] =>
    cols.map((column) => ({
      ...column,
      cards: column.cards.map((c) =>
        c.id === 'slab'
          ? {
              ...c,
              meta: (
                <>
                  {c.meta}{' '}
                  <button type="button" onClick={() => setOpened('Opened “Pour the slab”.')}>
                    Open
                  </button>
                </>
              ),
            }
          : c,
      ),
    }));

  return (
    <Demo
      layout="block"
      code={`<Board
  columns={columns}
  onMove={(move) => {
    // Refuse it and the board rolls back and says why.
    if (move.to.columnId === 'doing' && full) return { refused: 'Doing is at its limit' };
    setColumns(apply(columns, move));
  }}
/>`}
    >
      <Board
        columns={withAction(columns)}
        handle
        aria-label="Site work"
        onMove={(move) => {
          setColumns((current) => apply(current, move));
        }}
      />
      <p>Drag a card, or focus one and press Space, then the arrow keys, then Space again.</p>
      {opened ? <p>{opened}</p> : null}
    </Demo>
  );
}

export function BoardOpenDemo() {
  const [columns, setColumns] = useState(START);
  const [opened, setOpened] = useState('');

  const titleOf = (cardId: string) => {
    const card = columns.flatMap((c) => c.cards).find((c) => c.id === cardId);
    if (!card) return cardId;
    if (card.label) return card.label;
    return typeof card.title === 'string' ? card.title : cardId;
  };

  return (
    <Demo
      layout="block"
      code={`<Board
  columns={columns}
  handle
  // The card front is a title and badges; opening it is the card's own job, not a button's.
  onCardOpen={(cardId) => open(cardId)}
  onMove={(move) => setColumns((c) => apply(c, move))}
/>`}
    >
      <Board
        columns={columns}
        handle
        aria-label="Work with details"
        onCardOpen={(cardId) => setOpened(cardId)}
        onMove={(move) => {
          setColumns((current) => apply(current, move));
        }}
      />
      <p>Click a card's title, or focus it and press Enter, to open it. Drag it by its handle to move it.</p>
      {opened ? <p>Opened “{titleOf(opened)}”.</p> : null}
    </Demo>
  );
}

export function BoardRefusalDemo() {
  const [columns, setColumns] = useState(START);

  return (
    <Demo
      layout="block"
      code={`onMove={async (move) => {
  const problem = await save(move);
  return problem ? { refused: problem } : undefined;
}}`}
    >
      <Board
        columns={columns}
        aria-label="A board that refuses"
        onMove={(move) => {
          if (move.to.columnId === 'doing') return { refused: 'someone else is already on that' };
          setColumns((current) => apply(current, move));
        }}
      />
      <p>Moving into “Doing” is always refused here: the card goes back and the reason is announced.</p>
    </Demo>
  );
}
