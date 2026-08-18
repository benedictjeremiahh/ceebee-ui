import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatCard } from './stat-card.js';

/** ADR 0009: the placeholder must not resize the tile when the real data lands. */
describe('StatCard.Skeleton', () => {
  it('wears the same surface, radius and padding classes as the card it stands in for', () => {
    const { container: real } = render(<StatCard label="Revenue" value="120,456" hue="violet" />);
    const { container: placeholder } = render(<StatCard.Skeleton />);

    const classesOf = (root: HTMLElement) =>
      Array.from(root.firstElementChild!.classList)
        .filter((c) => c.startsWith('cb-radius') || c.startsWith('cb-pad') || c.startsWith('cb-surface'))
        .sort();

    expect(classesOf(placeholder)).toEqual(classesOf(real));
  });

  it('hides its shapes from assistive technology', () => {
    const { container } = render(<StatCard.Skeleton withVisual />);
    const shapes = container.querySelectorAll('.cb-skeleton');
    expect(shapes.length).toBeGreaterThan(0);
    shapes.forEach((shape) => expect(shape).toHaveAttribute('aria-hidden', 'true'));
  });
});
