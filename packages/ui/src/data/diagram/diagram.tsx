'use client';

import { Background, ConnectionMode, ControlButton, Controls, ReactFlow, type Edge, type Node, type ReactFlowProps } from '@xyflow/react';
import { Tooltip } from 'antd';
import { Maximize2 } from 'lucide-react';
import { useCallback, useId, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { DiagramLegend, type DiagramLegendEntry, DiagramOutline, FIT_VIEW, NODE_TYPES, safeId, useCellSize, SCROLL_PANS } from './diagram-flow.js';
import { toFlowEdges, toFlowNodes } from './diagram.math.js';
import { DiagramSkeleton, type DiagramSkeletonProps } from './diagram.skeleton.js';
import { describeSelection, type DiagramSelection, type DiagramSelectionTarget } from './diagram.selection.js';
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
  /**
   * Offers a maximize control among the canvas's own controls — the corner where that glyph is the
   * convention, so it may be icon-only. Its tooltip, shown on hover and keyboard focus, and its accessible
   * name are `maximizeLabel`.
   */
  onMaximize?: () => void;
  maximizeLabel?: string;
  /**
   * Opt-in reading panel beside the canvas (below it on a narrow screen), the same one DiagramEditor offers.
   * Given, a node or edge can be chosen by click, or by focusing it and pressing Enter or Space, and the panel
   * renders what is chosen in a person's terms; `null` when nothing is, so render a hint then. Without it the
   * drawing stays inert.
   */
  renderInspector?: (selection: DiagramSelection | null) => ReactNode;
  /** Accessible name for the inspector panel. */
  inspectorLabel?: string;
}

function targetOf(element: EventTarget | null): DiagramSelectionTarget {
  if (!(element instanceof Element)) return null;
  const node = element.closest('.react-flow__node')?.getAttribute('data-id');
  if (node) return { kind: 'node', id: node };
  const edge = element.closest('.react-flow__edge')?.getAttribute('data-id');
  return edge ? { kind: 'edge', id: edge } : null;
}

/**
 * A read-only drawing of nodes joined by arrows, on the React Flow runtime. Pan and zoom are the
 * viewport's; nothing in the drawing is draggable or editable. Without `renderInspector` nothing is focusable
 * or selectable either; with it, a node or edge can be chosen to read about it. The diagram is also given as an
 * outline list, which the viewport is described by.
 */
function DiagramRoot({
  label, nodes, edges, hint, outlineLabel = 'Diagram outline', ariaLabels, legendLabels, legend, fitMinZoom, onMaximize,
  maximizeLabel = 'Maximize', renderInspector, inspectorLabel = 'Selection',
}: DiagramProps) {
  const fitView = useMemo(() => (fitMinZoom === undefined ? FIT_VIEW : { ...FIT_VIEW, minZoom: fitMinZoom }), [fitMinZoom]);
  const base = safeId(useId());
  const cellRef = useRef<HTMLSpanElement>(null);
  const cell = useCellSize(cellRef);
  const inspecting = Boolean(renderInspector);
  const [inspected, setInspected] = useState<DiagramSelectionTarget>(null);
  const selectedId = inspected?.kind === 'node' ? inspected.id : null;
  const flowNodes = useMemo(() => toFlowNodes(nodes, cell, { connectable: false, selectedId }), [nodes, cell, selectedId]);
  const flowEdges = useMemo(() => toFlowEdges(edges, nodes), [edges, nodes]);
  const selection = useMemo(() => describeSelection(inspected, nodes, edges), [inspected, nodes, edges]);

  const onNodeClick = useCallback((_: MouseEvent, node: Node) => setInspected({ kind: 'node', id: node.id }), []);
  const onEdgeClick = useCallback((_: MouseEvent, edge: Edge) => setInspected({ kind: 'edge', id: edge.id }), []);
  const onPaneClick = useCallback(() => setInspected(null), []);
  const onKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const target = targetOf(event.target);
    if (!target) return;
    event.preventDefault();
    setInspected(target);
  }, []);

  return (
    <div className="cb-diagram" data-inspector={inspecting ? 'true' : undefined}>
      <span ref={cellRef} className="cb-diagram__cell" aria-hidden="true" />
      {hint ? <p className="cb-diagram__hint">{hint}</p> : null}
      <div className="cb-diagram__body">
      <div className="cb-diagram__viewport" role="region" aria-label={label} aria-describedby={`${base}-outline`}>
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={NODE_TYPES}
          connectionMode={ConnectionMode.Loose}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          nodesFocusable={inspecting}
          edgesFocusable={inspecting}
          {...(inspecting ? { onNodeClick, onEdgeClick, onPaneClick, onKeyDown } : {})}
          {...SCROLL_PANS}
          fitView
          fitViewOptions={fitView}
          minZoom={Math.min(0.5, fitMinZoom ?? 0.5)}
          maxZoom={2}
          ariaLabelConfig={ariaLabels}
        >
          <Background gap={cell} />
          <Controls showInteractive={false}>
            {onMaximize ? (
              <Tooltip title={maximizeLabel} trigger={['hover', 'focus']} placement="right">
                <ControlButton onClick={onMaximize} aria-label={maximizeLabel} title={maximizeLabel}>
                  <Maximize2 aria-hidden="true" />
                </ControlButton>
              </Tooltip>
            ) : null}
          </Controls>
        </ReactFlow>
      </div>
      {renderInspector ? (
        <aside className="cb-diagram__inspector" aria-label={inspectorLabel}>
          {renderInspector(selection)}
        </aside>
      ) : null}
      </div>
      {legend || legendLabels ? <DiagramLegend nodes={nodes} labels={legendLabels} entries={legend} /> : null}
      <DiagramOutline id={`${base}-outline`} nodes={nodes} edges={edges} label={outlineLabel} />
    </div>
  );
}

export const Diagram = Object.assign(DiagramRoot, { Skeleton: DiagramSkeleton });
export type { DiagramSkeletonProps };
