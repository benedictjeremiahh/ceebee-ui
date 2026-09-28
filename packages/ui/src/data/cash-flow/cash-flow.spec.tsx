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
  it('keeps keyboard inspection and the accessible table in a compact overview without disclosure', () => {
    const { container } = render(<CashFlowChart label="Cash" opening={50} periods={PERIODS}
      format={money} formatPeriod={(day) => day} compact />);
    expect(container.querySelector('details')).not.toBeInTheDocument();
    expect(container.querySelector('.cb-cash-flow__periods--compact')).toBeInTheDocument();
    expect(screen.getByRole('table')).toHaveTextContent('Rp -10');
    fireEvent.focus(screen.getByRole('img', { name: /2026-10-05: In Rp 10/ }));
    expect(screen.getByTestId('cash-flow-detail')).toHaveTextContent('BalanceRp -10');
  });
  it('discloses an exact-value table instead of a second row of date labels', () => {
    const { container } = render(<CashFlowChart label="Cash" opening={50} periods={PERIODS} format={money}
      formatExact={(value) => `Exact ${value}`} formatPeriod={(day) => day}
      periodControlsLabel="Browse exact amounts" />);
    const disclosure = container.querySelector('details');
    expect(disclosure).toBeInTheDocument();
    expect(disclosure).not.toHaveAttribute('open');
    expect(disclosure?.querySelector('summary')).toHaveTextContent('Browse exact amounts');
    const table = disclosure?.querySelector('table');
    expect(table).toBeInTheDocument();
    expect(table).toHaveTextContent('PeriodInOutBalance');
    expect(table).toHaveTextContent('2026-10-05Exact 10Exact 40Exact -10');
    expect(disclosure?.querySelectorAll('.cb-cash-flow__periods')).toHaveLength(0);
    expect(container.querySelectorAll('table')).toHaveLength(1);
  });
  it('preserves selectable period actions and adjustments inside the disclosed table', () => {
    const onSelect = vi.fn();
    const { container } = render(<CashFlowChart label="Cash" opening={50}
      periods={[{ id: 'a', start: '2026-09-28', inflow: 10, outflow: 5, adjustment: -20 }]}
      format={money} formatPeriod={(day) => day} periodControlsLabel="Browse" periodLabel="Periode"
      selectedPeriod="a" onSelectPeriod={onSelect} />);
    const table = container.querySelector('details table');
    if (!(table instanceof HTMLTableElement)) throw new Error('The disclosed cash table is missing');
    expect(table).toHaveTextContent('PeriodeInOutAdjustmentBalance');
    expect(table).toHaveTextContent('2026-09-28Rp 10Rp 5Rp -20Rp 35');
    const button = within(table).getByRole('button', { name: /2026-09-28: In Rp 10/ });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(button);
    expect(onSelect).toHaveBeenCalledWith('a');
  });
  it('shows exact details on focus without pretending a non-actionable period is a button', () => {
    const { container } = render(<CashFlowChart label="Cash" opening={50} periods={[{ id: 'a', start: '2026-09-28', inflow: 10, outflow: 5, adjustment: -20 }]}
      format={money} formatPeriod={(day) => day} adjustmentLabel="Adjustment" />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    fireEvent.focus(screen.getByRole('img', { name: /2026-09-28: In Rp 10/ }));
    expect(screen.getByTestId('cash-flow-detail')).toHaveTextContent('AdjustmentRp -20');
    const plot = container.querySelector('.cb-cash-flow__plot');
    if (!plot) throw new Error('The cash plot is missing');
    fireEvent.mouseLeave(plot);
    expect(screen.getByTestId('cash-flow-detail')).toHaveTextContent('AdjustmentRp -20');
    expect(screen.getByRole('table')).toHaveTextContent('Adjustment');
  });
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

  it('marks a period that closes below the line beside its readable period label', () => {
    const { container } = render(<CashFlowChart label="Kas" opening={50} periods={PERIODS} format={money} />);
    const periods = container.querySelectorAll('.cb-cash-flow__period');
    expect([...periods].map((period) => period.getAttribute('data-below'))).toEqual([null, 'true', null]);
    expect(container.querySelector('.cb-cash-flow__canvas')).toBeInTheDocument();
    expect(container.querySelector('svg')).not.toBeInTheDocument();
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

  it('reveals exact amounts on keyboard focus while leaving the compact axis format intact', () => {
    const exact = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;
    render(<CashFlowChart label="Kas" opening={50} periods={PERIODS} format={() => '0M'} formatExact={exact}
      formatPeriod={(day) => day} onSelectPeriod={() => undefined} inflowLabel="Masuk" outflowLabel="Keluar" balanceLabel="Saldo" />);
    const button = screen.getByRole('button', { name: '2026-10-05: Masuk Rp 10, Keluar Rp 40, Saldo Rp -10' });
    fireEvent.focus(button);
    expect(screen.getByTestId('cash-flow-detail')).toHaveTextContent('MasukRp 10KeluarRp 40SaldoRp -10');
    fireEvent.blur(button);
    expect(screen.queryByTestId('cash-flow-detail')).not.toBeInTheDocument();
  });

  it('shows the empty wording when there are no periods', () => {
    render(<CashFlowChart label="Kas" opening={0} periods={[]} format={money} emptyLabel="Belum ada proyeksi." />);
    expect(screen.getByText('Belum ada proyeksi.')).toBeInTheDocument();
  });
  it('keeps the exact table exposed without a disclosure in forced colors', () => {
    const query = vi.spyOn(window, 'matchMedia').mockImplementation((media) => ({
      media, matches: media === '(forced-colors: active)', onchange: null,
      addEventListener: () => {}, removeEventListener: () => {},
      addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
    }));
    try {
      const { container } = render(<CashFlowChart label="Cash" opening={50} periods={PERIODS}
        format={money} periodControlsLabel="Browse" />);
      expect(container.querySelector('details')).not.toBeInTheDocument();
      expect(container.querySelector('.cb-cash-flow__canvas')).not.toBeInTheDocument();
      expect(screen.getByRole('table')).toHaveTextContent('Rp -10');
    } finally {
      query.mockRestore();
    }
  });
});
