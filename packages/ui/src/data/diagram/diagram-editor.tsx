'use client';

import {
  Background,
  ConnectionMode,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  applyNodeChanges,
  useReactFlow,
  type Connection,
  type Node,
  type NodeChange,
  type OnBeforeDelete,
  type OnSelectionChangeParams,
  type ReactFlowProps,
} from '@xyflow/react';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type DragEvent, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { DiagramLegend, type DiagramLegendEntry, DiagramOutline, FIT_VIEW, NODE_TYPES, SCROLL_PANS, safeId, useCellSize } from './diagram-flow.js';
import { DiagramRenameContext, type DiagramRenameHandlers } from './diagram-node.js';
import { DiagramPalette } from './diagram-palette.js';
import { PALETTE_MIME, landingCell, type DiagramAddRequest, type DiagramPaletteItem } from './diagram.palette.js';
import { describeSelection, type DiagramSelection, type DiagramSelectionTarget } from './diagram.selection.js';
import {
  applySelection,
  changedMoves,
  connectStep,
  keepIfUnchanged,
  mergeFlowNodes,
  settledMoves,
  toFlowEdges,
  toFlowNodes,
  type ConnectEvent,
  type ConnectState,
  type DiagramFlowNode,
} from './diagram.math.js';
import { DiagramSkeleton, type DiagramSkeletonProps } from './diagram.skeleton.js';
import type { DiagramEdge, DiagramNode, DiagramPosition, DiagramShape } from './diagram.types.js';

export interface DiagramRemoval {
  nodeIds: string[];
  edgeIds: string[];
}

export interface DiagramRenameTarget {
  kind: 'node' | 'edge';
  id: string;
}

export interface DiagramEditorProps {
  label: string;
  nodes: readonly DiagramNode[];
  edges: readonly DiagramEdge[];
  hint?: string;
  selectedId?: string | null;
  onSelectionChange?: (id: string) => void;
  /** A request, in whole cells: the caller moves the node by updating `nodes`, or does not. */
  onMoveNode?: (id: string, position: DiagramPosition) => void;
  onConnect?: (from: string, to: string) => void;
  /** A request: removing a node names the edges touching it too. Nothing is removed until `nodes`/`edges` change. */
  onRemove?: (removal: DiagramRemoval) => void;
  /** The caller renders the rename input; the editor only says what is to be renamed. */
  onRename?: (target: DiagramRenameTarget) => void;
  connectingStatus?: (nodeLabel: string) => string;
  outlineLabel?: string;
  /** Localised names for the substrate's own controls and keyboard descriptions. */
  ariaLabels?: ReactFlowProps['ariaLabelConfig'];
  /**
   * The panel beside the canvas (below it on a narrow screen) that says what is selected and offers what can
   * be done with it as real buttons — the keyboard shortcuts stay as accelerators, not the only way. Given
   * the selection described in a person's terms, or `null` when nothing is selected; render a hint then.
   */
  renderInspector?: (selection: DiagramSelection | null) => ReactNode;
  /** Accessible name for the inspector panel. */
  inspectorLabel?: string;
  /** Names for the node shapes in use; given, a legend lists the shapes the diagram draws. */
  legendLabels?: Partial<Record<DiagramShape, string>>;
  /** An explicit legend — shape, tone and meaning — for a diagram whose shapes alone do not tell nodes apart. */
  legend?: readonly DiagramLegendEntry[];
  /**
   * The kinds of node a person can add (ceebee-ui#44). Dragged onto the canvas, or tapped / Enter for the
   * middle of what is visible, each asks `onAddNode` for a node there; it appears when the caller adds it.
   */
  palette?: readonly DiagramPaletteItem[];
  onAddNode?: (request: DiagramAddRequest) => void;
  /** The palette's accessible name, and an optional one-line hint shown in it. */
  paletteLabel?: string;
  paletteHint?: string;
  /**
   * The node being renamed in place: it shows an input where its label was. Set it to the id of a node the
   * caller just added, so a new node is named where it sits. Enter or leaving the input calls
   * `onRenameSubmit`; Escape, or an empty or unchanged name, calls `onRenameCancel`.
   */
  editingId?: string | null;
  onRenameSubmit?: (id: string, label: string) => void;
  onRenameCancel?: () => void;
  /** The rename input's accessible name, given the node's current label. */
  renameLabel?: (label: string) => string;
}

const CONNECT_KEY = 'c';
const DELETE_KEYS = ['Delete', 'Backspace'];
const defaultConnectingStatus = (node: string) => `Connecting from ${node}. Focus another node and press C, or press Escape to cancel.`;

/** The node or edge a key was pressed on, read from the ids React Flow puts on its wrappers. */
function elementAt(target: EventTarget | null): DiagramRenameTarget | null {
  if (!(target instanceof Element)) return null;
  const node = target.closest('.react-flow__node')?.getAttribute('data-id');
  if (node) return { kind: 'node', id: node };
  const edge = target.closest('.react-flow__edge')?.getAttribute('data-id');
  return edge ? { kind: 'edge', id: edge } : null;
}

