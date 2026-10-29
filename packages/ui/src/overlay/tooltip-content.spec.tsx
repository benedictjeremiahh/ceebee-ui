import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Tooltip } from '../client.js';

describe('Tooltip semantic content wiring', () => {
  it('adds its content marker while retaining caller object class names and React content', async () => {
    render(
      <Tooltip
        open
        title={<span><strong>Important detail</strong> for this item</span>}
        classNames={{ root: 'caller-root', container: 'caller-container', arrow: 'caller-arrow' }}
      >
        <button type="button">Show detail</button>
      </Tooltip>,
    );

    const tooltip = await screen.findByRole('tooltip');
    const root = tooltip.closest('.ant-tooltip');
    expect(tooltip).toHaveClass('cb-tooltip-content', 'caller-container');
    expect(root).toHaveClass('caller-root');
    expect(root?.querySelector('.ant-tooltip-arrow')).toHaveClass('caller-arrow');
    expect(within(tooltip).getByText('Important detail', { exact: false })).toBeInTheDocument();
  });

  it('retains callback class names and render-function titles', async () => {
    const classNames = vi.fn(() => ({
      root: 'computed-root',
      container: 'computed-container',
      arrow: 'computed-arrow',
    }));
    render(
      <Tooltip
        open
        title={() => <span>Rendered detail</span>}
        classNames={classNames}
      >
        <button type="button">Show rendered detail</button>
      </Tooltip>,
    );

    const tooltip = await screen.findByRole('tooltip');
    const root = tooltip.closest('.ant-tooltip');
    expect(classNames).toHaveBeenCalled();
    expect(tooltip).toHaveClass('cb-tooltip-content', 'computed-container');
    expect(root).toHaveClass('computed-root');
    expect(root?.querySelector('.ant-tooltip-arrow')).toHaveClass('computed-arrow');
    expect(within(tooltip).getByText('Rendered detail')).toBeInTheDocument();
  });
});
