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
import {
  applyMove,
  canPickUp,
  columnLoad,
  hiddenEdges,
  isNoop,
  locate,
  nextTarget,
  refusalFor,
  type BoardDirection,
  type BoardOverflow,
} from './board.math.js';
import type { BoardColumn, BoardMove, BoardMoveResult, BoardPosition } from './board.types.js';
import './board.css';

export interface BoardLabels {
  pickUp: string;
  dropped: (card: string, column: string) => string;
  cancelled: string;
  refused: (reason: string) => string;
  undo: string;
  /** The drag handle's accessible name, when cards carry their own actions. */
  move: (card: string) => string;
  undone: string;
  lanes: string;
  over: (count: number, limit: number) => string;
  /** The control that scrolls a board wider than its page back by one column. */
  scrollBack: string;
  /** The control that scrolls it on by one column. */
  scrollOn: string;
  /** The control that opens a column the consumer kept as a strip (ceebee-ui#25). */
  expand: (column: string) => string;
  /** The control that returns an opened column to its strip. */
  collapse: (column: string) => string;
  /** The footer action that adds a card to the named column (ceebee-ui#21). Takes the column's name. */
  addCard: (column: string) => string;
}

const DEFAULTS: BoardLabels = {
  pickUp: 'Picked up. Use the arrow keys to move it, Space to drop, Escape to cancel.',
  dropped: (card, column) => `${card} moved to ${column}.`,
  cancelled: 'Move cancelled.',
  refused: (reason) => `Move refused: ${reason}`,
  undo: 'Undo',
  move: (card) => `Move ${card}`,
  undone: 'Move undone.',
  lanes: 'Column',
  over: (count, limit) => `${count} of ${limit}, over the limit`,
  scrollBack: 'Scroll back one column',
  scrollOn: 'Scroll on one column',
  expand: (column) => `Show ${column}`,
  collapse: (column) => `Collapse ${column}`,
  addCard: (column) => `Add a card to ${column}`,
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
  /**
   * Put the grab on a handle instead of the whole card. Use it whenever a card carries its own
   * buttons: a card that is itself a control has **presentational children**, so anything
   * interactive inside it disappears from the accessibility tree. With a handle the card is plain
   * markup, its buttons stay reachable, and the handle is the one thing that drags and takes the
   * keyboard.
   */
  handle?: boolean;
  /**
   * Open a card. When given, the card's **title** becomes a button, so the card front can be a title and
   * small badges rather than a row of action buttons — the shape a Trello board has. The open lives on the
   * title, never the whole card: a card that is itself a control has presentational children, so the
   * `meta` buttons would leave the accessibility tree (the reason `handle` exists at all). Enter and Space
   * activate the open button natively; the drag keeps its own path — Space picks up on the handle (with
   * `handle`) or on the card, so the two do not share a key.
   */
  onCardOpen?: (cardId: string) => void;
  /**
   * Add a card to a column, from that column. Given it, every column that takes cards grows a footer
   * action naming itself — so work is added where a person is looking rather than from a toolbar and a
   * dialog that asks the destination again (ceebee-ui#21). What it opens is the consumer's.
   */
  onAddCard?: (columnId: string) => void;
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
  handle = false,
  onCardOpen,
  onAddCard,
  'aria-label': ariaLabel = 'Board',
}: BoardProps) {
  const text = { ...DEFAULTS, ...labels };
  const [optimistic, setOptimistic] = React.useState<BoardColumn[] | null>(null);
  const [held, setHeld] = React.useState<{ cardId: string; at: BoardPosition } | null>(null);
  const [dragging, setDragging] = React.useState<string | null>(null);
  const [announcement, setAnnouncement] = React.useState('');
  const [undoable, setUndoable] = React.useState<BoardMove | null>(null);
  const [lane, setLane] = React.useState(0);
  // Which strips a reader has opened. Which columns *may* collapse is the consumer's, but whether one is
  // open this minute is a view state, and a board that asked the consumer to hold it would make opening a
  // column a round trip through a product that has nothing to say about it.
  const [opened, setOpened] = React.useState<readonly string[]>([]);
  const surfaceRef = React.useRef<HTMLDivElement | null>(null);
  // Which edges hide a column. Measured rather than derived: it depends on the container's width, how many
  // columns there are, and the kit's own column width — and this component owns none of the three.
  const [overflow, setOverflow] = React.useState<BoardOverflow | null>(null);

  // The board shown is the optimistic one while a move is in flight, so a card does not jump back and
  // forth on a slow consumer; props win again the moment the consumer answers.
  const view = optimistic ?? columns;
  React.useEffect(() => setOptimistic(null), [columns]);

  const narrow = useMediaQuery(layout === 'auto' ? phoneQuery : null);
  const lanes = layout === 'lanes' || (layout === 'auto' && narrow);
  const calm = useMediaQuery('(prefers-reduced-motion: reduce)');
  const still = !motion || calm;

  /**
   * One column, plus the gap beside it, read off the DOM. Scrolling by the surface's own width would skip
   * columns on a wide screen, and a constant would drift the moment the kit retunes its spacing.
   */
  const step = (direction: -1 | 1) => {
    const surface = surfaceRef.current;
    if (!surface) return;
    const [first, second] = Array.from(surface.querySelectorAll<HTMLElement>('.cb-board__column'));
    const by = second && first ? second.offsetLeft - first.offsetLeft : (first?.offsetWidth ?? surface.clientWidth);
    if (typeof surface.scrollBy !== 'function') return;
    surface.scrollBy({ left: by * direction, behavior: still ? 'auto' : 'smooth' });
  };

  // Re-measured on scroll, when the surface is resized, and whenever the columns change — a card added to
  // the last column can be what makes the one past it reachable, or the reverse.
  React.useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface || lanes) {
      setOverflow(null);
      return;
    }
    const read = () => setOverflow(hiddenEdges(surface));
    read();
    surface.addEventListener('scroll', read, { passive: true });
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(read) : null;
    observer?.observe(surface);
    return () => {
      surface.removeEventListener('scroll', read);
      observer?.disconnect();
    };
  }, [lanes, view]);

  const nameOf = (columnId: string) => {
    const column = view.find((c) => c.id === columnId);
    return column?.label ?? textOf(column?.name, columnId);
  };

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

      {/*
        The frame is the board's chrome, laid over the surface rather than inside it: the scroll controls
        and the edge shade are not content, so they must not join what the group announces, and the shade
        must not scroll away from the edge it is pointing past.
      */}
      <div className="cb-board__frame" data-overflow={!lanes && overflow ? overflow : undefined}>
        {!lanes && (overflow === 'start' || overflow === 'both') ? (
          <button
            type="button"
            className="cb-board__scroll cb-board__scroll--back"
            aria-label={text.scrollBack}
            onClick={() => step(-1)}
          >
            ‹
          </button>
        ) : null}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={(e: DragStartEvent) => setDragging(String(e.active.id))}
          onDragCancel={() => setDragging(null)}
          onDragEnd={onDragEnd}
        >
          <div ref={surfaceRef} className="cb-board__surface" role="group" aria-label={ariaLabel} data-lanes={lanes ? '' : undefined}>
            {shown.map((column) => (
              <Column
                key={column.id}
                column={column}
                held={held}
                onCardKeyDown={onCardKeyDown}
                labels={text}
                handle={handle}
                onCardOpen={onCardOpen}
                open={opened.includes(column.id)}
                onOpenChange={(open) =>
                  setOpened((current) =>
                    open ? [...current, column.id] : current.filter((id) => id !== column.id),
                  )
                }
                onAddCard={onAddCard}
              />
            ))}
          </div>
          <DragOverlay>{dragging ? <div className="cb-board__card cb-board__card--lift">{cardTitle(view, dragging)}</div> : null}</DragOverlay>
        </DndContext>
        {!lanes && (overflow === 'end' || overflow === 'both') ? (
          <button
            type="button"
            className="cb-board__scroll cb-board__scroll--on"
            aria-label={text.scrollOn}
            onClick={() => step(1)}
          >
            ›
          </button>
        ) : null}
      </div>

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
const titleOf = (columns: BoardColumn[], cardId: string) => {
  const card = columns.flatMap((c) => c.cards).find((c) => c.id === cardId);
  return card?.label ?? textOf(card?.title, cardId);
};

