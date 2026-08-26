"use client";

import { Popover as BasePopover } from '@base-ui/react/popover';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { type KeyboardEvent, type ReactNode, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useFieldWiring } from '../field.js';
import { CascaderSkeleton } from './cascader.skeleton.js';

export interface CascaderOption {
  key: string;
  label: ReactNode;
  disabled?: boolean;
  children?: CascaderOption[];
}

export interface CascaderProps {
  options: CascaderOption[];
  label: string;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (path: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  motion?: boolean;
}

interface Column {
  options: CascaderOption[];
  activeKey: string;
}

function firstEnabledKey(options: CascaderOption[]) {
  return options.find((option) => !option.disabled)?.key;
}

function findOption(options: CascaderOption[], key: string | undefined) {
  return options.find((option) => option.key === key);
}

function isLeafPath(options: CascaderOption[], path: string[]) {
  let current = options;
  for (const key of path) {
    const option = findOption(current, key);
    if (!option || option.disabled) return false;
    current = option.children ?? [];
  }
  return path.length > 0 && current.length === 0;
}

function labelsForPath(options: CascaderOption[], path: string[]) {
  const labels: ReactNode[] = [];
  let current = options;
  for (const key of path) {
    const option = findOption(current, key);
    if (!option) return [];
    labels.push(option.label);
    current = option.children ?? [];
  }
  return labels;
}

function validateOptions(options: CascaderOption[], ancestors: string[] = []) {
  const keys = new Set<string>();
  for (const option of options) {
    if (keys.has(option.key)) throw new Error(`Cascader requires unique sibling keys; duplicate key at ${[...ancestors, option.key].join(' / ')}.`);
    keys.add(option.key);
    if (option.children?.length) validateOptions(option.children, [...ancestors, option.key]);
  }
}

function columnsForPath(options: CascaderOption[], path: string[]): Column[] {
  const columns: Column[] = [];
  let current = options;
  for (let index = 0; current.length > 0; index += 1) {
    const activeKey = findOption(current, path[index]) && !findOption(current, path[index])!.disabled
      ? path[index]!
      : firstEnabledKey(current);
    if (!activeKey) break;
    columns.push({ options: current, activeKey });
    if (index >= path.length - 1) break;
    const active = findOption(current, activeKey);
    current = active?.children ?? [];
  }
  return columns;
}

function optionId(popupId: string, path: string[]) {
  const encodedPath = path.map((key) => encodeURIComponent(key)).join('--');
  return `${popupId}-option-${encodedPath}`;
}

/** A hierarchical, column-by-column selection surface. It is not an inline tree or a flat Select. */
function CascaderRoot({
  options,
  label,
  value,
  defaultValue = [],
  onValueChange,
  placeholder = 'Select…',
  disabled = false,
  motion = true,
}: CascaderProps) {
  validateOptions(options);
  if (label.trim().length === 0) throw new Error('Cascader label must not be empty.');
  const field = useFieldWiring();
  const popupId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedPath = controlled ? value : internalValue;
  const [open, setOpen] = useState(false);
  const [activePath, setActivePath] = useState<string[]>([]);
  const [activeColumn, setActiveColumn] = useState(0);
  const columns = useMemo(() => columnsForPath(options, activePath), [options, activePath]);
  const selectedLabels = labelsForPath(options, selectedPath);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  const initialize = () => {
    const initialPath = isLeafPath(options, selectedPath) ? selectedPath : [firstEnabledKey(options)].filter((key): key is string => Boolean(key));
    setActivePath(initialPath);
    setActiveColumn(Math.max(0, initialPath.length - 1));
  };

  const openPopup = () => {
    if (disabled) return;
    initialize();
    setOpen(true);
  };

  const updatePathAtColumn = (columnIndex: number, key: string) => {
    setActivePath((current) => [...current.slice(0, columnIndex), key]);
    setActiveColumn(columnIndex);
  };

  const choose = (path: string[]) => {
    if (disabled || !isLeafPath(options, path)) return;
    if (!controlled) setInternalValue(path);
    onValueChange?.(path);
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const currentColumn = columns[activeColumn];
  const currentOption = currentColumn ? findOption(currentColumn.options, currentColumn.activeKey) : undefined;
  const activeOptionId = open && currentColumn
    ? optionId(popupId, [...activePath.slice(0, activeColumn), currentColumn.activeKey])
    : undefined;

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (!open && (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      openPopup();
      return;
    }
    if (!open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    } else if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && currentColumn) {
      event.preventDefault();
      const enabled = currentColumn.options.filter((option) => !option.disabled);
      const index = enabled.findIndex((option) => option.key === currentColumn.activeKey);
      if (enabled.length > 0) updatePathAtColumn(activeColumn, enabled[(index + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length]!.key);
    } else if (event.key === 'ArrowRight' && currentOption?.children?.length) {
      event.preventDefault();
      const childKey = firstEnabledKey(currentOption.children);
      if (childKey) {
        setActivePath((current) => [...current.slice(0, activeColumn + 1), childKey]);
        setActiveColumn(activeColumn + 1);
      }
    } else if (event.key === 'ArrowLeft' && activeColumn > 0) {
      event.preventDefault();
      setActivePath((current) => current.slice(0, activeColumn));
      setActiveColumn(activeColumn - 1);
    } else if (event.key === 'Enter' && currentOption && !currentOption.children?.length) {
      event.preventDefault();
      choose(activePath.slice(0, activeColumn + 1));
    }
  };

  return (
    <BasePopover.Root open={open} onOpenChange={setOpen}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        className={`cb-cascader${!motion ? ' cb-cascader--motionless' : ''}`}
        id={field?.controlId}
        disabled={disabled}
        aria-describedby={field?.describedBy}
        aria-label={label}
        aria-invalid={field?.invalid || undefined}
        aria-required={field?.required || undefined}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? popupId : undefined}
        aria-activedescendant={activeOptionId}
        onClick={openPopup}
        onKeyDown={handleKeyDown}
      >
        <span className="cb-cascader__value">{selectedLabels.length ? selectedLabels.map((label, index) => <span key={index}>{index ? ' / ' : null}{label}</span>) : placeholder}</span>
        <ChevronDown className="cb-cascader__icon" aria-hidden="true" />
      </button>
      <BasePopover.Portal>
        <BasePopover.Positioner anchor={triggerRef} side="bottom" align="start" className="cb-cascader__positioner">
          <BasePopover.Popup id={popupId} aria-label="Cascader options" className={`cb-cascader__popup${!motion ? ' cb-cascader__popup--motionless' : ''}`} initialFocus={false} finalFocus={false}>
            <div className="cb-cascader__columns" aria-label="Cascader options">
              {columns.map((column, columnIndex) => (
                <div className="cb-cascader__column" role="listbox" aria-label={`Level ${columnIndex + 1}`} key={columnIndex}>
                  {column.options.map((option) => {
                    const active = option.key === column.activeKey;
                    const hasChildren = Boolean(option.children?.length);
                    const path = [...activePath.slice(0, columnIndex), option.key];
                    return (
                      <button
                        type="button"
                        role="option"
                        id={optionId(popupId, path)}
                        tabIndex={-1}
                        key={option.key}
                        className="cb-cascader__option"
                        disabled={option.disabled}
                        aria-selected={active}
                        data-active={active || undefined}
                        data-branch={hasChildren || undefined}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          if (option.disabled) return;
                          if (hasChildren) {
                            const child = firstEnabledKey(option.children!);
                            if (child) {
                              setActivePath([...path, child]);
                              setActiveColumn(columnIndex + 1);
                            }
                          } else choose(path);
                        }}
                      >
                        <span className="cb-cascader__option-label">{option.label}</span>
                        {hasChildren ? <ChevronRight className="cb-cascader__option-icon" aria-hidden="true" /> : null}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}

export const Cascader = Object.assign(CascaderRoot, { Skeleton: CascaderSkeleton });
