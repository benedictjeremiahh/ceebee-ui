import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Divider } from './divider.js';

describe('Divider', () => {
  it('is a separator either way, and only stops being an <hr> when it has to', () => {
    const { container, rerender } = render(<Divider />);
    expect(container.querySelector('hr')).toBeInTheDocument();

    /* An <hr> may not contain anything, so a labelled rule cannot be one — but
       it still has to announce itself as a separator. */
    rerender(<Divider>Or</Divider>);
    expect(container.querySelector('hr')).not.toBeInTheDocument();
    expect(screen.getByRole('separator')).toHaveTextContent('Or');
  });

  it('says which way it runs when it runs the other way', () => {
    render(<Divider orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });
});
