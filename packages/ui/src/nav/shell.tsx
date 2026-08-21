'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import { ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useLabels } from '../lib/labels.js';
import { cn } from '../lib/cn.js';

export interface NavItem {
  label: ReactNode;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  /** A count or status shown at the end of the row. */
  adornment?: ReactNode;
  /** One level of children. A parent with children is a disclosure, not a destination. */
  items?: NavItem[];
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

const hasActiveChild = (item: NavItem) => Boolean(item.items?.some((child) => child.active));

/**
 * The shell's navigation. Collapsed, it keeps the icons and hides the labels — the labels stay in
 * the accessible name, and hovering or focusing a rail item opens a flyout carrying that label and
 * any children, so a collapsed rail stays readable instead of becoming a column of guesses.
 */
export function Sidebar({ sections, header, footer, collapsed = false, onCollapsedChange, className }: SidebarProps) {
  const labels = useLabels();

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
            {section.items.map((item, itemIndex) => (
              <SidebarEntry item={item} collapsed={collapsed} key={itemIndex} />
            ))}
          </div>
        ))}
      </div>

      {footer ? <div className="cb-sidebar__footer">{footer}</div> : null}

      {onCollapsedChange ? (
        <button
          type="button"
          className="cb-sidebar__toggle"
          aria-label={collapsed ? labels.expandNavigation : labels.collapseNavigation}
          aria-expanded={!collapsed}
          onClick={() => onCollapsedChange(!collapsed)}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      ) : null}
    </nav>
  );
}

function SidebarEntry({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const children = item.items ?? [];
  const [open, setOpen] = useState(() => hasActiveChild(item));

  if (children.length === 0) {
    const row = <SidebarRow item={item} collapsed={collapsed} />;
    // Collapsed, a leaf shows no label, so the flyout supplies one.
    return collapsed ? <Flyout label={item.label}>{row}</Flyout> : row;
  }

  if (collapsed) {
    return (
      <Flyout label={item.label} items={children}>
        <SidebarRow item={{ ...item, active: item.active || hasActiveChild(item) }} collapsed />
      </Flyout>
    );
  }

  return (
    <>
      <button
        type="button"
        className="cb-sidebar__item"
        data-active={item.active || hasActiveChild(item) || undefined}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {item.icon ? <span className="cb-sidebar__icon">{item.icon}</span> : null}
        <span className="cb-sidebar__label">{item.label}</span>
        {item.adornment ? <span className="cb-sidebar__adornment">{item.adornment}</span> : null}
        <ChevronRight size={14} className="cb-sidebar__chevron" data-open={open || undefined} />
      </button>

      {open ? (
        <div className="cb-sidebar__children">
          {children.map((child, index) => (
            <SidebarRow item={child} collapsed={false} nested key={index} />
          ))}
        </div>
      ) : null}
    </>
  );
}

function SidebarRow({ item, collapsed, nested }: { item: NavItem; collapsed: boolean; nested?: boolean }) {
  const content = (
    <>
      {item.icon ? <span className="cb-sidebar__icon">{item.icon}</span> : null}
      <span className="cb-sidebar__label">{item.label}</span>
      {item.adornment && !collapsed ? <span className="cb-sidebar__adornment">{item.adornment}</span> : null}
    </>
  );
  const props = {
    className: cn('cb-sidebar__item', nested && 'cb-sidebar__item--nested'),
    'data-active': item.active || undefined,
    'aria-current': item.active ? ('page' as const) : undefined,
  };

  return item.href ? (
    <a href={item.href} {...props}>
      {content}
    </a>
  ) : (
    <button type="button" onClick={item.onClick} {...props}>
      {content}
    </button>
  );
}

/** The collapsed rail's label carrier: hover or focus, and the name — plus any children — appears. */
function Flyout({ label, items, children }: { label: ReactNode; items?: NavItem[]; children: ReactNode }) {
  return (
    <BasePopover.Root>
      <BasePopover.Trigger
        openOnHover
        delay={120}
        nativeButton={false}
        render={<span className="cb-sidebar__flyout-trigger">{children}</span>}
      />
      <BasePopover.Portal>
        <BasePopover.Positioner side="right" align="start" sideOffset={8} className="cb-sidebar__flyout-positioner">
          <BasePopover.Popup className="cb-sidebar__flyout">
            <p className="cb-sidebar__flyout-title">{label}</p>
            {items?.length ? (
              <div className="cb-sidebar__flyout-items">
                {items.map((child, index) => (
                  <SidebarRow item={child} collapsed={false} key={index} />
                ))}
              </div>
            ) : null}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
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
