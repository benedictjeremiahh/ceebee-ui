import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageContainer } from './page-container.js';
const css = readFileSync(join(process.cwd(), 'packages/ui/src/foundation/page-container/page-container.css'), 'utf8');
describe('PageContainer', () => {
  it('renders optional frame anatomy without creating interaction state', () => { const { container } = render(<PageContainer breadcrumb={<nav aria-label="Breadcrumb">Trail</nav>} title={<h1>Projects</h1>} subtitle="Current work" extra={<button type="button">Create</button>} tabs={<div role="tablist" />}><p>Body</p></PageContainer>); expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument(); expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument(); expect(container.querySelector('.cb-page-container__tabs')).toBeTruthy(); expect(container.querySelector('.cb-page-container')).not.toHaveAttribute('tabindex'); });
  it('uses existing Container and token-only responsive CSS', () => { const { container } = render(<PageContainer containerSize="sm" title="Title" />); expect(container.querySelector('.cb-container--sm')).toBeTruthy(); expect(css).toContain('var(--cb-space-4)'); expect(css).not.toMatch(/#[0-9a-f]/i); });
  it('has matching noninteractive skeleton anatomy', () => { const { container } = render(<PageContainer.Skeleton tabs lines={2} />); expect(container.querySelector('.cb-page-container--skeleton')).toHaveAttribute('aria-hidden', 'true'); expect(container.querySelector('.cb-page-container__skeleton-tabs')).toBeTruthy(); });
});
