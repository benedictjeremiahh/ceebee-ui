import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useScheduleFullscreen } from './use-schedule-fullscreen.js';

function Example({ enabled = true }: { enabled?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const fullscreen = useScheduleFullscreen(root, enabled);
  return <><button>Outside</button><div ref={root} tabIndex={-1} data-mode={fullscreen.mode}>
    <button onClick={fullscreen.toggle}>{fullscreen.mode === 'inline' ? 'Expand' : 'Exit'}</button>
    <input aria-label="Order" defaultValue="week" />
  </div></>;
}

afterEach(() => {
  vi.restoreAllMocks();
  Reflect.deleteProperty(document, 'fullscreenEnabled');
  Reflect.deleteProperty(document, 'fullscreenElement');
  Reflect.deleteProperty(document, 'exitFullscreen');
  Reflect.deleteProperty(Element.prototype, 'requestFullscreen');
});

describe('Schedule fullscreen', () => {
  it('returns inline when fullscreen is disabled while the window view is open', () => {
    const { rerender } = render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Expand' });
    fireEvent.click(trigger);
    expect(trigger.parentElement).toHaveAttribute('data-mode', 'window');
    rerender(<Example enabled={false} />);
    expect(trigger.parentElement).toHaveAttribute('data-mode', 'inline');
    expect(screen.getByRole('button', { name: 'Outside' })).not.toHaveAttribute('inert');
  });
  it('fills the window without a dialog when native fullscreen is unavailable, then restores focus', async () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Expand' });
    trigger.focus();
    fireEvent.click(trigger);
    const region = trigger.parentElement;
    expect(region).toHaveAttribute('data-mode', 'window');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Outside', hidden: true })).toHaveAttribute('inert');
    fireEvent.keyDown(region ?? document, { key: 'Escape' });
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(region).toHaveAttribute('data-mode', 'inline');
    expect(screen.getByLabelText('Order')).toHaveValue('week');
    expect(screen.getByRole('button', { name: 'Outside' })).not.toHaveAttribute('inert');
  });
  it('enters and leaves native fullscreen without remounting chart controls', async () => {
    const state: { element: Element | null } = { element: null };
    Object.defineProperty(document, 'fullscreenEnabled', { configurable: true, value: true });
    Object.defineProperty(document, 'fullscreenElement', { configurable: true, get: () => state.element });
    const request = vi.fn(function(this: Element) {
      state.element = this;
      document.dispatchEvent(new Event('fullscreenchange'));
      return Promise.resolve();
    });
    Object.defineProperty(Element.prototype, 'requestFullscreen', { configurable: true, value: request });
    Object.defineProperty(document, 'exitFullscreen', { configurable: true, value: () => {
      state.element = null;
      document.dispatchEvent(new Event('fullscreenchange'));
      return Promise.resolve();
    } });
    render(<Example />);
    const input = screen.getByLabelText('Order');
    fireEvent.change(input, { target: { value: 'month' } });
    const trigger = screen.getByRole('button', { name: 'Expand' });
    trigger.focus();
    await act(async () => fireEvent.click(trigger));
    expect(request).toHaveBeenCalledOnce();
    expect(trigger.parentElement).toHaveAttribute('data-mode', 'native');
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Exit' })));
    expect(trigger.parentElement).toHaveAttribute('data-mode', 'inline');
    expect(screen.getByLabelText('Order')).toBe(input);
    expect(input).toHaveValue('month');
    expect(trigger).toHaveFocus();
  });

  it('recovers from a denied fullscreen request with the labelled window mode', async () => {
    Object.defineProperty(document, 'fullscreenEnabled', { configurable: true, value: true });
    Object.defineProperty(Element.prototype, 'requestFullscreen', { configurable: true,
      value: () => Promise.reject(new Error('Denied')) });
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Expand' });
    await act(async () => fireEvent.click(trigger));
    expect(trigger.parentElement).toHaveAttribute('data-mode', 'window');
    fireEvent.click(screen.getByRole('button', { name: 'Exit' }));
    expect(trigger.parentElement).toHaveAttribute('data-mode', 'inline');
  });

  it('restores outside elements on unmount without clearing a pre-existing inert state', () => {
    const { unmount } = render(<Example />);
    const outside = screen.getByRole('button', { name: 'Outside' });
    outside.setAttribute('inert', '');
    fireEvent.click(screen.getByRole('button', { name: 'Expand' }));
    unmount();
    expect(outside).toHaveAttribute('inert');
    expect(document.querySelector('[inert]')).toBeNull();
  });
});
