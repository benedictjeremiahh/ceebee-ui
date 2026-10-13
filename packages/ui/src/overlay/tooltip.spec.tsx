import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { createRef, useState } from 'react';
import type { ComponentRef } from 'react';
import { Tooltip as AntTooltip } from 'antd';
import { describe, expect, it, vi } from 'vitest';

import { Tooltip } from '../client.js';

describe('Tooltip Escape dismissal', () => {
  it('closes an uncontrolled tooltip from its focused trigger without moving focus', async () => {
    render(<Tooltip title="Helpful detail" trigger={['focus']}>
      <button type="button">More information</button>
    </Tooltip>);
    const trigger = screen.getByRole('button', { name: 'More information' });
    act(() => trigger.focus());
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Helpful detail');

    const allowed = fireEvent.keyDown(document, { key: 'Escape' });

    expect(allowed).toBe(false);
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
    expect(trigger).toHaveFocus();
  });

  it('lets a controlled host close the tooltip and calls both change APIs once', async () => {
    const onOpenChange = vi.fn();
    const onVisibleChange = vi.fn();
    function ControlledTooltip() {
      const [open, setOpen] = useState(true);
      return <Tooltip open={open} onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        setOpen(nextOpen);
      }} onVisibleChange={onVisibleChange} title="Controlled detail" trigger={['focus']}>
        <button type="button">Controlled trigger</button>
      </Tooltip>;
    }

    render(<ControlledTooltip />);
    const trigger = screen.getByRole('button', { name: 'Controlled trigger' });
    act(() => trigger.focus());
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Controlled detail');
    fireEvent.keyDown(trigger, { key: 'Escape' });

    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(onVisibleChange).toHaveBeenCalledTimes(1);
    expect(onVisibleChange).toHaveBeenLastCalledWith(false);
  });

  it('closes before the parent modal handles Escape, then allows the next Escape through', async () => {
    const onCancel = vi.fn();
    function ParentModal() {
      const [open, setOpen] = useState(true);
      if (!open) return null;
      return <div role="dialog" onKeyDown={(event) => {
        if (event.key !== 'Escape') return;
        onCancel();
        setOpen(false);
      }}>
        <Tooltip title="Modal detail" trigger={['focus']}>
          <button type="button">Modal trigger</button>
        </Tooltip>
      </div>;
    }
    render(<ParentModal />);
    const dialog = await screen.findByRole('dialog');
    const trigger = within(dialog).getByRole('button', { name: 'Modal trigger' });
    act(() => trigger.focus());
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Modal detail');

    fireEvent.keyDown(trigger, { key: 'Escape', keyCode: 27 });
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
    expect(onCancel).not.toHaveBeenCalled();

    fireEvent.keyDown(trigger, { key: 'Escape', keyCode: 27 });
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('keeps the native hover trigger contract', async () => {
    render(<Tooltip title="Hover detail" mouseEnterDelay={0}>
      <button type="button">Hover trigger</button>
    </Tooltip>);
    const trigger = screen.getByRole('button', { name: 'Hover trigger' });
    fireEvent.mouseEnter(trigger);
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Hover detail');
    fireEvent.mouseLeave(trigger);
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
  });

  it('forwards the native ref and preserves the upstream internal panel', () => {
    const ref = createRef<ComponentRef<typeof Tooltip>>();
    render(<Tooltip ref={ref} title="Ref detail">
      <button type="button">Ref trigger</button>
    </Tooltip>);

    expect(ref.current?.nativeElement).toBe(screen.getByRole('button', { name: 'Ref trigger' }));
    expect(Tooltip._InternalPanelDoNotUseOrYouWillBeFired).toBe(AntTooltip._InternalPanelDoNotUseOrYouWillBeFired);
  });

  it('supports the legacy defaultVisible and onVisibleChange props', async () => {
    const onVisibleChange = vi.fn();
    render(<Tooltip defaultVisible title="Legacy detail" onVisibleChange={onVisibleChange}>
      <button type="button">Legacy trigger</button>
    </Tooltip>);
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Legacy detail');

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
    expect(onVisibleChange).toHaveBeenCalledTimes(1);
    expect(onVisibleChange).toHaveBeenLastCalledWith(false);
  });

  it('treats the legacy visible prop as controlled state', async () => {
    function LegacyControlledTooltip() {
      const [visible, setVisible] = useState(true);
      return <Tooltip visible={visible} onVisibleChange={setVisible} title="Visible detail">
        <button type="button">Visible trigger</button>
      </Tooltip>;
    }
    render(<LegacyControlledTooltip />);
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Visible detail');

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
  });

  it('suppresses an uncontrolled empty defaultOpen tooltip without consuming parent Escape', () => {
    const onCancel = vi.fn();
    render(<div role="dialog" onKeyDown={(event) => {
      if (event.key === 'Escape') onCancel();
    }}>
      <Tooltip defaultOpen>
        <button type="button">Empty tooltip trigger</button>
      </Tooltip>
    </div>);
    const trigger = screen.getByRole('button', { name: 'Empty tooltip trigger' });

    expect(screen.queryByRole('tooltip')).toBeNull();
    fireEvent.keyDown(trigger, { key: 'Escape', keyCode: 27 });

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('preserves title zero as visible uncontrolled content', async () => {
    render(<Tooltip defaultOpen title={0}>
      <button type="button">Zero trigger</button>
    </Tooltip>);

    expect(await screen.findByRole('tooltip')).toHaveTextContent('0');
  });

  it('keeps explicit controlled open authoritative when the tooltip has no content', async () => {
    const onOpenChange = vi.fn();
    const onCancel = vi.fn();
    render(<div role="dialog" onKeyDown={() => onCancel()}>
      <Tooltip open title={undefined} onOpenChange={onOpenChange}>
        <button type="button">Controlled empty trigger</button>
      </Tooltip>
    </div>);

    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    const allowed = fireEvent.keyDown(document, { key: 'Escape' });

    expect(allowed).toBe(false);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(onCancel).not.toHaveBeenCalled();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });
});
