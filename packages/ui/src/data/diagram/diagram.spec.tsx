import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Diagram } from './diagram.js';
import { DiagramEditor } from './diagram-editor.js';
import type { DiagramEdge, DiagramNode } from './diagram.types.js';

/* Dragging, panning, zooming, selection and Delete are React Flow's and depend on layout jsdom does not
   have; they are proven in a browser. These specs cover what this library adds on top: the outline, the
   read-only switches, keyboard connecting, rename requests, and the loading state. */

const nodes: DiagramNode[] = [
  { id: 'draft', label: 'Draft', position: { x: 0, y: 4 } },
  { id: 'review', label: 'Review', position: { x: 12, y: 4 }, shape: 'diamond' },
  { id: 'approved', label: 'Approved', position: { x: 24, y: 0 }, tone: 'success' },
];
const edges: DiagramEdge[] = [
  { id: 'e1', from: 'draft', to: 'review' },
  { id: 'e2', from: 'review', to: 'approved', label: 'Yes' },
];

/* The label also appears in the outline list, so a node is found by the id React Flow puts on its wrapper. */
const wrapperOf = (label: string) => {
  const id = nodes.find((node) => node.label === label)?.id;
  const wrapper = document.querySelector(`.react-flow__node[data-id="${id}"]`);
  if (!wrapper) throw new Error(`no node wrapper for ${label}`);
  return wrapper;
};

describe('Diagram', () => {
  it('names the viewport, describes it by the outline, and lists each node with the edges leaving it', () => {
    render(<Diagram label="Approval process" nodes={nodes} edges={edges} />);
    const outline = screen.getByRole('list', { name: 'Diagram outline' });
    expect(outline).toHaveTextContent('→ Approved: Yes');
    expect(screen.getByRole('region', { name: 'Approval process' })).toHaveAttribute('aria-describedby', outline.id);
  });

  it('makes no node focusable', () => {
    render(<Diagram label="Approval process" nodes={nodes} edges={edges} />);
    expect(wrapperOf('Draft')).not.toHaveAttribute('tabindex');
  });

  it('ships a named loading state', () => {
    render(<Diagram.Skeleton label="Loading process" />);
    expect(screen.getByRole('status', { name: 'Loading process' })).toBeInTheDocument();
  });
});

describe('DiagramEditor', () => {
  function renderEditor() {
    const onConnect = vi.fn();
    const onRename = vi.fn();
    render(<DiagramEditor label="Approval process" nodes={nodes} edges={edges} onConnect={onConnect} onRename={onRename} />);
    return { onConnect, onRename };
  }

  it('makes every node focusable for the runtime’s keyboard model', () => {
    renderEditor();
    expect(wrapperOf('Draft')).toHaveAttribute('tabindex', '0');
  });

  it('connects from the keyboard with C on one node and C on another, announcing the state between', () => {
    const { onConnect } = renderEditor();
    fireEvent.keyDown(wrapperOf('Approved'), { key: 'c' });
    expect(screen.getByText(/Connecting from Approved/)).toBeInTheDocument();
    fireEvent.keyDown(wrapperOf('Draft'), { key: 'C' });
    expect(onConnect).toHaveBeenCalledWith('approved', 'draft');
  });

  it('cancels a keyboard connection with Escape, and never connects a node to itself', () => {
    const { onConnect } = renderEditor();
    fireEvent.keyDown(wrapperOf('Draft'), { key: 'c' });
    fireEvent.keyDown(wrapperOf('Draft'), { key: 'Escape' });
    fireEvent.keyDown(wrapperOf('Review'), { key: 'c' });
    fireEvent.keyDown(wrapperOf('Review'), { key: 'c' });
    expect(onConnect).not.toHaveBeenCalled();
  });

  it('ignores C pressed with a modifier, so copy shortcuts stay copy shortcuts', () => {
    renderEditor();
    fireEvent.keyDown(wrapperOf('Draft'), { key: 'c', metaKey: true });
    expect(screen.queryByText(/Connecting from/)).not.toBeInTheDocument();
  });

  it('asks to rename the focused node with F2', () => {
    const { onRename } = renderEditor();
    fireEvent.keyDown(wrapperOf('Review'), { key: 'F2' });
    expect(onRename).toHaveBeenCalledWith({ kind: 'node', id: 'review' });
  });

  it('ships a named loading state', () => {
    render(<DiagramEditor.Skeleton label="Loading editor" />);
    expect(screen.getByRole('status', { name: 'Loading editor' })).toBeInTheDocument();
  });
});
