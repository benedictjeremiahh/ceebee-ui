import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ScheduleScaleLabels } from './schedule-scale-labels.js';

describe('ScheduleScaleLabels', () => {
  it('does not render while there are no clipped labels', () => {
    const { container } = render(<ScheduleScaleLabels labels={[]} label="Calendar labels" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('shows distinct full labels when activated by keyboard', async () => {
    const user = userEvent.setup();
    render(<ScheduleScaleLabels labels={['August 2026', 'September 2026']} label="Calendar labels" />);
    const trigger = screen.getByRole('button', { name: 'Calendar labels' });

    trigger.focus();
    await user.keyboard('{Enter}');

    await waitFor(() => expect(screen.getByText('August 2026')).toBeVisible());
    expect(screen.getByText('September 2026')).toBeVisible();
  });

  it('opens from touch activation and closes on a second activation', async () => {
    const user = userEvent.setup();
    render(<ScheduleScaleLabels labels={['August 2026']} label="Calendar labels" />);
    const trigger = screen.getByRole('button', { name: 'Calendar labels' });

    await user.pointer({ keys: '[TouchA]', target: trigger });
    await waitFor(() => expect(screen.getByText('August 2026')).toBeVisible());
    await user.click(trigger);
    await waitFor(() => expect(screen.queryByText('August 2026')).not.toBeVisible());
  });
});
