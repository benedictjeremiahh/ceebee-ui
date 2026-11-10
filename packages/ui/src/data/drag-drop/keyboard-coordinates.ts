import type { KeyboardCoordinateGetter } from '@dnd-kit/core';
import { dropData } from './types.js';

/** Navigate measured semantic zones instead of arbitrary pixel increments. */
export const dropZoneCoordinates: KeyboardCoordinateGetter = (event, { context, currentCoordinates }) => {
  if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(event.code)) return;
  event.preventDefault();
  const active = context.draggingNodeRect;
  const centerY = (context.collisionRect?.top ?? currentCoordinates.y) + (active?.height ?? 0) / 2;
  const sourceId = context.active ? String(context.active.id) : undefined;
  // The dragged row's own slot is a resting place, not a destination: arrows step over it.
  const zones = context.droppableContainers.getEnabled().flatMap(container => {
    if (dropData(container.data.current)?.targetId === sourceId) return [];
    const rect = context.droppableRects.get(container.id);
    return rect ? [{ rect, y: rect.top + rect.height / 2 }] : [];
  }).sort((a, b) => a.y - b.y);
  const forwards = event.code === 'ArrowDown' || event.code === 'ArrowRight';
  const target = forwards ? zones.find(zone => zone.y > centerY + 1)
    : [...zones].reverse().find(zone => zone.y < centerY - 1);
  if (!target) return;
  return {
    x: target.rect.left + target.rect.width / 2 - (active?.width ?? 0) / 2,
    y: target.y - (active?.height ?? 0) / 2,
  };
};
