import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Menu } from './menu.js';

const menuCss = readFileSync(join(process.cwd(), 'packages/ui/src/nav/menu/menu.css'), 'utf8');

const items = [
  { key: 'home', label: 'Home', href: '/home' },
  {
    key: 'projects',
    label: 'Projects',
    ariaLabel: 'Project sections',
    children: [
      { key: 'active', label: 'Active projects', href: '#projects-active' },
      { key: 'archived', label: 'Archived projects', href: '#projects-archived' },
    ],
  },
];

describe('Menu', () => {
  it('renders persistent native navigation instead of a menu popup', () => {
    render(<Menu items={items} defaultOpenKeys={['projects']} selectedPath="projects/active" aria-label="Project navigation" />);
    expect(screen.getByRole('navigation', { name: 'Project navigation' })).toBeTruthy();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Active projects' })).toHaveAttribute('href', '#projects-active');
    expect(screen.getByRole('link', { name: 'Active projects' })).toHaveAttribute('aria-current', 'page');
  });

  it('owns uncontrolled selection and nested disclosure state', () => {
    const onSelectedPathChange = vi.fn();
    render(<Menu items={items} onSelectedPathChange={onSelectedPathChange} />);

    const toggle = screen.getByRole('button', { name: 'Project sections' });
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById(toggle.getAttribute('aria-controls')!)).toBeTruthy();
    fireEvent.click(screen.getByRole('link', { name: 'Active projects' }));
    expect(onSelectedPathChange).toHaveBeenLastCalledWith('projects/active');
    expect(screen.getByRole('link', { name: 'Active projects' })).toHaveAttribute('aria-current', 'page');
  });

  it('respects controlled selection and controlled branches', () => {
    const onOpenKeysChange = vi.fn();
    render(<Menu items={items} selectedPath="home" openKeys={[]} onOpenKeysChange={onOpenKeysChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Project sections' }));
    expect(onOpenKeysChange).toHaveBeenLastCalledWith(['projects']);
    expect(screen.queryByRole('link', { name: 'Active projects' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  });

  it('uses a static expanded icon without motion while keeping an open branch visible', () => {
    render(<Menu items={items} defaultOpenKeys={['projects']} motion={false} />);
    expect(screen.getByRole('navigation')).toHaveClass('cb-persistent-menu--motion-off');
    const toggle = screen.getByRole('button', { name: 'Project sections' });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle.querySelector('.cb-persistent-menu__chevron--expanded')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Active projects' })).toBeVisible();
    const reducedMotionRules = menuCss.slice(menuCss.indexOf('@media (prefers-reduced-motion: reduce)'));
    expect(reducedMotionRules).toContain('.cb-persistent-menu__chevron { transition: none; }');
    expect(reducedMotionRules).toContain('.cb-persistent-menu__chevron--expanded { display: block; }');
  });

  it('keeps duplicate local branch keys independent through their full path', () => {
    render(
      <Menu
        defaultOpenKeys={['alpha', 'beta', 'alpha/settings']}
        items={[
          { key: 'alpha', label: 'Alpha', ariaLabel: 'Alpha sections', children: [{ key: 'settings', label: 'Alpha settings', ariaLabel: 'Alpha settings sections', children: [{ key: 'alpha-leaf', label: 'Alpha leaf', href: '#alpha' }] }] },
          { key: 'beta', label: 'Beta', ariaLabel: 'Beta sections', children: [{ key: 'settings', label: 'Beta settings', ariaLabel: 'Beta settings sections', children: [{ key: 'beta-leaf', label: 'Beta leaf', href: '#beta' }] }] },
        ]}
      />,
    );
    expect(screen.getByRole('button', { name: 'Alpha settings sections' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Beta settings sections' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: 'Alpha settings sections' }).getAttribute('aria-controls')).not.toBe(
      screen.getByRole('button', { name: 'Beta settings sections' }).getAttribute('aria-controls'),
    );
  });

  it('marks only one duplicate local leaf key current by its recursive path', () => {
    render(
      <Menu
        defaultOpenKeys={['alpha', 'beta']}
        selectedPath="alpha/leaf"
        items={[
          { key: 'alpha', label: 'Alpha', ariaLabel: 'Alpha sections', children: [{ key: 'leaf', label: 'Alpha leaf', href: '#alpha' }] },
          { key: 'beta', label: 'Beta', ariaLabel: 'Beta sections', children: [{ key: 'leaf', label: 'Beta leaf', href: '#beta' }] },
        ]}
      />,
    );
    expect(screen.getByRole('link', { name: 'Alpha leaf' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Beta leaf' })).not.toHaveAttribute('aria-current');
  });

  it('renders a disabled leaf as non-actionable presentation', () => {
    render(<Menu items={[{ key: 'disabled', label: 'Disabled destination', href: '#disabled', disabled: true }]} />);
    expect(screen.queryByRole('link', { name: 'Disabled destination' })).not.toBeInTheDocument();
    expect(document.querySelector('.cb-persistent-menu__entry[aria-disabled="true"]')).toHaveTextContent('Disabled destination');
  });
});

describe('Menu.Skeleton', () => {
  it('matches the menu landmark and row count', () => {
    render(<Menu.Skeleton items={3} size="lg" />);
    const navigation = screen.getByRole('navigation', { hidden: true });
    expect(navigation).toHaveClass('cb-persistent-menu--lg', 'cb-persistent-menu--skeleton');
    expect(navigation.querySelectorAll('.cb-persistent-menu__item')).toHaveLength(3);
  });
});
