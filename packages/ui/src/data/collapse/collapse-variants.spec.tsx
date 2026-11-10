import { createRef } from 'react';
import type { KeyboardEvent } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ConfigProvider } from 'antd';
import { Collapse } from '../../client.js';

describe('Collapse Space compatibility', () => {
  it.each(['header', 'icon'] as const)('activates only the upstream %s trigger area', async mode => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Collapse collapsible={mode} onChange={onChange}
      items={[{ key: 'recipe', label: 'Saved recipe', children: 'Material quantities' }]} />);
    const triggers = screen.getAllByRole('button');
    const trigger = triggers[0];
    if (!trigger) throw new Error('Expected an enabled trigger');
    trigger.focus();
    await user.keyboard(' ');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(onChange).toHaveBeenCalledTimes(1);
    await user.keyboard(' ');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('preserves legacy panels, root refs and a configured prefix', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();
    render(<ConfigProvider prefixCls="example">
      <Collapse ref={ref}>
        <Collapse.Panel key="legacy" header="Legacy section">Legacy content</Collapse.Panel>
      </Collapse>
    </ConfigProvider>);
    const trigger = screen.getByRole('button', { name: 'Legacy section' });
    expect(ref.current).toHaveClass('example-collapse');
    expect(trigger.parentElement).toBe(ref.current?.firstElementChild);
    trigger.focus();
    await user.keyboard(' ');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveFocus();
  });

  it('respects keyup cancellation without leaving a pending activation', () => {
    const onKeyUp = vi.fn((event: KeyboardEvent<HTMLDivElement>) => event.preventDefault());
    render(<Collapse items={[{ key: 'first', label: 'Section', onKeyUp, children: 'Contents' }]} />);
    const trigger = screen.getByRole('button', { name: 'Section' });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: ' ' });
    fireEvent.keyUp(trigger, { key: ' ' });
    expect(onKeyUp).toHaveBeenCalledOnce();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('does not activate when the pressed header loses focus and regains it before release', () => {
    render(<><Collapse items={[{ key: 'first', label: 'Section', children: 'Contents' }]} />
      <button type="button">Other action</button></>);
    const trigger = screen.getByRole('button', { name: 'Section' });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: ' ' });
    screen.getByRole('button', { name: 'Other action' }).focus();
    trigger.focus();
    fireEvent.keyUp(trigger, { key: ' ' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
