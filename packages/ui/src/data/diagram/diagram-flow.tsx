'use client';

import type { FitViewOptions, NodeTypes } from '@xyflow/react';
import { useEffect, useState, type RefObject } from 'react';
import { DiagramNodeView } from './diagram-node.js';
import { FALLBACK_CELL, FLOW_NODE_TYPE, cellSize } from './diagram.math.js';
import { shapesInUse } from './diagram.selection.js';
import type { Tone } from '../../lib/cn.js';
import type { DiagramEdge, DiagramNode, DiagramShape } from './diagram.types.js';

/* What Diagram and DiagramEditor share on top of React Flow. */

/**
 * Fit the whole diagram on open, but never below a zoom at which a label can still be read: a fourteen-stage
 * flow fitted at 0.5× drew 14px labels at 7px. Past this, the reader pans — the controls and the outline
 * still reach every node.
 */
export const FIT_VIEW: FitViewOptions = { minZoom: 0.8, padding: 0.1 };

/**
 * Scroll and a two-finger swipe pan, the way every page and trackpad does; pinch, Ctrl/⌘ + wheel and the
 * − / + / fit controls zoom (ceebee-ui#44). A wheel that zoomed fought the page the canvas sits in.
 */
export const SCROLL_PANS = { panOnScroll: true, zoomOnScroll: false, zoomOnPinch: true } as const;

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

/** A key to the node shapes the diagram draws, named by the consumer (a diamond is "Keputusan", say). */
/** One legend line: a node's shape and tone, and what it means. */
export interface DiagramLegendEntry {
  shape: DiagramShape;
  tone?: Tone;
  label: string;
}

/**
 * A key to the nodes. Given `entries`, it lists exactly those — a shape alone cannot tell a finished end
 * from a lost one when both are pills. Given only `labels`, it names the shapes the diagram draws.
 */
export function DiagramLegend({
  nodes,
  labels,
  entries: given,
}: {
  nodes: readonly DiagramNode[];
  labels?: Partial<Record<DiagramShape, string>>;
  entries?: readonly DiagramLegendEntry[];
}) {
  const entries: readonly DiagramLegendEntry[] =
    given ??
    shapesInUse(nodes).flatMap((shape) => {
      const label = labels?.[shape];
      return label ? [{ shape, label }] : [];
    });
  if (entries.length === 0) return null;
  return (
    <ul className="cb-diagram__legend">
      {entries.map(({ shape, tone, label }) => (
        <li key={`${shape}-${tone ?? ''}-${label}`} className="cb-diagram__legend-item">
          <span className="cb-diagram__legend-swatch" data-shape={shape} data-tone={tone} aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  );
}
