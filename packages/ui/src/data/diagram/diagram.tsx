'use client';

import { Background, ConnectionMode, Controls, ReactFlow, type ReactFlowProps } from '@xyflow/react';
import { useId, useMemo, useRef } from 'react';
import { DiagramLegend, type DiagramLegendEntry, DiagramOutline, FIT_VIEW, NODE_TYPES, safeId, useCellSize } from './diagram-flow.js';
import { toFlowEdges, toFlowNodes } from './diagram.math.js';
import { DiagramSkeleton, type DiagramSkeletonProps } from './diagram.skeleton.js';
import type { DiagramEdge, DiagramNode, DiagramShape } from './diagram.types.js';

export interface DiagramProps {
  /** Accessible name for the diagram viewport. */
  label: string;
  nodes: readonly DiagramNode[];
  edges: readonly DiagramEdge[];
  hint?: string;
  /** Accessible name for the list a screen reader walks instead of the drawing. */
  outlineLabel?: string;
  /** Localised names for the substrate's own controls and descriptions. */
  ariaLabels?: ReactFlowProps['ariaLabelConfig'];
  /** Names for the node shapes in use; given, a legend lists the shapes the diagram draws. */
  legendLabels?: Partial<Record<DiagramShape, string>>;
  /** An explicit legend — shape, tone and meaning — for a diagram whose shapes alone do not tell nodes apart. */
  legend?: readonly DiagramLegendEntry[];
  /**
   * The smallest zoom the opening fit may use. Defaults to a readable 0.8, which pans a long diagram; an
   * overview that must show the whole thing at once (a process map) passes something lower.
   */
  fitMinZoom?: number;
}

/**
 * A read-only drawing of nodes joined by arrows, on the React Flow runtime. Pan and zoom are the
 * viewport's; nothing in the drawing is focusable, draggable or selectable. The diagram is also given as an
 * outline list, which the viewport is described by.
 */
function DiagramRoot({ label, nodes, edges, hint, outlineLabel = 'Diagram outline', ariaLabels, legendLabels, legend, fitMinZoom }: DiagramProps) {
  const fitView = useMemo(() => (fitMinZoom === undefined ? FIT_VIEW : { ...FIT_VIEW, minZoom: fitMinZoom }), [fitMinZoom]);
  const base = safeId(useId());
  const cellRef = useRef<HTMLSpanElement>(null);
  const cell = useCellSize(cellRef);
  const flowNodes = useMemo(() => toFlowNodes(nodes, cell, { connectable: false }), [nodes, cell]);
  const flowEdges = useMemo(() => toFlowEdges(edges, nodes), [edges, nodes]);

  return (
    <div className="cb-diagram">
      <span ref={cellRef} className="cb-diagram__cell" aria-hidden="true" />
      {hint ? <p className="cb-diagram__hint">{hint}</p> : null}
      <div className="cb-diagram__viewport" role="region" aria-label={label} aria-describedby={`${base}-outline`}>
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={NODE_TYPES}
          connectionMode={ConnectionMode.Loose}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          fitView
          fitViewOptions={fitView}
          minZoom={Math.min(0.5, fitMinZoom ?? 0.5)}
          maxZoom={2}
          ariaLabelConfig={ariaLabels}
        >
          <Background gap={cell} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
      {legend || legendLabels ? <DiagramLegend nodes={nodes} labels={legendLabels} entries={legend} /> : null}
      <DiagramOutline id={`${base}-outline`} nodes={nodes} edges={edges} label={outlineLabel} />
    </div>
  );
}

export const Diagram = Object.assign(DiagramRoot, { Skeleton: DiagramSkeleton });
export type { DiagramSkeletonProps };
