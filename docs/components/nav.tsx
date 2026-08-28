'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Boxes,
  Database,
  FlaskConical,
  Keyboard,
  Layers,
  Table2,
  LayoutDashboard,
  MessageSquare,
  MousePointerClick,
  Navigation,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { Text } from '@ceebee/ui';
import { BrandMark } from './brand-mark';

interface Entry {
  href: string;
  label: string;
}

interface Group {
  title: string;
  icon: LucideIcon;
  entries: Entry[];
}

const GROUPS: Group[] = [
  {
    title: 'Overview',
    icon: BookOpen,
    entries: [
      { href: '/', label: 'Introduction' },
      { href: '/tokens', label: 'Tokens' },
      { href: '/theming', label: 'Theming' },
      { href: '/labels', label: 'Labels' },
      { href: '/motion', label: 'Motion contract' },
      { href: '/changelog', label: 'Changelog' },
    ],
  },
  {
    title: 'General',
    icon: MousePointerClick,
    entries: [
      { href: '/form/button', label: 'Button' },
      { href: '/form/float-button', label: 'FloatButton' },
      { href: '/general/icon', label: 'Icon' },
      { href: '/foundation/text', label: 'Typography' },
    ],
  },
  {
    title: 'Layout',
    icon: LayoutDashboard,
    entries: [
      { href: '/layout/divider', label: 'Divider' },
      { href: '/layout/flex', label: 'Flex' },
      { href: '/layout/grid', label: 'Grid' },
      { href: '/layout/layout', label: 'Layout' },
      { href: '/layout/masonry', label: 'Masonry' },
      { href: '/layout/space', label: 'Space' },
      { href: '/layout/splitter', label: 'Splitter' },
    ],
  },
  {
    title: 'Navigation',
    icon: Navigation,
    entries: [
      { href: '/navigation/anchor', label: 'Anchor' },
      { href: '/navigation/breadcrumb', label: 'Breadcrumb' },
      { href: '/navigation/dropdown', label: 'Dropdown' },
      { href: '/navigation/menu', label: 'Menu' },
      { href: '/navigation/pagination', label: 'Pagination' },
      { href: '/navigation/steps', label: 'Steps' },
      { href: '/navigation/tabs', label: 'Tabs' },
    ],
  },
  {
    title: 'Data Entry',
    icon: Keyboard,
    entries: [
      { href: '/data-entry/auto-complete', label: 'AutoComplete' },
      { href: '/data-entry/cascader', label: 'Cascader' },
      { href: '/data-entry/checkbox', label: 'Checkbox' },
      { href: '/data-entry/color-picker', label: 'ColorPicker' },
      { href: '/data-entry/date-picker', label: 'DatePicker' },
      { href: '/data-entry/form', label: 'Form' },
      { href: '/data-entry/input', label: 'Input' },
      { href: '/data-entry/input-number', label: 'InputNumber' },
      { href: '/data-entry/mentions', label: 'Mentions' },
      { href: '/data-entry/radio', label: 'Radio' },
      { href: '/data-entry/rate', label: 'Rate' },
      { href: '/data-entry/select', label: 'Select' },
      { href: '/data-entry/slider', label: 'Slider' },
      { href: '/data-entry/switch', label: 'Switch' },
      { href: '/data-entry/time-picker', label: 'TimePicker' },
      { href: '/data-entry/transfer', label: 'Transfer' },
      { href: '/data-entry/tree-select', label: 'TreeSelect' },
      { href: '/data-entry/upload', label: 'Upload' },
    ],
  },
  {
    title: 'Data Display',
    icon: Table2,
    entries: [
      { href: '/data-display/avatar', label: 'Avatar' },
      { href: '/data-display/badge', label: 'Badge' },
      { href: '/data-display/calendar', label: 'Calendar' },
      { href: '/data-display/card', label: 'Card' },
      { href: '/data-display/carousel', label: 'Carousel' },
      { href: '/data-display/collapse', label: 'Collapse' },
      { href: '/data-display/descriptions', label: 'Descriptions' },
      { href: '/data-display/empty', label: 'Empty' },
      { href: '/data-display/image', label: 'Image' },
      { href: '/data-display/list', label: 'List' },
      { href: '/data-display/listy', label: 'Listy' },
      { href: '/data-display/popover', label: 'Popover' },
      { href: '/data-display/qr-code', label: 'QRCode' },
      { href: '/data-display/segmented', label: 'Segmented' },
      { href: '/data-display/sticker-group', label: 'StickerGroup' },
      { href: '/data-display/statistic', label: 'Statistic' },
      { href: '/data-display/table', label: 'Table' },
      { href: '/data-display/tag', label: 'Tag' },
      { href: '/data-display/timeline', label: 'Timeline' },
      { href: '/data-display/tooltip', label: 'Tooltip' },
      { href: '/data-display/tour', label: 'Tour' },
      { href: '/data-display/tree', label: 'Tree' },
    ],
  },
  {
    title: 'Feedback',
    icon: MessageSquare,
    entries: [
      { href: '/feedback/alert', label: 'Alert' },
      { href: '/feedback/drawer', label: 'Drawer' },
      { href: '/feedback/message', label: 'Message' },
      { href: '/feedback/modal', label: 'Modal' },
      { href: '/feedback/notification', label: 'Notification' },
      { href: '/feedback/popconfirm', label: 'Popconfirm' },
      { href: '/feedback/progress', label: 'Progress' },
      { href: '/feedback/result', label: 'Result' },
      { href: '/feedback/skeleton', label: 'Skeleton' },
      { href: '/feedback/spin', label: 'Spin' },
      { href: '/feedback/watermark', label: 'Watermark' },
    ],
  },
  {
    title: 'Other',
    icon: FlaskConical,
    entries: [
      { href: '/other/affix', label: 'Affix' },
      { href: '/other/app', label: 'App' },
      { href: '/other/border-beam', label: 'BorderBeam' },
      { href: '/other/config-provider', label: 'ConfigProvider' },
      { href: '/other/util', label: 'Util' },
    ],
  },
  {
    title: 'Foundation',
    icon: Boxes,
    entries: [
      { href: '/foundation/surface', label: 'Surface' },
      { href: '/foundation/page-container', label: 'PageContainer' },
      { href: '/nav/shell', label: 'Sidebar · TopBar' },
    ],
  },
  {
    title: 'Patterns',
    icon: Layers,
    entries: [
      { href: '/overlay/command-palette', label: 'CommandPalette' },
      { href: '/onboarding/checklist', label: 'Checklist' },
    ],
  },
  {
    title: 'Charts',
    icon: Database,
    entries: [
      { href: '/data/donut', label: 'Donut' },
      { href: '/data/sparkline', label: 'Sparkline · BarMini' },
      { href: '/data/leaderboard', label: 'Leaderboard' },
    ],
  },
  {
    title: 'Recipes',
    icon: FlaskConical,
    entries: [
      { href: '/recipes/astra-dashboard', label: 'Astra dashboard' },
      { href: '/recipes/control-center', label: 'Glass control center' },
      { href: '/recipes/gamified', label: 'Gamified learning' },
      { href: '/recipes/fintech', label: 'Fintech mobile' },
    ],
  },
];

