import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { StrictMode, useState } from 'react';
import { describe, expect, it } from 'vitest';

import { Modal } from '../client.js';

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

  it('preserves the upstream static and hook APIs', () => {
    expect(Modal.confirm).toBeTypeOf('function');
    expect(Modal.useModal).toBeTypeOf('function');
  });
});
