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

describe('DiagramEditor inspector and legend', () => {
  it('renders the consumer inspector with the selected node described, and nothing selected as null', () => {
    const seen: (string | null)[] = [];
    const { rerender } = render(
      <DiagramEditor
        label="Flow"
        nodes={nodes}
        edges={edges}
        renderInspector={(selection) => {
          seen.push(selection?.kind === 'node' ? `${selection.node.label}:${selection.outgoing.map((l) => l.node.label).join(',')}` : null);
          return <p>inspector</p>;
        }}
        inspectorLabel="Pilihan"
      />,
    );
    expect(screen.getByRole('complementary', { name: 'Pilihan' })).toBeDefined();
    expect(seen.at(-1)).toBeNull();
    rerender(
      <DiagramEditor
        label="Flow"
        nodes={nodes}
        edges={edges}
        selectedId="review"
        renderInspector={(selection) => {
          seen.push(selection?.kind === 'node' ? `${selection.node.label}:${selection.outgoing.map((l) => l.node.label).join(',')}` : null);
          return null;
        }}
      />,
    );
    expect(seen.at(-1)).toBe('Review:Approved');
  });

  it('lists only the shapes in use that the consumer named', () => {
    render(<Diagram label="Flow" nodes={nodes} edges={edges} legendLabels={{ rect: 'Tahap', diamond: 'Keputusan', pill: 'Selesai' }} />);
    const legend = document.querySelector('.cb-diagram__legend');
    expect(legend?.textContent).toBe('TahapKeputusan');
  });

  it('keeps the full label as a tooltip when it is clamped', () => {
    render(<Diagram label="Flow" nodes={nodes} edges={edges} />);
    expect(document.querySelector('.cb-diagram__label[title="Review"]')).not.toBeNull();
  });
});

describe('Diagram explicit legend', () => {
  it('lists each given entry with its tone, so two pills can mean different ends', () => {
    render(
      <Diagram
        label="Flow"
        nodes={nodes}
        edges={edges}
        legend={[
          { shape: 'pill', tone: 'success', label: 'Selesai' },
          { shape: 'pill', tone: 'danger', label: 'Kalah' },
        ]}
      />,
    );
    const swatches = [...document.querySelectorAll('.cb-diagram__legend-swatch')].map((s) => s.getAttribute('data-tone'));
    expect(swatches).toEqual(['success', 'danger']);
    expect(document.querySelector('.cb-diagram__legend')?.textContent).toBe('SelesaiKalah');
  });
});