export function Nav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [compact, setCompact] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [flyout, setFlyout] = useState<{
    group: Group;
    top: number;
    left: number;
    availableHeight: number;
  } | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());

  const cancelClose = useCallback(() => {
    if (closeTimer.current !== undefined) window.clearTimeout(closeTimer.current);
    closeTimer.current = undefined;
  }, []);

  const closeFlyout = useCallback((restoreFocus = false) => {
    cancelClose();
    const title = flyout?.group.title;
    setFlyout(null);
    if (restoreFocus && title) triggerRefs.current.get(title)?.focus();
  }, [cancelClose, flyout]);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setFlyout(null), readDurationToken('--cb-duration-base'));
  }, [cancelClose]);

  const openFlyout = useCallback((group: Group, trigger: HTMLButtonElement) => {
    if (compact || !collapsed) return;
    cancelClose();
    const rect = trigger.getBoundingClientRect();
    setFlyout({
      group,
      top: rect.top,
      left: rect.right,
      availableHeight: window.innerHeight - rect.top,
    });
  }, [cancelClose, collapsed, compact]);

  // The attribute lives on the document so the grid can react to it without threading state
  // through a server layout.
  useEffect(() => {
    const media = window.matchMedia('(max-width: 860px)');
    const synchronize = () => {
      const stored = window.localStorage.getItem('docs-nav') === 'collapsed';
      setCompact(media.matches);
      setCollapsed(stored);
      if (!media.matches) setMobileOpen(false);
      setReady(true);
    };
    synchronize();
    media.addEventListener('change', synchronize);
    return () => media.removeEventListener('change', synchronize);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.nav = compact
      ? mobileOpen ? 'mobile-open' : 'mobile-closed'
      : collapsed ? 'collapsed' : 'expanded';
    if (!compact) window.localStorage.setItem('docs-nav', collapsed ? 'collapsed' : 'expanded');
  }, [collapsed, compact, mobileOpen, ready]);

  useEffect(() => {
    setFlyout(null);
    if (compact) setMobileOpen(false);
  }, [compact, pathname]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  return (
    <>
      <button
        type="button"
        className="docs__nav-open"
        aria-label="Show navigation"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen(true)}
      >
        <PanelLeftOpen size={16} aria-hidden="true" />
      </button>

      <aside className="docs__sidebar">
        <div className="docs__brand">
          <BrandMark className="docs__mark" />
          <Text className="docs__brand-name" weight="semibold">@ceebee/ui</Text>
          <button
            type="button"
            className="docs__nav-close"
            aria-label={compact ? 'Hide navigation' : collapsed ? 'Expand navigation' : 'Collapse navigation'}
            aria-expanded={compact ? mobileOpen : !collapsed}
            onClick={() => {
              closeFlyout();
              if (compact) setMobileOpen(false);
              else setCollapsed((value) => !value);
            }}
          >
            {collapsed && !compact
              ? <PanelLeftOpen size={16} aria-hidden="true" />
              : <PanelLeftClose size={16} aria-hidden="true" />}
          </button>
        </div>
        <nav className="docs__nav" aria-label="Component documentation">
          {GROUPS.map((group) => {
            const Icon = group.icon;
            const active = group.entries.some((entry) => pathname === entry.href);
            const flyoutId = `docs-group-${group.title.toLowerCase().replaceAll(' ', '-')}`;
            return (
              <div className="docs__group" key={group.title} data-active={active || undefined}>
                <button
                  ref={(element) => {
                    if (element) triggerRefs.current.set(group.title, element);
                    else triggerRefs.current.delete(group.title);
                  }}
                  type="button"
                  className="docs__group-trigger"
                  aria-label={`${group.title} components`}
                  aria-expanded={flyout?.group.title === group.title}
                  aria-controls={flyoutId}
                  onClick={(event) => openFlyout(group, event.currentTarget)}
                  onFocus={(event) => openFlyout(group, event.currentTarget)}
                  onBlur={scheduleClose}
                  onPointerEnter={(event) => openFlyout(group, event.currentTarget)}
                  onPointerLeave={scheduleClose}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      event.preventDefault();
                      closeFlyout(true);
                    }
                  }}
                >
                  <Icon size={18} aria-hidden="true" />
                </button>
                <p className="docs__group-title">
                  <Icon size={14} aria-hidden="true" />
                  {group.title}
                </p>
                <div className="docs__group-links">
                  <GroupLinks group={group} pathname={pathname} />
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      {ready && flyout ? createPortal(
        <nav
          id={`docs-group-${flyout.group.title.toLowerCase().replaceAll(' ', '-')}`}
          className="docs__flyout"
          aria-label={`${flyout.group.title} components`}
          style={{
            insetBlockStart: flyout.top,
            insetInlineStart: flyout.left,
            '--docs-flyout-available-height': `${flyout.availableHeight}px`,
          } as CSSProperties}
          onFocus={cancelClose}
          onBlur={scheduleClose}
          onPointerEnter={cancelClose}
          onPointerLeave={scheduleClose}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              closeFlyout(true);
            }
          }}
        >
          <p className="docs__flyout-title">{flyout.group.title}</p>
          <GroupLinks group={flyout.group} pathname={pathname} onNavigate={() => closeFlyout()} />
        </nav>,
        document.body,
      ) : null}
    </>
  );
}

function GroupLinks({ group, pathname, onNavigate }: { group: Group; pathname: string; onNavigate?: () => void }) {
  return group.entries.map((entry) => (
    <Link
      key={entry.href}
      href={entry.href}
      className="docs__link"
      data-active={pathname === entry.href}
      onClick={onNavigate}
    >
      {entry.label}
    </Link>
  ));
}

function readDurationToken(name: string) {
  const value = window.getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const amount = Number.parseFloat(value);
  if (!Number.isFinite(amount)) return 0;
  return value.endsWith('s') && !value.endsWith('ms') ? amount * 1000 : amount;
}
