'use client';

import { createContext, useContext, useId, useState, useRef, useEffect, useLayoutEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, MeasuringStrategy,
  pointerWithin, useDndContext, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';
import { Tooltip } from '../../overlay/tooltip.js';
import { dropZoneCoordinates } from './keyboard-coordinates.js';
import './drag-drop.css';
import { DragActiveContext } from '../../lib/drag-active.js';
import { dropData, type DragDropLabels, type DragDropMove, type DragDropProviderProps, type DropPosition } from './types.js';

interface State {
  activeId: string | null;
  move: DragDropMove | null;
  canDrop: DragDropProviderProps['canDrop'];
  describe: DragDropLabels['describe'];
  unavailable: string;
  /** The consumer reorders its rows to open the slot, so zone indicators would point at moving rows. */
  previewing: boolean;
}
const Context = createContext<State | null>(null);
const allPositions: readonly DropPosition[] = ['before', 'inside', 'after'];
const adjacentPositions: readonly DropPosition[] = ['before', 'after'];

/**
 * Edge-only auto-scroll. The runtime default (a fifth of the scroll container, fast acceleration) scrolls the
 * page whenever a row low in the viewport is nudged, so the pointer lands on a row far from the one aimed at.
 */
export const dragDropAutoScroll = { threshold: { x: 0, y: 0.08 }, acceleration: 2 } as const;

function sameMove(a: DragDropMove | null, b: DragDropMove | null): boolean {
  return a === b || (a !== null && b !== null && a.sourceId === b.sourceId && a.targetId === b.targetId && a.position === b.position);
}

/** Re-measure drop zones after the consumer moves rows (immediately, and again once their transitions settle). */
function PreviewMeasurer({ active, signal }: { active: boolean; signal: unknown }) {
  const { measureDroppableContainers } = useDndContext();
  useLayoutEffect(() => { if (active) measureDroppableContainers([]); }, [active, signal, measureDroppableContainers]);
  useEffect(() => {
    if (!active) return;
    const settle = () => measureDroppableContainers([]);
    document.addEventListener('transitionend', settle);
    document.addEventListener('transitioncancel', settle);
    return () => { document.removeEventListener('transitionend', settle); document.removeEventListener('transitioncancel', settle); };
  }, [active, measureDroppableContainers]);
  return null;
}

export function DragDropProvider({ children, canDrop, onDrop, labelOf, labels, renderOverlay, onPreview }: DragDropProviderProps) {
  const id = useId();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [move, setMove] = useState<DragDropMove | null>(null);
  const preview = useRef<DragDropMove | null>(null);
  // The runtime announces a drop after onDragEnd has cleared the preview, so the dropped move is kept for it.
  const dropped = useRef<DragDropMove | null>(null);
  const previewing = onPreview !== undefined;
  const text: DragDropLabels = {
    instructions: 'Press Space or Enter to pick up. Use arrow keys to choose a position. Press Space or Enter to drop, or Escape to cancel.',
    pickup: source => `Picked up ${labelOf(source)}.`,
    describe: intent => `${labelOf(intent.sourceId)} ${intent.position} ${labelOf(intent.targetId)}.`,
    cancelled: 'Move cancelled.', unavailable: 'This position is unavailable.', ...labels,
  };
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: dropZoneCoordinates, scrollBehavior: 'auto' }));
  /** A valid move under the pointer; over the dragged row's own slot, the move already previewed there. */
  const intentOf = (event: Pick<DragEndEvent, 'active' | 'over'>): DragDropMove | null => {
    const data = dropData(event.over?.data.current);
    if (!data) return null;
    const sourceId = String(event.active.id);
    if (data.targetId === sourceId) return previewing ? preview.current : null;
    const candidate = { sourceId, ...data };
    return canDrop(candidate) ? candidate : null;
  };
  const showPreview = (next: DragDropMove | null) => {
    if (sameMove(preview.current, next)) return;
    preview.current = next;
    onPreview?.(next);
  };
  const finish = () => { setActiveId(null); setMove(null); showPreview(null); };
  useEffect(() => {
    if (activeId === null) return;
    document.documentElement.setAttribute('data-cb-drag-drop-active', '');
    return () => document.documentElement.removeAttribute('data-cb-drag-drop-active');
  }, [activeId]);
  return <Context.Provider value={{ activeId, move, canDrop, describe: text.describe, unavailable: text.unavailable, previewing }}>
    <DragActiveContext.Provider value={activeId !== null}><DndContext id={id} sensors={sensors} autoScroll={dragDropAutoScroll}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      collisionDetection={args => pointerWithin({ ...args, pointerCoordinates: args.pointerCoordinates ?? {
        x: args.collisionRect.left + args.collisionRect.width / 2,
        y: args.collisionRect.top + args.collisionRect.height / 2,
      } })}
      accessibility={{ restoreFocus: true, screenReaderInstructions: { draggable: text.instructions }, announcements: {
        onDragStart: event => text.pickup(String(event.active.id)),
        onDragOver: event => { const intent = intentOf(event); return intent ? text.describe(intent) : text.unavailable; },
        onDragEnd: () => dropped.current ? text.describe(dropped.current) : text.cancelled,
        onDragCancel: () => text.cancelled,
      } }}
      onDragStart={event => { preview.current = null; dropped.current = null; setActiveId(String(event.active.id)); }}
      onDragOver={event => {
        const intent = intentOf(event);
        setMove(intent);
        // Keep the open slot while the pointer rests on it or crosses an unavailable position: clearing it would
        // move the rows back under the pointer and make the slot oscillate.
        if (intent) showPreview(intent);
      }}
      onDragCancel={finish}
      onDragEnd={event => { const intent = intentOf(event); dropped.current = intent; finish(); if (intent) onDrop(intent); }}>
      {children}
      {previewing ? <PreviewMeasurer active={activeId !== null} signal={children} /> : null}
      {typeof document !== 'undefined' ? createPortal(<div className="cb-drag-drop__portal"><DragOverlay dropAnimation={null} style={{ width: 'max-content', height: 'auto' }}>
        {activeId ? <div className="cb-drag-drop__overlay" data-lifted={renderOverlay ? '' : undefined}>
          {renderOverlay ? <><GripVertical aria-hidden="true" className="cb-drag-drop__overlay-grip" />{renderOverlay(activeId)}</> : labelOf(activeId)}
        </div> : null}
      </DragOverlay></div>, document.body) : null}
    </DndContext></DragActiveContext.Provider>
  </Context.Provider>;
}

