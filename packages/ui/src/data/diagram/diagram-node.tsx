'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';
import { createContext, useContext, type KeyboardEvent } from 'react';
import type { DiagramFlowNode } from './diagram.math.js';

/* How one node looks inside React Flow. React Flow owns the wrapper around it — focus, selection, dragging
   and its keyboard — so this is appearance and connection points only. A diamond is drawn behind the label
   rather than clipped, so the label and focus ring stay whole. Every side has a handle, and the editor
   connects in loose mode, so an arrow can leave or arrive on any side. */
/** How a node renamed in place reports back to the editor. Context, not node data, so no callback's identity
    ever churns the runtime's node store. */
export interface DiagramRenameHandlers {
  submit: (id: string, label: string) => void;
  cancel: () => void;
  /** The input's accessible name, given the node's current label. */
  inputLabel: (label: string) => string;
}
export const DiagramRenameContext = createContext<DiagramRenameHandlers | null>(null);

/** The label's in-place editor: Enter or leaving it saves, Escape cancels, an empty name is a cancel. */
function RenameInput({ id, label }: { id: string; label: string }) {
  const handlers = useContext(DiagramRenameContext);
  const finish = (value: string) => {
    const name = value.trim();
    if (!name || name === label) handlers?.cancel();
    else handlers?.submit(id, name);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // The runtime's own keys — Backspace removes the node — must not fire while a name is typed.
    event.stopPropagation();
    if (event.key === 'Enter') finish(event.currentTarget.value);
    if (event.key === 'Escape') handlers?.cancel();
  };
  return (
    <input
      className="cb-diagram__rename nodrag nopan"
      defaultValue={label}
      aria-label={handlers?.inputLabel(label) ?? label}
      autoFocus
      onFocus={(event) => event.currentTarget.select()}
      onKeyDown={onKeyDown}
      onBlur={(event) => finish(event.currentTarget.value)}
    />
  );
}

export function DiagramNodeView({ id, data, selected }: NodeProps<DiagramFlowNode>) {
  return (
    <div
      className="cb-diagram__node"
      data-shape={data.shape}
      data-tone={data.tone}
      data-selected={String(Boolean(selected))}
      data-connecting={String(data.connecting)}
    >
      <Handle id="left" type="target" position={Position.Left} className="cb-diagram__handle" isConnectable={data.connectable} />
      <Handle id="top" type="target" position={Position.Top} className="cb-diagram__handle" isConnectable={data.connectable} />
      {/* Two lines, then an ellipsis; the whole label is the tooltip and is always in the outline. */}
      {data.editing ? (
        <RenameInput id={id} label={data.label} />
      ) : (
        <span className="cb-diagram__label" title={data.label}>
          {data.label}
        </span>
      )}
      {data.content}
      <Handle id="right" type="source" position={Position.Right} className="cb-diagram__handle" isConnectable={data.connectable} />
      <Handle id="bottom" type="source" position={Position.Bottom} className="cb-diagram__handle" isConnectable={data.connectable} />
    </div>
  );
}
