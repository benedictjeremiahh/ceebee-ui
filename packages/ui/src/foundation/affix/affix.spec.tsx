import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Affix } from './affix.js';

const stylesheet = readFileSync(join(process.cwd(), 'packages/ui/src/foundation/affix/affix.css'), 'utf8');

describe('Affix', () => {
  it('preserves child semantics without imposing an interaction contract', () => {
    const { container, getByRole } = render(
      <Affix><button type="button">Save</button><a href="/details">Details</a></Affix>,
    );
    const root = container.firstElementChild;

    expect(root).toHaveClass('cb-affix', 'cb-affix--top', 'cb-affix--offset-md');
    expect(root).toHaveAttribute('data-edge', 'top');
    expect(root).toHaveAttribute('data-offset', 'md');
    expect(getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'Details' })).toBeInTheDocument();
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('tabindex');
  });

  it('maps edge and offset choices to semantic classes and spacing Tokens', () => {
    const { container } = render(<Affix edge="bottom" offset="lg">Content</Affix>);
    const root = container.firstElementChild;

    expect(root).toHaveClass('cb-affix--bottom', 'cb-affix--offset-lg');
    expect(root).toHaveStyle('--cb-affix-offset: var(--cb-space-6)');
  });

  it('uses sticky positioning, the semantic sticky stacking rung, and no clipping', () => {
    expect(stylesheet).toContain('position: sticky');
    expect(stylesheet).toContain('z-index: var(--cb-z-sticky)');
    expect(stylesheet).not.toMatch(/overflow\s*:/);
    expect(stylesheet).not.toMatch(/clip\s*:/);
    expect(stylesheet).toContain('inset-block-start: var(--cb-affix-offset)');
    expect(stylesheet).toContain('inset-block-end: var(--cb-affix-offset)');
  });
});
