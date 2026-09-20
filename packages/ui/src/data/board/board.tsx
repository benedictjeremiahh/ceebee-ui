'use client';

import * as React from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BoardSkeleton, type BoardSkeletonProps } from './board.skeleton.js';
import { applyMove, canPickUp, columnLoad, isNoop, locate, nextTarget, refusalFor, type BoardDirection } from './board.math.js';
import type { BoardColumn, BoardMove, BoardMoveResult, BoardPosition } from './board.types.js';
import './board.css';

export interface BoardLabels {
  pickUp: string;
  dropped: (card: string, column: string) => string;
  cancelled: string;
  refused: (reason: string) => string;
  undo: string;
  undone: string;
  lanes: string;
  over: (count: number, limit: number) => string;
}

const DEFAULTS: BoardLabels = {
  pickUp: 'Picked up. Use the arrow keys to move it, Space to drop, Escape to cancel.',
  dropped: (card, column) => `${card} moved to ${column}.`,
  cancelled: 'Move cancelled.',
  refused: (reason) => `Move refused: ${reason}`,
  undo: 'Undo',
  undone: 'Move undone.',
  lanes: 'Column',
  over: (count, limit) => `${count} of ${limit}, over the limit`,
};

export interface BoardProps {
  columns: BoardColumn[];
  /**
   * The one path every move takes, from the pointer and from the keyboard alike. Return nothing to
   * accept it; return `{ refused }` or reject to roll the board back and say why.
   */
  onMove: (move: BoardMove) => BoardMoveResult | Promise<BoardMoveResult>;
  /** `auto` switches to lanes on a narrow viewport; force either to prove one in a test. */
  layout?: 'auto' | 'board' | 'lanes';
  /** What `auto` calls narrow. */
  phoneQuery?: string;
  labels?: Partial<BoardLabels>;
  motion?: boolean;
  'aria-label'?: string;
}

/** A card's plain-text name, for an announcement that cannot read a React node. */
const textOf = (node: React.ReactNode, fallback: string) => (typeof node === 'string' ? node : fallback);

function BoardRoot({
  columns,
  onMove,
  layout = 'auto',
  phoneQuery = '(max-width: 640px)',
  labels,
  motion = true,
  'aria-label': ariaLabel = 'Board',
}: BoardProps) {
  const text = { ...DEFAULTS, ...labels };
  const [optimistic, setOptimistic] = React.useState<BoardColumn[] | null>(null);
  const [held, setHeld] = React.useState<{ cardId: string; at: BoardPosition } | null>(null);
  const [dragging, setDragging] = React.useState<string | null>(null);
  const [announcement, setAnnouncement] = React.useState('');
  const [undoable, setUndoable] = React.useState<BoardMove | null>(null);
  const [lane, setLane] = React.useState(0);

  // The board shown is the optimistic one while a move is in flight, so a card does not jump back and
  // forth on a slow consumer; props win again the moment the consumer answers.
  const view = optimistic ?? columns;
  React.useEffect(() => setOptimistic(null), [columns]);

  const narrow = useNarrow(layout === 'auto' ? phoneQuery : null);
  const lanes = layout === 'lanes' || (layout === 'auto' && narrow);

  const nameOf = (columnId: string) => textOf(view.find((c) => c.id === columnId)?.name, columnId);

  /**
   * Every move — dragged or typed — comes through here. It applies optimistically, asks the consumer,
   * and puts the board back if the answer is no.
   */
  const commit = React.useCallback(
    async (move: BoardMove, announceAs?: string) => {
      if (isNoop(move)) return;
      const refusal = refusalFor(view, move);
      if (refusal) {
        setAnnouncement(text.refused(refusal));
        return;
      }
      const before = view;
      setOptimistic(applyMove(view, move));
      setAnnouncement(announceAs ?? text.dropped(titleOf(view, move.cardId), nameOf(move.to.columnId)));
      try {
        const result = await onMove(move);
        if (result && 'refused' in result) {
          setOptimistic(before);
          setAnnouncement(text.refused(result.refused));
          return;
        }
        setUndoable({ cardId: move.cardId, from: move.to, to: move.from });
      } catch (e) {
        setOptimistic(before);
        setAnnouncement(text.refused(e instanceof Error ? e.message : String(e)));
      }
    },
    [view, onMove, text],
  );

  // ── the keyboard path ──
  const onCardKeyDown = (event: React.KeyboardEvent, cardId: string) => {
    const DIRECTIONS: Record<string, BoardDirection> = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowUp: 'up',
      ArrowDown: 'down',
    };
    if (event.key === 'Escape' && held) {
      event.preventDefault();
      setHeld(null);
      setAnnouncement(text.cancelled);
      return;
    }
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (!held) {
        if (!canPickUp(view, cardId)) {
          const card = view.flatMap((c) => c.cards).find((c) => c.id === cardId);
          setAnnouncement(text.refused(card?.disabledReason ?? 'this card cannot be moved'));
          return;
        }
        const at = locate(view, cardId);
        if (at) {
          setHeld({ cardId, at });
          setAnnouncement(text.pickUp);
        }
        return;
      }
      const from = locate(view, held.cardId);
      if (from) void commit({ cardId: held.cardId, from, to: held.at });
      setHeld(null);
      return;
    }
    const direction = DIRECTIONS[event.key];
    if (!direction || !held) return;
    event.preventDefault();
    const target = nextTarget(view, held.at, direction);
    if (!target) return;
    setHeld({ ...held, at: target });
    setAnnouncement(`${nameOf(target.columnId)}, ${target.index + 1}`);
  };

  // ── the pointer path ──
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const onDragEnd = (event: DragEndEvent) => {
    setDragging(null);
    const cardId = String(event.active.id);
    const over = event.over ? String(event.over.id) : null;
    if (!over) return;
    const from = locate(view, cardId);
    if (!from) return;
    // A card dropped on a column lands at its end; dropped on a card, it takes that card's place.
    const onColumn = view.find((c) => c.id === over);
    const to = onColumn ? { columnId: onColumn.id, index: onColumn.cards.length } : locate(view, over);
    if (to) void commit({ cardId, from, to });
  };

  const laneColumn = view[Math.min(lane, Math.max(view.length - 1, 0))];
  const shown = lanes ? (laneColumn ? [laneColumn] : []) : view;

  return (
    <div className="cb-board" data-motion={motion ? undefined : 'off'}>
      {lanes ? (
        <div className="cb-board__lanes" role="tablist" aria-label={text.lanes}>
          {view.map((column, i) => (
            <button
              key={column.id}
              type="button"
              role="tab"
              aria-selected={i === lane}
              className="cb-board__lane"
              onClick={() => setLane(i)}
            >
              {column.name} <span className="cb-board__count">{column.cards.length}</span>
            </button>
          ))}
        </div>
      ) : null}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={(e: DragStartEvent) => setDragging(String(e.active.id))}
        onDragCancel={() => setDragging(null)}
        onDragEnd={onDragEnd}
      >
        <div className="cb-board__surface" role="group" aria-label={ariaLabel} data-lanes={lanes ? '' : undefined}>
          {shown.map((column) => (
            <Column key={column.id} column={column} held={held} onCardKeyDown={onCardKeyDown} labels={text} />
          ))}
        </div>
        <DragOverlay>{dragging ? <div className="cb-board__card cb-board__card--lift">{cardTitle(view, dragging)}</div> : null}</DragOverlay>
      </DndContext>

      {undoable ? (
        <div className="cb-board__undo">
          <button
            type="button"
            onClick={() => {
              const move = undoable;
              setUndoable(null);
              void commit(move, text.undone);
            }}
          >
            {text.undo}
          </button>
        </div>
      ) : null}

      <div className="cb-board__live" role="status" aria-live="polite">
        {announcement}
      </div>
    </div>
  );
}

