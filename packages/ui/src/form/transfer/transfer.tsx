'use client';

import { useEffect, useId, useMemo, useState, type ReactNode } from 'react';
import { TransferSkeleton } from './transfer.skeleton.js';

export interface TransferItem {
  /** Stable identity. Keys must be unique within one Transfer. */
  key: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface TransferProps {
  /** The application supplies the complete, stable collection; Transfer never fetches it. */
  items: TransferItem[];
  /** Keys currently assigned to the target list. Supplying this makes assignment controlled. */
  targetKeys?: string[];
  defaultTargetKeys?: string[];
  onTargetKeysChange?: (keys: string[]) => void;
  sourceTitle?: ReactNode;
  targetTitle?: ReactNode;
  disabled?: boolean;
  'aria-label'?: string;
}

function normalizeTargetKeys(items: TransferItem[], keys: string[]) {
  const itemKeys = new Set(items.map((item) => item.key));
  const seen = new Set<string>();
  return keys.filter((key) => itemKeys.has(key) && !seen.has(key) && (seen.add(key), true));
}

function validateItemKeys(items: TransferItem[]) {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.key)) throw new RangeError(`Transfer item keys must be unique: ${item.key}`);
    seen.add(item.key);
  }
}

/**
 * Two persistent checkbox lists for assigning supplied records between source and target.
 * `targetKeys` is controlled or uncontrolled assignment state; transient per-list checkbox
 * selection is deliberately internal, cleared only for records that are moved.
 */
function TransferRoot({
  items,
  targetKeys,
  defaultTargetKeys = [],
  onTargetKeysChange,
  sourceTitle = 'Available',
  targetTitle = 'Selected',
  disabled = false,
  'aria-label': ariaLabel = 'Transfer items',
}: TransferProps) {
  validateItemKeys(items);
  const generatedId = useId();
  const controlled = targetKeys !== undefined;
  const [internalTargetKeys, setInternalTargetKeys] = useState(() => normalizeTargetKeys(items, defaultTargetKeys));
  const [sourceSelection, setSourceSelection] = useState<Set<string>>(() => new Set());
  const [targetSelection, setTargetSelection] = useState<Set<string>>(() => new Set());
  const assignedKeys = normalizeTargetKeys(items, controlled ? targetKeys ?? [] : internalTargetKeys);
  const assigned = useMemo(() => new Set(assignedKeys), [assignedKeys]);
  const sourceItems = items.filter((item) => !assigned.has(item.key));
  const targetItems = items.filter((item) => assigned.has(item.key));

  // In controlled mode, a request does not move an item until the caller confirms it through
  // targetKeys. Keep its transient selection during that interval; prune only after a side changes.
  useEffect(() => {
    const sourceKeys = new Set(sourceItems.map((item) => item.key));
    const targetKeys = new Set(targetItems.map((item) => item.key));
    setSourceSelection((previous) => intersection(previous, sourceKeys));
    setTargetSelection((previous) => intersection(previous, targetKeys));
  }, [sourceItems, targetItems]);

  const updateAssignment = (next: string[]) => {
    if (!controlled) setInternalTargetKeys(next);
    onTargetKeysChange?.(next);
  };

  const toggle = (key: string, side: 'source' | 'target', checked: boolean) => {
    const setSelection = side === 'source' ? setSourceSelection : setTargetSelection;
    setSelection((previous) => {
      const next = new Set(previous);
      if (checked) next.add(key);
      else next.delete(key);
      return next;
    });
  };

  const movable = (list: TransferItem[], selected: Set<string>) => list
    .filter((item) => selected.has(item.key) && !item.disabled)
    .map((item) => item.key);

  const moveToTarget = () => {
    if (disabled) return;
    const moving = movable(sourceItems, sourceSelection);
    if (moving.length === 0) return;
    updateAssignment([...assignedKeys, ...moving]);
    if (!controlled) setSourceSelection((previous) => without(previous, moving));
  };

  const moveToSource = () => {
    if (disabled) return;
    const moving = movable(targetItems, targetSelection);
    if (moving.length === 0) return;
    const movingSet = new Set(moving);
    updateAssignment(assignedKeys.filter((key) => !movingSet.has(key)));
    if (!controlled) setTargetSelection((previous) => without(previous, moving));
  };

  const movableSource = movable(sourceItems, sourceSelection);
  const movableTarget = movable(targetItems, targetSelection);

  return (
    <section className="cb-transfer" aria-label={ariaLabel} data-disabled={disabled || undefined}>
      <TransferList
        id={`${generatedId}-source`}
        title={sourceTitle}
        items={sourceItems}
        selection={sourceSelection}
        disabled={disabled}
        onToggle={(key, checked) => toggle(key, 'source', checked)}
      />
      <div className="cb-transfer__actions" aria-label="Transfer actions">
        <button type="button" className="cb-transfer__action" onClick={moveToTarget} disabled={disabled || movableSource.length === 0} aria-label="Move selected to target">
          →
        </button>
        <button type="button" className="cb-transfer__action" onClick={moveToSource} disabled={disabled || movableTarget.length === 0} aria-label="Move selected to source">
          ←
        </button>
      </div>
      <TransferList
        id={`${generatedId}-target`}
        title={targetTitle}
        items={targetItems}
        selection={targetSelection}
        disabled={disabled}
        onToggle={(key, checked) => toggle(key, 'target', checked)}
      />
    </section>
  );
}

function without(previous: Set<string>, keys: string[]) {
  const next = new Set(previous);
  keys.forEach((key) => next.delete(key));
  return next;
}

function intersection(previous: Set<string>, valid: Set<string>) {
  const next = new Set([...previous].filter((key) => valid.has(key)));
  return next.size === previous.size ? previous : next;
}

function TransferList({
  id,
  title,
  items,
  selection,
  disabled,
  onToggle,
}: {
  id: string;
  title: ReactNode;
  items: TransferItem[];
  selection: Set<string>;
  disabled: boolean;
  onToggle: (key: string, checked: boolean) => void;
}) {
  return (
    <fieldset className="cb-transfer__list" disabled={disabled}>
      <legend className="cb-transfer__title">{title}</legend>
      <span className="cb-transfer__count" aria-live="polite">{items.length}</span>
      <ul className="cb-transfer__items">
        {items.map((item) => {
          const itemId = `${id}-${encodeURIComponent(item.key)}`;
          const descriptionId = item.description ? `${itemId}-description` : undefined;
          return (
            <li className="cb-transfer__item" key={item.key} data-disabled={item.disabled || undefined}>
              <input
                id={itemId}
                className="cb-transfer__checkbox"
                type="checkbox"
                checked={selection.has(item.key)}
                disabled={item.disabled}
                aria-describedby={descriptionId}
                onChange={(event) => onToggle(item.key, event.target.checked)}
              />
              <span className="cb-transfer__content">
                <label className="cb-transfer__label" htmlFor={itemId}>
                <span>{item.label}</span>
                </label>
                {item.description ? <span className="cb-transfer__description" id={descriptionId}>{item.description}</span> : null}
              </span>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

export const Transfer = Object.assign(TransferRoot, { Skeleton: TransferSkeleton });
