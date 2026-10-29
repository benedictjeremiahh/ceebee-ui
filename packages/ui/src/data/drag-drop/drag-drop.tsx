'use client';

import { createContext, useContext, useId, useState, useRef, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, MeasuringStrategy,
  pointerWithin, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
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
}
const Context = createContext<State | null>(null);
const allPositions: readonly DropPosition[] = ['before', 'inside', 'after'];
const adjacentPositions: readonly DropPosition[] = ['before', 'after'];

export function DragDropProvider({ children, canDrop, onDrop, labelOf, labels }: DragDropProviderProps) {
  const id = useId();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [move, setMove] = useState<DragDropMove | null>(null);
  const text: DragDropLabels = {
    instructions: 'Press Space or Enter to pick up. Use arrow keys to choose a position. Press Space or Enter to drop, or Escape to cancel.',
    pickup: source => `Picked up ${labelOf(source)}.`,
    describe: intent => `${labelOf(intent.sourceId)} ${intent.position} ${labelOf(intent.targetId)}.`,
    cancelled: 'Move cancelled.', unavailable: 'This position is unavailable.', ...labels,
  };
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: dropZoneCoordinates, scrollBehavior: 'auto' }));
  const intentOf = (event: Pick<DragEndEvent, 'active' | 'over'>): DragDropMove | null => {
    const data = dropData(event.over?.data.current);
    const candidate = data ? { sourceId: String(event.active.id), ...data } : null;
    return candidate && canDrop(candidate) ? candidate : null;
  };
  const finish = () => { setActiveId(null); setMove(null); };
  return <Context.Provider value={{ activeId, move, canDrop, describe: text.describe, unavailable: text.unavailable }}>
    <DragActiveContext.Provider value={activeId !== null}><DndContext id={id} sensors={sensors} measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      collisionDetection={args => pointerWithin({ ...args, pointerCoordinates: args.pointerCoordinates ?? {
        x: args.collisionRect.left + args.collisionRect.width / 2,
        y: args.collisionRect.top + args.collisionRect.height / 2,
      } })}
      accessibility={{ restoreFocus: true, screenReaderInstructions: { draggable: text.instructions }, announcements: {
        onDragStart: event => text.pickup(String(event.active.id)),
        onDragOver: event => { const intent = intentOf(event); return intent ? text.describe(intent) : text.unavailable; },
        onDragEnd: event => { const intent = intentOf(event); return intent ? text.describe(intent) : text.cancelled; },
        onDragCancel: () => text.cancelled,
      } }}
      onDragStart={event => setActiveId(String(event.active.id))}
      onDragOver={event => setMove(intentOf(event))}
      onDragCancel={finish}
      onDragEnd={event => { const intent = intentOf(event); finish(); if (intent) onDrop(intent); }}>
      {children}
      {typeof document !== 'undefined' ? createPortal(<div className="cb-drag-drop__portal"><DragOverlay dropAnimation={null} style={{ width: 'max-content', height: 'auto' }}>
        {activeId ? <div className="cb-drag-drop__overlay">{labelOf(activeId)}</div> : null}
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
  const disabled = !context?.activeId || !context.canDrop({ sourceId: context.activeId, targetId: id, position });
  const { setNodeRef } = useDroppable({ id: `drop:${encodeURIComponent(id)}:${position}`, disabled,
    data: { targetId: id, position } });
  return <span ref={setNodeRef} className="cb-drag-drop__zone" data-position={position} data-active={active || undefined} aria-hidden="true" />;
}

export function DragDropTarget({ id, children, inside = false, insideOnly = false, className }: {
  id: string; children: ReactNode; inside?: boolean; insideOnly?: boolean; className?: string;
}) {
  const context = useContext(Context);
  const positions = insideOnly ? ['inside'] as const : inside ? allPositions : adjacentPositions;
  const position = context?.move?.targetId === id ? context.move.position : undefined;
  return <div className={['cb-drag-drop__target', className].filter(Boolean).join(' ')} data-zones={insideOnly ? 'one' : inside ? 'three' : 'two'} data-drop={position}>
    {children}{positions.map(candidate => <DropZone key={candidate} id={id} position={candidate} active={position === candidate} />)}
  </div>;
}

export function DragDropStatus({ idle, renderMove }: { idle: string; renderMove?: (move: DragDropMove) => ReactNode }) {
  const context = useContext(Context);
  return <div className="cb-drag-drop__status">{context?.activeId ? context.move ? renderMove?.(context.move) ?? context.describe(context.move) : context.unavailable : idle}</div>;
}