export function DragDropHandle({ id, label, disabled = false, tabIndex, focusRequest }: {
  id: string; label: string; disabled?: boolean; tabIndex?: number; focusRequest?: number;
}) {
  const button = useRef<HTMLButtonElement | null>(null);
  useEffect(() => { if (focusRequest !== undefined) button.current?.focus({ preventScroll: true }); }, [focusRequest]);
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, isDragging } = useDraggable({ id, disabled });
  return <Tooltip title={label} open={isDragging ? false : undefined} trigger={['hover', 'focus']}><button ref={node => { button.current = node; setNodeRef(node); setActivatorNodeRef(node); }}
    type="button" className="cb-drag-drop__handle" {...attributes} {...listeners} tabIndex={tabIndex ?? 0} disabled={disabled}
    aria-label={label} data-dragging={isDragging || undefined}>
    <GripVertical aria-hidden="true" />
  </button></Tooltip>;
}

function DropZone({ id, position, active }: { id: string; position: DropPosition; active: boolean }) {
  const context = useContext(Context);
  // The dragged row's own slot stays collidable while previewing so a drop on it commits the previewed move.
  const disabled = !context?.activeId || (context.activeId === id ? !context.previewing
    : !context.canDrop({ sourceId: context.activeId, targetId: id, position }));
  // One record may expose several drop surfaces (e.g. every cell of a table row): each zone instance needs its own
  // droppable id; the destination is read from `data`, so all surfaces of one record resolve to the same move.
  const instance = useId();
  const { setNodeRef } = useDroppable({ id: `drop:${encodeURIComponent(id)}:${position}:${instance}`, disabled,
    data: { targetId: id, position } });
  return <span ref={setNodeRef} className="cb-drag-drop__zone" data-position={position} data-active={active || undefined} aria-hidden="true" />;
}

export function DragDropTarget({ id, children, inside = false, insideOnly = false, className }: {
  id: string; children: ReactNode; inside?: boolean; insideOnly?: boolean; className?: string;
}) {
  const context = useContext(Context);
  const positions = insideOnly ? ['inside'] as const : inside ? allPositions : adjacentPositions;
  const position = !context?.previewing && context?.move?.targetId === id ? context.move.position : undefined;
  return <div className={['cb-drag-drop__target', className].filter(Boolean).join(' ')} data-zones={insideOnly ? 'one' : inside ? 'three' : 'two'} data-drop={position}>
    {children}{positions.map(candidate => <DropZone key={candidate} id={id} position={candidate} active={position === candidate} />)}
  </div>;
}

export function DragDropStatus({ idle, renderMove }: { idle: string; renderMove?: (move: DragDropMove) => ReactNode }) {
  const context = useContext(Context);
  return <div className="cb-drag-drop__status">{context?.activeId ? context.move ? renderMove?.(context.move) ?? context.describe(context.move) : context.unavailable : idle}</div>;
}
