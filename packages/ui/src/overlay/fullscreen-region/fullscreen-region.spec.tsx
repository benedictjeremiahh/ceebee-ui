import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConfigProvider, Modal } from 'antd';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FullscreenRegion } from './fullscreen-region.js';

const labels = {
  enter: 'Enter expanded mode',
  exit: 'Exit fullscreen',
  expand: 'Expand workspace',
  collapse: 'Return to workspace',
  hint: 'Press Escape to exit fullscreen.',
  expandedHint: 'Press Escape to return to the page.',
};

function Example() {
  const [value, setValue] = useState('week');
  return <><button>Outside</button><FullscreenRegion label="Planning workspace" labels={labels} toolbar={<span>Workspace tools</span>}>
    <input aria-label="Period" value={value} onChange={(event) => setValue(event.currentTarget.value)} />
  </FullscreenRegion></>;
}

function ModalExample({ portal }: { portal: HTMLElement }) {
  const [modal, contextHolder] = Modal.useModal();
  return <ConfigProvider getPopupContainer={() => portal}>
    <FullscreenRegion label="Planning workspace" labels={labels}>
      {contextHolder}
      <button onClick={() => modal.confirm({ title: 'Confirm action', content: 'Apply this change?' })}>
        Show confirmation
      </button>
    </FullscreenRegion>
  </ConfigProvider>;
}

afterEach(() => {
  vi.restoreAllMocks();
  Reflect.deleteProperty(document, 'fullscreenEnabled');
  Reflect.deleteProperty(document, 'fullscreenElement');
  Reflect.deleteProperty(document, 'exitFullscreen');
  Reflect.deleteProperty(Element.prototype, 'requestFullscreen');
});

describe('FullscreenRegion', () => {
  it('uses generic labels and keeps the same input mounted in the isolated window mode', async () => {
    render(<Example />);
    const input = screen.getByLabelText('Period');
    fireEvent.change(input, { target: { value: 'month' } });
    const trigger = screen.getByRole('button', { name: labels.expand });
    trigger.focus();
    fireEvent.click(trigger);

    const region = screen.getByRole('region', { name: 'Planning workspace' });
    expect(region).toHaveAttribute('data-mode', 'window');
    expect(screen.getByRole('button', { name: labels.collapse })).toBeInTheDocument();
    expect(screen.getByText(labels.expandedHint)).toHaveAttribute('role', 'status');
    expect(screen.getByRole('button', { name: 'Outside', hidden: true })).toHaveAttribute('inert');
    expect(screen.getByLabelText('Period')).toBe(input);
    expect(input).toHaveValue('month');

    fireEvent.keyDown(input, { key: 'Escape' });
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(region).toHaveAttribute('data-mode', 'inline');
    expect(screen.getByRole('button', { name: 'Outside' })).not.toHaveAttribute('inert');
  });

  it('falls back to isolated window mode when a native fullscreen request is denied', async () => {
    Object.defineProperty(document, 'fullscreenEnabled', { configurable: true, value: true });
    Object.defineProperty(Element.prototype, 'requestFullscreen', { configurable: true,
      value: () => Promise.reject(new Error('Denied')) });
    render(<Example />);
    await waitFor(() => expect(screen.getByRole('button', { name: labels.enter })).toBeInTheDocument());
    const trigger = screen.getByRole('button', { name: labels.enter });
    trigger.focus();
    await act(async () => fireEvent.click(trigger));
    expect(screen.getByRole('region', { name: 'Planning workspace' })).toHaveAttribute('data-mode', 'window');
    fireEvent.click(screen.getByRole('button', { name: labels.collapse }));
    expect(screen.getByRole('region', { name: 'Planning workspace' })).toHaveAttribute('data-mode', 'inline');
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('uses the native labels when the browser grants fullscreen', async () => {
    const state: { element: Element | null } = { element: null };
    Object.defineProperty(document, 'fullscreenEnabled', { configurable: true, value: true });
    Object.defineProperty(document, 'fullscreenElement', { configurable: true, get: () => state.element });
    Object.defineProperty(Element.prototype, 'requestFullscreen', { configurable: true, value: function(this: Element) {
      state.element = this;
      document.dispatchEvent(new Event('fullscreenchange'));
      return Promise.resolve();
    } });
    Object.defineProperty(document, 'exitFullscreen', { configurable: true, value: () => {
      state.element = null;
      document.dispatchEvent(new Event('fullscreenchange'));
      return Promise.resolve();
    } });
    render(<Example />);
    await waitFor(() => expect(screen.getByRole('button', { name: labels.enter })).toBeInTheDocument());
    const trigger = screen.getByRole('button', { name: labels.enter });
    trigger.focus();
    await act(async () => fireEvent.click(trigger));
    expect(screen.getByRole('button', { name: labels.exit })).toBeInTheDocument();
    expect(screen.getByText(labels.hint)).toHaveAttribute('role', 'status');
    await act(async () => fireEvent.click(screen.getByRole('button', { name: labels.exit })));
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('contains a hook modal inside the native fullscreen region and preserves the parent portal inline', async () => {
    const state: { element: Element | null } = { element: null };
    Object.defineProperty(document, 'fullscreenEnabled', { configurable: true, value: true });
    Object.defineProperty(document, 'fullscreenElement', { configurable: true, get: () => state.element });
    Object.defineProperty(Element.prototype, 'requestFullscreen', { configurable: true, value: function(this: Element) {
      state.element = this;
      document.dispatchEvent(new Event('fullscreenchange'));
      return Promise.resolve();
    } });
    const portal = document.createElement('div');
    document.body.append(portal);

    const nativeRender = render(<ModalExample portal={portal} />);
    await waitFor(() => expect(screen.getByRole('button', { name: labels.enter })).toBeInTheDocument());
    const region = screen.getByRole('region', { name: 'Planning workspace' });
    await act(async () => fireEvent.click(screen.getByRole('button', { name: labels.enter })));
    fireEvent.click(screen.getByRole('button', { name: 'Show confirmation' }));
    const fullscreenDialog = await screen.findByRole('dialog', { name: 'Confirm action' });
    expect(region.contains(fullscreenDialog)).toBe(true);

    act(() => {
      state.element = null;
      document.dispatchEvent(new Event('fullscreenchange'));
    });
    nativeRender.unmount();
    portal.replaceChildren();
    render(<ModalExample portal={portal} />);
    fireEvent.click(screen.getByRole('button', { name: 'Show confirmation' }));
    const inlineDialog = await screen.findByRole('dialog', { name: 'Confirm action' });
    expect(region.contains(inlineDialog)).toBe(false);
    expect(portal.contains(inlineDialog)).toBe(true);
    portal.remove();
  });
});
