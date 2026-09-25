import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DiagramEditor } from './diagram-editor.js';
import { SCROLL_PANS } from './diagram-flow.js';
import type { DiagramNode } from './diagram.types.js';

const NODES: DiagramNode[] = [{ id: 'draft', label: 'Draft', position: { x: 0, y: 0 } }];
const PALETTE = [
  { kind: 'stage', label: 'Stage', shape: 'rect' as const, description: 'A step the work stands in' },
  { kind: 'decision', label: 'Keputusan', shape: 'diamond' as const },
];

describe('DiagramEditor palette', () => {
  it('asks for a node of the tapped kind, in whole cells', async () => {
    const onAddNode = vi.fn();
    render(<DiagramEditor label="Flow" nodes={NODES} edges={[]} palette={PALETTE} onAddNode={onAddNode} paletteLabel="Tambah" />);
    await act(async () => {});
    fireEvent.click(screen.getByRole('button', { name: 'Keputusan' }));
    expect(onAddNode).toHaveBeenCalledTimes(1);
    const [request] = onAddNode.mock.calls[0] ?? [];
    expect(request.kind).toBe('decision');
    expect(Number.isInteger(request.position.x) && Number.isInteger(request.position.y)).toBe(true);
  });

  it('asks for the dragged kind where it is dropped, and ignores a drop that is not from the palette', async () => {
    const onAddNode = vi.fn();
    render(<DiagramEditor label="Flow" nodes={NODES} edges={[]} palette={PALETTE} onAddNode={onAddNode} />);
    await act(async () => {});
    const viewport = screen.getByRole('region', { name: 'Flow' });
    const payload = (kind: string) => ({ dataTransfer: { getData: () => kind, types: ['application/x-cb-diagram-kind'] }, clientX: 100, clientY: 60 });
    fireEvent.drop(viewport, payload('stage'));
    fireEvent.drop(viewport, payload('not-a-kind'));
    expect(onAddNode).toHaveBeenCalledTimes(1);
    expect(onAddNode.mock.calls[0]?.[0].kind).toBe('stage');
  });

  it('makes each palette item draggable and a button, named by its label', () => {
    render(<DiagramEditor label="Flow" nodes={NODES} edges={[]} palette={PALETTE} onAddNode={vi.fn()} paletteLabel="Tambah" />);
    const group = screen.getByRole('group', { name: 'Tambah' });
    expect(screen.getByRole('button', { name: 'Stage' })).toHaveAttribute('draggable', 'true');
    expect(group).toContainElement(screen.getByRole('button', { name: 'Stage' }));
  });
});

describe('DiagramEditor rename in place', () => {
  const renaming = () => {
    const onRenameSubmit = vi.fn();
    const onRenameCancel = vi.fn();
    render(
      <DiagramEditor label="Flow" nodes={NODES} edges={[]} editingId="draft"
        onRenameSubmit={onRenameSubmit} onRenameCancel={onRenameCancel} renameLabel={(label) => `Ganti nama ${label}`} />,
    );
    // The runtime keeps a node visibility: hidden until it is measured, which jsdom never does, so the input is
    // found by its class and its name read from the attribute.
    const input = document.querySelector<HTMLInputElement>('.cb-diagram__rename');
    if (!input) throw new Error('no rename input');
    expect(input).toHaveAttribute('aria-label', 'Ganti nama Draft');
    return { onRenameSubmit, onRenameCancel, input };
  };

  it('saves a new name on Enter', () => {
    const { onRenameSubmit, input } = renaming();
    fireEvent.change(input, { target: { value: '  Survei lokasi ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onRenameSubmit).toHaveBeenCalledWith('draft', 'Survei lokasi');
  });

  it('cancels on Escape, and treats an empty name as a cancel', () => {
    const { onRenameSubmit, onRenameCancel, input } = renaming();
    fireEvent.keyDown(input, { key: 'Escape' });
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onRenameCancel).toHaveBeenCalledTimes(2);
    expect(onRenameSubmit).not.toHaveBeenCalled();
  });
});

describe('scroll and zoom', () => {
  it('pans on scroll and zooms only on pinch or the controls', () => {
    expect(SCROLL_PANS).toEqual({ panOnScroll: true, zoomOnScroll: false, zoomOnPinch: true });
  });
});
