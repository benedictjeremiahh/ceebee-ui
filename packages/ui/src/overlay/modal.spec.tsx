import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { StrictMode, useState } from 'react';
import { describe, expect, it } from 'vitest';

import { Drawer, Modal } from '../client.js';

function ConditionalModal() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Open details</button>
      {open ? (
        <Modal
          open
          title="Expense details"
          description="Review the category and contributors before saving."
          footer={null}
          scrollLock={false}
          onCancel={() => setOpen(false)}
        >
          <button type="button" onClick={() => setOpen(false)}>Close details</button>
        </Modal>
      ) : null}
    </>
  );
}

describe('Modal', () => {
  it('keeps the title and description as distinct accessible relationships', async () => {
    render(<ConditionalModal />);
    fireEvent.click(screen.getByRole('button', { name: 'Open details' }));

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAccessibleName('Expense details');
    expect(dialog).toHaveAccessibleDescription(
      'Review the category and contributors before saving.',
    );
  });

  it('returns focus when a controlled consumer unmounts it immediately', async () => {
    render(<StrictMode><ConditionalModal /></StrictMode>);
    const trigger = screen.getByRole('button', { name: 'Open details' });
    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.click(await screen.findByRole('button', { name: 'Close details' }));

    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('keeps an explicitly elevated dialog on the documented above-drawer layer', async () => {
    render(
      <Modal open title="Expense details" layer="above-drawer" footer={null} scrollLock={false} onCancel={() => {}}>
        Expense body
      </Modal>,
    );

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAccessibleName('Expense details');
    expect(dialog.closest('.ant-modal-wrap')).toHaveClass('cb-modal--above-drawer');
  });

  it('elevates a dialog opened from a Drawer without an explicit layer', async () => {
    function DrawerBackedModal() {
      const [drawerOpen, setDrawerOpen] = useState(false);
      const [dialogOpen, setDialogOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setDrawerOpen(true)}>Open drawer</button>
          <Drawer open={drawerOpen} title="Drawer title" onClose={() => setDrawerOpen(false)}>
            <button type="button" onClick={() => setDialogOpen(true)}>Open nested dialog</button>
            <Modal open={dialogOpen} title="Nested dialog" footer={null} scrollLock={false} onCancel={() => setDialogOpen(false)}>
              Nested body
            </Modal>
          </Drawer>
        </>
      );
    }

    render(<DrawerBackedModal />);
    fireEvent.click(screen.getByRole('button', { name: 'Open drawer' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Open nested dialog' }));

    const title = await screen.findByText('Nested dialog');
    const dialog = title.closest('.ant-modal');
    expect(dialog).not.toBeNull();
    expect(dialog?.closest('.ant-modal-wrap')).toHaveClass('cb-modal--above-drawer');
  });

  it('preserves the upstream static and hook APIs', () => {
    expect(Modal.confirm).toBeTypeOf('function');
    expect(Modal.useModal).toBeTypeOf('function');
  });
});
