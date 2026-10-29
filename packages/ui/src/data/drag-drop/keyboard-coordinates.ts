import type { KeyboardCoordinateGetter } from '@dnd-kit/core';

/** Navigate measured semantic zones instead of arbitrary pixel increments. */
export const dropZoneCoordinates: KeyboardCoordinateGetter = (event, { context, currentCoordinates }) => {
  if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(event.code)) return;
  event.preventDefault();
  const active = context.draggingNodeRect;
  const centerY = (context.collisionRect?.top ?? currentCoordinates.y) + (active?.height ?? 0) / 2;
  const zones = context.droppableContainers.getEnabled().flatMap(container => {
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