function Column({
  column,
  held,
  onCardKeyDown,
  labels,
  handle,
  onCardOpen,
  open,
  onOpenChange,
  onAddCard,
}: {
  column: BoardColumn;
  held: { cardId: string; at: BoardPosition } | null;
  onCardKeyDown: (event: React.KeyboardEvent, cardId: string) => void;
  labels: BoardLabels;
  handle: boolean;
  onCardOpen?: (cardId: string) => void;
  /** Whether the reader has opened this column. A collapsed column ignores it until they have. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Present when the board was given one. A column that refuses cards never offers it. */
  onAddCard?: (columnId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const load = columnLoad(column);
  const holding = held?.at.columnId === column.id;
  const name = column.label ?? textOf(column.name, column.id);

  // The strip is still the column: it stays a drop target and keeps its count, because a column nobody has
  // opened is exactly the sort of place a card is about to be sent.
  if (column.collapsed === true && !open) {
    return (
      <section ref={setNodeRef} className="cb-board__column" data-strip="" data-over={isOver ? '' : undefined}>
        <button type="button" className="cb-board__strip" aria-label={labels.expand(name)} onClick={() => onOpenChange(true)}>
          <span className="cb-board__strip-name" aria-hidden>
            {column.name}
          </span>
          <span className="cb-board__count" data-over-limit={load.over ? '' : undefined}>
            {typeof column.limit === 'number' ? `${load.count}/${column.limit}` : load.count}
          </span>
        </button>
      </section>
    );
  }

  return (
    <section
      ref={setNodeRef}
      className="cb-board__column"
      data-over={isOver ? '' : undefined}
      data-refuses={column.accepts === false ? '' : undefined}
      aria-label={column.label ?? (typeof column.name === 'string' ? column.name : undefined)}
    >
      <header className="cb-board__head">
        <span className="cb-board__name">{column.name}</span>
        <span className="cb-board__count" data-over-limit={load.over ? '' : undefined}>
          {typeof column.limit === 'number' ? `${load.count}/${column.limit}` : load.count}
        </span>
        {column.collapsed === true ? (
          <button type="button" className="cb-board__collapse" aria-label={labels.collapse(name)} onClick={() => onOpenChange(false)}>
            ‹
          </button>
        ) : null}
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
              handle={handle}
              onCardOpen={onCardOpen}
              labels={labels}
            />
          ))}
          {holding && held.at.index >= column.cards.length ? <li className="cb-board__marker" aria-hidden /> : null}
        </ol>
      </SortableContext>
      {/* A footer, after the cards, so it stays put as they are added — and only where a card can land,
          because a column that refuses them has nothing to invite. It names its column, so a screen reader
          hears as many different actions as there are columns rather than "Add" repeated. */}
      {onAddCard && column.accepts !== false ? (
        <button type="button" className="cb-board__add" onClick={() => onAddCard(column.id)}>
          {labels.addCard(name)}
        </button>
      ) : null}
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
  handle,
  onCardOpen,
  labels,
}: {
  card: BoardColumn['cards'][number];
  held: boolean;
  marker: boolean;
  onKeyDown: (event: React.KeyboardEvent, cardId: string) => void;
  handle: boolean;
  onCardOpen?: (cardId: string) => void;
  labels: BoardLabels;
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
        data-handle={handle ? '' : undefined}
        {...(handle
          ? {}
          : {
              ...attributes,
              ...(card.disabled ? {} : listeners),
              tabIndex: 0,
              'aria-roledescription': 'draggable card',
              'aria-disabled': card.disabled || undefined,
              onKeyDown: (event: React.KeyboardEvent) => onKeyDown(event, card.id),
            })}
      >
        {handle ? (
          <button
            type="button"
            className="cb-board__handle"
            {...attributes}
            {...(card.disabled ? {} : listeners)}
            aria-label={labels.move(card.label ?? (typeof card.title === 'string' ? card.title : card.id))}
            aria-roledescription="drag handle"
            aria-disabled={card.disabled || undefined}
            disabled={card.disabled}
            onKeyDown={(event) => onKeyDown(event, card.id)}
          >
            <span aria-hidden>⠿</span>
          </button>
        ) : null}
        {onCardOpen ? (
          <button
            type="button"
            className="cb-board__title cb-board__open"
            onClick={() => onCardOpen(card.id)}
            disabled={card.disabled}
            aria-label={typeof card.title === 'string' ? undefined : (card.label ?? card.id)}
            // Enter/Space activate this button (open). Without a handle the card itself also answers those
            // keys with pick-up, and a keydown on a focused child bubbles — so the card's move path is
            // stopped here and the open stands alone. Arrows still bubble, so a held card still moves.
            onKeyDown={(event) => {
              if (event.key === ' ' || event.key === 'Enter') event.stopPropagation();
            }}
          >
            {card.title}
          </button>
        ) : (
          <div className="cb-board__title">{card.title}</div>
        )}
        {card.meta ? <div className="cb-board__meta">{card.meta}</div> : null}
      </li>
    </>
  );
}

/** A media query's answer, or false wherever the browser cannot answer one — a server render, a test DOM. */
function useMediaQuery(query: string | null): boolean {
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
