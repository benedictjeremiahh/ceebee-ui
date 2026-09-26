import { MarkerType, type Edge, type Node, type NodeChange } from '@xyflow/react';
import type { DiagramEdge, DiagramFlowNodeData, DiagramNode, DiagramPosition } from './diagram.types.js';

/* The translation between the library's diagram — positions in grid cells, edges from/to — and React Flow's
   nodes in pixels. Pure, because each step can be wrong without looking wrong: a node that lands half a
   cell off, an edge drawn to a node that is not there, a move reported while the pointer is still down. */

export const FLOW_NODE_TYPE = 'cb-diagram';

/** Used only until one Token grid cell has been measured in the page. */
export const FALLBACK_CELL = 20;

export type DiagramFlowNode = Node<DiagramFlowNodeData, typeof FLOW_NODE_TYPE>;

export function cellSize(measured: number | undefined): number {
  return measured !== undefined && measured > 0 ? measured : FALLBACK_CELL;
}

export function toCells(position: DiagramPosition, cell: number): DiagramPosition {
  return { x: Math.round(position.x / cell), y: Math.round(position.y / cell) };
}

export function toFlowNodes(
  nodes: readonly DiagramNode[],
  cell: number,
  state: { selectedId?: string | null; connectingFrom?: string | null; connectable: boolean; editingId?: string | null },
): DiagramFlowNode[] {
  return nodes.map((node) => ({
    id: node.id,
    type: FLOW_NODE_TYPE,
    position: { x: node.position.x * cell, y: node.position.y * cell },
    selected: state.selectedId === node.id,
    data: {
      label: node.label,
      content: node.content,
      shape: node.shape ?? 'rect',
      tone: node.tone,
      connecting: state.connectingFrom === node.id,
      connectable: state.connectable,
      editing: state.editingId === node.id,
    },
  }));
}

export type DiagramSide = 'left' | 'right' | 'top' | 'bottom';

/** A node's centre in cells. The slot sizes match the stylesheet: 8×3 cells, and 4×4 for a diamond. */
function centreOf(node: DiagramNode): DiagramPosition {
  const [columns, rows] = node.shape === 'diamond' ? [4, 4] : [8, 3];
  return { x: node.position.x + columns / 2, y: node.position.y + rows / 2 };
}

/**
 * Which sides an edge leaves and enters by: the side of the source facing the target and the side of the
 * target facing the source, along whichever axis separates them more. Without it every edge leaves on the
 * right and enters on the left, so an edge that points back loops around both nodes.
 */
export function edgeHandles(from: DiagramNode, to: DiagramNode): { sourceHandle: DiagramSide; targetHandle: DiagramSide } {
  const a = centreOf(from);
  const b = centreOf(to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? { sourceHandle: 'right', targetHandle: 'left' } : { sourceHandle: 'left', targetHandle: 'right' };
  }
  return dy >= 0 ? { sourceHandle: 'bottom', targetHandle: 'top' } : { sourceHandle: 'top', targetHandle: 'bottom' };
}

/** An edge naming a node that is not in the diagram is left out rather than drawn to nowhere. */
/**
 * A weighted edge's thickness as a multiple of the border width: 1.5× for a trickle, up to 8× for the busiest
 * path. Linear in the weight, so twice the traffic reads as a visibly thicker line; clamped so a weight
 * outside 0–1 cannot draw a hairline or a slab.
 */
export function edgeThickness(weight: number): number {
  const clamped = Math.min(1, Math.max(0, weight));
  return Math.round((1.5 + clamped * 6.5) * 100) / 100;
}

/** The marker size, in stroke widths, that keeps a weighted edge's arrowhead as large as a plain one's. */
export function arrowSize(weight: number): number {
  return Math.round((12.5 / edgeThickness(weight)) * 100) / 100;
}

export function toFlowEdges(edges: readonly DiagramEdge[], nodes: readonly DiagramNode[]): Edge[] {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  return edges.flatMap((edge) => {
    const from = byId.get(edge.from);
    const to = byId.get(edge.to);
    if (!from || !to) return [];
    return [
      {
        id: edge.id,
        source: edge.from,
        target: edge.to,
        ...edgeHandles(from, to),
        label: edge.label,
        // The default head first: a weighted edge replaces it below with one sized back down.
        markerEnd: { type: MarkerType.ArrowClosed },
        className: [
          'cb-diagram__edge',
          edge.tone ? `cb-diagram__edge--${edge.tone}` : null,
          edge.weight === 0 ? 'cb-diagram__edge--unused' : null,
        ].filter(Boolean).join(' '),
        ...(edge.weight !== undefined && edge.weight > 0
          ? {
              style: { strokeWidth: `calc(var(--cb-border-width) * ${edgeThickness(edge.weight)})` },
              // React Flow sizes a marker in stroke widths, so a thick line would carry a huge head; divide it
              // back out so every arrowhead is the same size whatever the traffic.
              markerEnd: { type: MarkerType.ArrowClosed, width: arrowSize(edge.weight), height: arrowSize(edge.weight) },
            }
          : {}),
      },
    ];
  });
}

