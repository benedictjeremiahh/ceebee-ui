'use client';

import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type MutableRefObject, type ReactNode } from 'react';
import { cn } from '../../lib/cn.js';
import { TreeSkeleton, type TreeSkeletonProps } from './tree.skeleton.js';

export type TreeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
export type TreeSize = 'sm' | 'md' | 'lg';

export interface TreeNode {
  key: string;
  label: ReactNode;
  /** Static supplementary content, such as a count or status. It must not introduce controls. */
  content?: ReactNode;
  disabled?: boolean;
  children?: TreeNode[];
}

export interface TreeProps {
  nodes: TreeNode[];
  expandedPaths?: string[];
  defaultExpandedPaths?: string[];
  onExpandedPathsChange?: (paths: string[]) => void;
  selectedPath?: string;
  defaultSelectedPath?: string;
  onSelectedPathChange?: (path: string) => void;
  size?: TreeSize;
  tone?: TreeTone;
  motion?: boolean;
  'aria-label'?: string;
}

interface VisibleNode {
  node: TreeNode;
  path: string;
  parentPath?: string;
  level: number;
  hasChildren: boolean;
}

/**
 * Inline hierarchy with the ARIA tree keyboard model. It is neither a navigation menu nor a
 * disclosure: Tree owns one roving treeitem focus and independently controlled expansion.
 */
