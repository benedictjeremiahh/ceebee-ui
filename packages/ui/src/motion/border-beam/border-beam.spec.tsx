import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BorderBeam } from './border-beam.js';

const stylesheet = readFileSync(join(process.cwd(), 'packages/ui/src/motion/border-beam/border-beam.css'), 'utf8');

describe('BorderBeam', () => {
  it('preserves child semantics and interactions', () => {
    render(
      <BorderBeam>
        <button type="button">Continue</button>
      </BorderBeam>,
    );

    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    expect(stylesheet).toContain('overflow: visible');
  });

  it('keeps the beam decorative and non-interactive', () => {
    render(<BorderBeam tone="success" size="lg" motion={false}><h2>Ready</h2></BorderBeam>);

    const root = screen.getByText('Ready').parentElement?.parentElement;
    const overlay = root?.querySelector('.cb-border-beam__overlay');
    expect(root).toHaveClass('cb-border-beam', 'cb-border-beam--lg');
    expect(root).toHaveAttribute('data-tone', 'success');
    expect(root).toHaveAttribute('data-motion', 'off');
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
    expect(overlay).toBeInTheDocument();
  });

  it('defines reduced motion as a static visible rendering and uses motion tokens', () => {
    expect(stylesheet).toContain('@media (prefers-reduced-motion: reduce)');
    expect(stylesheet).toMatch(/prefers-reduced-motion:[\s\S]*animation: none;/);
    expect(stylesheet).toContain('.cb-border-beam[data-motion="off"] .cb-border-beam__overlay');
    expect(stylesheet).toMatch(/data-motion="off"[\s\S]*animation: none;/);
    expect(stylesheet).toContain('pointer-events: none');
    expect(stylesheet).toContain('.cb-border-beam__content { position: relative; z-index: 1; }');
    expect(stylesheet).not.toContain('opacity:');
    expect(stylesheet).toContain('var(--cb-duration-deliberate)');
    expect(stylesheet).toContain('var(--cb-ease-standard)');
    expect(stylesheet).toContain('@property --cb-border-beam-angle');
    expect(stylesheet).toContain('from var(--cb-border-beam-angle)');
    expect(stylesheet).not.toContain('transform: rotate');
  });

  it('keeps a focusable child above the decorative overlay', () => {
    render(<BorderBeam><button type="button">Focusable</button></BorderBeam>);
    const button = screen.getByRole('button', { name: 'Focusable' });
    button.focus();
    expect(button).toHaveFocus();
    expect(stylesheet).toContain('z-index: 1');
  });
});
