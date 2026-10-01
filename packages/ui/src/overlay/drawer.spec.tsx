import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import { Drawer } from '../client.js';

function ConditionalDrawer() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Open panel</button>
      {open ? (
        <Drawer open title="Record details" onClose={() => setOpen(false)}>
          <button type="button" onClick={() => setOpen(false)}>Close panel</button>
        </Drawer>
      ) : null}
    </>
  );
}

describe('Drawer stacking contract', () => {
  it('paints the Drawer and its backdrop on the documented drawer rungs', async () => {
    render(<ConditionalDrawer />);
    fireEvent.click(screen.getByRole('button', { name: 'Open panel' }));

    const panel = await screen.findByRole('dialog', { name: 'Record details' });
    expect(panel.closest('.ant-drawer')).toHaveClass('cb-drawer');
    expect(document.querySelector('.ant-drawer-mask')).toHaveClass('cb-drawer__backdrop');
  });
});
