import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
