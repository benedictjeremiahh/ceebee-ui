'use client';

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export interface NavItem {
  label: ReactNode;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  /** A count or status shown at the end of the row. */
  adornment?: ReactNode;
}

export interface NavSection {
  title?: ReactNode;
  items: NavItem[];
}

export interface SidebarProps {
  sections: NavSection[];
  /** Brand block at the top — a Logo, usually. */
  header?: ReactNode;
  footer?: ReactNode;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  className?: string;
}

/**
 * The shell's navigation. Collapsed, it keeps the icons and hides the labels — the labels stay
 * in the accessible name, so a collapsed sidebar is still navigable by screen reader.
 */
export function Sidebar({ sections, header, footer, collapsed = false, onCollapsedChange, className }: SidebarProps) {
  return (
    <nav
      className={cn('cb-sidebar', collapsed && 'cb-sidebar--collapsed', className)}
      aria-label="Main"
      data-collapsed={collapsed || undefined}
    >
      {header ? <div className="cb-sidebar__header">{header}</div> : null}

      <div className="cb-sidebar__body">
        {sections.map((section, index) => (
          <div className="cb-sidebar__section" key={index}>
            {section.title && !collapsed ? <p className="cb-sidebar__title">{section.title}</p> : null}
            {section.items.map((item, itemIndex) => {
              const content = (
                <>
                  {item.icon ? <span className="cb-sidebar__icon">{item.icon}</span> : null}
                  <span className="cb-sidebar__label">{item.label}</span>
                  {item.adornment && !collapsed ? (
                    <span className="cb-sidebar__adornment">{item.adornment}</span>
                  ) : null}
                </>
              );
              const props = {
                className: 'cb-sidebar__item',
                'data-active': item.active || undefined,
                'aria-current': item.active ? ('page' as const) : undefined,
                title: collapsed && typeof item.label === 'string' ? item.label : undefined,
              };
              return item.href ? (
                <a key={itemIndex} href={item.href} {...props}>
                  {content}
                </a>
              ) : (
                <button key={itemIndex} type="button" onClick={item.onClick} {...props}>
                  {content}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {footer ? <div className="cb-sidebar__footer">{footer}</div> : null}

      {onCollapsedChange ? (
        <button
          type="button"
          className="cb-sidebar__toggle"
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          aria-expanded={!collapsed}
          onClick={() => onCollapsedChange(!collapsed)}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      ) : null}
    </nav>
  );
}

export interface TopBarProps {
  /** Page title, or a Breadcrumbs trail. */
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Search, filters — anything that belongs in the middle. */
  center?: ReactNode;
  actions?: ReactNode;
  sticky?: boolean;
  className?: string;
}

export function TopBar({ title, subtitle, center, actions, sticky = true, className }: TopBarProps) {
  return (
    <header className={cn('cb-topbar', sticky && 'cb-topbar--sticky', className)}>
      <div className="cb-topbar__lead">
        {title ? <div className="cb-topbar__title">{title}</div> : null}
        {subtitle ? <p className="cb-topbar__subtitle">{subtitle}</p> : null}
      </div>
      {center ? <div className="cb-topbar__center">{center}</div> : null}
      {actions ? <div className="cb-topbar__actions">{actions}</div> : null}
    </header>
  );
}
