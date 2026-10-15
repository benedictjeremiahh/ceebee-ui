import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ReactFlowProps } from '@xyflow/react';
import { DiagramEditor } from './diagram-editor.js';
import type { DiagramEdge, DiagramNode } from './diagram.types.js';

vi.mock('@xyflow/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@xyflow/react')>();
  return {
    ...actual,
    ReactFlow: (props: ReactFlowProps) => {
      const node = props.nodes?.[0];
      const otherNode = props.nodes?.[1];
      const edge = props.edges?.[0];

      return (
        <div
          onKeyDown={(event) => {
            props.onKeyDown?.(event);
            if (event.key === 'Escape') props.onSelectionChange?.({ nodes: [], edges: [] });
          }}
        >
          {node ? (
            <button
              type="button"
              onClick={(event) => {
                props.onNodeClick?.(event, node);
                props.onSelectionChange?.({ nodes: [node], edges: [] });
              }}
            >
              Select draft node
            </button>
          ) : null}
          {otherNode ? (
            <button
              type="button"
              onClick={(event) => {
                props.onNodeClick?.(event, otherNode);
                props.onSelectionChange?.({ nodes: [otherNode], edges: [] });
              }}
            >
              Select review node
            </button>
          ) : null}
          {edge ? (
            <button
              type="button"
              onClick={(event) => {
                props.onEdgeClick?.(event, edge);
                props.onSelectionChange?.({ nodes: [], edges: [] });
              }}
            >
              Select edge
            </button>
          ) : null}
          <button
            type="button"
            onClick={(event) => {
              props.onPaneClick?.(event);
              props.onSelectionChange?.({ nodes: [], edges: [] });
            }}
          >
            Clear selection
          </button>
          {props.children}
        </div>
      );
    },
  };
});

const NODES: DiagramNode[] = [
  { id: 'draft', label: 'Draft', position: { x: 0, y: 0 } },
  { id: 'review', label: 'Review', position: { x: 2, y: 0 } },
];
const EDGES: DiagramEdge[] = [{ id: 'draft-review', from: 'draft', to: 'review' }];

describe('DiagramEditor selection inspector', () => {
  it('handles Escape before an enclosing overlay, then lets the next Escape reach it', () => {
    const outerKeyDown = vi.fn();
    render(
      <div onKeyDown={outerKeyDown}>
        <DiagramEditor label="Flow" nodes={NODES} edges={EDGES}
          renderInspector={(selection) => selection ? selection.kind : 'No selection'} />
      </div>,
    );
    const edge = screen.getByRole('button', { name: 'Select edge' });
    fireEvent.click(edge);
    fireEvent.keyDown(edge, { key: 'Escape' });
    expect(screen.getByLabelText('Selection')).toHaveTextContent('No selection');
    expect(outerKeyDown).not.toHaveBeenCalled();
    fireEvent.keyDown(edge, { key: 'Escape' });
    expect(outerKeyDown).toHaveBeenCalledTimes(1);
  });

  it('keeps an edge after the runtime reports empty selection, then clears and selects a node again', () => {
    render(
      <DiagramEditor
        label="Flow"
        nodes={NODES}
        edges={EDGES}
        renderInspector={(selection) => selection
          ? `${selection.kind}:${selection.kind === 'node' ? selection.node.id : selection.edge.id}`
          : 'No selection'}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Select draft node' }));
    expect(screen.getByLabelText('Selection')).toHaveTextContent('node:draft');

    fireEvent.click(screen.getByRole('button', { name: 'Select edge' }));
    expect(screen.getByLabelText('Selection')).toHaveTextContent('edge:draft-review');

    fireEvent.click(screen.getByRole('button', { name: 'Select review node' }));
    expect(screen.getByLabelText('Selection')).toHaveTextContent('node:review');

    fireEvent.click(screen.getByRole('button', { name: 'Select edge' }));
    expect(screen.getByLabelText('Selection')).toHaveTextContent('edge:draft-review');
    fireEvent.keyDown(screen.getByRole('button', { name: 'Select edge' }), { key: 'Escape' });
    expect(screen.getByLabelText('Selection')).toHaveTextContent('No selection');

    fireEvent.click(screen.getByRole('button', { name: 'Select edge' }));
    expect(screen.getByLabelText('Selection')).toHaveTextContent('edge:draft-review');
    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(screen.getByLabelText('Selection')).toHaveTextContent('No selection');

    fireEvent.click(screen.getByRole('button', { name: 'Select draft node' }));
    expect(screen.getByLabelText('Selection')).toHaveTextContent('node:draft');

    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(screen.getByLabelText('Selection')).toHaveTextContent('No selection');

    fireEvent.click(screen.getByRole('button', { name: 'Select review node' }));
    fireEvent.keyDown(screen.getByRole('button', { name: 'Select review node' }), { key: 'Escape' });
    expect(screen.getByLabelText('Selection')).toHaveTextContent('No selection');
  });
});
