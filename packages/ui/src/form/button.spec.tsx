import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef, useState } from 'react';
import { Button as AntButton, ConfigProvider } from 'antd';
import type { GetRef } from 'antd';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../client.js';

function LoadingCycle() {
  const [loading, setLoading] = useState(false);
  return <>
    <Button loading={loading} onClick={() => setLoading(true)}>Save changes</Button>
    <button onClick={() => setLoading(false)}>Finish saving</button>
  </>;
}

describe('Button loading accessibility', () => {
  it('keeps the default spinner decorative and the action name stable through its leave state', async () => {
    const { container } = render(<LoadingCycle />);
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    const saving = await screen.findByRole('button', { name: 'Save changes' });
    expect(saving).toHaveClass('ant-btn-loading');
    await waitFor(() => {
      expect(container.querySelector('.ant-btn-loading-icon [role="img"][aria-label="loading"]'))
        .toHaveAttribute('aria-hidden', 'true');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Finish saving' }));
    const saved = await screen.findByRole('button', { name: 'Save changes' });
    await waitFor(() => expect(saved).not.toHaveClass('ant-btn-loading'));
    const leavingIcon = container.querySelector('.ant-btn-loading-icon [role="img"][aria-label="loading"]');
    if (leavingIcon) expect(leavingIcon).toHaveAttribute('aria-hidden', 'true');
  });

  it('blocks activation while loading without replacing the action label', async () => {
    const activate = vi.fn();
    render(<Button loading onClick={activate}>Save changes</Button>);
    const save = await screen.findByRole('button', { name: 'Save changes' });
    fireEvent.click(save);
    expect(activate).not.toHaveBeenCalled();
  });

  it('preserves explicit labels, refs, native link and button attributes, and Ant Button.Group', () => {
    const buttonRef = createRef<GetRef<typeof Button>>();
    const linkRef = createRef<GetRef<typeof Button>>();
    render(
      <>
        <Button ref={buttonRef} htmlType="submit" aria-label="Save changes" loading />
        <Button ref={linkRef} href="/people" target="_blank">Open people</Button>
      </>,
    );

    const save = screen.getByRole('button', { name: 'Save changes' });
    const link = screen.getByRole('link', { name: 'Open people' });
    expect(buttonRef.current).toBe(save);
    expect(save).toHaveAttribute('type', 'submit');
    expect(linkRef.current).toBe(link);
    expect(link).toHaveAttribute('href', '/people');
    expect(link).toHaveAttribute('target', '_blank');
    expect(Button.Group).toBe(AntButton.Group);
  });
});

describe('Button loading icon preservation', () => {
  it('does not hide a caller icon or a caller-supplied loading icon', async () => {
    const callerIcon = <span role="img" aria-label="receipt">▤</span>;
    const loadingIcon = <span role="img" aria-label="sync">↻</span>;
    const { rerender } = render(<Button icon={callerIcon}>Save</Button>);

    expect(screen.getByRole('button', { name: 'receipt Save' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'receipt' })).not.toHaveAttribute('aria-hidden', 'true');

    rerender(<Button icon={callerIcon} loading={{ icon: loadingIcon }}>Save</Button>);
    expect(await screen.findByRole('button', { name: 'sync Save' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'sync' })).not.toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('img', { name: 'receipt' })).toBeNull();

    rerender(<Button icon={callerIcon}>Save</Button>);
    expect(await screen.findByRole('button', { name: 'receipt Save' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'receipt' })).not.toHaveAttribute('aria-hidden', 'true');
  });

  it('preserves a ConfigProvider loading icon and its accessible name', async () => {
    const providerIcon = <span role="img" aria-label="provider sync">↻</span>;
    render(
      <ConfigProvider button={{ loadingIcon: providerIcon }}>
        <Button loading>Save</Button>
      </ConfigProvider>,
    );

    expect(await screen.findByRole('button', { name: 'provider sync Save' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'provider sync' })).not.toHaveAttribute('aria-hidden', 'true');
    expect(document.querySelector('.ant-btn-loading-icon [aria-label="loading"]')).toBeNull();
  });

  it('uses a custom prefix for the adapter boundary without adding a wrapper element', async () => {
    const { container } = render(<Button prefixCls="garden-button" loading>Save</Button>);
    const button = await screen.findByRole('button', { name: 'Save' });
    expect(button).toHaveClass('garden-button-loading');
    await waitFor(() => {
      expect(container.querySelector('.garden-button-loading-icon [role="img"][aria-label="loading"]'))
        .toHaveAttribute('aria-hidden', 'true');
    });
    expect(container.firstElementChild).toBe(button);
    expect(container.querySelectorAll('.garden-button')).toHaveLength(1);
  });

  it('waits for a delayed loading state and restores the exact name after an immediate finish', async () => {
    const finish = vi.fn();
    function DelayedCycle() {
      const [loading, setLoading] = useState(false);
      return <>
        <Button loading={loading ? { delay: 40 } : false} onClick={finish}>Save changes</Button>
        <button onClick={() => setLoading(true)}>Start saving</button>
        <button onClick={() => setLoading(false)}>Finish saving</button>
      </>;
    }

    const { container } = render(<DelayedCycle />);
    fireEvent.click(screen.getByRole('button', { name: 'Start saving' }));
    const save = screen.getByRole('button', { name: 'Save changes' });
    expect(save).not.toHaveClass('ant-btn-loading');
    expect(container.querySelector('.ant-btn-loading-icon [aria-label="loading"]')).toBeNull();

    await waitFor(() => expect(save).toHaveClass('ant-btn-loading'), { timeout: 1000 });
    await waitFor(() => {
      expect(container.querySelector('.ant-btn-loading-icon [role="img"][aria-label="loading"]'))
        .toHaveAttribute('aria-hidden', 'true');
    });
    fireEvent.click(screen.getByRole('button', { name: 'Finish saving' }));
    const finished = await screen.findByRole('button', { name: 'Save changes' });
    await waitFor(() => expect(finished).not.toHaveClass('ant-btn-loading'));
    const leavingIcon = container.querySelector('.ant-btn-loading-icon [role="img"][aria-label="loading"]');
    if (leavingIcon) expect(leavingIcon).toHaveAttribute('aria-hidden', 'true');
    expect(finish).not.toHaveBeenCalled();
  });
});
