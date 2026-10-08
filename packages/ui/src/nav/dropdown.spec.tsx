import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Button, Dropdown, Modal, Tooltip } from '../client.js';

function MenuDialog() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dropdown trigger={['click']} menu={{ items: [
        { key: 'edit', label: 'Edit details', onClick: () => setOpen(true) },
      ] }}>
        <Tooltip title="More actions"><Button aria-label="More actions">More actions</Button></Tooltip>
      </Dropdown>
      {open ? <Modal open title="Details" footer={null} scrollLock={false} onCancel={() => setOpen(false)}>
        <button type="button">Dialog action</button>
      </Modal> : null}
    </>
  );
}

describe('Dropdown focus handoff', () => {
  it('consumes the default Enter click when its menu item opens a dialog', async () => {
    render(<MenuDialog />);
    fireEvent.click(screen.getByRole('button', { name: 'More actions' }));
    const item = await screen.findByRole('menuitem', { name: 'Edit details' });
    act(() => item.focus());
    const defaultAllowed = fireEvent.keyDown(item, { key: 'Enter', code: 'Enter', keyCode: 13, which: 13 });
    expect(defaultAllowed).toBe(false);
    expect(await screen.findByRole('dialog')).toHaveAccessibleName('Details');
  });

  it('returns to the durable trigger after an item opens a conditional dialog', async () => {
    render(<MenuDialog />);
    const trigger = screen.getByRole('button', { name: 'More actions' });
    act(() => trigger.focus());
    fireEvent.click(trigger);
    const item = await screen.findByRole('menuitem', { name: 'Edit details' });
    act(() => item.focus());
    fireEvent.click(item);
    const dialog = await screen.findByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('forwards the trigger ref and menu close notification without losing focus', async () => {
    const ref = createRef<HTMLElement>();
    const onOpenChange = vi.fn();
    render(<Dropdown ref={ref} trigger={['click']} onOpenChange={onOpenChange}
      menu={{ items: [{ key: 'inspect', label: 'Inspect' }] }}>
      <button type="button">Actions</button>
    </Dropdown>);
    const trigger = screen.getByRole('button', { name: 'Actions' });
    expect(ref.current).toBe(trigger);
    fireEvent.click(trigger);
    const item = await screen.findByRole('menuitem', { name: 'Inspect' });
    act(() => item.focus());
    fireEvent.click(item);
    expect(onOpenChange).toHaveBeenLastCalledWith(false, { source: 'menu' });
    expect(trigger).toHaveFocus();
  });

  it('preserves the upstream static API', () => {
    expect(Dropdown.Button).toBeDefined();
  });

  it('keeps a multiple-selection menu open without moving focus to the trigger', async () => {
    const onOpenChange = vi.fn();
    render(<Dropdown trigger={['click']} onOpenChange={onOpenChange}
      menu={{ selectable: true, multiple: true, items: [{ key: 'one', label: 'First choice' }] }}>
      <button type="button">Choices</button>
    </Dropdown>);
    fireEvent.click(screen.getByRole('button', { name: 'Choices' }));
    const item = await screen.findByRole('menuitem', { name: 'First choice' });
    act(() => item.focus());
    fireEvent.click(item);
    expect(item).toHaveFocus();
    expect(onOpenChange).not.toHaveBeenCalledWith(false, { source: 'menu' });
  });
});
