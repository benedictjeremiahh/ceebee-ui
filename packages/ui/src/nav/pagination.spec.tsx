import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './pagination';

function renderPagination(current: number, itemRender?: React.ComponentProps<typeof Pagination>['itemRender']) {
  const onChange = vi.fn();
  const view = render(
    <Pagination current={current} pageSize={20} total={46} onChange={onChange} itemRender={itemRender} />,
  );
  return { ...view, onChange };
}

describe('Pagination', () => {
  it('advances exactly one page when Enter is pressed on the native next button', async () => {
    const user = userEvent.setup();
    const { container, onChange } = renderPagination(1);
    const next = container.querySelector<HTMLButtonElement>('.ant-pagination-next button');
    expect(next).not.toBeNull();
    next?.focus();

    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(2, 20);
  });

  it('moves back exactly one page when Space is pressed on the native previous button', async () => {
    const user = userEvent.setup();
    const { container, onChange } = renderPagination(2);
    const previous = container.querySelector<HTMLButtonElement>('.ant-pagination-prev button');
    expect(previous).not.toBeNull();
    previous?.focus();

    await user.keyboard(' ');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(1, 20);
  });

  it('keeps disabled arrows inert for keyboard and pointer activation', async () => {
    const user = userEvent.setup();
    const firstPage = renderPagination(1);
    const previous = firstPage.container.querySelector<HTMLButtonElement>('.ant-pagination-prev button');
    expect(previous).toBeDisabled();
    previous?.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    if (previous) await user.click(previous);
    expect(firstPage.onChange).not.toHaveBeenCalled();
    firstPage.unmount();

    const lastPage = renderPagination(3);
    const next = lastPage.container.querySelector<HTMLButtonElement>('.ant-pagination-next button');
    expect(next).toBeDisabled();
    next?.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    if (next) await user.click(next);
    expect(lastPage.onChange).not.toHaveBeenCalled();
  });

  it('keeps pointer clicks and the outer previous-item keyboard contract single', async () => {
    const user = userEvent.setup();
    const pointer = renderPagination(1);
    const pointerNext = pointer.container.querySelector('.ant-pagination-next button');
    if (!pointerNext) throw new Error('The next button should render.');
    await user.click(pointerNext);
    expect(pointer.onChange).toHaveBeenCalledTimes(1);
    expect(pointer.onChange).toHaveBeenCalledWith(2, 20);
    pointer.unmount();

    const outer = renderPagination(1);
    const nextItem = outer.container.querySelector<HTMLElement>('.ant-pagination-next');
    expect(nextItem).not.toBeNull();
    if (nextItem) fireEvent.keyDown(nextItem, { key: 'Enter' });
    expect(outer.onChange).toHaveBeenCalledTimes(1);
    expect(outer.onChange).toHaveBeenCalledWith(2, 20);
  });

  it('preserves a custom arrow-button key handler and does not double-advance', async () => {
    const user = userEvent.setup();
    const customKeyDown = vi.fn();
    const itemRender: React.ComponentProps<typeof Pagination>['itemRender'] = (_page, type, element) => {
      if (type !== 'next' || !React.isValidElement<React.ButtonHTMLAttributes<HTMLButtonElement>>(element)) return element;
      return React.cloneElement(element, { onKeyDown: customKeyDown });
    };
    const { container, onChange } = renderPagination(1, itemRender);
    const next = container.querySelector<HTMLButtonElement>('.ant-pagination-next button');
    expect(next).not.toBeNull();
    next?.focus();

    await user.keyboard('{Enter}');

    expect(customKeyDown).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(2, 20);
  });

  it('respects preventDefault from a custom arrow-button key handler', async () => {
    const user = userEvent.setup();
    const customKeyDown = vi.fn((event: React.KeyboardEvent<HTMLButtonElement>) => event.preventDefault());
    const itemRender: React.ComponentProps<typeof Pagination>['itemRender'] = (_page, type, element) => {
      if (type !== 'next' || !React.isValidElement<React.ButtonHTMLAttributes<HTMLButtonElement>>(element)) return element;
      return React.cloneElement(element, { onKeyDown: customKeyDown });
    };
    const { container, onChange } = renderPagination(1, itemRender);
    const next = container.querySelector<HTMLButtonElement>('.ant-pagination-next button');
    expect(next).not.toBeNull();
    next?.focus();

    await user.keyboard('{Enter}');

    expect(customKeyDown).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('keeps the page number item keyboard target available', () => {
    const { container, onChange } = renderPagination(1);
    const secondPage = container.querySelector<HTMLElement>('.ant-pagination-item-2');
    expect(secondPage).not.toBeNull();
    if (secondPage) fireEvent.keyDown(secondPage, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(2, 20);
  });
});
