import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Anchor, type AnchorItem } from './anchor.js';

const items: AnchorItem[] = [
  { id: 'intro', label: 'Introduction', href: '#intro' },
  { id: 'api', label: 'API', href: '#api' },
];
const validFragmentItem = { id: 'valid', label: 'Valid', href: '#valid' } satisfies AnchorItem;
const anchorCss = readFileSync(join(process.cwd(), 'packages/ui/src/nav/anchor/anchor.css'), 'utf8');

describe('Anchor', () => {
  it('renders a native nav and hash links', () => {
    render(<Anchor items={items} />);
    expect(screen.getByRole('navigation', { name: 'On this page' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Introduction' })).toHaveAttribute('href', '#intro');
    expect(screen.getByRole('link', { name: 'API' })).toHaveAttribute('href', '#api');
  });

  it('marks only the injected active item as the current location', () => {
    render(<Anchor items={items} activeId="api" />);
    expect(screen.getByRole('link', { name: 'API' })).toHaveAttribute('aria-current', 'location');
    expect(screen.getByRole('link', { name: 'Introduction' })).not.toHaveAttribute('aria-current');
  });

  it('renders nested native lists and keeps active state across depths', () => {
    render(
      <Anchor
        items={[{ id: 'parent', label: 'Parent', href: '#parent', children: [{ id: 'child', label: 'Child', href: '#child' }] }]}
        activeId="child"
      />,
    );
    expect(screen.getAllByRole('list')).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Child' })).toHaveAttribute('aria-current', 'location');
    expect(screen.getByRole('link', { name: 'Child' })).toHaveAttribute('href', '#child');
    expect(validFragmentItem.href).toBe('#valid');
  });

  it('does not impose event handlers or tab indexes', () => {
    render(<Anchor items={items} orientation="horizontal" size="lg" tone="success" />);
    const links = screen.getAllByRole('link');
    expect(links[0]).not.toHaveAttribute('tabindex');
    expect(links[0]).not.toHaveAttribute('onclick');
    expect(screen.getByRole('navigation')).toHaveClass('cb-anchor--horizontal', 'cb-anchor--lg', 'cb-anchor--success');
  });

  it('drops color and background transitions under reduced motion while keeping active styling', () => {
    const reducedMotionRules = anchorCss.slice(anchorCss.indexOf('@media (prefers-reduced-motion: reduce)'));
    expect(reducedMotionRules).toContain('.cb-anchor__link { transition: none; }');
    expect(anchorCss).toContain(".cb-anchor__link[aria-current='location']");
    expect(anchorCss).toContain('color: var(--cb-anchor-active-color)');
  });

  it('allows motion to be disabled without removing the active state', () => {
    render(<Anchor items={items} activeId="api" orientation="horizontal" motion={false} />);
    expect(screen.getByRole('navigation')).toHaveClass('cb-anchor--motion-off');
    expect(screen.getByRole('link', { name: 'API' })).toHaveAttribute('aria-current', 'location');
    expect(anchorCss).toContain('.cb-anchor--motion-off .cb-anchor__link { transition: none; }');
    expect(anchorCss).toContain('border-inline-start-color: transparent');
  });
});

describe('Anchor.Skeleton', () => {
  it('matches the navigation geometry and item count', () => {
    render(<Anchor.Skeleton items={3} orientation="horizontal" size="sm" />);
    expect(screen.getByRole('navigation', { hidden: true })).toHaveClass(
      'cb-anchor--horizontal',
      'cb-anchor--sm',
      'cb-anchor--skeleton',
    );
    expect(screen.getByRole('navigation', { hidden: true }).querySelectorAll('.cb-anchor__item')).toHaveLength(3);
  });
});
