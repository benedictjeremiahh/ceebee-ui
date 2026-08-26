import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Field } from '../field.js';
import { TreeSelect } from './tree-select.js';

const nodes = [{ key: 'team', label: 'Team', children: [{ key: 'design', label: 'Design' }] }, { key: 'finance', label: 'Finance', disabled: true }];

describe('TreeSelect', () => {
  it('opens an anchored tree and selects an enabled recursive path', () => {
    const onValueChange = vi.fn();
    render(<TreeSelect nodes={nodes} label="Owner" defaultOpen onValueChange={onValueChange} />);
    expect(screen.getByRole('tree', { name: 'Owner options' })).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('treeitem', { name: 'Team' }), { key: 'ArrowRight' });
    fireEvent.click(screen.getByRole('treeitem', { name: 'Design' }));
    expect(onValueChange).toHaveBeenLastCalledWith('team/design');
    expect(screen.queryByRole('tree')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Owner' })).toHaveTextContent('Design');
  });

  it('keeps controlled value and open state with its caller', () => {
    const onOpenChange = vi.fn();
    const onValueChange = vi.fn();
    render(<TreeSelect nodes={nodes} label="Owner" value="team/design" open={false} onOpenChange={onOpenChange} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Owner' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.queryByRole('tree')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Owner' })).toHaveTextContent('Design');
  });

  it('treats a controlled null value as empty instead of falling back to defaultValue', () => {
    render(<TreeSelect nodes={nodes} label="Owner" value={null} defaultValue="team/design" placeholder="Choose owner" />);
    expect(screen.getByRole('button', { name: 'Owner' })).toHaveTextContent('Choose owner');
    expect(screen.getByRole('button', { name: 'Owner' })).not.toHaveTextContent('Design');
  });

  it('closes and makes the hierarchy unavailable when disabled while open', () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(<TreeSelect nodes={nodes} label="Owner" defaultOpen onOpenChange={onOpenChange} />);
    expect(screen.getByRole('tree', { name: 'Owner options' })).toBeInTheDocument();
    rerender(<TreeSelect nodes={nodes} label="Owner" defaultOpen disabled onOpenChange={onOpenChange} />);
    expect(screen.queryByRole('tree', { name: 'Owner options' })).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('wires Field and disabled semantics, and has a noninteractive Skeleton', () => {
    const { container } = render(<Field label="Owner" hint="Choose a team" error="Required" required><TreeSelect nodes={nodes} label="Owner" disabled /></Field>);
    const trigger = screen.getByRole('button', { name: 'Owner' });
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger).toHaveAttribute('aria-required', 'true');
    expect(trigger.getAttribute('aria-describedby')).toContain('hint');
    const skeleton = render(<TreeSelect.Skeleton />).container;
    expect(skeleton.querySelector('.cb-tree-select--skeleton')).toBeTruthy();
  });
});
