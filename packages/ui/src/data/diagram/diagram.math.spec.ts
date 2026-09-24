import { MarkerType, type NodeChange } from '@xyflow/react';
import { describe, expect, it } from 'vitest';
import {
  arrowSize,
  edgeThickness,
  FALLBACK_CELL,
  applySelection,
  cellSize,
  changedMoves,
  connectStep,
  edgeHandles,
  keepIfUnchanged,
  mergeFlowNodes,
  settledMoves,
  toCells,
  toFlowEdges,
  toFlowNodes,
} from './diagram.math.js';

describe('cells and pixels', () => {
  it('uses the measured Token cell, falling back only when nothing was measured', () => {
    expect(cellSize(24)).toBe(24);
    expect(cellSize(0)).toBe(FALLBACK_CELL);
    expect(cellSize(undefined)).toBe(FALLBACK_CELL);
  });

  it('snaps a pixel position to the nearest whole cell', () => {
    expect(toCells({ x: 250, y: 69 }, 20)).toEqual({ x: 13, y: 3 });
  });
});

describe('toFlowNodes', () => {
  it('places nodes in pixels and carries selection, connecting state and shape', () => {
    const [review] = toFlowNodes([{ id: 'review', label: 'Review', position: { x: 12, y: 4 }, shape: 'diamond' }], 20, {
      selectedId: 'review',
      connectingFrom: 'review',
      connectable: true,
    });
    expect(review).toMatchObject({
      id: 'review',
      type: 'cb-diagram',
      position: { x: 240, y: 80 },
      selected: true,
      data: { label: 'Review', shape: 'diamond', connecting: true, connectable: true },
    });
  });

  it('defaults a node to a rectangle that is neither selected nor connecting', () => {
    const [draft] = toFlowNodes([{ id: 'draft', label: 'Draft', position: { x: 0, y: 0 } }], 20, { connectable: false });
    expect(draft?.selected).toBe(false);
    expect(draft?.data).toMatchObject({ shape: 'rect', connecting: false, connectable: false });
  });
});

