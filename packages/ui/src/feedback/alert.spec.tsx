import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Alert } from './alert.js';

describe('Alert', () => {
  it('interrupts for danger and warning, and waits its turn otherwise', () => {
    const { rerender } = render(<Alert tone="danger" title="Payment failed" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Payment failed');

    rerender(<Alert tone="success" title="Saved" />);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
  });

  it('can be dismissed, and the control is named', async () => {
    const onDismiss = vi.fn();
    render(<Alert title="Heads up" onDismiss={onDismiss} />);
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});
