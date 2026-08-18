'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    ],
  },
  {
    title: 'Feedback',
    entries: [{ href: '/feedback/skeleton', label: 'Skeleton', kind: 'Atom' }],
  },
  {
    title: 'Overlay',
    entries: [{ href: '/overlay/dialog', label: 'Dialog', kind: 'Composition' }],
  },
  {
    title: 'Data',
    entries: [
      { href: '/data/progress-ring', label: 'ProgressRing', kind: 'Widget' },
      { href: '/data/stat-card', label: 'StatCard', kind: 'Composition' },
    ],
  },
  {
    title: 'Motion',
    entries: [{ href: '/motion', label: 'Motion contract' }],
  },
  {
    title: 'Recipes',
    entries: [{ href: '/recipes/astra-dashboard', label: 'Astra dashboard' }],
  },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <aside className="docs__sidebar">
      <div className="docs__brand">
        <span className="docs__mark" />
        <Text weight="semibold">@ceebee/ui</Text>
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
  );
}
