import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { StrictMode, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

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

  it('adds its touch-target class through the documented close semantic slot', async () => {
    render(
      <Drawer open title="Record details" classNames={{ close: 'caller-close' }} onClose={() => {}}>
        <p>Details</p>
      </Drawer>,
    );

    await screen.findByRole('dialog', { name: 'Record details' });
    expect(document.querySelector('.cb-drawer__close')).toHaveClass('caller-close');
  });

  it('restores the connected opener when closing conditionally unmounts the Drawer', async () => {
    render(<ConditionalDrawer />);
    const opener = screen.getByRole('button', { name: 'Open panel' });
    opener.focus();
    fireEvent.click(opener);
    await screen.findByRole('dialog', { name: 'Record details' });
    const closeButton = screen.getByRole('button', { name: 'Close panel' });
    closeButton.focus();
    fireEvent.click(closeButton);

    await waitFor(() => expect(opener).toHaveFocus());
  });

  it('restores focus if conditional removal interrupts the controlled close transition', async () => {
    function ClosingDrawer() {
      const [mounted, setMounted] = useState(false);
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => { setMounted(true); setOpen(true); }}>Open panel</button>
          {mounted ? (
            <Drawer open={open} title="Record details" onClose={() => setOpen(false)}>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setTimeout(() => setMounted(false), 0);
                }}
              >
                Close panel
              </button>
            </Drawer>
          ) : null}
        </>
      );
    }

    render(<ClosingDrawer />);
    const opener = screen.getByRole('button', { name: 'Open panel' });
    opener.focus();
    fireEvent.click(opener);
    await screen.findByRole('dialog', { name: 'Record details' });
    const closeButton = screen.getByRole('button', { name: 'Close panel' });
    closeButton.focus();
    fireEvent.click(closeButton);

    await waitFor(() => expect(opener).toHaveFocus());
  });

  it('keeps conditional restoration working under Strict Mode effect replay', async () => {
    render(<StrictMode><ConditionalDrawer /></StrictMode>);
    const opener = screen.getByRole('button', { name: 'Open panel' });
    opener.focus();
    fireEvent.click(opener);
    await screen.findByRole('dialog', { name: 'Record details' });
    await act(async () => new Promise((resolve) => setTimeout(resolve, 0)));
    const closeButton = screen.getByRole('button', { name: 'Close panel' });
    closeButton.focus();
    fireEvent.click(closeButton);

    await waitFor(() => expect(opener).toHaveFocus());
  });

  it('keeps the opener when the focus opt-out changes during the same open Drawer', async () => {
    function DynamicFocusDrawer() {
      const [open, setOpen] = useState(false);
      const [restoreFocus, setRestoreFocus] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>Open panel</button>
          <button type="button" onClick={() => setRestoreFocus(true)}>Enable focus return</button>
          {open ? (
            <Drawer
              open
              title="Record details"
              focusable={{ focusTriggerAfterClose: restoreFocus }}
              onClose={() => setOpen(false)}
            >
              <button type="button" onClick={() => setOpen(false)}>Close panel</button>
            </Drawer>
          ) : null}
        </>
      );
    }

    render(<StrictMode><DynamicFocusDrawer /></StrictMode>);
    const opener = screen.getByRole('button', { name: 'Open panel' });
    opener.focus();
    fireEvent.click(opener);
    await screen.findByRole('dialog', { name: 'Record details' });
    await act(async () => new Promise((resolve) => setTimeout(resolve, 0)));
    fireEvent.click(screen.getByRole('button', { name: 'Enable focus return' }));
    const closeButton = screen.getByRole('button', { name: 'Close panel' });
    closeButton.focus();
    fireEvent.click(closeButton);

    await waitFor(() => expect(opener).toHaveFocus());
  });

  it('does not steal focus from another connected control during unmount cleanup', async () => {
    function DrawerWithExternalFocusTarget() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>Open panel</button>
          <button type="button">Other control</button>
          {open ? (
            <Drawer open title="Record details" onClose={() => setOpen(false)}>
              <button type="button" onClick={() => setOpen(false)}>Close panel</button>
            </Drawer>
          ) : null}
        </>
      );
    }

    render(<DrawerWithExternalFocusTarget />);
    const opener = screen.getByRole('button', { name: 'Open panel' });
    const otherControl = screen.getByRole('button', { name: 'Other control' });
    opener.focus();
    fireEvent.click(opener);
    await screen.findByRole('dialog', { name: 'Record details' });
    const closeButton = screen.getByRole('button', { name: 'Close panel' });
    closeButton.focus();
    fireEvent.click(closeButton);
    otherControl.focus();

    await act(async () => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(otherControl).toHaveFocus();
  });

  it('honors the focus restoration opt-out when conditionally unmounted', async () => {
    function OptOutDrawer() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>Open panel</button>
          {open ? (
            <Drawer open title="Record details" focusable={{ focusTriggerAfterClose: false }} onClose={() => setOpen(false)}>
              <button type="button" onClick={() => setOpen(false)}>Close panel</button>
            </Drawer>
          ) : null}
        </>
      );
    }

    render(<OptOutDrawer />);
    const opener = screen.getByRole('button', { name: 'Open panel' });
    opener.focus();
    fireEvent.click(opener);
    await screen.findByRole('dialog', { name: 'Record details' });
    const closeButton = screen.getByRole('button', { name: 'Close panel' });
    closeButton.focus();
    fireEvent.click(closeButton);

    await act(async () => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(document.activeElement).toBe(document.body);
  });

  it('forwards the completed controlled close callback', async () => {
    const afterOpenChange = vi.fn();
    function ControlledDrawer() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>Open panel</button>
          <Drawer open={open} title="Record details" afterOpenChange={afterOpenChange} onClose={() => setOpen(false)}>
            <button type="button" onClick={() => setOpen(false)}>Close panel</button>
          </Drawer>
        </>
      );
    }

    render(<ControlledDrawer />);
    fireEvent.click(screen.getByRole('button', { name: 'Open panel' }));
    await screen.findByRole('dialog', { name: 'Record details' });
    fireEvent.click(screen.getByRole('button', { name: 'Close panel' }));
    await waitFor(() => expect(afterOpenChange).toHaveBeenCalledWith(false));
  });

  it('restores focus to a connected opener inside a parent Drawer', async () => {
    function NestedDrawers() {
      const [parentOpen, setParentOpen] = useState(false);
      const [childOpen, setChildOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setParentOpen(true)}>Open parent panel</button>
          {parentOpen ? (
            <Drawer open title="Parent panel" onClose={() => setParentOpen(false)}>
              <button type="button" onClick={() => setChildOpen(true)}>Open child panel</button>
              {childOpen ? (
                <Drawer open title="Child panel" onClose={() => setChildOpen(false)}>
                  <button type="button" onClick={() => setChildOpen(false)}>Close child panel</button>
                </Drawer>
              ) : null}
            </Drawer>
          ) : null}
        </>
      );
    }

    render(<NestedDrawers />);
    fireEvent.click(screen.getByRole('button', { name: 'Open parent panel' }));
    await screen.findByRole('dialog', { name: 'Parent panel' });
    const childOpener = screen.getByRole('button', { name: 'Open child panel' });
    childOpener.focus();
    fireEvent.click(childOpener);
    await screen.findByText('Child panel', { exact: true });
    const childClose = screen.getByRole('button', { name: 'Close child panel' });
    childClose.focus();
    fireEvent.click(childClose);

    await waitFor(() => expect(childOpener).toHaveFocus());
  });
});