/**
 * Draws and edits a diagram on the React Flow runtime. React Flow owns dragging, panning, zooming,
 * selection, focus and its keyboard model; this component keeps the caller in charge of the data by turning
 * every change into a request, and adds keyboard connecting, which the runtime does not offer.
 *
 * Every value handed to the runtime keeps its identity between renders. The runtime pushes any prop whose
 * identity changed into its store after each render, and some of those — the selection callback among them —
 * fire again when they change, so a fresh function or array per render is enough to loop.
 */
function DiagramEditorCanvas(props: DiagramEditorProps) {
  const {
    label,
    nodes,
    edges,
    hint,
    selectedId,
    connectingStatus = defaultConnectingStatus,
    outlineLabel = 'Diagram outline',
    ariaLabels,
    renderInspector,
    inspectorLabel = 'Selection',
    legendLabels,
    legend,
    palette,
    paletteLabel = 'Add a node',
    paletteHint,
    editingId = null,
  } = props;
  // What the inspector describes: a node or an edge. The runtime selects both; only nodes are reported out.
  const [inspected, setInspected] = useState<DiagramSelectionTarget>(selectedId ? { kind: 'node', id: selectedId } : null);
  const base = safeId(useId());
  const cellRef = useRef<HTMLSpanElement>(null);
  const cell = useCellSize(cellRef);
  const [connect, setConnect] = useState<ConnectState>({ mode: 'idle' });
  const connectingFrom = connect.mode === 'connecting' ? connect.from : null;

  // The latest props and state, read by callbacks whose identity must not change.
  const latest = useRef({ props, cell, connect });
  latest.current = { props, cell, connect };
  const reportedSelection = useRef<string | null>(selectedId ?? null);

  /* React Flow draws drags and selection from its own node state. The caller's `nodes` are merged into that
     mirror whenever they change — and after every reported move, so a move the caller declines snaps back —
     keeping what the runtime owns. The caller's `selectedId` is applied once when it changes. */
  const [resync, setResync] = useState(0);
  const [flowNodes, setFlowNodes] = useState<DiagramFlowNode[]>(() => toFlowNodes(nodes, cell, { selectedId, connectable: true, editingId }));
  useEffect(() => {
    setFlowNodes((current) => mergeFlowNodes(current, toFlowNodes(nodes, cell, { connectingFrom, connectable: true, editingId })));
  }, [nodes, cell, connectingFrom, editingId, resync]);
  useEffect(() => {
    if (selectedId === undefined) return;
    reportedSelection.current = selectedId;
    setInspected(selectedId ? { kind: 'node', id: selectedId } : null);
    setFlowNodes((current) => applySelection(current, selectedId));
  }, [selectedId]);
  const flowEdges = useMemo(() => toFlowEdges(edges, nodes), [edges, nodes]);
  const snapGrid = useMemo<[number, number]>(() => [cell, cell], [cell]);

  const step = useCallback((event: ConnectEvent) => {
    const { connect: state, props: current } = latest.current;
    const next = connectStep(state, event);
    setConnect(next.state);
    if (next.connect) current.onConnect?.(next.connect.from, next.connect.to);
  }, []);

  const onNodesChange = useCallback((changes: NodeChange<DiagramFlowNode>[]) => {
    const { props: current, cell: size } = latest.current;
    // Removal is a request answered through onBeforeDelete, so it never reaches the mirror.
    setFlowNodes((mirror) => keepIfUnchanged(mirror, applyNodeChanges(changes.filter((change) => change.type !== 'remove'), mirror)));
    const moves = changedMoves(settledMoves(changes, size), current.nodes);
    for (const move of moves) current.onMoveNode?.(move.id, move.position);
    if (moves.length > 0) setResync((n) => n + 1);
  }, []);

  const onConnectEdge = useCallback((connection: Connection) => {
    if (connection.source !== connection.target) latest.current.props.onConnect?.(connection.source, connection.target);
  }, []);

  const onBeforeDelete = useCallback<OnBeforeDelete<DiagramFlowNode>>(async ({ nodes: gone, edges: goneEdges }) => {
    latest.current.props.onRemove?.({ nodeIds: gone.map((n) => n.id), edgeIds: goneEdges.map((e) => e.id) });
    return false;
  }, []);

  const onSelectionChange = useCallback(({ nodes: chosen, edges: chosenEdges }: OnSelectionChangeParams) => {
    const edgeId = chosenEdges[0]?.id;
    setInspected(chosen[0] ? { kind: 'node', id: chosen[0].id } : edgeId ? { kind: 'edge', id: edgeId } : null);
    const id = chosen[0]?.id;
    if (!id || id === reportedSelection.current) return;
    reportedSelection.current = id;
    latest.current.props.onSelectionChange?.(id);
  }, []);

  const onNodeClick = useCallback(
    (_: MouseEvent, node: Node) => {
      if (latest.current.connect.mode === 'connecting') step({ type: 'choose', nodeId: node.id });
    },
    [step],
  );

  const onPaneClick = useCallback(() => {
    if (latest.current.connect.mode === 'connecting') step({ type: 'cancel' });
  }, [step]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const target = elementAt(event.target);
      if (event.key.toLowerCase() === CONNECT_KEY && target?.kind === 'node' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        step({ type: 'choose', nodeId: target.id });
      } else if (event.key === 'Escape' && latest.current.connect.mode === 'connecting') {
        step({ type: 'cancel' });
      } else if (event.key === 'F2' && target) {
        event.preventDefault();
        latest.current.props.onRename?.(target);
      }
    },
    [step],
  );

  // The runtime's store, which turns a point on the screen into a point in the diagram. Read from the
  // provider rather than `onInit`, which waits for every node to be measured.
  const flow = useReactFlow<DiagramFlowNode>();
  const toDiagram = useRef(flow.screenToFlowPosition);
  toDiagram.current = flow.screenToFlowPosition;
  const viewportRef = useRef<HTMLDivElement>(null);

  /** Ask for a node of `item`'s kind centred on a screen point — the drop, or the middle of the view. */
  const requestAt = useCallback((item: DiagramPaletteItem, screen: { x: number; y: number }) => {
    const { props: current, cell: size } = latest.current;
    if (!current.onAddNode) return;
    current.onAddNode({ kind: item.kind, position: landingCell(toDiagram.current(screen), size, item.shape) });
  }, []);

  const pick = useCallback((item: DiagramPaletteItem) => {
    const box = viewportRef.current?.getBoundingClientRect();
    if (box) requestAt(item, { x: box.left + box.width / 2, y: box.top + box.height / 2 });
  }, [requestAt]);

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    if (!event.dataTransfer.types.includes(PALETTE_MIME)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const onDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    const kind = event.dataTransfer.getData(PALETTE_MIME);
    const item = latest.current.props.palette?.find((candidate) => candidate.kind === kind);
    if (!item) return;
    event.preventDefault();
    requestAt(item, { x: event.clientX, y: event.clientY });
  }, [requestAt]);

  const rename = useMemo<DiagramRenameHandlers>(() => ({
    submit: (id, name) => latest.current.props.onRenameSubmit?.(id, name),
    cancel: () => latest.current.props.onRenameCancel?.(),
    inputLabel: (current) => latest.current.props.renameLabel?.(current) ?? `Rename ${current}`,
  }), []);

  const labelOf = (id: string) => nodes.find((n) => n.id === id)?.label ?? '';
  const selection = useMemo(() => describeSelection(inspected, nodes, edges), [inspected, nodes, edges]);

  return (
    <div className="cb-diagram cb-diagram--editor" data-inspector={renderInspector ? 'true' : undefined}>
      <span ref={cellRef} className="cb-diagram__cell" aria-hidden="true" />
      {hint ? <p className="cb-diagram__hint">{hint}</p> : null}
      {palette && palette.length > 0 ? <DiagramPalette items={palette} label={paletteLabel} hint={paletteHint} onPick={pick} /> : null}
      <div className="cb-diagram__body">
      <DiagramRenameContext.Provider value={rename}>
      <div
        ref={viewportRef}
        className="cb-diagram__viewport"
        role="region"
        aria-label={label}
        aria-describedby={`${base}-outline`}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={NODE_TYPES}
          onNodesChange={onNodesChange}
          onConnect={onConnectEdge}
          onBeforeDelete={onBeforeDelete}
          onSelectionChange={onSelectionChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onKeyDown={onKeyDown}
          {...SCROLL_PANS}
          connectionMode={ConnectionMode.Loose}
          connectOnClick
          snapToGrid
          snapGrid={snapGrid}
          deleteKeyCode={DELETE_KEYS}
          fitView
          fitViewOptions={FIT_VIEW}
          minZoom={0.5}
          maxZoom={2}
          ariaLabelConfig={ariaLabels}
        >
          <Background gap={cell} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
      </DiagramRenameContext.Provider>
      {renderInspector ? (
        <aside className="cb-diagram__inspector" aria-label={inspectorLabel}>
          {renderInspector(selection)}
        </aside>
      ) : null}
      </div>
      {legend || legendLabels ? <DiagramLegend nodes={nodes} labels={legendLabels} entries={legend} /> : null}
      <p className="cb-diagram__status" role="status">
        {connectingFrom ? connectingStatus(labelOf(connectingFrom)) : ''}
      </p>
      <DiagramOutline id={`${base}-outline`} nodes={nodes} edges={edges} label={outlineLabel} />
    </div>
  );
}

/** The canvas inside its own runtime store, so the palette can place a node before the first measure. */
function DiagramEditorRoot(props: DiagramEditorProps) {
  return (
    <ReactFlowProvider>
      <DiagramEditorCanvas {...props} />
    </ReactFlowProvider>
  );
}

export const DiagramEditor = Object.assign(DiagramEditorRoot, { Skeleton: DiagramSkeleton });
export type { DiagramSkeletonProps };