function TreeRoot({
  nodes,
  expandedPaths,
  defaultExpandedPaths = [],
  onExpandedPathsChange,
  selectedPath,
  defaultSelectedPath,
  onSelectedPathChange,
  size = 'md',
  tone = 'brand',
  motion = true,
  'aria-label': ariaLabel = 'Tree',
}: TreeProps) {
  validateTreeNodes(nodes);
  const [uncontrolledExpandedPaths, setUncontrolledExpandedPaths] = useState(defaultExpandedPaths);
  const [uncontrolledSelectedPath, setUncontrolledSelectedPath] = useState(defaultSelectedPath);
  const currentExpandedPaths = expandedPaths ?? uncontrolledExpandedPaths;
  const currentSelectedPath = selectedPath ?? uncontrolledSelectedPath;
  const visibleNodes = useMemo(() => flattenVisible(nodes, currentExpandedPaths), [nodes, currentExpandedPaths]);
  const firstEnabledPath = visibleNodes.find(({ node }) => !node.disabled)?.path;
  const [activePath, setActivePath] = useState(() => selectedPath ?? defaultSelectedPath ?? firstEnabledPath);
  const currentActivePath = visibleNodes.some(({ path, node }) => path === activePath && !node.disabled)
    ? activePath
    : firstEnabledPath;
  useEffect(() => {
    if (selectedPath && visibleNodes.some(({ path, node }) => path === selectedPath && !node.disabled)) {
      setActivePath(selectedPath);
    }
  }, [selectedPath]);
  const itemRefs = useRef(new Map<string, HTMLDivElement>());

  const setExpanded = (next: string[]) => {
    if (expandedPaths === undefined) setUncontrolledExpandedPaths(next);
    onExpandedPathsChange?.(next);
  };
  const expand = (path: string) => {
    if (!currentExpandedPaths.includes(path)) setExpanded([...currentExpandedPaths, path]);
  };
  const collapse = (path: string) => {
    if (currentExpandedPaths.includes(path)) setExpanded(currentExpandedPaths.filter((item) => item !== path));
  };
  const select = (path: string) => {
    if (selectedPath === undefined) setUncontrolledSelectedPath(path);
    onSelectedPathChange?.(path);
  };
  const focusPath = (path: string) => {
    setActivePath(path);
    itemRefs.current.get(path)?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>, current: VisibleNode) => {
    const enabled = visibleNodes.filter(({ node }) => !node.disabled);
    const currentIndex = enabled.findIndex(({ path }) => path === current.path);
    const currentExpanded = currentExpandedPaths.includes(current.path);
    const child = enabled.find(({ parentPath }) => parentPath === current.path);

    if (event.key === 'ArrowDown' && currentIndex < enabled.length - 1) {
      event.preventDefault();
      focusPath(enabled[currentIndex + 1]!.path);
    } else if (event.key === 'ArrowUp' && currentIndex > 0) {
      event.preventDefault();
      focusPath(enabled[currentIndex - 1]!.path);
    } else if (event.key === 'Home' && enabled[0]) {
      event.preventDefault();
      focusPath(enabled[0].path);
    } else if (event.key === 'End' && enabled.at(-1)) {
      event.preventDefault();
      focusPath(enabled.at(-1)!.path);
    } else if (event.key === 'ArrowRight' && current.hasChildren) {
      event.preventDefault();
      if (!currentExpanded) expand(current.path);
      else if (child) focusPath(child.path);
    } else if (event.key === 'ArrowLeft') {
      if (current.hasChildren && currentExpanded) {
        event.preventDefault();
        collapse(current.path);
      } else if (current.parentPath) {
        event.preventDefault();
        const parent = nearestEnabledParent(current.parentPath, visibleNodes);
        if (parent) focusPath(parent);
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      select(current.path);
    }
  };

  return (
    <div
      role="tree"
      aria-label={ariaLabel}
      className={cn('cb-tree', `cb-tree--${size}`, `cb-tree--${tone}`, !motion && 'cb-tree--motion-off')}
    >
      <TreeGroup
        nodes={nodes}
        pathParts={[]}
        root
        level={1}
        parentPath={undefined}
        expandedPaths={currentExpandedPaths}
        selectedPath={currentSelectedPath}
        activePath={currentActivePath}
        refs={itemRefs}
        onFocusPath={focusPath}
        onSelect={select}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}

interface TreeGroupProps {
  nodes: TreeNode[];
  pathParts: string[];
  root?: boolean;
  level: number;
  parentPath: string | undefined;
  expandedPaths: string[];
  selectedPath: string | undefined;
  activePath: string | undefined;
  refs: MutableRefObject<Map<string, HTMLDivElement>>;
  onFocusPath: (path: string) => void;
  onSelect: (path: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>, current: VisibleNode) => void;
}

function TreeGroup({ nodes, pathParts, root = false, level, parentPath, expandedPaths, selectedPath, activePath, refs, onFocusPath, onSelect, onKeyDown }: TreeGroupProps) {
  return (
    <div role={root ? undefined : 'group'} className="cb-tree__group">
      {nodes.map((node) => {
        const parts = [...pathParts, node.key];
        const path = toPath(parts);
        const hasChildren = Boolean(node.children?.length);
        const expanded = expandedPaths.includes(path);
        const current: VisibleNode = { node, path, parentPath, level, hasChildren };

        return (
          <div key={path} className="cb-tree__node">
            <div
              ref={(element) => {
                if (element) refs.current.set(path, element);
                else refs.current.delete(path);
              }}
              role="treeitem"
              aria-level={level}
              aria-expanded={hasChildren ? expanded : undefined}
              aria-selected={selectedPath === path || undefined}
              aria-disabled={node.disabled || undefined}
              tabIndex={!node.disabled && activePath === path ? 0 : -1}
              className="cb-tree__item"
              data-selected={selectedPath === path || undefined}
              data-disabled={node.disabled || undefined}
              onFocus={() => onFocusPath(path)}
              onClick={() => {
                if (!node.disabled) onSelect(path);
              }}
              onKeyDown={(event) => onKeyDown(event, current)}
            >
              {hasChildren ? <TreeChevron expanded={expanded} /> : <span className="cb-tree__indent" aria-hidden="true" />}
              <span className="cb-tree__label">{node.label}</span>
              {node.content ? <span className="cb-tree__content">{node.content}</span> : null}
            </div>
            {hasChildren && expanded ? (
              <TreeGroup
                nodes={node.children!}
                pathParts={parts}
                level={level + 1}
                parentPath={path}
                expandedPaths={expandedPaths}
                selectedPath={selectedPath}
                activePath={activePath}
                refs={refs}
                onFocusPath={onFocusPath}
                onSelect={onSelect}
                onKeyDown={onKeyDown}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function TreeChevron({ expanded }: { expanded: boolean }) {
  return (
    <span className="cb-tree__chevrons" aria-hidden="true" data-expanded={expanded || undefined}>
      <ChevronRight className="cb-tree__chevron cb-tree__chevron--collapsed" />
      <ChevronDown className="cb-tree__chevron cb-tree__chevron--expanded" />
    </span>
  );
}

function flattenVisible(nodes: TreeNode[], expandedPaths: string[], pathParts: string[] = [], level = 1, parentPath?: string): VisibleNode[] {
  return nodes.flatMap((node) => {
    const parts = [...pathParts, node.key];
    const path = toPath(parts);
    const hasChildren = Boolean(node.children?.length);
    const current: VisibleNode = { node, path, parentPath, level, hasChildren };
    const children = hasChildren && expandedPaths.includes(path)
      ? flattenVisible(node.children!, expandedPaths, parts, level + 1, path)
      : [];
    return [current, ...children];
  });
}

function toPath(parts: string[]) {
  return parts.map(encodeURIComponent).join('/');
}

function nearestEnabledParent(path: string, visibleNodes: VisibleNode[]) {
  let candidate = visibleNodes.find((node) => node.path === path);
  while (candidate && candidate.node.disabled) {
    candidate = candidate.parentPath ? visibleNodes.find((node) => node.path === candidate!.parentPath) : undefined;
  }
  return candidate?.path;
}

function validateTreeNodes(nodes: TreeNode[], path: string[] = []) {
  const siblingKeys = new Set<string>();
  for (const node of nodes) {
    if (siblingKeys.has(node.key)) {
      const location = [...path, node.key].join(' / ') || node.key;
      throw new Error(`Tree requires unique sibling keys; duplicate key at ${location}.`);
    }
    siblingKeys.add(node.key);
    if (node.children?.length) validateTreeNodes(node.children, [...path, node.key]);
  }
}

export const Tree = Object.assign(TreeRoot, { Skeleton: TreeSkeleton });

export type { TreeSkeletonProps };