/**
 * The moves to report from a batch of React Flow node changes: a position change that is not mid-drag —
 * the drop at the end of a drag, or a keyboard step — converted to whole cells. Changes while the pointer
 * is still down only redraw.
 */
export function settledMoves(changes: readonly NodeChange[], cell: number): { id: string; position: DiagramPosition }[] {
  return changes.flatMap((change) =>
    change.type === 'position' && change.position && change.dragging !== true
      ? [{ id: change.id, position: toCells(change.position, cell) }]
      : [],
  );
}

/** Moves that change something: a drop or step that lands on the cell the node already has is not a request. */
export function changedMoves(
  moves: readonly { id: string; position: DiagramPosition }[],
  nodes: readonly DiagramNode[],
): { id: string; position: DiagramPosition }[] {
  return moves.filter((move) => {
    const current = nodes.find((node) => node.id === move.id)?.position;
    return !current || current.x !== move.position.x || current.y !== move.position.y;
  });
}

/**
 * The caller's nodes laid over React Flow's current ones. What the caller owns — position, label, shape,
 * tone, connecting state — comes from `next`; what the runtime owns — whether a node is selected and its
 * measured size — is kept from `current`. Rebuilding without keeping those makes the runtime re-measure and
 * re-select on every update, and when the caller also mirrors selection the two chase each other without
 * end. The same array comes back when nothing changed, so the runtime is not told the nodes are new.
 */
export function mergeFlowNodes(current: DiagramFlowNode[], next: readonly DiagramFlowNode[]): DiagramFlowNode[] {
  const byId = new Map(current.map((node) => [node.id, node]));
  let changed = current.length !== next.length;
  const merged = next.map((node, index) => {
    const previous = byId.get(node.id);
    if (!previous) {
      changed = true;
      return node;
    }
    const same =
      current[index] === previous &&
      previous.position.x === node.position.x &&
      previous.position.y === node.position.y &&
      previous.data.label === node.data.label &&
      previous.data.content === node.data.content &&
      previous.data.shape === node.data.shape &&
      previous.data.tone === node.data.tone &&
      previous.data.connecting === node.data.connecting &&
      previous.data.connectable === node.data.connectable &&
      previous.data.editing === node.data.editing;
    if (same) return previous;
    changed = true;
    return { ...node, selected: previous.selected, measured: previous.measured };
  });
  return changed ? merged : current;
}

/**
 * The array to keep after applying runtime changes: the current one when every node object survived as it was.
 * The runtime treats a new array as new nodes and pushes them back through its store, so handing it an equal
 * but new array after each no-op change is how an update loop starts.
 */
export function keepIfUnchanged<T>(current: T[], next: T[]): T[] {
  return next.length === current.length && next.every((item, index) => item === current[index]) ? current : next;
}

/** The controlled selection applied once, when the caller changes it; the same array when it already holds. */
export function applySelection(current: DiagramFlowNode[], selectedId: string | null): DiagramFlowNode[] {
  let changed = false;
  const next = current.map((node) => {
    const selected = node.id === selectedId;
    if (Boolean(node.selected) === selected) return node;
    changed = true;
    return { ...node, selected };
  });
  return changed ? next : current;
}

export type ConnectState = { mode: 'idle' } | { mode: 'connecting'; from: string };

export type ConnectEvent = { type: 'start'; nodeId: string } | { type: 'choose'; nodeId: string } | { type: 'cancel' };

/**
 * The keyboard connect sequence. `choose` begins from idle and commits while connecting — unless it names
 * the starting node, which cancels, because an edge from a node to itself is never what a second press on
 * it meant.
 */
export function connectStep(
  state: ConnectState,
  event: ConnectEvent,
): { state: ConnectState; connect?: { from: string; to: string } } {
  if (event.type === 'cancel') return { state: { mode: 'idle' } };
  if (event.type === 'start' || state.mode === 'idle') return { state: { mode: 'connecting', from: event.nodeId } };
  if (event.nodeId === state.from) return { state: { mode: 'idle' } };
  return { state: { mode: 'idle' }, connect: { from: state.from, to: event.nodeId } };
}
