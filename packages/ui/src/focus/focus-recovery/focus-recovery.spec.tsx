import { act, fireEvent, render, screen } from '@testing-library/react';
import { StrictMode, createRef, useState } from 'react';
import { describe, expect, it } from 'vitest';

import { FocusRecovery } from './focus-recovery.js';

function RemovableControl({ ready = true }: { ready?: boolean }) {
  const targetRef = createRef<HTMLHeadingElement>();
  const [visible, setVisible] = useState(true);
  return (
    <>
      <h2 ref={targetRef} tabIndex={-1}>Records</h2>
      <FocusRecovery targetRef={targetRef} ready={ready}>
        {visible ? <button type="button" onClick={() => setVisible(false)}>Remove control</button> : null}
      </FocusRecovery>
    </>
  );
}

describe('FocusRecovery', () => {
  it('lets a nested section keep a removed control pending until that section is ready', async () => {
    const outerTargetRef = createRef<HTMLHeadingElement>();
    const innerTargetRef = createRef<HTMLHeadingElement>();
    let markInnerReady = () => {};

    function NestedSections() {
      const [innerReady, setInnerReady] = useState(false);
      const [visible, setVisible] = useState(true);
      markInnerReady = () => setInnerReady(true);
      return (
        <>
          <h1 ref={outerTargetRef} tabIndex={-1}>Attendance</h1>
          <FocusRecovery targetRef={outerTargetRef}>
            <h2 ref={innerTargetRef} tabIndex={-1}>Crew</h2>
            <FocusRecovery targetRef={innerTargetRef} ready={innerReady}>
              {visible ? <button type="button" onClick={() => setVisible(false)}>Remove crew control</button> : null}
            </FocusRecovery>
          </FocusRecovery>
        </>
      );
    }

    render(<NestedSections />);
    const control = screen.getByRole('button', { name: 'Remove crew control' });
    control.focus();
    fireEvent.click(control);

    await act(async () => {});
    expect(document.activeElement).toBe(document.body);

    act(() => markInnerReady());
    await act(async () => {});
    expect(screen.getByRole('heading', { name: 'Crew' })).toHaveFocus();
  });

  it('prefers a ready nested section target when both sections can recover', async () => {
    const outerTargetRef = createRef<HTMLHeadingElement>();
    const innerTargetRef = createRef<HTMLHeadingElement>();

    function NestedSections() {
      const [visible, setVisible] = useState(true);
      return (
        <>
          <h1 ref={outerTargetRef} tabIndex={-1}>Attendance</h1>
          <FocusRecovery targetRef={outerTargetRef}>
            <h2 ref={innerTargetRef} tabIndex={-1}>Crew</h2>
            <FocusRecovery targetRef={innerTargetRef}>
              {visible ? <button type="button" onClick={() => setVisible(false)}>Remove crew control</button> : null}
            </FocusRecovery>
          </FocusRecovery>
        </>
      );
    }

    render(<NestedSections />);
    const control = screen.getByRole('button', { name: 'Remove crew control' });
    control.focus();
    fireEvent.click(control);

    await act(async () => {});
    expect(screen.getByRole('heading', { name: 'Crew' })).toHaveFocus();
  });

  it('returns focus to its injected target after the focused control is removed', async () => {
    render(<RemovableControl />);
    const control = screen.getByRole('button', { name: 'Remove control' });
    control.focus();
    fireEvent.click(control);

    await act(async () => {});
    expect(screen.getByRole('heading', { name: 'Records' })).toHaveFocus();
  });

  it('retains a removal until the section is ready', async () => {
    function DeferredRemoval() {
      const targetRef = createRef<HTMLHeadingElement>();
      const [ready, setReady] = useState(false);
      const [visible, setVisible] = useState(true);
      return (
        <>
          <h2 ref={targetRef} tabIndex={-1}>Records</h2>
          <button type="button" onClick={() => setReady(true)}>Finish loading</button>
          <FocusRecovery targetRef={targetRef} ready={ready}>
            {visible ? <button type="button" onClick={() => setVisible(false)}>Remove control</button> : null}
          </FocusRecovery>
        </>
      );
    }

    render(<DeferredRemoval />);
    const control = screen.getByRole('button', { name: 'Remove control' });
    control.focus();
    fireEvent.click(control);
    await act(async () => {});
    expect(document.activeElement).toBe(document.body);

    fireEvent.click(screen.getByRole('button', { name: 'Finish loading' }));
    await act(async () => {});
    expect(screen.getByRole('heading', { name: 'Records' })).toHaveFocus();
  });

  it('does not move focus when the focused control remains connected', async () => {
    render(<RemovableControl />);
    const control = screen.getByRole('button', { name: 'Remove control' });
    control.focus();
    await act(async () => {});
    expect(control).toHaveFocus();
  });

  it('does not retry recovery on later mutations when no focused control was removed', async () => {
    function StableControl() {
      const targetRef = createRef<HTMLHeadingElement>();
      const [count, setCount] = useState(0);
      return (
        <>
          <h2 ref={targetRef} tabIndex={-1}>Records</h2>
          <FocusRecovery targetRef={targetRef}>
            <button type="button">Keep focus</button>
            <button type="button" onClick={() => setCount((value) => value + 1)}>Add content</button>
            {Array.from({ length: count }, (_, index) => <span key={index}>Record</span>)}
          </FocusRecovery>
        </>
      );
    }

    render(<StableControl />);
    const control = screen.getByRole('button', { name: 'Keep focus' });
    control.focus();
    fireEvent.click(screen.getByRole('button', { name: 'Add content' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add content' }));

    await act(async () => {});
    expect(control).toHaveFocus();
  });

  it('does not steal intentional focus outside the section', async () => {
    render(
      <>
        <button type="button">Other control</button>
        <RemovableControl />
      </>,
    );
    const control = screen.getByRole('button', { name: 'Remove control' });
    control.focus();
    screen.getByRole('button', { name: 'Other control' }).focus();
    fireEvent.click(control);

    await act(async () => {});
    expect(screen.getByRole('button', { name: 'Other control' })).toHaveFocus();
  });

  it('does not recover focus after unmount under Strict Mode', async () => {
    function RecoveringSection() {
      const targetRef = createRef<HTMLHeadingElement>();
      const [mounted, setMounted] = useState(true);
      return (
        <>
          <h2 ref={targetRef} tabIndex={-1}>Records</h2>
          {mounted ? (
            <FocusRecovery targetRef={targetRef}>
              <button type="button" onClick={() => setMounted(false)}>Remove section</button>
            </FocusRecovery>
          ) : null}
        </>
      );
    }

    render(<StrictMode><RecoveringSection /></StrictMode>);
    const control = screen.getByRole('button', { name: 'Remove section' });
    control.focus();
    fireEvent.click(control);
    await act(async () => {});
    expect(screen.getByRole('heading', { name: 'Records' })).not.toHaveFocus();
  });
});
