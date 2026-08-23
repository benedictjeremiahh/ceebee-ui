import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Modal } from './modal.js';
import { Drawer } from './drawer.js';

describe('Drawer', () => {
  it('renders an independent edge panel with modal semantics', () => {
    render(<Drawer open title="Menu">Navigation</Drawer>);

    expect(screen.getByRole('dialog')).toHaveClass('cb-drawer');
    expect(screen.getByRole('dialog')).not.toHaveClass('cb-modal');
  });

  it('does not share its public or CSS abstraction with Modal', () => {
    const { rerender } = render(<Modal open title="Decision">Confirm</Modal>);
    expect(screen.getByRole('dialog')).toHaveClass('cb-modal');
    expect(screen.getByRole('dialog')).not.toHaveClass('cb-drawer');

    rerender(<Drawer open title="Navigation">Pages</Drawer>);
    expect(screen.getByRole('dialog')).toHaveClass('cb-drawer');
    expect(screen.getByRole('dialog')).not.toHaveClass('cb-modal');
  });
});
