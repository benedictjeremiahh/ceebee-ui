import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Popover, Tooltip } from './popover.js';

describe('anchored overlay placement', () => {
  it('renders a Popover arrow for a horizontal placement', async () => {
    render(
      <Popover trigger={<button type="button">Open details</button>} side="right" align="end">
        Details
      </Popover>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open details' }));

    expect(await screen.findByText('Details')).toBeVisible();
    const arrow = document.querySelector('.cb-popover__arrow');
    expect(arrow?.getAttribute('data-side')).toMatch(/^(left|right)$/);
    expect(arrow).toHaveAttribute('data-align', 'end');
    expect(arrow?.querySelector('svg.cb-arrow')).toBeInTheDocument();
    expect(arrow?.querySelectorAll('path')).toHaveLength(2);
  });

  it('gives Tooltip the same placement and optional-arrow controls', async () => {
    render(
      <Tooltip label="Helpful label" side="left" align="start" sideOffset={10} delay={0}>
        <button type="button">Help</button>
      </Tooltip>,
    );

    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Help' }));

    expect(await screen.findByText('Helpful label')).toBeVisible();
    expect(document.querySelector('.cb-tooltip__arrow')).toHaveAttribute('data-side', 'left');
    expect(document.querySelector('.cb-tooltip__arrow')).toHaveAttribute('data-align', 'start');
    expect(document.querySelector('.cb-tooltip__arrow svg.cb-arrow')).toBeInTheDocument();
  });
});
