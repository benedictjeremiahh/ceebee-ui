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
}

export function dropData(value: unknown): DropData | undefined {
  if (typeof value !== 'object' || value === null || !('targetId' in value) || typeof value.targetId !== 'string'
    || !('position' in value) || !['before', 'inside', 'after'].includes(String(value.position))) return;
  if (value.position !== 'before' && value.position !== 'inside' && value.position !== 'after') return;
  return { targetId: value.targetId, position: value.position };
}
