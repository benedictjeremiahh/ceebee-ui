import type { ReactNode } from 'react';

/** One card on the board. `disabled` refuses movement without hiding the card. */
export interface BoardCard {
  id: string;
  title: ReactNode;
  /** Whatever a person triages by — an owner, an age, a due date, a blocked marker. */
  meta?: ReactNode;
  /** A card that cannot move: it stays visible, is not a drag source, and is skipped by the keyboard path. */
  disabled?: boolean;
  /** Why it cannot move, announced when a move is attempted on it. */
  disabledReason?: string;
}

/** One column: a state of the workflow, not a category of thing. */
export interface BoardColumn {
  id: string;
  name: ReactNode;
  cards: BoardCard[];
  /** A work-in-progress limit, shown beside the count; exceeding it marks the column, never blocks a move. */
  limit?: number;
  /** Shown when the column holds no cards. An empty column must still invite one. */
  empty?: ReactNode;
  /** A column that takes no cards — an end state, say. Dropping onto it is refused with `refusal`. */
  accepts?: boolean;
  /** Why this column refuses a card, announced and shown on an attempted drop. */
  refusal?: string;
}

/** Where a card is, or is going. `index` is its position within the column, 0-based. */
export interface BoardPosition {
  columnId: string;
  index: number;
}

/** A move the consumer is asked to validate and apply. */
export interface BoardMove {
  cardId: string;
  from: BoardPosition;
  to: BoardPosition;
}

/**
 * What the consumer answers with. Resolving accepts the move; rejecting — or resolving with a
 * `refused` reason — rolls the board back and says why.
 */
export type BoardMoveResult = void | { refused: string };

/** The shape the pure logic needs: ids and order, no React. */
export interface BoardShape {
  id: string;
  cards: { id: string; disabled?: boolean }[];
  accepts?: boolean;
}