const cardTitle = (columns: BoardColumn[], cardId: string) =>
  columns.flatMap((c) => c.cards).find((c) => c.id === cardId)?.title ?? null;

/** The card's name as text, for an announcement. Falls back to the id only when the title is a node. */
const titleOf = (columns: BoardColumn[], cardId: string) => textOf(cardTitle(columns, cardId), cardId);

function Column({
  column,
  held,
  onCardKeyDown,
  labels,
}: {
  column: BoardColumn;
  held: { cardId: string; at: BoardPosition } | null;
  onCardKeyDown: (event: React.KeyboardEvent, cardId: string) => void;
  labels: BoardLabels;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const load = columnLoad(column);
  const holding = held?.at.columnId === column.id;

  return (
    <section
      ref={setNodeRef}
      className="cb-board__column"
      data-over={isOver ? '' : undefined}
      data-refuses={column.accepts === false ? '' : undefined}
      aria-label={typeof column.name === 'string' ? column.name : undefined}
    >
      <header className="cb-board__head">
        <span className="cb-board__name">{column.name}</span>
        <span className="cb-board__count" data-over-limit={load.over ? '' : undefined}>
          {typeof column.limit === 'number' ? `${load.count}/${column.limit}` : load.count}
        </span>
      </header>
      <SortableContext items={column.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <ol className="cb-board__list">
          {column.cards.map((card, index) => (
            <Card
              key={card.id}
              card={card}
              held={held?.cardId === card.id}
              marker={holding && held?.at.index === index}
              onKeyDown={onCardKeyDown}
            />
          ))}
          {holding && held.at.index >= column.cards.length ? <li className="cb-board__marker" aria-hidden /> : null}
        </ol>
      </SortableContext>
      {column.cards.length === 0 ? <div className="cb-board__empty">{column.empty ?? null}</div> : null}
      {column.accepts === false && column.refusal ? <p className="cb-board__refusal">{column.refusal}</p> : null}
      {load.over && typeof column.limit === 'number' ? (
        <p className="cb-board__over">{labels.over(load.count, column.limit)}</p>
      ) : null}
    </section>
  );
}

function Card({
  card,
  held,
  marker,
  onKeyDown,
}: {
  card: BoardColumn['cards'][number];
  held: boolean;
  marker: boolean;
  onKeyDown: (event: React.KeyboardEvent, cardId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    disabled: card.disabled,
  });

  return (
    <>
      {marker ? <li className="cb-board__marker" aria-hidden /> : null}
      <li
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        className="cb-board__card"
        data-dragging={isDragging ? '' : undefined}
        data-held={held ? '' : undefined}
        data-disabled={card.disabled ? '' : undefined}
        {...attributes}
        {...(card.disabled ? {} : listeners)}
        tabIndex={0}
        aria-roledescription="draggable card"
        aria-disabled={card.disabled || undefined}
        onKeyDown={(event) => onKeyDown(event, card.id)}
      >
        <div className="cb-board__title">{card.title}</div>
        {card.meta ? <div className="cb-board__meta">{card.meta}</div> : null}
      </li>
    </>
  );
}

/** `auto` only: matches the phone query when the browser can answer, and stays false when it cannot. */
function useNarrow(query: string | null): boolean {
  const [narrow, setNarrow] = React.useState(false);
  React.useEffect(() => {
    if (!query || typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const read = () => setNarrow(mql.matches);
    read();
    mql.addEventListener('change', read);
    return () => mql.removeEventListener('change', read);
  }, [query]);
  return narrow;
}

export const Board = Object.assign(BoardRoot, { Skeleton: BoardSkeleton });
export type { BoardSkeletonProps };
