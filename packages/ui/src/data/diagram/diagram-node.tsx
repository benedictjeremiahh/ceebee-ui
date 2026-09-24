'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { DiagramFlowNode } from './diagram.math.js';

/* How one node looks inside React Flow. React Flow owns the wrapper around it — focus, selection, dragging
   and its keyboard — so this is appearance and connection points only. A diamond is drawn behind the label
   rather than clipped, so the label and focus ring stay whole. Every side has a handle, and the editor
   connects in loose mode, so an arrow can leave or arrive on any side. */
export function DiagramNodeView({ data, selected }: NodeProps<DiagramFlowNode>) {
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
      <span className="cb-diagram__label" title={data.label}>
        {data.label}
      </span>
      {data.content}
      <Handle id="right" type="source" position={Position.Right} className="cb-diagram__handle" isConnectable={data.connectable} />
      <Handle id="bottom" type="source" position={Position.Bottom} className="cb-diagram__handle" isConnectable={data.connectable} />
    </div>
  );
}
