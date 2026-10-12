import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { FocusRecovery } from '../focus/focus-recovery/index.js';
import { Drawer, Modal } from '../client.js';

describe('Modal focus recovery', () => {
  it('keeps a connected opener ahead of the section target', async () => {
    function Scenario() {
      const targetRef = createRef<HTMLHeadingElement>();
      const [open, setOpen] = useState(false);
      return (
        <>
          <h2 ref={targetRef} tabIndex={-1}>Records</h2>
          <FocusRecovery targetRef={targetRef}>
            <button type="button" onClick={() => setOpen(true)}>Open dialog</button>
            <Modal open={open} title="Record details" footer={null} scrollLock={false} onCancel={() => setOpen(false)}>
              <button type="button" onClick={() => setOpen(false)}>Close dialog</button>
            </Modal>
          </FocusRecovery>
        </>
      );
    }

    render(<Scenario />);
    const opener = screen.getByRole('button', { name: 'Open dialog' });
    opener.focus();
    fireEvent.click(opener);
    const closeButton = await screen.findByRole('button', { name: 'Close dialog' });
    closeButton.focus();
    fireEvent.click(closeButton);

    await waitFor(() => expect(opener).toHaveFocus());
  });

  it('holds a direct-link dialog recovery until the section is ready', async () => {
    function Scenario() {
      const targetRef = createRef<HTMLHeadingElement>();
      const [ready, setReady] = useState(false);
      const [open, setOpen] = useState(true);
      return (
        <>
          <h2 ref={targetRef} tabIndex={-1}>Records</h2>
          <button type="button" onClick={() => setReady(true)}>Finish loading</button>
          <FocusRecovery targetRef={targetRef} ready={ready}>
            <Modal open={open} title="Record details" footer={null} scrollLock={false} onCancel={() => setOpen(false)}>
              <button type="button" onClick={() => setOpen(false)}>Close dialog</button>
            </Modal>
          </FocusRecovery>
        </>
      );
    }

    render(<Scenario />);
    const closeButton = await screen.findByRole('button', { name: 'Close dialog' });
    closeButton.focus();
    fireEvent.click(closeButton);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(screen.getByRole('heading', { name: 'Records' })).not.toHaveFocus();

    fireEvent.click(screen.getByRole('button', { name: 'Finish loading' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Records' })).toHaveFocus());
  });

  it('uses the section target when its opener was removed during the dialog', async () => {
    function Scenario() {
      const targetRef = createRef<HTMLHeadingElement>();
      const [open, setOpen] = useState(false);
      const [showOpener, setShowOpener] = useState(true);
      return (
        <>
          <h2 ref={targetRef} tabIndex={-1}>Records</h2>
          <FocusRecovery targetRef={targetRef}>
            {showOpener ? <button type="button" onClick={() => setOpen(true)}>Open dialog</button> : null}
            <button type="button" onClick={() => setShowOpener(false)}>Remove opener</button>
            <Modal open={open} title="Record details" footer={null} scrollLock={false} onCancel={() => setOpen(false)}>
              <button type="button" onClick={() => setOpen(false)}>Close dialog</button>
            </Modal>
          </FocusRecovery>
        </>
      );
    }

    render(<Scenario />);
    const opener = screen.getByRole('button', { name: 'Open dialog' });
    opener.focus();
    fireEvent.click(opener);
    fireEvent.click(await screen.findByRole('button', { name: 'Remove opener' }));
    const closeButton = await screen.findByRole('button', { name: 'Close dialog' });
    closeButton.focus();
    fireEvent.click(closeButton);

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Records' })).toHaveFocus());
  });

  it('recovers after conditional unmount interrupts close when the opener was removed', async () => {
    function Scenario() {
      const targetRef = createRef<HTMLHeadingElement>();
      const [mounted, setMounted] = useState(false);
      const [open, setOpen] = useState(false);
      const [showOpener, setShowOpener] = useState(true);
      return (
        <>
          <h2 ref={targetRef} tabIndex={-1}>Records</h2>
          <FocusRecovery targetRef={targetRef}>
            {showOpener ? <button type="button" onClick={() => { setMounted(true); setOpen(true); }}>Open dialog</button> : null}
            {mounted ? (
              <>
                <button type="button" onClick={() => setShowOpener(false)}>Remove opener</button>
                <Modal open={open} title="Record details" footer={null} scrollLock={false} onCancel={() => setOpen(false)}>
                  <button type="button" onClick={() => { setOpen(false); setMounted(false); }}>Close dialog</button>
                </Modal>
              </>
            ) : null}
          </FocusRecovery>
        </>
      );
    }

    render(<Scenario />);
    const opener = screen.getByRole('button', { name: 'Open dialog' });
    opener.focus();
    fireEvent.click(opener);
    fireEvent.click(await screen.findByRole('button', { name: 'Remove opener' }));
    const closeButton = await screen.findByRole('button', { name: 'Close dialog' });
    closeButton.focus();
    fireEvent.click(closeButton);

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Records' })).toHaveFocus());
  });

  it('uses the ready section target when an opener disappears before deferred return focus', async () => {
    const targetRef = createRef<HTMLHeadingElement>();
    let removeOpener = () => {};
    let finishLoading = () => {};

    function Scenario() {
      const [ready, setReady] = useState(false);
      const [mounted, setMounted] = useState(false);
      const [open, setOpen] = useState(false);
      const [showOpener, setShowOpener] = useState(true);
      removeOpener = () => setShowOpener(false);
      finishLoading = () => setReady(true);
      return (
        <>
          <h2 ref={targetRef} tabIndex={-1}>Records</h2>
          <FocusRecovery targetRef={targetRef} ready={ready}>
            {showOpener ? <button type="button" onClick={() => { setMounted(true); setOpen(true); }}>Open dialog</button> : null}
            {mounted ? (
              <Modal open={open} title="Record details" footer={null} scrollLock={false} onCancel={() => setOpen(false)}>
                <button type="button" onClick={() => { setOpen(false); setMounted(false); }}>Close dialog</button>
              </Modal>
            ) : null}
          </FocusRecovery>
        </>
      );
    }

    render(<Scenario />);
    const opener = screen.getByRole('button', { name: 'Open dialog' });
    opener.focus();
    fireEvent.click(opener);
    const closeButton = await screen.findByRole('button', { name: 'Close dialog' });
    closeButton.focus();
    vi.useFakeTimers();
    try {
      fireEvent.click(closeButton);
      await act(async () => {});
      expect(opener.isConnected).toBe(true);

      act(() => removeOpener());
      expect(opener.isConnected).toBe(false);

      act(() => { vi.advanceTimersByTime(0); });
      expect(document.activeElement).toBe(document.body);

      act(() => finishLoading());
      expect(screen.getByRole('heading', { name: 'Records' })).toHaveFocus();
    } finally {
      vi.useRealTimers();
    }
  });

  it('keeps focus inside a parent panel when a nested dialog opener is removed', async () => {
    function Scenario() {
      const targetRef = createRef<HTMLHeadingElement>();
      const [dialogOpen, setDialogOpen] = useState(false);
      const [showOpener, setShowOpener] = useState(true);
      return (
        <Drawer open title="Parent panel" onClose={() => {}}>
          <h2 ref={targetRef} tabIndex={-1}>Panel section</h2>
          <FocusRecovery targetRef={targetRef}>
            {showOpener ? <button type="button" onClick={() => setDialogOpen(true)}>Open nested dialog</button> : null}
            <button type="button" onClick={() => setShowOpener(false)}>Remove nested opener</button>
            <Modal open={dialogOpen} title="Nested details" footer={null} scrollLock={false} onCancel={() => setDialogOpen(false)}>
              <button type="button" onClick={() => setDialogOpen(false)}>Close nested dialog</button>
            </Modal>
          </FocusRecovery>
        </Drawer>
      );
    }

    render(<Scenario />);
    const opener = await screen.findByRole('button', { name: 'Open nested dialog' });
    opener.focus();
    fireEvent.click(opener);
    fireEvent.click(await screen.findByRole('button', { name: 'Remove nested opener' }));
    expect(await screen.findByText('Nested details', { exact: true })).toBeInTheDocument();
    const closeButton = await screen.findByRole('button', { name: 'Close nested dialog' });
    closeButton.focus();
    fireEvent.click(closeButton);

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Panel section' })).toHaveFocus());
    expect(document.querySelector('.ant-drawer-section')).toHaveAttribute('role', 'dialog');
  });
});