describe('toFlowEdges', () => {
  const draft = { id: 'draft', label: 'Draft', position: { x: 0, y: 4 } };
  const review = { id: 'review', label: 'Review', position: { x: 12, y: 4 }, shape: 'diamond' as const };

  it('draws edges with an arrow, a tone class and facing handles, and leaves out one naming a missing node', () => {
    const edges = toFlowEdges(
      [
        { id: 'e1', from: 'draft', to: 'review', label: 'Send', tone: 'success' },
        { id: 'e2', from: 'review', to: 'gone' },
      ],
      [draft, review],
    );
    expect(edges).toEqual([
      {
        id: 'e1',
        source: 'draft',
        target: 'review',
        sourceHandle: 'right',
        targetHandle: 'left',
        label: 'Send',
        className: 'cb-diagram__edge cb-diagram__edge--success',
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ]);
  });
});

describe('edgeHandles', () => {
  const at = (id: string, x: number, y: number) => ({ id, label: id, position: { x, y } });

  it('leaves and enters on the facing sides, so an edge that points back does not loop around its nodes', () => {
    expect(edgeHandles(at('a', 0, 0), at('b', 20, 2))).toEqual({ sourceHandle: 'right', targetHandle: 'left' });
    expect(edgeHandles(at('b', 20, 2), at('a', 0, 0))).toEqual({ sourceHandle: 'left', targetHandle: 'right' });
  });

  it('uses top and bottom when the nodes are separated more vertically', () => {
    expect(edgeHandles(at('a', 0, 0), at('b', 2, 10))).toEqual({ sourceHandle: 'bottom', targetHandle: 'top' });
    expect(edgeHandles(at('b', 2, 10), at('a', 0, 0))).toEqual({ sourceHandle: 'top', targetHandle: 'bottom' });
  });

  it('measures a diamond from the centre of its square slot', () => {
    // Diamond at (12,4) has centre (14,6); a rectangle at (12,-6) has centre (16,-4.5): mostly above.
    expect(edgeHandles({ id: 'd', label: 'd', position: { x: 12, y: 4 }, shape: 'diamond' }, at('r', 12, -6))).toEqual({
      sourceHandle: 'top',
      targetHandle: 'bottom',
    });
  });
});

describe('settledMoves', () => {
  it('reports a drop or a keyboard step in cells, and nothing while the pointer is still down', () => {
    const changes: NodeChange[] = [
      { type: 'position', id: 'a', position: { x: 42, y: 18 }, dragging: true },
      { type: 'position', id: 'b', position: { x: 60, y: 80 }, dragging: false },
      { type: 'position', id: 'c', position: { x: 21, y: 0 } },
      { type: 'select', id: 'd', selected: true },
      { type: 'position', id: 'e', dragging: false },
    ];
    expect(settledMoves(changes, 20)).toEqual([
      { id: 'b', position: { x: 3, y: 4 } },
      { id: 'c', position: { x: 1, y: 0 } },
    ]);
  });
});

describe('changedMoves', () => {
  it('drops a move onto the cell the node already has', () => {
    const nodes = [{ id: 'a', label: 'A', position: { x: 2, y: 3 } }];
    expect(changedMoves([{ id: 'a', position: { x: 2, y: 3 } }, { id: 'a', position: { x: 3, y: 3 } }], nodes)).toEqual([
      { id: 'a', position: { x: 3, y: 3 } },
    ]);
  });
});

describe('mergeFlowNodes', () => {
  const build = (nodes: { id: string; x: number; label?: string }[], selectedId: string | null = null) =>
    toFlowNodes(
      nodes.map((n) => ({ id: n.id, label: n.label ?? n.id, position: { x: n.x, y: 0 } })),
      20,
      { selectedId, connectable: true },
    );

  it('keeps the runtime’s selection and measured size when the caller’s data changes', () => {
    const [a, b] = build([{ id: 'a', x: 0 }, { id: 'b', x: 10 }]);
    if (!a || !b) throw new Error('fixture');
    const current = [{ ...a, selected: true, measured: { width: 160, height: 60 } }, b];
    const [mergedA] = mergeFlowNodes(current, build([{ id: 'a', x: 2 }, { id: 'b', x: 10 }]));
    expect(mergedA).toMatchObject({ position: { x: 40, y: 0 }, selected: true, measured: { width: 160, height: 60 } });
  });

  it('returns the very same node objects when nothing the caller owns changed', () => {
    const current = build([{ id: 'a', x: 0 }, { id: 'b', x: 10 }]);
    const merged = mergeFlowNodes(current, build([{ id: 'a', x: 0 }, { id: 'b', x: 10 }]));
    expect(merged[0]).toBe(current[0]);
    expect(merged[1]).toBe(current[1]);
  });

  it('adds new nodes and drops removed ones', () => {
    const current = build([{ id: 'a', x: 0 }, { id: 'b', x: 10 }]);
    expect(mergeFlowNodes(current, build([{ id: 'a', x: 0 }, { id: 'c', x: 5 }])).map((n) => n.id)).toEqual(['a', 'c']);
  });
});

describe('keepIfUnchanged', () => {
  it('keeps the current array when every element is the same object, and takes the new one otherwise', () => {
    const a = { id: 'a' };
    const b = { id: 'b' };
    const current = [a, b];
    expect(keepIfUnchanged(current, [a, b])).toBe(current);
    const moved = [a, { id: 'b' }];
    expect(keepIfUnchanged(current, moved)).toBe(moved);
    const shorter = [a];
    expect(keepIfUnchanged(current, shorter)).toBe(shorter);
  });
});

describe('applySelection', () => {
  it('selects exactly the chosen node, returning the same array when that already holds', () => {
    const nodes = toFlowNodes(
      [
        { id: 'a', label: 'A', position: { x: 0, y: 0 } },
        { id: 'b', label: 'B', position: { x: 9, y: 0 } },
      ],
      20,
      { selectedId: 'a', connectable: true },
    );
    expect(applySelection(nodes, 'a')).toBe(nodes);
    expect(applySelection(nodes, 'b').map((n) => [n.id, n.selected])).toEqual([
      ['a', false],
      ['b', true],
    ]);
  });
});

describe('connectStep', () => {
  it('begins from a node, then commits to another', () => {
    const begun = connectStep({ mode: 'idle' }, { type: 'choose', nodeId: 'a' });
    expect(begun).toEqual({ state: { mode: 'connecting', from: 'a' } });
    expect(connectStep(begun.state, { type: 'choose', nodeId: 'b' })).toEqual({ state: { mode: 'idle' }, connect: { from: 'a', to: 'b' } });
  });

  it('cancels rather than connecting a node to itself, and on request', () => {
    expect(connectStep({ mode: 'connecting', from: 'a' }, { type: 'choose', nodeId: 'a' })).toEqual({ state: { mode: 'idle' } });
    expect(connectStep({ mode: 'connecting', from: 'a' }, { type: 'cancel' })).toEqual({ state: { mode: 'idle' } });
  });

  it('restarts from another node when told to start', () => {
    expect(connectStep({ mode: 'connecting', from: 'a' }, { type: 'start', nodeId: 'c' })).toEqual({ state: { mode: 'connecting', from: 'c' } });
  });
});

describe('edgeThickness', () => {
  it('draws a trickle at 1.5× the border width and the busiest path at 8×', () => {
    expect(edgeThickness(0)).toBe(1.5);
    expect(edgeThickness(1)).toBe(8);
    expect(edgeThickness(0.5)).toBe(4.75);
  });
  it('keeps the arrowhead the same size on a thick line', () => {
    expect(arrowSize(1) * edgeThickness(1)).toBeCloseTo(12.5, 1);
    expect(arrowSize(0) * edgeThickness(0)).toBeCloseTo(12.5, 1);
  });
  it('clamps a weight outside 0–1', () => {
    expect(edgeThickness(3)).toBe(8);
    expect(edgeThickness(-1)).toBe(1.5);
  });
});

describe('toFlowEdges weights', () => {
  const from = { id: 'a', label: 'A', position: { x: 0, y: 0 } };
  const to = { id: 'b', label: 'B', position: { x: 10, y: 0 } };
  it('thickens a weighted edge and marks an untaken one as unused', () => {
    const [heavy] = toFlowEdges([{ id: 'e', from: 'a', to: 'b', weight: 1 }], [from, to]);
    expect(heavy?.style?.strokeWidth).toBe('calc(var(--cb-border-width) * 8)');
    expect(heavy?.markerEnd).toEqual({ type: MarkerType.ArrowClosed, width: 1.56, height: 1.56 });
    const [unused] = toFlowEdges([{ id: 'e', from: 'a', to: 'b', weight: 0 }], [from, to]);
    expect(unused?.className).toContain('cb-diagram__edge--unused');
    expect(unused?.style).toBeUndefined();
  });
});
