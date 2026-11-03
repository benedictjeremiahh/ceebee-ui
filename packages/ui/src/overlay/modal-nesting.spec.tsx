import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useState } from 'react';
import { Drawer, Modal } from '../client.js';

const tokens = ['--cb-z-modal', '--cb-z-modal-backdrop', '--cb-z-modal-above-drawer', '--cb-z-modal-above-drawer-backdrop'];
const previous: string[] = [];
beforeEach(() => {
  tokens.forEach((key, index) => {
    previous[index] = document.documentElement.style.getPropertyValue(key);
    const value = ['300', '200', '1500', '1400'][index];
    if (value !== undefined) document.documentElement.style.setProperty(key, value);
  });
});
afterEach(() => tokens.forEach((key, index) => {
  if (previous[index]) document.documentElement.style.setProperty(key, previous[index]);
  else document.documentElement.style.removeProperty(key);
}));

function NestedDialogs({ drawer = false }: { drawer?: boolean }) {
  const [open, setOpen] = useState(false);
  const content = <Modal open title="Parent review" footer={null} scrollLock={false} onCancel={() => {}}>
    <button onClick={() => setOpen(true)}>Open child task</button>
    {open ? <Modal open title="Child task" footer={null} scrollLock={false} onCancel={() => setOpen(false)}>
      <button onClick={() => setOpen(false)}>Close child task</button>
    </Modal> : null}
  </Modal>;
  return drawer ? <Drawer open title="Review drawer">{content}</Drawer> : content;
}

describe('rendered nested Modal portals', () => {
  it.each([false, true])('keeps the child mask between the two panels (Drawer ancestor: %s)', async drawer => {
    render(<NestedDialogs drawer={drawer} />);
    const opener = await screen.findByRole('button', { name: 'Open child task' });
    // The upstream test environment uses a fixed title ID; locate the rendered panels by title.
    const parent = (await screen.findByText('Parent review')).closest('[role="dialog"]');
    opener.focus(); fireEvent.click(opener);
    const child = (await screen.findByText('Child task')).closest('[role="dialog"]');
    await waitFor(() => {
      const parentWrapper = parent?.closest<HTMLElement>('.ant-modal-wrap');
      const childWrapper = child?.closest<HTMLElement>('.ant-modal-wrap');
      const mask = childWrapper?.parentElement?.querySelector<HTMLElement>('.ant-modal-mask');
      expect(parentWrapper).not.toBeNull(); expect(childWrapper).not.toBeNull(); expect(mask).not.toBeNull();
      const parentLayer = Number(parentWrapper?.style.zIndex);
      const maskLayer = Number(mask?.style.zIndex);
      expect(maskLayer).toBeGreaterThan(parentLayer);
      expect(Number(childWrapper?.style.zIndex)).toBeGreaterThan(maskLayer);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Close child task' }));
    await waitFor(() => expect(opener).toHaveFocus());
    expect(parent).toBeInTheDocument();
  });
});
