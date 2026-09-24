import type { DiagramEdge, DiagramNode, DiagramShape } from './diagram.types.js';

/**
 * What the editor hands its inspector: the selected node or edge, described in the terms a person acts on —
 * where it leads, what leads to it — rather than as ids the consumer has to look up again. Pure, so it is
 * spec'd without React Flow.
 */
export interface DiagramLink {
  edge: DiagramEdge;
  /** The node at the other end. */
  node: DiagramNode;
}

export type DiagramSelection =
  | { kind: 'node'; node: DiagramNode; outgoing: DiagramLink[]; incoming: DiagramLink[] }
  | { kind: 'edge'; edge: DiagramEdge; from: DiagramNode; to: DiagramNode };

export type DiagramSelectionTarget = { kind: 'node' | 'edge'; id: string } | null;

export function describeSelection(
  target: DiagramSelectionTarget,
  nodes: readonly DiagramNode[],
  edges: readonly DiagramEdge[],
): DiagramSelection | null {
  if (!target) return null;
  const byId = new Map(nodes.map((n) => [n.id, n]));
  if (target.kind === 'edge') {
    const edge = edges.find((e) => e.id === target.id);
    const from = edge ? byId.get(edge.from) : undefined;
    const to = edge ? byId.get(edge.to) : undefined;
    return edge && from && to ? { kind: 'edge', edge, from, to } : null;
  }
  const node = byId.get(target.id);
  if (!node) return null;
  const link = (edge: DiagramEdge, otherId: string): DiagramLink[] => {
    const other = byId.get(otherId);
    return other ? [{ edge, node: other }] : [];
  };
  return {
    kind: 'node',
    node,
    outgoing: edges.filter((e) => e.from === node.id).flatMap((e) => link(e, e.to)),
    incoming: edges.filter((e) => e.to === node.id).flatMap((e) => link(e, e.from)),
  };
}

const SHAPE_ORDER: readonly DiagramShape[] = ['rect', 'pill', 'diamond'];

/** The shapes the diagram actually draws, in a stable order, each once — what a legend lists. */
export function shapesInUse(nodes: readonly DiagramNode[]): DiagramShape[] {
  const used = new Set(nodes.map((n) => n.shape ?? 'rect'));
  return SHAPE_ORDER.filter((shape) => used.has(shape));
}
