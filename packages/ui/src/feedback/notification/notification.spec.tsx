import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Notification } from './notification.js';

describe('Notification', () => {
  it('announces durable informational content politely', () => {
    render(
      <Notification
        title="Import completed"
        description="Twenty records are ready."
        actions={<a href="/records">View records</a>}
      />,
    );

    expect(screen.getByRole('status')).toHaveAttribute('data-tone', 'info');
    expect(screen.getByText('Import completed')).toBeVisible();
    expect(screen.getByRole('link', { name: 'View records' })).toHaveAttribute('href', '/records');
  });

  it('uses assertive alert semantics only for danger', () => {
    const { rerender } = render(<Notification title="Payment failed" tone="danger" />);
    expect(screen.getByRole('alert')).toBeVisible();

    rerender(<Notification title="Saved" tone="success" />);
    expect(screen.getByRole('status')).toBeVisible();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('keeps warning polite and permits the decorative icon to be omitted', () => {
    const { container } = render(<Notification title="Storage nearly full" tone="warning" icon={null} />);
    expect(screen.getByRole('status')).toHaveAttribute('data-tone', 'warning');
    expect(container.querySelector('.cb-notification__icon')).not.toBeInTheDocument();
  });

  it('can suppress live-region semantics for already-visible history', () => {
    const { container } = render(<Notification title="Earlier update" announce={false} />);
    const notification = container.querySelector('.cb-notification');
    expect(notification).not.toHaveAttribute('role');
  });

  it('ships matching non-interactive Skeleton geometry', () => {
    const { container } = render(<Notification.Skeleton lines={3} withActions />);
    expect(container.querySelector('.cb-notification--skeleton')).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelectorAll('.cb-notification__skeleton-line')).toHaveLength(3);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
