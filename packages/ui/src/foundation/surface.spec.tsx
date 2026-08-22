import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Surface } from './surface.js';

describe('Surface glass material', () => {
  it('marks regular glass explicitly by default', () => {
    const { container } = render(<Surface variant="glass">Navigation</Surface>);

    expect(container.firstElementChild).toHaveAttribute('data-glass-style', 'regular');
  });

  it('exposes clear glass only when requested', () => {
    const { container, rerender } = render(
      <Surface variant="glass" glassStyle="clear">Media controls</Surface>,
    );

    expect(container.firstElementChild).toHaveAttribute('data-glass-style', 'clear');

    rerender(<Surface variant="plain" glassStyle="clear">Content</Surface>);
    expect(container.firstElementChild).not.toHaveAttribute('data-glass-style');
  });
});
