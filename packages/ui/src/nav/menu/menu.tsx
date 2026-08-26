'use client';

import { ChevronDown, ChevronRight } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn.js';
import { MenuSkeleton, type MenuSkeletonProps } from './menu.skeleton.js';

export type MenuTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
export type MenuSize = 'sm' | 'md' | 'lg';

export interface PersistentMenuLeaf {
  key: string;
  label: ReactNode;
  href: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface PersistentMenuBranch {
  key: string;
  label: ReactNode;
  /** Explicit accessible name for the disclosure control; labels may contain arbitrary React nodes. */
  ariaLabel: string;
  icon?: ReactNode;
  disabled?: boolean;
  children: PersistentMenuItem[];
  href?: never;
}

export type PersistentMenuItem = PersistentMenuLeaf | PersistentMenuBranch;

export interface MenuProps {
  items: PersistentMenuItem[];
  selectedPath?: string;
  defaultSelectedPath?: string;
  onSelectedPathChange?: (path: string) => void;
  openKeys?: string[];
  defaultOpenKeys?: string[];
  onOpenKeysChange?: (keys: string[]) => void;
  size?: MenuSize;
  tone?: MenuTone;
  motion?: boolean;
  'aria-label'?: string;
}

/**
 * Persistent navigation in normal document flow. Native links retain their normal browser
 * behaviour; nested branches are disclosure buttons. This is intentionally not Dropdown:
 * Dropdown is an anchored, dismissible action menu with roving focus.
 */
function MenuRoot({
  items,
  selectedPath,
  defaultSelectedPath,
  onSelectedPathChange,
  openKeys,
  defaultOpenKeys = [],
  onOpenKeysChange,
  size = 'md',
  tone = 'brand',
  motion = true,
  'aria-label': ariaLabel = 'Navigation',
}: MenuProps) {
  const [uncontrolledSelectedPath, setUncontrolledSelectedPath] = useState(defaultSelectedPath);
  const [uncontrolledOpenKeys, setUncontrolledOpenKeys] = useState(defaultOpenKeys);
  const currentSelectedPath = selectedPath ?? uncontrolledSelectedPath;
  const currentOpenKeys = openKeys ?? uncontrolledOpenKeys;
  const menuId = useId();

  const select = (path: string) => {
    if (selectedPath === undefined) setUncontrolledSelectedPath(path);
    onSelectedPathChange?.(path);
  };

  const toggle = (key: string) => {
    const next = currentOpenKeys.includes(key)
      ? currentOpenKeys.filter((openKey) => openKey !== key)
      : [...currentOpenKeys, key];
    if (openKeys === undefined) setUncontrolledOpenKeys(next);
    onOpenKeysChange?.(next);
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={cn('cb-persistent-menu', `cb-persistent-menu--${size}`, `cb-persistent-menu--${tone}`, !motion && 'cb-persistent-menu--motion-off')}
    >
      <MenuList
        items={items}
        selectedPath={currentSelectedPath}
        openKeys={currentOpenKeys}
        path={[]}
        menuId={menuId}
        onSelect={select}
        onToggle={toggle}
      />
    </nav>
  );
}

interface MenuListProps {
  items: PersistentMenuItem[];
  selectedPath?: string;
  openKeys: string[];
  path: string[];
  menuId: string;
  nested?: boolean;
  onSelect: (key: string) => void;
  onToggle: (key: string) => void;
}

function MenuList({ items, selectedPath, openKeys, path, menuId, nested = false, onSelect, onToggle }: MenuListProps) {
  return (
    <ul className={cn('cb-persistent-menu__list', nested && 'cb-persistent-menu__list--nested')}>
      {items.map((item) => {
        const itemPath = [...path, item.key];
        const pathKey = pathIdentity(itemPath);
        const isBranch = 'children' in item;
        const open = openKeys.includes(pathKey);
        const current = selectedPath === pathKey;
        const branchId = `${menuId}-${pathKey}`;

        return (
          <li className="cb-persistent-menu__item" key={item.key}>
            <div className="cb-persistent-menu__row">
              {isBranch ? (
                <MenuBranch item={item} open={open} branchId={branchId} onToggle={() => onToggle(pathKey)} />
              ) : (
                <MenuEntry item={item} path={pathKey} current={current} onSelect={onSelect} />
              )}
            </div>
            {isBranch && open ? (
              <div id={branchId} className="cb-persistent-menu__branch">
                <MenuList
                  items={item.children}
                  selectedPath={selectedPath}
                  openKeys={openKeys}
                  path={itemPath}
                  menuId={menuId}
                  nested={true}
                  onSelect={onSelect}
                  onToggle={onToggle}
                />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function MenuEntry({
  item,
  path,
  current,
  onSelect,
}: {
  item: PersistentMenuLeaf;
  path: string;
  current: boolean;
  onSelect: (key: string) => void;
}) {
  const content = (
    <>
      {item.icon ? <span className="cb-persistent-menu__icon" aria-hidden="true">{item.icon}</span> : null}
      <span className="cb-persistent-menu__label">{item.label}</span>
    </>
  );
  const props = {
    className: 'cb-persistent-menu__entry',
    'aria-current': current ? ('page' as const) : undefined,
    'aria-disabled': item.disabled || undefined,
    'data-current': current || undefined,
    'data-disabled': item.disabled || undefined,
  };

  if (item.disabled) {
    return <span {...props}>{content}</span>;
  }

  return (
    <a
      href={item.href}
      {...props}
      onClick={() => onSelect(path)}
    >
      {content}
    </a>
  );
}

function MenuBranch({
  item,
  open,
  branchId,
  onToggle,
}: {
  item: PersistentMenuBranch;
  open: boolean;
  branchId: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="cb-persistent-menu__branch-trigger"
      aria-label={item.ariaLabel}
      aria-expanded={open}
      aria-controls={branchId}
      disabled={item.disabled}
      data-open={open || undefined}
      data-disabled={item.disabled || undefined}
      onClick={onToggle}
    >
      {item.icon ? <span className="cb-persistent-menu__icon" aria-hidden="true">{item.icon}</span> : null}
      <span className="cb-persistent-menu__label">{item.label}</span>
      <ChevronRight aria-hidden="true" className="cb-persistent-menu__chevron cb-persistent-menu__chevron--collapsed" />
      <ChevronDown aria-hidden="true" className="cb-persistent-menu__chevron cb-persistent-menu__chevron--expanded" />
    </button>
  );
}

function pathIdentity(path: string[]) {
  return path.map(encodeURIComponent).join('/');
}

export const Menu = Object.assign(MenuRoot, { Skeleton: MenuSkeleton });

export type { MenuSkeletonProps };
