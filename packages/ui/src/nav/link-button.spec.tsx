import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from '../form/button.js';
import { LinkButton } from './link-button.js';

/* What can be wrong when two components share one look: the shared half stops
   being shared, or the half that is NOT shared quietly leaks across. A link that
   reports itself as a button is the second kind, and no screenshot shows it
   (ADR 0012). */
describe('LinkButton', () => {
  it('is a link, not a button', () => {
    render(<LinkButton href="/places/1">History</LinkButton>);

    const link = screen.getByRole('link', { name: 'History' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/places/1');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('wears the same look as a Button rather than a second copy of it', () => {
    const { rerender } = render(<Button variant="outline" tone="neutral" size="sm">Go</Button>);
    const button = screen.getByRole('button');
    const shared = ['cb-button', 'cb-button--outline', 'cb-button--sm'];
    for (const cls of shared) expect(button).toHaveClass(cls);

    rerender(<LinkButton href="/x" variant="outline" tone="neutral" size="sm">Go</LinkButton>);
    const link = screen.getByRole('link');
    for (const cls of shared) expect(link).toHaveClass(cls);
    expect(link).toHaveAttribute('data-tone', 'neutral');
  });

  it('keeps a bare glyph square and lets it carry its own name', () => {
    render(<LinkButton href="/maps" aria-label="Open in Maps" iconStart={<svg />} />);

    const link = screen.getByRole('link', { name: 'Open in Maps' });
    expect(link).toHaveClass('cb-button--icon');
  });
  it('hands its look to a router link rather than replacing it with a plain anchor', () => {
    /* A router's Link must stay itself — swapped for a bare anchor, every
       navigation becomes a full page load and the app loses its state. */
    function RouterLink(props: React.ComponentProps<'a'>) {
      return <a data-router="" {...props} />;
    }

    render(
      <LinkButton
        render={<RouterLink href="/places/1" />}
        variant="ghost"
        tone="neutral"
        size="sm"
      >
        History
      </LinkButton>,
    );

    const link = screen.getByRole('link', { name: 'History' });
    expect(link).toHaveAttribute('data-router');
    expect(link).toHaveAttribute('href', '/places/1');
    expect(link).toHaveClass('cb-button', 'cb-button--ghost', 'cb-button--sm');
  });
});
