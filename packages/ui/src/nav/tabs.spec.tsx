import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LabelsProvider } from '../lib/labels.js';
import { Tabs } from '../client.js';

const ITEMS = Array.from({ length: 8 }, (_, index) => ({ key: String(index), label: `Tab ${index + 1}`, children: `Panel ${index + 1}` }));

function forceTabOverflow() {
  class ImmediateResizeObserver implements ResizeObserver {
    constructor(private readonly callback: ResizeObserverCallback) {}

    observe(target: Element) {
      const entry: ResizeObserverEntry = {
        target,
        contentRect: target.getBoundingClientRect(),
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      };
      queueMicrotask(() => this.callback([entry], this));
    }

    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal('ResizeObserver', ImmediateResizeObserver);
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function getOffsetWidth(this: HTMLElement) {
    if (this.classList.contains('ant-tabs-nav')) return 180;
    if (this.classList.contains('ant-tabs-nav-list')) return 640;
    if (this.classList.contains('ant-tabs-nav-operations')) return 32;
    if (this.classList.contains('ant-tabs-tab')) return 80;
    return 0;
  });
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function getOffsetHeight(this: HTMLElement) {
    return this.classList.contains('ant-tabs-nav') || this.classList.contains('ant-tabs-nav-list') ? 40 : 0;
  });
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function getBoundingClientRect(this: HTMLElement) {
    const width = this.classList.contains('ant-tabs-nav') ? 180
      : this.classList.contains('ant-tabs-nav-list') ? 640
        : this.classList.contains('ant-tabs-nav-operations') ? 32
          : this.classList.contains('ant-tabs-tab') ? 80 : 0;
    const height = width > 0 ? 40 : 0;
    const left = this.classList.contains('ant-tabs-tab') ? Number(this.getAttribute('data-node-key') ?? '0') * 80 : 0;
    return new DOMRect(left, 0, width, height);
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Tabs overflow label', () => {
  it('names the overflow trigger and keeps a caller icon with overflowing tabs', async () => {
    forceTabOverflow();
    expect(Tabs.TabPane).toBeDefined();
    const { container } = render(
      <Tabs
        style={{ width: 180 }}
        items={ITEMS}
        moreIcon={<span data-testid="caller-more-icon" aria-hidden="true">⋯</span>}
      />,
    );

    const moreButton = await screen.findByRole('button', { name: 'More tabs' });
    expect(container.querySelector('.ant-tabs-nav-operations-hidden')).toBeNull();
    expect(screen.getByTestId('caller-more-icon')).toBeInTheDocument();
    expect(moreButton).toHaveAttribute('aria-haspopup', 'listbox');
    expect(moreButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.keyDown(moreButton, { key: 'Enter', code: 'Enter', which: 13, keyCode: 13 });
    await waitFor(() => expect(moreButton).toHaveAttribute('aria-expanded', 'true'));
    const overflowedOptions = await screen.findAllByRole('option');
    const firstOverflowedOption = overflowedOptions[0];
    if (!firstOverflowedOption) throw new Error('Expected an overflowed tab option');
    const selectedLabel = firstOverflowedOption.textContent ?? '';
    fireEvent.keyDown(moreButton, { key: 'ArrowDown', code: 'ArrowDown', which: 40, keyCode: 40 });
    await waitFor(() => expect(firstOverflowedOption).toHaveAttribute('aria-selected', 'true'));
    fireEvent.keyDown(moreButton, { key: 'Enter', code: 'Enter', which: 13, keyCode: 13 });
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: selectedLabel, selected: true })).toBeInTheDocument();
      const selectedItem = ITEMS.find((item) => item.label === selectedLabel);
      if (!selectedItem) throw new Error(`No test panel exists for ${selectedLabel}`);
      expect(screen.getByRole('tabpanel')).toHaveTextContent(selectedItem.children);
    });
  });

  it('uses the localized label from LabelsProvider', async () => {
    forceTabOverflow();
    render(
      <LabelsProvider labels={{ moreTabs: 'Tab lainnya' }}>
        <Tabs style={{ width: 180 }} items={ITEMS} moreIcon={<span aria-hidden="true">⋯</span>} />
      </LabelsProvider>,
    );

    expect(await screen.findByRole('button', { name: 'Tab lainnya' })).toBeInTheDocument();
  });

  it('preserves an explicit caller label override', async () => {
    forceTabOverflow();
    render(
      <LabelsProvider labels={{ moreTabs: 'Tab lainnya' }}>
        <Tabs
          style={{ width: 180 }}
          items={ITEMS}
          moreIcon={<span aria-hidden="true">⋯</span>}
          more={{ 'aria-label': 'Show every tab' }}
        />
      </LabelsProvider>,
    );

    expect(await screen.findByRole('button', { name: 'Show every tab' })).toBeInTheDocument();
  });

  it('preserves Ant Tabs ConfigProvider icon precedence over the moreIcon prop', async () => {
    forceTabOverflow();
    render(
      <ConfigProvider
        tabs={{ moreIcon: <span data-testid="configured-more-icon" aria-hidden="true">configured</span> }}
      >
        <Tabs
          style={{ width: 180 }}
          items={ITEMS}
          moreIcon={<span data-testid="caller-more-icon" aria-hidden="true">caller</span>}
        />
      </ConfigProvider>,
    );

    await screen.findByRole('button', { name: 'More tabs' });
    expect(screen.getByTestId('configured-more-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('caller-more-icon')).not.toBeInTheDocument();
  });
});
