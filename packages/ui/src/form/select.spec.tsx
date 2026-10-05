import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ConfigProvider, Select as AntSelect } from 'antd';
import { LabelsProvider } from '../lib/labels.js';
import { Select } from './select.js';
import { TruncatedLabel } from './truncated-label.js';

const OPTIONS = [
  { value: 'a', label: 'Gudang' },
  { value: 'b', label: 'Lokasi Proyek Barat — Rumah Hartono' },
];

describe('Select width', () => {
  it('is as wide as its longest option by default, capped', () => {
    const { container } = render(<Select options={OPTIONS} value="a" />);
    const root = container.querySelector<HTMLElement>('.cb-select');
    expect(root?.style.inlineSize).toBe('clamp(12rem, calc(35ch + 4.5rem), 28rem)');
  });

  it('only widens as options change, so a searching select does not jump', () => {
    const { container, rerender } = render(<Select options={OPTIONS} value="a" />);
    rerender(<Select options={[{ value: 'a', label: 'Gudang' }]} value="a" />);
    expect(container.querySelector<HTMLElement>('.cb-select')?.style.inlineSize).toBe('clamp(12rem, calc(35ch + 4.5rem), 28rem)');
  });

  it('keeps a width the consumer set', () => {
    const { container } = render(<Select options={OPTIONS} value="a" style={{ width: '100%' }} />);
    const root = container.querySelector<HTMLElement>('.cb-select');
    expect(root?.style.inlineSize).toBe('');
    expect(root?.style.width).toBe('100%');
  });

  it('shows the selected option through the truncating label, with its full text as content', () => {
    render(<Select options={OPTIONS} value="b" />);
    expect(screen.getByText('Lokasi Proyek Barat — Rumah Hartono')).toHaveClass('cb-select__label');
  });
});

describe('Select clear label', () => {
  it('uses the default clear label and calls onChange when cleared', () => {
    const onChange = vi.fn();
    render(<Select allowClear options={OPTIONS} value="a" onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(onChange).toHaveBeenCalledWith(undefined, undefined);
  });

  it('preserves Ant Select default clear icon', () => {
    const { container } = render(
      <>
        <Select allowClear options={OPTIONS} value="a" />
        <AntSelect allowClear options={OPTIONS} value="a" />
      </>,
    );

    const icons = container.querySelectorAll('.ant-select-clear > .anticon');
    expect(icons).toHaveLength(2);
    expect(icons[0]?.className).toBe(icons[1]?.className);
    expect(icons[0]).toHaveClass('anticon-close-circle');
  });

  it('uses the localized clear label from LabelsProvider', () => {
    render(
      <LabelsProvider labels={{ clear: 'Hapus pilihan' }}>
        <Select allowClear options={OPTIONS} value="a" />
      </LabelsProvider>,
    );

    expect(screen.getByRole('button', { name: 'Hapus pilihan' })).toBeInTheDocument();
  });

  it('preserves an explicit caller clear label', () => {
    render(
      <LabelsProvider labels={{ clear: 'Hapus pilihan' }}>
        <Select allowClear={{ label: 'Remove value' }} options={OPTIONS} value="a" />
      </LabelsProvider>,
    );

    expect(screen.getByRole('button', { name: 'Remove value' })).toBeInTheDocument();
  });

  it('preserves an explicit allowClear icon', () => {
    render(
      <Select
        allowClear={{ label: 'Remove value', clearIcon: <span data-testid="caller-clear-icon">x</span> }}
        options={OPTIONS}
        value="a"
      />,
    );

    expect(screen.getByTestId('caller-clear-icon')).toBeInTheDocument();
  });

  it('localizes a ConfigProvider-enabled clear button and preserves its icon', () => {
    render(
      <ConfigProvider select={{ allowClear: true, clearIcon: <span data-testid="provider-clear-icon">x</span> }}>
        <LabelsProvider labels={{ clear: 'Hapus pilihan' }}>
          <Select options={OPTIONS} value="a" />
        </LabelsProvider>
      </ConfigProvider>,
    );

    expect(screen.getByRole('button', { name: 'Hapus pilihan' })).toBeInTheDocument();
    expect(screen.getByTestId('provider-clear-icon')).toBeInTheDocument();
  });

  it('keeps a prop clear icon ahead of the ConfigProvider icon', () => {
    render(
      <ConfigProvider select={{ allowClear: true, clearIcon: <span data-testid="provider-clear-icon">p</span> }}>
        <Select
          clearIcon={<span data-testid="caller-prop-icon">c</span>}
          options={OPTIONS}
          value="a"
        />
      </ConfigProvider>,
    );

    expect(screen.getByTestId('caller-prop-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('provider-clear-icon')).toBeNull();
  });

  it('lets an explicit false value override ConfigProvider allowClear', () => {
    render(
      <ConfigProvider select={{ allowClear: true }}>
        <Select allowClear={false} options={OPTIONS} value="a" />
      </ConfigProvider>,
    );

    expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
  });

  it('keeps false and undefined allowClear values disabled', () => {
    const { rerender } = render(<Select allowClear={false} options={OPTIONS} value="a" />);
    expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();

    rerender(<Select options={OPTIONS} value="a" />);
    expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
  });
});

describe('TruncatedLabel', () => {
  const cut = (element: HTMLElement, scroll: number, client: number) => {
    Object.defineProperty(element, 'scrollWidth', { configurable: true, value: scroll });
    Object.defineProperty(element, 'clientWidth', { configurable: true, value: client });
  };

  it('shows its whole text in a tooltip only when it is actually cut', async () => {
    render(<TruncatedLabel>Lokasi Proyek Barat — Rumah Hartono</TruncatedLabel>);
    const label = screen.getByText('Lokasi Proyek Barat — Rumah Hartono');
    cut(label, 400, 120);
    fireEvent.mouseEnter(label);
    expect(await screen.findByRole('tooltip', {}, { timeout: 2000 })).toHaveTextContent('Lokasi Proyek Barat — Rumah Hartono');
  });

  it('shows no tooltip when the text fits', async () => {
    render(<TruncatedLabel>Gudang</TruncatedLabel>);
    const label = screen.getByText('Gudang');
    cut(label, 60, 120);
    fireEvent.mouseEnter(label);
    await new Promise((resolve) => setTimeout(resolve, 600));
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});
