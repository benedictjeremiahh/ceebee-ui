import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from './badge.js';

describe('Badge', () => {
  it('carries its tone and treatment as data rather than as colour', () => {
    render(<Badge tone="warning" variant="soft">Rp 75-175k</Badge>);
    const badge = screen.getByText('Rp 75-175k');
    expect(badge).toHaveAttribute('data-tone', 'warning');
    expect(badge).toHaveClass('cb-badge', 'cb-badge--soft');
  });

  it('hides its status dot from the reading, since the label already says it', () => {
    render(<Badge dot tone="success">Live</Badge>);
    const dot = screen.getByText('Live').querySelector('.cb-badge__dot');
    expect(dot).toHaveAttribute('aria-hidden', 'true');
  });
});
