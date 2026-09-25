'use client';

import { Diagram, DiagramEditor, type DiagramEdge, type DiagramNode } from '@ceebee/ui/client';
import { useState } from 'react';
import { Demo } from './demo';

const START_NODES: DiagramNode[] = [
  { id: 'draft', label: 'Draft', position: { x: 1, y: 5 } },
  { id: 'review', label: 'Review', position: { x: 13, y: 5 }, shape: 'diamond' },
  { id: 'approved', label: 'Approved', position: { x: 25, y: 1 }, shape: 'pill', tone: 'success' },
  { id: 'rework', label: 'Rework', position: { x: 25, y: 9 }, tone: 'warning' },
];

const START_EDGES: DiagramEdge[] = [
  { id: 'draft-review', from: 'draft', to: 'review' },
  { id: 'review-approved', from: 'review', to: 'approved', label: 'Yes' },
  { id: 'review-rework', from: 'review', to: 'rework', label: 'No' },
];

const PALETTE = [
  { kind: 'step', label: 'Step', shape: 'rect' as const, description: 'Work stands here until it moves on.' },
  { kind: 'decision', label: 'Decision', shape: 'diamond' as const, description: 'A question with an answer per branch.' },
  { kind: 'end', label: 'End', shape: 'pill' as const, tone: 'success' as const, description: 'Where the work finishes.' },
];

export function DiagramDemo() {
  return (
    <Demo
      layout="block"
      code={`<Diagram
  label="Approval process"
  nodes={nodes}
  edges={edges}
/>`}
    >
      <Diagram label="Approval process" hint="Scroll or drag the background to pan. Pinch, Ctrl + scroll or the controls zoom." nodes={START_NODES} edges={START_EDGES} />
    </Demo>
  );
}

export function DiagramEditorDemo() {
  const [nodes, setNodes] = useState(START_NODES);
  const [edges, setEdges] = useState(START_EDGES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <Demo
      layout="block"
      code={`<DiagramEditor
  label="Approval process"
  nodes={nodes}
  edges={edges}
  selectedId={selectedId}
  onSelectionChange={setSelectedId}
  onMoveNode={(id, position) => setNodes(moveNode(nodes, id, position))}
  onConnect={(from, to) => setEdges([...edges, { id: \`\${from}-\${to}\`, from, to }])}
  onRemove={({ nodeIds, edgeIds }) => remove(nodeIds, edgeIds)}
  palette={[{ kind: 'step', label: 'Step', shape: 'rect' }, …]}
  onAddNode={({ kind, position }) => addAndRename(kind, position)}
  editingId={editingId}
  onRenameSubmit={(id, label) => rename(id, label)}
  onRenameCancel={() => setEditingId(null)}
/>`}
    >
      <DiagramEditor
        label="Approval process"
        hint="Drag a kind in, or tap it. Drag or click between handles to connect; from the keyboard, C then C. F2 renames."
        palette={PALETTE}
        paletteLabel="Add a node"
        onAddNode={({ kind, position }) => {
          const item = PALETTE.find((p) => p.kind === kind);
          const id = `${kind}-${Date.now()}`;
          setNodes((current) => [...current, { id, label: item?.label ?? kind, position, shape: item?.shape, tone: item?.tone }]);
          setEditingId(id);
        }}
        editingId={editingId}
        onRenameSubmit={(id, label) => {
          setNodes((current) => current.map((n) => (n.id === id ? { ...n, label } : n)));
          setEditingId(null);
        }}
        onRenameCancel={() => setEditingId(null)}
        nodes={nodes}
        edges={edges}
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
        onMoveNode={(id, position) => setNodes((current) => current.map((n) => (n.id === id ? { ...n, position } : n)))}
        onConnect={(from, to) =>
          setEdges((current) => (current.some((e) => e.from === from && e.to === to) ? current : [...current, { id: `${from}-${to}`, from, to }]))
        }
        onRemove={({ nodeIds, edgeIds }) => {
          setNodes((current) => current.filter((n) => !nodeIds.includes(n.id)));
          setEdges((current) => current.filter((e) => !edgeIds.includes(e.id)));
        }}
        onRename={(target) => (target.kind === 'node' ? setEditingId(target.id) : undefined)}
      />
    </Demo>
  );
}
