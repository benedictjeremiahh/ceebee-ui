import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import { ConfigProvider } from 'antd';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DatePicker, Modal } from '../client.js';

const originalViewport = { width: window.innerWidth, height: window.innerHeight };

function resizeViewport(width: number, height = window.innerHeight) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: height });
  fireEvent(window, new Event('resize'));
}

afterEach(() => {
  vi.unstubAllEnvs();
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalViewport.width });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: originalViewport.height });
});

function ControlledDatePicker({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <DatePicker
      aria-label="Effective date"
      value={dayjs('2026-10-11')}
      format="D MMM YYYY"
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        setOpen(nextOpen);
      }}
    />
  );
}

function DatePickerModal({ onCancel }: { onCancel: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Open date modal</button>
      <Modal
        open={open}
        title="Choose effective date"
        footer={null}
        scrollLock={false}
        onCancel={() => {
          onCancel();
          setOpen(false);
        }}
      >
        <DatePicker
          aria-label="Effective date"
          defaultValue={dayjs('2026-10-11')}
          format="D MMM YYYY"
        />
      </Modal>
    </>
  );
}

describe('DatePicker viewport resize', () => {
  it('closes an open popup once on width change without changing the value or submitting', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onChange = vi.fn();
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <DatePicker
          aria-label="Effective date"
          defaultValue={dayjs('2026-10-11')}
          format="D MMM YYYY"
          onChange={onChange}
          onOpenChange={onOpenChange}
        />
        <button type="submit">Save</button>
      </form>,
    );
    const input = screen.getByRole('textbox', { name: 'Effective date' });
    await user.click(input);
    expect(screen.getByTitle('2026-10-11')).toBeInTheDocument();

    resizeViewport(window.innerWidth - 160);
    fireEvent(window, new Event('resize'));

    await waitFor(() => expect(document.querySelector('.ant-picker-dropdown')).toHaveClass('ant-picker-dropdown-hidden'));
    expect(onOpenChange.mock.calls.filter(([open]) => !open)).toHaveLength(1);
    expect(onChange).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(input).toHaveValue('11 Oct 2026');
    expect(input).toHaveFocus();
  });

  it('keeps the popup open when only viewport height changes', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <DatePicker
        aria-label="Effective date"
        defaultValue={dayjs('2026-10-11')}
        onOpenChange={onOpenChange}
      />,
    );
    const input = screen.getByRole('textbox', { name: 'Effective date' });
    await user.click(input);
    expect(screen.getByTitle('2026-10-11')).toBeInTheDocument();
    const initialWidth = window.innerWidth;
    const initialHeight = window.innerHeight;

    resizeViewport(initialWidth, initialHeight - 250);

    expect(screen.getByTitle('2026-10-11')).toBeInTheDocument();
    expect(onOpenChange.mock.calls.filter(([open]) => !open)).toHaveLength(0);
  });

  it('can reopen with the same date after a width change', async () => {
    const user = userEvent.setup();
    render(
      <DatePicker
        aria-label="Effective date"
        defaultValue={dayjs('2026-10-11')}
        format="D MMM YYYY"
      />,
    );
    const input = screen.getByRole('textbox', { name: 'Effective date' });
    await user.click(input);
    resizeViewport(window.innerWidth - 120);
    await waitFor(() => expect(document.querySelector('.ant-picker-dropdown')).toHaveClass('ant-picker-dropdown-hidden'));

    await user.click(input);

    expect(screen.getByTitle('2026-10-11')).toBeInTheDocument();
    expect(input).toHaveValue('11 Oct 2026');
  });

  it('notifies a controlled owner to close on width change', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<ControlledDatePicker onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('textbox', { name: 'Effective date' }));
    expect(screen.getByTitle('2026-10-11')).toBeInTheDocument();

    resizeViewport(window.innerWidth - 100);

    await waitFor(() => expect(document.querySelector('.ant-picker-dropdown')).toHaveClass('ant-picker-dropdown-hidden'));
    expect(onOpenChange.mock.calls.filter(([open]) => !open)).toHaveLength(1);
  });

  it('removes its resize listener when closed and after unmount', async () => {
    const user = userEvent.setup();
    const addListener = vi.spyOn(window, 'addEventListener');
    const removeListener = vi.spyOn(window, 'removeEventListener');
    const view = render(<DatePicker aria-label="Effective date" />);
    const input = screen.getByRole('textbox', { name: 'Effective date' });

    await user.click(input);
    const resizeHandler = addListener.mock.calls
      .filter(([name, listener]) => name === 'resize' && typeof listener === 'function')
      .map(([, listener]) => listener)
      .find((listener) => typeof listener === 'function' && listener.name === 'onResize');
    expect(resizeHandler).toBeDefined();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(document.querySelector('.ant-picker-dropdown')).toHaveClass('ant-picker-dropdown-hidden'));
    expect(removeListener).toHaveBeenCalledWith('resize', resizeHandler);

    await user.click(input);
    const nextResizeHandler = addListener.mock.calls
      .filter(([name, listener]) => name === 'resize' && typeof listener === 'function')
      .map(([, listener]) => listener)
      .filter((listener) => typeof listener === 'function' && listener.name === 'onResize')
      .at(-1);
    expect(nextResizeHandler).toBeDefined();
    view.unmount();

    expect(removeListener).toHaveBeenCalledWith('resize', nextResizeHandler);
  });

  it('closes its popup before the enclosing Modal and restores focus to the opener', async () => {
    // Upstream uses one constant portal ID in test mode; real IDs keep nested portals distinct.
    vi.stubEnv('NODE_ENV', 'development');
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<ConfigProvider theme={{ token: { motion: false } }}><DatePickerModal onCancel={onCancel} /></ConfigProvider>);
    const opener = screen.getByRole('button', { name: 'Open date modal' });
    await user.click(opener);

    const dialog = await screen.findByRole('dialog', { name: 'Choose effective date' });
    const input = screen.getByRole('textbox', { name: 'Effective date' });
    await user.click(input);
    await waitFor(() => expect(input).toHaveFocus());
    expect(screen.getByTitle('2026-10-11')).toBeInTheDocument();

    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape', keyCode: 27 });

    await waitFor(() => expect(document.querySelector('.ant-picker-dropdown')).toHaveClass('ant-picker-dropdown-hidden'));
    expect(dialog).toBeInTheDocument();
    expect(onCancel).not.toHaveBeenCalled();
    expect(input).toHaveFocus();

    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape', keyCode: 27 });

    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Choose effective date' })).toBeNull());
    expect(onCancel).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(opener).toHaveFocus());
  });

});
