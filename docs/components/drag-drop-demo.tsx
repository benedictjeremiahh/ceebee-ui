"use client";
import { useState } from 'react';
import { DragDropProvider, DragDropHandle, DragDropTarget, DragDropStatus } from '@ceebee/ui/client';
import { Flex } from '@ceebee/ui';

export function DragDropDemo() {
  const [rows, setRows] = useState(['Research', 'Design', 'Review']);
  return <DragDropProvider labelOf={id => id} canDrop={move => move.sourceId !== move.targetId && move.position !== 'inside'} onDrop={move => {
    setRows(current => {
      const next = current.filter(row => row !== move.sourceId);
      const at = next.indexOf(move.targetId);
      if (at < 0) return current;
      next.splice(at + (move.position === 'after' ? 1 : 0), 0, move.sourceId);
      return next;
    });
  }}><DragDropStatus idle="Drag a handle, or focus it and press Space." />
    {rows.map(row => <DragDropTarget key={row} id={row}><Flex direction="row" align="center" gap={2}>
      <DragDropHandle id={row} label={`Move ${row}`} /><span>{row}</span>
    </Flex></DragDropTarget>)}
  </DragDropProvider>;
}
