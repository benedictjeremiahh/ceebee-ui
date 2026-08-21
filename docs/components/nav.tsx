'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Text } from '@ceebee/ui';

interface Entry {
  href: string;
  label: string;
  kind?: 'Atom' | 'Composition' | 'Widget';
}

const GROUPS: Array<{ title: string; entries: Entry[] }> = [
  {
    title: 'Overview',
    entries: [
      { href: '/', label: 'Introduction' },
      { href: '/tokens', label: 'Tokens' },
      { href: '/theming', label: 'Theming' },
    ],
  },
  {
    title: 'Foundation',
    entries: [
      { href: '/foundation/surface', label: 'Surface', kind: 'Atom' },
      { href: '/foundation/layout', label: 'Stack · Grid', kind: 'Atom' },
      { href: '/foundation/text', label: 'Text · Heading', kind: 'Atom' },
    ],
  },
  {
    title: 'Form',
    entries: [
      { href: '/form/button', label: 'Button', kind: 'Atom' },
      { href: '/form/field', label: 'Field · Input', kind: 'Atom' },
      { href: '/form/select', label: 'Select', kind: 'Atom' },
      { href: '/form/choice', label: 'Checkbox · Radio · Switch', kind: 'Atom' },
      { href: '/form/number-input', label: 'NumberInput', kind: 'Atom' },
      { href: '/form/combobox', label: 'Combobox', kind: 'Atom' },
      { href: '/form/date-input', label: 'DateInput', kind: 'Composition' },
      { href: '/form/time-input', label: 'TimeInput', kind: 'Composition' },
      { href: '/form/file-drop', label: 'FileDrop', kind: 'Composition' },
    ],
  },
  {
    title: 'Feedback',
    entries: [
      { href: '/feedback/skeleton', label: 'Skeleton', kind: 'Atom' },
      { href: '/feedback/progress', label: 'Spinner · ProgressBar', kind: 'Atom' },
      { href: '/feedback/badge', label: 'Badge', kind: 'Atom' },
      { href: '/feedback/alert', label: 'Alert', kind: 'Composition' },
      { href: '/feedback/toast', label: 'Toast', kind: 'Composition' },
      { href: '/feedback/empty-state', label: 'EmptyState', kind: 'Composition' },
    ],
  },
  {
    title: 'Overlay',
    entries: [
      { href: '/overlay/dialog', label: 'Dialog', kind: 'Composition' },
      { href: '/overlay/popover', label: 'Popover · Tooltip', kind: 'Atom' },
      { href: '/overlay/command-palette', label: 'CommandPalette', kind: 'Composition' },
    ],
  },
  {
    title: 'Data',
    entries: [
      { href: '/data/progress-ring', label: 'ProgressRing', kind: 'Widget' },
      { href: '/data/donut', label: 'Donut', kind: 'Widget' },
      { href: '/data/sparkline', label: 'Sparkline · BarMini', kind: 'Widget' },
      { href: '/data/stat-card', label: 'StatCard', kind: 'Composition' },
      { href: '/data/table', label: 'DataTable · Pagination', kind: 'Composition' },
      { href: '/data/timeline', label: 'Timeline', kind: 'Composition' },
      { href: '/data/leaderboard', label: 'Leaderboard', kind: 'Composition' },
    ],
  },
  {
    title: 'Navigation',
    entries: [
      { href: '/nav/tabs', label: 'Tabs', kind: 'Composition' },
      { href: '/nav/menu', label: 'DropdownMenu', kind: 'Composition' },
      { href: '/nav/breadcrumbs', label: 'Breadcrumbs', kind: 'Atom' },
      { href: '/nav/stepper', label: 'Stepper', kind: 'Composition' },
      { href: '/nav/shell', label: 'Sidebar · TopBar', kind: 'Composition' },
    ],
  },
  {
    title: 'Media',
    entries: [
      { href: '/media/carousel', label: 'Carousel', kind: 'Composition' },
      { href: '/media/avatar', label: 'Avatar', kind: 'Atom' },
      { href: '/media/image', label: 'Image', kind: 'Composition' },
    ],
  },
  {
    title: 'Onboarding',
    entries: [
      { href: '/onboarding/coachmark', label: 'Coachmark · Tour', kind: 'Composition' },
      { href: '/onboarding/checklist', label: 'Checklist', kind: 'Composition' },
    ],
  },
  {
    title: 'Motion',
    entries: [{ href: '/motion', label: 'Motion contract' }],
  },
  {
    title: 'Recipes',
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
  const [hidden, setHidden] = useState(false);

  // The attribute lives on the document so the grid can react to it without threading state
  // through a server layout.
  useEffect(() => {
    const stored = window.localStorage.getItem('docs-nav') === 'hidden';
    setHidden(stored);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.nav = hidden ? 'hidden' : 'shown';
    window.localStorage.setItem('docs-nav', hidden ? 'hidden' : 'shown');
  }, [hidden]);

  return (
    <>
      <button
        type="button"
        className="docs__nav-open"
        aria-label="Show navigation"
        aria-expanded={!hidden}
        onClick={() => setHidden(false)}
      >
        <PanelLeftOpen size={16} />
      </button>

      <aside className="docs__sidebar">
        <div className="docs__brand">
          <span className="docs__mark" />
          <Text weight="semibold">@ceebee/ui</Text>
          <button
            type="button"
            className="docs__nav-close"
            aria-label="Hide navigation"
            aria-expanded={!hidden}
            onClick={() => setHidden(true)}
          >
            <PanelLeftClose size={16} />
          </button>
        </div>
        {GROUPS.map((group) => (
          <div className="docs__group" key={group.title}>
          <p className="docs__group-title">{group.title}</p>
          {group.entries.map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              className="docs__link"
              data-active={pathname === entry.href}
            >
              {entry.label}
              {entry.kind ? <span className="docs__label">{entry.kind}</span> : null}
            </Link>
          ))}
        </div>
        ))}
      </aside>
    </>
  );
}
