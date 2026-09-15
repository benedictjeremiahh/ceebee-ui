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
      <Diagram label="Approval process" hint="Drag the background to pan. Scroll, pinch or use the controls to zoom." nodes={START_NODES} edges={START_EDGES} />
    </Demo>
  );
}

export function DiagramEditorDemo() {
  const [nodes, setNodes] = useState(START_NODES);
  const [edges, setEdges] = useState(START_EDGES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [request, setRequest] = useState('');

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
  onRename={(target) => openRename(target)}
/>`}
    >
      <DiagramEditor
        label="Approval process"
        hint="Drag to move. Drag or click between handles to connect. From the keyboard, C then C connects."
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
        onRename={(target) => setRequest(`Rename requested for ${target.kind} ${target.id}.`)}
      />
      {request ? <p>{request}</p> : null}
    </Demo>
  );
}
