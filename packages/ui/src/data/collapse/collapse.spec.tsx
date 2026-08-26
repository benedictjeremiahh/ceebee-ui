import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, expect, it, vi } from 'vitest';
import { Collapse } from './collapse.js';

const items = [
  { key: 'summary', label: 'Summary', children: 'Summary content' },
  { key: 'activity', label: 'Activity', children: 'Activity content' },
  { key: 'locked', label: 'Locked', children: 'Locked content', disabled: true },
];

const collapseCss = readFileSync(
  join(process.cwd(), 'packages/ui/src/data/collapse/collapse.css'),
  'utf8',
);

describe('Collapse disclosure contract', () => {
  it('has no automated accessibility violations in its labelled disclosure structure', async () => {
    const { container } = render(<Collapse items={items} defaultValue="summary" />);
    const result = await axe.run(container, {
      rules: { 'color-contrast': { enabled: false } },
    });

    expect(result.violations).toEqual([]);
  });

  it('associates heading buttons with panels and toggles an uncontrolled item', async () => {
    const user = userEvent.setup();
    render(<Collapse items={items} defaultValue="summary" headingLevel={2} />);

    const summary = screen.getByRole('button', { name: 'Summary' });
    const panelId = summary.getAttribute('aria-controls');

    expect(summary).toHaveAttribute('aria-expanded', 'true');
    expect(summary.closest('h2')).toBeInTheDocument();
    expect(panelId).toBeTruthy();
    expect(document.getElementById(panelId!)).toHaveTextContent('Summary content');

    await user.click(summary);
    expect(summary).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps only one item expanded in uncontrolled single mode', async () => {
    const user = userEvent.setup();
    render(<Collapse items={items} defaultValue="summary" />);

    await user.click(screen.getByRole('button', { name: 'Activity' }));

    expect(screen.getByRole('button', { name: 'Summary' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: 'Activity' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('supports uncontrolled multiple expansion without changing the disclosure contract', async () => {
    const user = userEvent.setup();
    render(<Collapse items={items} defaultValue={['summary']} multiple />);

    await user.keyboard('{Tab}');
    expect(screen.getByRole('button', { name: 'Summary' })).toHaveFocus();
    await user.keyboard('{Tab}{Enter}');

    expect(screen.getByRole('button', { name: 'Summary' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Activity' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('reports controlled values without mutating the rendered state', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Collapse items={items} value="summary" onValueChange={onValueChange} />);

    await user.click(screen.getByRole('button', { name: 'Activity' }));

    expect(onValueChange).toHaveBeenCalledWith('activity');
    expect(screen.getByRole('button', { name: 'Summary' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Activity' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('reports arrays in controlled multiple mode and preserves disabled items', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Collapse items={items} value={['summary']} multiple onValueChange={onValueChange} />);

    await user.click(screen.getByRole('button', { name: 'Activity' }));
    await user.click(screen.getByRole('button', { name: 'Locked' }));

    expect(onValueChange).toHaveBeenCalledWith(['summary', 'activity']);
    expect(screen.getByRole('button', { name: 'Locked' })).toHaveAttribute('aria-disabled', 'true');
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it('exposes the non-animated rendering without changing disclosure semantics', () => {
    const { container } = render(<Collapse items={items} motion={false} />);

    expect(container.firstElementChild).toHaveClass('cb-collapse--motionless');
    expect(screen.getAllByRole('button')).toHaveLength(items.length);
  });

  it('drops transforms but preserves opacity feedback under reduced motion', () => {
    const reducedMotionRules = collapseCss.slice(
      collapseCss.indexOf('@media (prefers-reduced-motion: reduce)'),
    );

    expect(reducedMotionRules).toContain('transform: none');
    expect(reducedMotionRules).toContain(
      'transition: opacity var(--cb-duration-fast) var(--cb-ease-standard)',
    );
    expect(reducedMotionRules).toContain('opacity: 0');
  });
});

describe('Collapse.Skeleton', () => {
  it('matches size, border, icon position, row, and open-panel geometry', () => {
    const { container } = render(
      <Collapse.Skeleton items={2} openItems={[1]} size="lg" expandIconPosition="end" />,
    );

    const root = container.firstElementChild;
    expect(root).toHaveClass(
      'cb-collapse',
      'cb-collapse--lg',
      'cb-collapse--bordered',
      'cb-collapse--icon-end',
      'cb-collapse--skeleton',
    );
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelectorAll('.cb-collapse__item')).toHaveLength(2);
    expect(container.querySelectorAll('.cb-collapse__content')).toHaveLength(1);
  });
});
