import type { ReactNode } from 'react';

export type DropPosition = 'before' | 'inside' | 'after';
export interface DragDropMove { sourceId: string; targetId: string; position: DropPosition }
export interface DropData { targetId: string; position: DropPosition }
export interface DragDropLabels {
  instructions: string;
  pickup: (id: string) => string;
  describe: (move: DragDropMove) => string;
  cancelled: string;
  unavailable: string;
}
export interface DragDropProviderProps {
  children: ReactNode;
  canDrop: (move: DragDropMove) => boolean;
  onDrop: (move: DragDropMove) => void;
  labelOf: (id: string) => string;
  labels?: Partial<DragDropLabels>;
  /** Content of the lifted row that follows the pointer; the provider adds the grip. Defaults to `labelOf`. */
  renderOverlay?: (activeId: string) => ReactNode;
  /**
   * The projected move while dragging, so a consumer can open a slot by reordering its rows. Fires when a
   * different valid position is reached, keeps the last one while the pointer rests on the dragged row's own
   * slot or on an unavailable position, and fires `null` when the drag ends or is cancelled.
   */
  onPreview?: (move: DragDropMove | null) => void;
}

export function dropData(value: unknown): DropData | undefined {
  if (typeof value !== 'object' || value === null || !('targetId' in value) || typeof value.targetId !== 'string'
    || !('position' in value) || !['before', 'inside', 'after'].includes(String(value.position))) return;
  if (value.position !== 'before' && value.position !== 'inside' && value.position !== 'after') return;
  return { targetId: value.targetId, position: value.position };
}
