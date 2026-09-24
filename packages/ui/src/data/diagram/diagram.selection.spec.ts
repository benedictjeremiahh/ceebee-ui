import { describe, expect, it } from 'vitest';
import { describeSelection, shapesInUse } from './diagram.selection.js';
import type { DiagramEdge, DiagramNode } from './diagram.types.js';

const nodes: DiagramNode[] = [
  { id: 'draft', label: 'Draft', position: { x: 0, y: 0 } },
  { id: 'review', label: 'Review', position: { x: 10, y: 0 }, shape: 'diamond' },
  { id: 'done', label: 'Done', position: { x: 20, y: 0 }, shape: 'pill' },
];
const edges: DiagramEdge[] = [
  { id: 'e1', from: 'draft', to: 'review' },
  { id: 'e2', from: 'review', to: 'done', label: 'Yes' },
  { id: 'e3', from: 'review', to: 'draft', label: 'No' },
];

describe('describeSelection', () => {
  it('describes a node by where it leads and what leads to it', () => {
    const selection = describeSelection({ kind: 'node', id: 'review' }, nodes, edges);
    expect(selection?.kind).toBe('node');
    if (selection?.kind !== 'node') return;
    expect(selection.node.label).toBe('Review');
    expect(selection.outgoing.map((l) => `${l.edge.label}→${l.node.label}`)).toEqual(['Yes→Done', 'No→Draft']);
    expect(selection.incoming.map((l) => l.node.label)).toEqual(['Draft']);
  });

  it('describes an edge by both of its ends', () => {
    const selection = describeSelection({ kind: 'edge', id: 'e2' }, nodes, edges);
    expect(selection).toMatchObject({ kind: 'edge', from: { label: 'Review' }, to: { label: 'Done' } });
  });

  it('is nothing when nothing is selected or the selection no longer exists', () => {
    expect(describeSelection(null, nodes, edges)).toBeNull();
    expect(describeSelection({ kind: 'node', id: 'gone' }, nodes, edges)).toBeNull();
    expect(describeSelection({ kind: 'edge', id: 'gone' }, nodes, edges)).toBeNull();
  });

  it('leaves out a link whose other end is missing', () => {
    const selection = describeSelection({ kind: 'node', id: 'draft' }, nodes, [...edges, { id: 'x', from: 'draft', to: 'nowhere' }]);
    expect(selection?.kind === 'node' ? selection.outgoing.map((l) => l.node.id) : null).toEqual(['review']);
  });
});

describe('shapesInUse', () => {
  it('lists each drawn shape once, in a stable order, counting an unshaped node as a rectangle', () => {
    const [draft, review, done] = nodes;
    expect(shapesInUse([done, review, draft, draft].filter((n): n is DiagramNode => n !== undefined))).toEqual(['rect', 'pill', 'diamond']);
    expect(shapesInUse(nodes.filter((n) => n.id === 'review'))).toEqual(['diamond']);
  });
});
