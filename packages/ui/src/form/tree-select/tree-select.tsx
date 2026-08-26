'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import { ChevronsUpDown } from 'lucide-react';
import { useEffect, useId, useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn.js';
import { Tree, type TreeNode } from '../../data/tree/tree.js';
import { useFieldWiring } from '../field.js';
import { TreeSelectSkeleton, type TreeSelectSkeletonProps } from './tree-select.skeleton.js';

export interface TreeSelectProps {
  nodes: TreeNode[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (path: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  label: string;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  motion?: boolean;
}

/** One value chosen from injected hierarchy. Popover owns anchoring/dismissal; Tree owns traversal. */
function TreeSelectRoot({ nodes, value, defaultValue = null, onValueChange, open, defaultOpen = false, onOpenChange, label, placeholder = 'Select…', name, disabled = false, motion = true }: TreeSelectProps) {
  const field = useFieldWiring();
  const generatedId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const currentValue = value !== undefined ? value : internalValue;
  const currentOpen = open ?? internalOpen;
  const effectiveOpen = disabled ? false : currentOpen;
  const selectedLabel = currentValue ? labelForPath(nodes, currentValue) : undefined;
  const setOpen = (next: boolean) => {
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };
  const select = (path: string) => {
    if (value === undefined) setInternalValue(path);
    onValueChange?.(path);
    setOpen(false);
  };

  useEffect(() => {
    if (disabled && currentOpen) setOpen(false);
  }, [disabled, currentOpen]);

  return (
    <BasePopover.Root open={effectiveOpen} onOpenChange={setOpen}>
      <BasePopover.Trigger
        disabled={disabled}
        render={<button type="button" id={field?.controlId ?? generatedId} className={cn('cb-tree-select', !motion && 'cb-tree-select--motionless')} aria-label={label} aria-describedby={field?.describedBy} aria-invalid={field?.invalid || undefined} aria-required={field?.required || undefined}><span className={cn('cb-tree-select__value', !selectedLabel && 'cb-tree-select__placeholder')}>{selectedLabel ?? placeholder}</span><ChevronsUpDown className="cb-tree-select__icon" aria-hidden="true" /></button>}
      />
      {name && currentValue ? <input type="hidden" name={name} value={currentValue} /> : null}
      <BasePopover.Portal>
        <BasePopover.Positioner side="bottom" align="start" className="cb-tree-select__positioner">
          <BasePopover.Popup className={cn('cb-tree-select__popup', !motion && 'cb-tree-select__popup--motionless')}>
            <Tree nodes={nodes} selectedPath={currentValue ?? undefined} onSelectedPathChange={select} motion={motion} aria-label={`${label} options`} />
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}

function labelForPath(nodes: TreeNode[], path: string, parts: string[] = []): ReactNode | undefined {
  for (const node of nodes) {
    const next = [...parts, node.key];
    const nodePath = next.map(encodeURIComponent).join('/');
    if (nodePath === path) return node.label;
    const found = node.children ? labelForPath(node.children, path, next) : undefined;
    if (found) return found;
  }
  return undefined;
}

export const TreeSelect = Object.assign(TreeSelectRoot, { Skeleton: TreeSelectSkeleton });
export type { TreeSelectSkeletonProps };
