import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Heading } from './text.js';

describe('Heading focus anchor', () => {
  it('exposes the named heading as an opt-in programmatic focus target', () => {
    const target = createRef<HTMLHeadingElement>();
    render(<Heading level={3} ref={target} tabIndex={-1}>Pending entries</Heading>);
    const heading = screen.getByRole('heading', { name: 'Pending entries', level: 3 });
    expect(target.current).toBe(heading);
    expect(heading.tabIndex).toBe(-1);
    target.current?.focus();
    expect(document.activeElement).toBe(heading);
  });

  it('does not add a tab stop to an ordinary heading', () => {
    render(<Heading>Summary</Heading>);
    expect(screen.getByRole('heading', { name: 'Summary' }).hasAttribute('tabindex')).toBe(false);
  });
});
