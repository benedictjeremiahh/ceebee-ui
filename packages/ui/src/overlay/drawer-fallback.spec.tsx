import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { FocusRecovery } from '../focus/focus-recovery/index.js';
import { Drawer, Modal } from '../client.js';

describe('Drawer focus recovery', () => {
  it('holds a direct-link Drawer recovery until the section is ready', async () => {
    function Scenario() {
      const targetRef = createRef<HTMLHeadingElement>();
      const [ready, setReady] = useState(false);
      const [open, setOpen] = useState(true);
      return (
        <>
          <h2 ref={targetRef} tabIndex={-1}>Records</h2>
          <button type="button" onClick={() => setReady(true)}>Finish loading</button>
          <FocusRecovery targetRef={targetRef} ready={ready}>
            <Drawer open={open} title="Record details" onClose={() => setOpen(false)}>
              <button type="button" onClick={() => setOpen(false)}>Close panel</button>
            </Drawer>
          </FocusRecovery>
        </>
      );
    }

    render(<Scenario />);
    const closeButton = await screen.findByRole('button', { name: 'Close panel' });
    closeButton.focus();
    fireEvent.click(closeButton);
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Records' })).not.toHaveFocus());

    fireEvent.click(screen.getByRole('button', { name: 'Finish loading' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Records' })).toHaveFocus());
  });

  it('drops a pending recovery when another dialog takes focus', async () => {
    function Scenario() {
      const targetRef = createRef<HTMLHeadingElement>();
      const [ready, setReady] = useState(false);
      const [drawerOpen, setDrawerOpen] = useState(true);
      const [dialogOpen, setDialogOpen] = useState(false);
      return (
        <>
          <h2 ref={targetRef} tabIndex={-1}>Records</h2>
          <FocusRecovery targetRef={targetRef} ready={ready}>
            <Drawer open={drawerOpen} title="Record details" onClose={() => setDrawerOpen(false)}>
              <button type="button" onClick={() => setDrawerOpen(false)}>Close panel</button>
            </Drawer>
          </FocusRecovery>
          <button type="button" onClick={() => setDialogOpen(true)}>Open another dialog</button>
          <button type="button" onClick={() => setReady(true)}>Finish loading</button>
          <Modal open={dialogOpen} title="Other details" footer={null} scrollLock={false} onCancel={() => setDialogOpen(false)}>
            <button type="button">Keep focus here</button>
          </Modal>
        </>
      );
    }

    render(<Scenario />);
    const closePanel = await screen.findByRole('button', { name: 'Close panel' });
    closePanel.focus();
    fireEvent.click(closePanel);
    fireEvent.click(screen.getByRole('button', { name: 'Open another dialog' }));
    const otherControl = await screen.findByRole('button', { name: 'Keep focus here' });
    otherControl.focus();
    fireEvent.click(screen.getByRole('button', { name: 'Finish loading' }));

    expect(otherControl).toHaveFocus();
    expect(screen.getByRole('heading', { name: 'Records' })).not.toHaveFocus();
  });

  it('uses the section target when its opener is removed before the Drawer closes', async () => {
    function Scenario() {
      const targetRef = createRef<HTMLHeadingElement>();
      const [open, setOpen] = useState(false);
      const [showOpener, setShowOpener] = useState(true);
      return (
        <>
          <h2 ref={targetRef} tabIndex={-1}>Records</h2>
          <FocusRecovery targetRef={targetRef}>
            {showOpener ? <button type="button" onClick={() => setOpen(true)}>Open panel</button> : null}
            <Drawer open={open} title="Record details" onClose={() => setOpen(false)}>
              <button type="button" onClick={() => setShowOpener(false)}>Remove opener</button>
              <button type="button" onClick={() => setOpen(false)}>Close panel</button>
            </Drawer>
          </FocusRecovery>
        </>
      );
    }

    render(<Scenario />);
    const opener = screen.getByRole('button', { name: 'Open panel' });
    opener.focus();
    fireEvent.click(opener);
    fireEvent.click(await screen.findByRole('button', { name: 'Remove opener' }));
    const closeButton = await screen.findByRole('button', { name: 'Close panel' });
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
            {showOpener ? <button type="button" onClick={() => { setMounted(true); setOpen(true); }}>Open panel</button> : null}
            {mounted ? (
              <Drawer open={open} title="Record details" onClose={() => setOpen(false)}>
                <button type="button" onClick={() => setShowOpener(false)}>Remove opener</button>
                <button type="button" onClick={() => { setOpen(false); setMounted(false); }}>Close panel</button>
              </Drawer>
            ) : null}
          </FocusRecovery>
        </>
      );
    }

    render(<Scenario />);
    const opener = screen.getByRole('button', { name: 'Open panel' });
    opener.focus();
    fireEvent.click(opener);
    fireEvent.click(await screen.findByRole('button', { name: 'Remove opener' }));
    const closeButton = await screen.findByRole('button', { name: 'Close panel' });
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
            {showOpener ? <button type="button" onClick={() => { setMounted(true); setOpen(true); }}>Open panel</button> : null}
            {mounted ? (
              <Drawer open={open} title="Record details" onClose={() => setOpen(false)}>
                <button type="button" onClick={() => { setOpen(false); setMounted(false); }}>Close panel</button>
              </Drawer>
            ) : null}
          </FocusRecovery>
        </>
      );
    }

    render(<Scenario />);
    const opener = screen.getByRole('button', { name: 'Open panel' });
    opener.focus();
    fireEvent.click(opener);
    const closeButton = await screen.findByRole('button', { name: 'Close panel' });
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

});
