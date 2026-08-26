import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Watermark, WatermarkMarks } from './watermark.js';
import { WatermarkSkeleton } from './watermark.skeleton.js';

const watermarkCss = readFileSync(join(process.cwd(), 'packages/ui/src/feedback/watermark/watermark.css'), 'utf8');

describe('Watermark', () => {
  it('fills arbitrary content with a decorative, pointer-neutral SVG pattern', () => {
    const { container } = render(
      <Watermark content="Internal">
        <button type="button">Save</button>
      </Watermark>,
    );

    const marks = container.querySelector('.cb-watermark__marks');
    expect(marks).toHaveAttribute('aria-hidden', 'true');
    expect(marks?.tagName.toLowerCase()).toBe('svg');
    expect(marks?.querySelector('pattern')).toHaveAttribute('patternUnits', 'userSpaceOnUse');
    expect(marks?.querySelector('rect')).toHaveAttribute('width', '100%');
    expect(marks?.querySelector('rect')).toHaveAttribute('height', '100%');
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('alternates a content sequence without changing the child interaction contract', () => {
    const { container } = render(
      <Watermark content={['A', 'B']} density="lg" direction="vertical" tone="brand">
        <button type="button">Action</button>
      </Watermark>,
    );

    const mark = container.querySelector('.cb-watermark__mark');
    expect(mark).toHaveTextContent('A · B');
    expect(container.firstElementChild).toHaveClass('cb-watermark--lg', 'cb-watermark--vertical');
    expect(container.firstElementChild).toHaveAttribute('data-tone', 'brand');
    expect(screen.getByRole('button', { name: 'Action' })).toBeEnabled();
  });

  it('renders an empty-safe deterministic pattern without a fixed mark budget', () => {
    const { container } = render(<WatermarkMarks content={[]} />);
    expect(container.querySelector('pattern')).toBeInTheDocument();
    expect(container.querySelector('.cb-watermark__mark')).toHaveTextContent('');
    expect(container.querySelectorAll('.cb-watermark__mark')).toHaveLength(1);
  });

  it('uses collision-safe pattern ids for identical sibling watermarks', () => {
    const { container } = render(
      <>
        <Watermark content="Internal"><span>One</span></Watermark>
        <Watermark content="Internal"><span>Two</span></Watermark>
      </>,
    );
    const patterns = Array.from(container.querySelectorAll('pattern'));
    const fills = Array.from(container.querySelectorAll('.cb-watermark__fill'));
    expect(patterns[0]?.id).toBeTruthy();
    expect(patterns[1]?.id).toBeTruthy();
    expect(patterns[0]?.id).not.toBe(patterns[1]?.id);
    expect(fills[0]).toHaveAttribute('fill', `url(#${patterns[0]?.id})`);
    expect(fills[1]).toHaveAttribute('fill', `url(#${patterns[1]?.id})`);
  });

  it('keeps clipping on the overlay while allowing content outlines and shadows to escape', () => {
    expect(watermarkCss).toMatch(/\.cb-watermark__marks\s*\{[\s\S]*overflow: hidden;/);
    expect(watermarkCss).not.toMatch(/\.cb-watermark\s*\{[^}]*overflow\s*:/);
    expect(watermarkCss).toContain('z-index: 2');
    expect(watermarkCss).toContain('pointer-events: none');
    expect(watermarkCss).not.toContain('opacity:');
  });
});

describe('Watermark.Skeleton', () => {
  it('preserves a marked content surface with an accessible placeholder state', () => {
    const { container } = render(<WatermarkSkeleton content="Private" lines={2} />);
    const root = container.firstElementChild;
    expect(root).toHaveClass('cb-watermark', 'cb-watermark--skeleton');
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('.cb-skeleton-text')).toBeInTheDocument();
    expect(container.querySelector('.cb-watermark__marks')).toBeInTheDocument();
  });

  it('is exposed as the compound Skeleton', () => {
    const { container } = render(<Watermark.Skeleton />);
    expect(container.firstElementChild).toHaveClass('cb-watermark--skeleton');
  });
});
