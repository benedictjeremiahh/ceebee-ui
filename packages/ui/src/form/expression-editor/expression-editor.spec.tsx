import { act, render, screen } from '@testing-library/react';
import { EditorView } from '@codemirror/view';
import { describe, expect, it, vi } from 'vitest';
import { ExpressionEditor } from './expression-editor.js';

function viewOf(element: HTMLElement) {
  const view = EditorView.findFromDOM(element);
  if (!view) throw new Error('Expected a mounted editor');
  return view;
}

describe('ExpressionEditor', () => {
  it('distinguishes variables, decimal constants, named constants and unknown identifiers', () => {
    const { container } = render(<ExpressionEditor label="Formula" value="length * 0.5 + pi + typo" variables={['length']} constants={['pi']} onChange={vi.fn()} />);
    expect(container.querySelector('.cb-expression-editor__variable')?.textContent).toBe('length');
    expect([...container.querySelectorAll('.cb-expression-editor__constant')].map(node => node.textContent)).toEqual(['0.5', 'pi']);
    expect(container.querySelector('.cb-expression-editor__invalid')?.textContent).toBe('typo');
  });

  it('emits user changes and synchronizes external updates without echoing them', () => {
    const change = vi.fn();
    const { rerender } = render(<ExpressionEditor label="Formula" value="length" variables={['length']} onChange={change} />);
    const view = viewOf(screen.getByRole('textbox', { name: 'Formula' }));
    act(() => view.dispatch({ changes: { from: 6, insert: ' * 0.5' } }));
    expect(change).toHaveBeenCalledWith('length * 0.5');
    change.mockClear();
    rerender(<ExpressionEditor label="Formula" value="0.25" variables={['length']} onChange={change} />);
    expect(view.state.doc.toString()).toBe('0.25');
    expect(change).not.toHaveBeenCalled();
  });

  it('reclassifies identifiers when input keys change without replacing the editor', () => {
    const props = { label: 'Formula', value: 'width', onChange: vi.fn() };
    const { container, rerender } = render(<ExpressionEditor {...props} variables={[]} />);
    const view = viewOf(screen.getByRole('textbox'));
    expect(container.querySelector('.cb-expression-editor__invalid')).toHaveTextContent('width');
    rerender(<ExpressionEditor {...props} variables={['width']} />);
    expect(viewOf(screen.getByRole('textbox'))).toBe(view);
    expect(container.querySelector('.cb-expression-editor__variable')).toHaveTextContent('width');
  });

  it('exposes field associations and invalid or disabled state', () => {
    render(<ExpressionEditor label="Formula" id="formula" describedBy="hint problem" required invalid disabled value="length" variables={['length']} onChange={vi.fn()} />);
    const field = screen.getByRole('textbox', { name: 'Formula' });
    expect(field).toHaveAttribute('id', 'formula');
    expect(field).toHaveAttribute('aria-describedby', 'hint problem');
    expect(field).toHaveAttribute('aria-required', 'true');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveAttribute('contenteditable', 'false');
  });

  it('rejects oversized edits atomically and destroys its runtime on unmount', () => {
    const change = vi.fn();
    const { unmount } = render(<ExpressionEditor label="Formula" value="1" variables={[]} maxLength={5} onChange={change} />);
    const view = viewOf(screen.getByRole('textbox'));
    act(() => view.dispatch({ changes: { from: 1, insert: '23456' } }));
    expect(view.state.doc.toString()).toBe('1');
    expect(change).not.toHaveBeenCalled();
    const destroy = vi.spyOn(view, 'destroy');
    unmount();
    expect(destroy).toHaveBeenCalledOnce();
  });
});
