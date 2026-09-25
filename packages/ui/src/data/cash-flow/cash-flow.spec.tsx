import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CashFlowChart } from './cash-flow.js';

const PERIODS = [
  { id: 'w1', start: '2026-09-28', inflow: 0, outflow: 30 },
  { id: 'w2', start: '2026-10-05', inflow: 10, outflow: 40 },
  { id: 'w3', start: '2026-10-12', inflow: 120, outflow: 20 },
];
const money = (value: number) => `Rp ${value}`;

describe('CashFlowChart', () => {
  it('says when the balance goes under and how far, in the consumer\'s words', () => {
    render(
      <CashFlowChart label="Kas" opening={50} periods={PERIODS} format={money} formatPeriod={(day) => day.slice(5)}
        belowLabel={(from, lowest, count) => `Minus mulai ${from}, terendah ${lowest}, ${count} minggu`} />,
    );
    expect(screen.getByText('Minus mulai 10-05, terendah Rp -10, 1 minggu')).toBeInTheDocument();
  });

  it('gives every figure in a table: in, out and the running balance per period', () => {
    render(<CashFlowChart label="Kas" opening={50} periods={PERIODS} format={money} formatPeriod={(day) => day} tableLabel="Arus kas" />);
    const table = screen.getByRole('table', { name: 'Arus kas' });
    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(4);
    expect(rows[2]).toHaveTextContent('2026-10-05Rp 10Rp 40Rp -10');
  });

  it('shades a period that closes below the line', () => {
    const { container } = render(<CashFlowChart label="Kas" opening={50} periods={PERIODS} format={money} />);
    const columns = container.querySelectorAll('.cb-cash-flow__column');
    expect([...columns].map((column) => column.getAttribute('data-below'))).toEqual([null, 'true', null]);
  });

  it('makes each period a named button only when the consumer can show what is behind it', () => {
    const onSelect = vi.fn();
    const { rerender } = render(<CashFlowChart label="Kas" opening={50} periods={PERIODS} format={money} formatPeriod={(day) => day} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    rerender(<CashFlowChart label="Kas" opening={50} periods={PERIODS} format={money} formatPeriod={(day) => day}
      onSelectPeriod={onSelect} selectedPeriod="w2" inflowLabel="Masuk" outflowLabel="Keluar" balanceLabel="Saldo" />);
    const button = screen.getByRole('button', { name: '2026-10-05: Masuk Rp 10, Keluar Rp 40, Saldo Rp -10' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(button);
    expect(onSelect).toHaveBeenCalledWith('w2');
  });

  it('shows the empty wording when there are no periods', () => {
    render(<CashFlowChart label="Kas" opening={0} periods={[]} format={money} emptyLabel="Belum ada proyeksi." />);
    expect(screen.getByText('Belum ada proyeksi.')).toBeInTheDocument();
  });
});
