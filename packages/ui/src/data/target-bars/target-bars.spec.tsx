import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TargetBars } from './target-bars.js';

const percent = (value: number) => `${value.toFixed(1).replace('.', ',')}%`;

const ROWS = [
  { id: 'a', label: 'Rumah Pak Budi', target: 15, actual: 18.2 },
  { id: 'b', label: 'Ruko Blok C', target: 15, actual: -3.5 },
  { id: 'c', label: 'Gudang Timur', target: 12, actual: null },
];

describe('TargetBars', () => {
  it('is a named list, one item per row, with both figures written out', () => {
    render(<TargetBars label="Final margin" rows={ROWS} format={percent} />);
    const list = screen.getByRole('list', { name: 'Final margin' });
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('Rumah Pak Budi');
    expect(items[0]).toHaveTextContent('Actual 18,2%');
    expect(items[0]).toHaveTextContent('Target 15,0%');
  });

  it('marks each row met, missed or unknown', () => {
    render(<TargetBars label="Final margin" rows={ROWS} format={percent} />);
    const items = screen.getAllByRole('listitem');
    expect(items.map((item) => item.getAttribute('data-verdict'))).toEqual(['met', 'missed', 'unknown']);
  });

  it('writes an unknown figure as unknown, never as zero, and draws no bar for it', () => {
    render(<TargetBars label="Final margin" rows={ROWS} format={percent} unknownLabel="belum diketahui" />);
    const unknown = screen.getAllByRole('listitem')[2];
    expect(unknown).toHaveTextContent('belum diketahui');
    expect(unknown?.querySelector('.cb-target-bars__fill')).toBeNull();
    expect(unknown?.querySelector('.cb-target-bars__target')).not.toBeNull();
  });

  it('takes the product words for the two figures', () => {
    render(<TargetBars label="Margin" rows={ROWS.slice(0, 1)} format={percent} actualLabel="Nyata" targetLabel="Target" />);
    expect(screen.getByRole('listitem')).toHaveTextContent('Nyata 18,2%');
  });

  it('keeps the bars out of the accessibility tree, since the text already says it', () => {
    const { container } = render(<TargetBars label="Final margin" rows={ROWS} format={percent} />);
    for (const track of container.querySelectorAll('.cb-target-bars__track')) {
      expect(track.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('shows the empty wording when there are no rows', () => {
    render(<TargetBars label="Final margin" rows={[]} format={percent} emptyLabel="Belum ada pekerjaan selesai." />);
    expect(screen.getByText('Belum ada pekerjaan selesai.')).toBeInTheDocument();
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('draws a deviation from the target line when asked, with both figures still written', () => {
    const { container } = render(<TargetBars label="Final margin" rows={ROWS} format={percent} variant="deviation" />);
    const [beat, missed, unknown] = container.querySelectorAll('.cb-target-bars__row');
    const fill = (row: Element | undefined) => row?.querySelector<HTMLElement>('.cb-target-bars__fill')?.style;
    // Deviations +3.2 and -18.5 on a ±18.5 scale: the miss runs from the left edge to the centre line.
    expect(fill(missed)?.insetInlineStart).toBe('0%');
    expect(fill(missed)?.inlineSize).toBe('50%');
    expect(fill(beat)?.insetInlineStart).toBe('50%');
    expect(beat).toHaveTextContent('Actual 18,2%');
    expect(unknown?.querySelector('.cb-target-bars__fill')).toBeNull();
    expect(container.querySelector('.cb-target-bars__target')).toBeNull();
    expect(container.querySelector('.cb-target-bars')?.getAttribute('data-variant')).toBe('deviation');
  });
});
