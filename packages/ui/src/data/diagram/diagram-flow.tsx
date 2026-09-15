'use client';

import type { NodeTypes } from '@xyflow/react';
import { useEffect, useState, type RefObject } from 'react';
import { DiagramNodeView } from './diagram-node.js';
import { FALLBACK_CELL, FLOW_NODE_TYPE, cellSize } from './diagram.math.js';
import type { DiagramEdge, DiagramNode } from './diagram.types.js';

/* What Diagram and DiagramEditor share on top of React Flow. */

/** Stable across renders: React Flow re-mounts every node when this object changes identity. */
export const NODE_TYPES: NodeTypes = { [FLOW_NODE_TYPE]: DiagramNodeView };

/** One grid cell in pixels, read from the Token-sized element the diagram renders, so the grid follows the Skin. */
export function useCellSize(ref: RefObject<HTMLElement | null>): number {
  const [cell, setCell] = useState(FALLBACK_CELL);
  useEffect(() => {
    setCell(cellSize(ref.current?.getBoundingClientRect().width));
  }, [ref]);
  return cell;
}

/** The diagram as a list: every node with the edges leaving it. What a screen reader walks instead of the drawing. */
export function DiagramOutline({
  id,
  nodes,
  edges,
  label,
}: {
  id: string;
  nodes: readonly DiagramNode[];
  edges: readonly DiagramEdge[];
  label: string;
}) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  return (
    <ul id={id} className="cb-diagram__outline" aria-label={label}>
      {nodes.map((node) => {
        const leaving = edges.filter((e) => e.from === node.id && byId.has(e.to));
        return (
          <li key={node.id}>
            {node.label}
            {leaving.length > 0 ? (
              <ul>
                {leaving.map((edge) => (
                  <li key={edge.id}>{`→ ${byId.get(edge.to)?.label ?? ''}${edge.label ? `: ${edge.label}` : ''}`}</li>
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

/** `useId` output contains colons, which are awkward in an id reference. */
export function safeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, '');
}
