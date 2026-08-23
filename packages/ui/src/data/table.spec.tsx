import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Table, type Column } from './table.js';

interface Row {
  id: string;
  name: string;
  amount: number;
}

const ROWS: Row[] = [
  { id: '1', name: 'Ada Putri', amount: 120 },
  { id: '2', name: 'Rio Hakim', amount: 340 },
];

const COLUMNS: Array<Column<Row>> = [
  { key: 'name', header: 'Name', cell: (row) => row.name, sortable: true },
  { key: 'amount', header: 'Amount', cell: (row) => row.amount, align: 'end' },
];

describe('Table', () => {
  it('renders a named table with a header row and one row per record', () => {
    render(<Table label="Customers" columns={COLUMNS} rows={ROWS} rowKey={(row) => row.id} />);
    expect(screen.getByRole('table', { name: 'Customers' })).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  it('exposes the sort state on the column header, not just in the icon', async () => {
    const onSortChange = vi.fn();
    const { rerender } = render(
      <Table label="Customers" columns={COLUMNS} rows={ROWS} rowKey={(row) => row.id} onSortChange={onSortChange} />,
    );

    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'none');
    await userEvent.click(screen.getByRole('button', { name: /Name/ }));
    expect(onSortChange).toHaveBeenCalledWith({ column: 'name', direction: 'asc' });

    rerender(
      <Table
        label="Customers"
        columns={COLUMNS}
        rows={ROWS}
        rowKey={(row) => row.id}
        sort={{ column: 'name', direction: 'asc' }}
        onSortChange={onSortChange}
      />,
    );
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'ascending');
  });

  it('offers no sort control on a column that is not sortable', () => {
    render(
      <Table label="Customers" columns={COLUMNS} rows={ROWS} rowKey={(row) => row.id} onSortChange={vi.fn()} />,
    );
    expect(screen.queryByRole('button', { name: /Amount/ })).toBeNull();
  });

  it('shows the empty slot instead of an empty table body', () => {
    render(
      <Table label="Customers" columns={COLUMNS} rows={[]} rowKey={(row) => row.id} empty={<p>No customers yet</p>} />,
    );
    expect(screen.getByText('No customers yet')).toBeInTheDocument();
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('hides the loading placeholder from assistive technology', () => {
    const { container } = render(<Table.Skeleton columns={3} rows={4} />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });
});
