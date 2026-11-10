import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Collapse } from '../../client.js';

function collapseItems() {
  return [
    { key: 'first', label: 'First section', children: <p>First content</p> },
    { key: 'second', label: 'Second section', children: <p>Second content</p> },
  ];
}

function getTrigger(name: string): HTMLElement {
  const title = screen.getByText(name);
  const trigger = title.closest('[role="button"], [role="tab"]');
  if (!(trigger instanceof HTMLElement)) throw new Error(`No keyboard trigger found for ${name}`);
  return trigger;
}

describe('Collapse keyboard interaction', () => {
  it('toggles Space once on keyup, prevents scrolling, and retains focus', () => {
    render(<Collapse items={[{ key: 'first', label: 'First section', children: <p>First content</p> }]} />);
    const trigger = getTrigger('First section');

    trigger.focus();
    const keyDown = new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true, cancelable: true });
    trigger.dispatchEvent(keyDown);

    expect(keyDown.defaultPrevented).toBe(true);
    expect(screen.queryByText('First content')).toBeNull();

    fireEvent.keyUp(trigger, { key: ' ', code: 'Space' });
    expect(screen.getByText('First content')).toBeVisible();
    expect(trigger).toHaveFocus();
  });

  it('keeps Enter and click activation to one change each', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Collapse items={collapseItems()} onChange={onChange} />);
    const trigger = getTrigger('First section');

    await user.click(trigger);
    expect(onChange).toHaveBeenCalledTimes(1);
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('supports uncontrolled and controlled active keys', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<Collapse items={collapseItems()} defaultActiveKey={['first']} />);

    expect(screen.getByText('First content')).toBeVisible();
    const uncontrolledTrigger = getTrigger('First section');
    await user.click(uncontrolledTrigger);
    expect(uncontrolledTrigger).toHaveAttribute('aria-expanded', 'false');

    rerender(<Collapse items={collapseItems()} activeKey={['first']} onChange={onChange} />);
    await user.click(getTrigger('First section'));
    expect(onChange).toHaveBeenCalledTimes(1);
    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(getTrigger('First section')).toHaveAttribute('aria-expanded', 'true');
  });

  it('preserves accordion behavior when Space activates a section', () => {
    render(<Collapse accordion items={collapseItems()} defaultActiveKey="first" />);
    const secondTrigger = getTrigger('Second section');
    secondTrigger.focus();

    fireEvent.keyDown(secondTrigger, { key: ' ', code: 'Space' });
    fireEvent.keyUp(secondTrigger, { key: ' ', code: 'Space' });

    expect(getTrigger('First section')).toHaveAttribute('aria-expanded', 'false');
    expect(secondTrigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('does not activate disabled sections with Space', () => {
    render(<Collapse items={[{ key: 'locked', label: 'Locked section', collapsible: 'disabled', children: <p>Locked content</p> }]} />);
    const trigger = getTrigger('Locked section');
    trigger.focus();

    fireEvent.keyDown(trigger, { key: ' ', code: 'Space' });
    fireEvent.keyUp(trigger, { key: ' ', code: 'Space' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('does not toggle from Space inside a text input or an extra button', () => {
    render(
      <Collapse items={[
        {
          key: 'first',
          label: <label>Search <input aria-label="Search field" /></label>,
          extra: <button type="button">Header action</button>,
          children: <p>First content</p>,
        },
      ]} />,
    );

    const input = screen.getByRole('textbox', { name: 'Search field' });
    input.focus();
    fireEvent.keyDown(input, { key: ' ', code: 'Space' });
    fireEvent.keyUp(input, { key: ' ', code: 'Space' });
    expect(screen.queryByText('First content')).toBeNull();

    const extraButton = screen.getByRole('button', { name: 'Header action' });
    extraButton.focus();
    fireEvent.keyDown(extraButton, { key: ' ', code: 'Space' });
    fireEvent.keyUp(extraButton, { key: ' ', code: 'Space' });
    expect(screen.queryByText('First content')).toBeNull();
  });

  it('does not toggle the parent when a nested section handles Space', () => {
    render(
      <Collapse defaultActiveKey={['parent']} items={[
        {
          key: 'parent',
          label: 'Parent section',
          children: <Collapse items={[{ key: 'nested', label: 'Nested section', children: <p>Nested content</p> }]} />,
        },
      ]} />,
    );
    const nestedTrigger = getTrigger('Nested section');
    nestedTrigger.focus();

    fireEvent.keyDown(nestedTrigger, { key: ' ', code: 'Space' });
    fireEvent.keyUp(nestedTrigger, { key: ' ', code: 'Space' });

    expect(nestedTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(getTrigger('Parent section')).toHaveAttribute('aria-expanded', 'true');
  });

  it('honors preventDefault from a caller item key handler', () => {
    render(<Collapse items={[
      {
        key: 'first',
        label: 'First section',
        onKeyDown: event => event.preventDefault(),
        children: <p>First content</p>,
      },
    ]} />);
    const trigger = getTrigger('First section');
    trigger.focus();

    fireEvent.keyDown(trigger, { key: ' ', code: 'Space' });
    fireEvent.keyUp(trigger, { key: ' ', code: 'Space' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('does not repeat activation while Space is held', () => {
    const onChange = vi.fn();
    render(<Collapse items={[{ key: 'first', label: 'First section', children: <p>First content</p> }]} onChange={onChange} />);
    const trigger = getTrigger('First section');
    trigger.focus();

    fireEvent.keyDown(trigger, { key: ' ', code: 'Space', repeat: false });
    fireEvent.keyDown(trigger, { key: ' ', code: 'Space', repeat: true });
    fireEvent.keyDown(trigger, { key: ' ', code: 'Space', repeat: true });
    fireEvent.keyUp(trigger, { key: ' ', code: 'Space' });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('does not activate a stale section if Space is released on another target', () => {
    render(
      <>
        <Collapse items={[{ key: 'first', label: 'First section', children: <p>First content</p> }]} />
        <button type="button">Elsewhere</button>
      </>,
    );
    const trigger = getTrigger('First section');
    const elsewhere = screen.getByRole('button', { name: 'Elsewhere' });
    trigger.focus();

    fireEvent.keyDown(trigger, { key: ' ', code: 'Space' });
    elsewhere.focus();
    fireEvent.keyUp(elsewhere, { key: ' ', code: 'Space' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
