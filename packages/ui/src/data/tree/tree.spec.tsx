import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Tree, type TreeNode } from './tree.js';

const stylesheet = readFileSync(join(process.cwd(), 'packages/ui/src/data/tree/tree.css'), 'utf8');
const nodes: TreeNode[] = [
  {
    key: 'projects',
    label: 'Projects',
    content: '3',
    children: [
      { key: 'active', label: 'Active projects' },
      { key: 'archived', label: 'Archived projects', disabled: true },
    ],
  },
  { key: 'settings', label: 'Settings' },
];

describe('Tree', () => {
  it('renders a labelled tree with nested groups, levels, selected state, and static content', () => {
    render(<Tree nodes={nodes} defaultExpandedPaths={['projects']} selectedPath="projects/active" aria-label="Project hierarchy" />);
    expect(screen.getByRole('tree', { name: 'Project hierarchy' })).toBeTruthy();
    expect(screen.getAllByRole('group')).toHaveLength(1);
    expect(screen.getByRole('treeitem', { name: /Projects/ })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('treeitem', { name: 'Active projects' })).toHaveAttribute('aria-level', '2');
    expect(screen.getByRole('treeitem', { name: 'Active projects' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('3')).toBeVisible();
  });

  it('follows roving tree focus and hierarchy keys while skipping disabled nodes', () => {
    render(<Tree nodes={nodes} />);
    const projects = screen.getByRole('treeitem', { name: /Projects/ });
    projects.focus();
    fireEvent.keyDown(projects, { key: 'ArrowRight' });
    expect(projects).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(projects, { key: 'ArrowRight' });
    expect(document.activeElement).toHaveAccessibleName('Active projects');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(document.activeElement).toHaveAccessibleName('Settings');
    fireEvent.keyDown(document.activeElement!, { key: 'Home' });
    expect(document.activeElement).toHaveAccessibleName('Projects 3');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
    expect(document.activeElement).toHaveAccessibleName('Projects 3');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
    expect(projects).toHaveAttribute('aria-expanded', 'false');
    fireEvent.keyDown(projects, { key: 'End' });
    expect(document.activeElement).toHaveAccessibleName('Settings');
  });

  it('owns uncontrolled selection and reports controlled selection and expansion without mutating them', () => {
    const onSelectedPathChange = vi.fn();
    const onExpandedPathsChange = vi.fn();
    const { rerender } = render(<Tree nodes={nodes} onSelectedPathChange={onSelectedPathChange} />);
    fireEvent.click(screen.getByRole('treeitem', { name: /Projects/ }));
    expect(onSelectedPathChange).toHaveBeenLastCalledWith('projects');
    expect(screen.getByRole('treeitem', { name: /Projects/ })).toHaveAttribute('aria-selected', 'true');

    rerender(<Tree nodes={nodes} selectedPath="settings" expandedPaths={[]} onExpandedPathsChange={onExpandedPathsChange} />);
    const projects = screen.getByRole('treeitem', { name: /Projects/ });
    fireEvent.keyDown(projects, { key: 'ArrowRight' });
    expect(onExpandedPathsChange).toHaveBeenLastCalledWith(['projects']);
    expect(projects).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('treeitem', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');
  });

  it('keeps recursive paths independent when local keys repeat', () => {
    render(
      <Tree
        defaultExpandedPaths={['alpha', 'beta', 'alpha/group']}
        selectedPath="alpha/group/leaf"
        nodes={[
          { key: 'alpha', label: 'Alpha', children: [{ key: 'group', label: 'Alpha group', children: [{ key: 'leaf', label: 'Alpha leaf' }] }] },
          { key: 'beta', label: 'Beta', children: [{ key: 'group', label: 'Beta group', children: [{ key: 'leaf', label: 'Beta leaf' }] }] },
        ]}
      />,
    );
    expect(screen.getByRole('treeitem', { name: 'Alpha group' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('treeitem', { name: 'Beta group' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('treeitem', { name: 'Alpha leaf' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.queryByRole('treeitem', { name: 'Beta leaf' })).not.toBeInTheDocument();
  });

  it('rejects duplicate sibling keys while allowing identical keys in separate branches', () => {
    expect(() => render(<Tree nodes={[{ key: 'duplicate', label: 'First' }, { key: 'duplicate', label: 'Second' }]} />)).toThrow('unique sibling keys');
    expect(() => render(<Tree nodes={[
      { key: 'alpha', label: 'Alpha', children: [{ key: 'same', label: 'Alpha child' }] },
      { key: 'beta', label: 'Beta', children: [{ key: 'same', label: 'Beta child' }] },
    ]} />)).not.toThrow();
  });

  it('does not move ArrowLeft focus to a disabled parent and syncs roving focus to visible selected paths', () => {
    const { rerender } = render(
      <Tree
        defaultExpandedPaths={['disabled-parent']}
        nodes={[{ key: 'disabled-parent', label: 'Disabled parent', disabled: true, children: [{ key: 'child', label: 'Enabled child' }] }]}
      />,
    );
    const child = screen.getByRole('treeitem', { name: 'Enabled child' });
    child.focus();
    fireEvent.keyDown(child, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(child);

    rerender(<Tree nodes={nodes} expandedPaths={['projects']} selectedPath="projects/active" />);
    expect(screen.getByRole('treeitem', { name: 'Active projects' })).toHaveAttribute('tabindex', '0');
    rerender(<Tree nodes={nodes} expandedPaths={['projects']} selectedPath="settings" />);
    expect(screen.getByRole('treeitem', { name: 'Settings' })).toHaveAttribute('tabindex', '0');
  });

  it('keeps keyboard roving focus after leaving a selected node until selectedPath changes externally', () => {
    const { rerender } = render(<Tree nodes={nodes} expandedPaths={['projects']} selectedPath="projects/active" />);
    const active = screen.getByRole('treeitem', { name: 'Active projects' });
    active.focus();
    fireEvent.keyDown(active, { key: 'ArrowDown' });
    expect(screen.getByRole('treeitem', { name: 'Settings' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('treeitem', { name: 'Active projects' })).toHaveAttribute('tabindex', '-1');

    rerender(<Tree nodes={nodes} expandedPaths={['projects']} selectedPath="projects" />);
    expect(screen.getByRole('treeitem', { name: /Projects/ })).toHaveAttribute('tabindex', '0');
  });

  it('uses encoded paths for special-character keys and leaves an all-disabled tree without a roving tab stop', () => {
    render(<Tree defaultExpandedPaths={['folder%2Fone']} selectedPath="folder%2Fone/leaf%20node" nodes={[
      { key: 'folder/one', label: 'Folder', children: [{ key: 'leaf node', label: 'Leaf' }] },
    ]} />);
    expect(screen.getByRole('treeitem', { name: 'Leaf' })).toHaveAttribute('aria-selected', 'true');

    const { container } = render(<Tree nodes={[{ key: 'disabled', label: 'Disabled', disabled: true }]} />);
    expect(container.querySelector('[role="treeitem"][tabindex="0"]')).toBeNull();
  });

  it('keeps static expansion state visible when motion is disabled or reduced', () => {
    render(<Tree nodes={nodes} defaultExpandedPaths={['projects']} motion={false} />);
    expect(screen.getByRole('tree')).toHaveClass('cb-tree--motion-off');
    expect(screen.getByRole('treeitem', { name: /Projects/ })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('treeitem', { name: 'Active projects' })).toBeVisible();
    const reducedRules = stylesheet.slice(stylesheet.indexOf('@media (prefers-reduced-motion: reduce)'));
    expect(reducedRules).toContain('.cb-tree__chevron--expanded { display: block; }');
    expect(stylesheet).toContain('.cb-tree--motion-off .cb-tree__chevron { transition: none; }');
  });
});

describe('Tree.Skeleton', () => {
  it('matches noninteractive tree geometry', () => {
    render(<Tree.Skeleton items={3} size="lg" />);
    const tree = screen.getByRole('tree', { hidden: true });
    expect(tree).toHaveClass('cb-tree--skeleton', 'cb-tree--lg');
    expect(tree.querySelectorAll('.cb-tree__node')).toHaveLength(3);
  });
});
