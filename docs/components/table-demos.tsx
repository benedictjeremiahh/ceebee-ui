'use client';

import { useMemo, useState } from 'react';
import { Copy, Inbox, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  Button,
  DataTable,
  DropdownMenu,
  Pagination,
  type Column,
  type SortState,
} from '@ceebee/ui/client';
import { Avatar, Badge, EmptyState, Stack, Text } from '@ceebee/ui';
import { CodeBlock } from './code-block';

interface Invoice {
  id: string;
  customer: string;
  status: 'paid' | 'pending' | 'overdue';
  amount: number;
  issued: string;
}

const INVOICES: Invoice[] = [
  { id: 'INV-1041', customer: 'Ada Putri', status: 'paid', amount: 4_250_000, issued: '2026-08-01' },
  { id: 'INV-1042', customer: 'Rio Hakim', status: 'pending', amount: 1_120_000, issued: '2026-08-03' },
  { id: 'INV-1043', customer: 'Sarah Chen', status: 'overdue', amount: 9_800_000, issued: '2026-07-18' },
  { id: 'INV-1044', customer: 'Budi Santoso', status: 'paid', amount: 640_000, issued: '2026-08-06' },
  { id: 'INV-1045', customer: 'Citra Dewi', status: 'pending', amount: 2_300_000, issued: '2026-08-09' },
];

const TONE = { paid: 'success', pending: 'warning', overdue: 'danger' } as const;
const money = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

export function TableDemo() {
  const [sort, setSort] = useState<SortState | null>({ column: 'issued', direction: 'desc' });
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    if (!sort) return INVOICES;
    const sorted = [...INVOICES].sort((a, b) => {
      const key = sort.column as keyof Invoice;
      return String(a[key]).localeCompare(String(b[key]), undefined, { numeric: true });
    });
    return sort.direction === 'asc' ? sorted : sorted.reverse();
  }, [sort]);

  const columns: Array<Column<Invoice>> = [
    { key: 'id', header: 'Invoice', cell: (row) => <Text size="sm" numeric as="span">{row.id}</Text>, sortable: true, width: '9rem' },
    {
      key: 'customer',
      header: 'Customer',
      sortable: true,
      cell: (row) => (
        <Stack direction="row" gap={2} align="center">
          <Avatar name={row.customer} size="sm" />
          <Text size="sm" as="span">{row.customer}</Text>
        </Stack>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <Badge tone={TONE[row.status]} size="sm" dot>{row.status}</Badge>,
    },
    { key: 'issued', header: 'Issued', cell: (row) => row.issued, sortable: true, secondary: true },
    {
      key: 'amount',
      header: 'Amount',
      align: 'end',
      sortable: true,
      cell: (row) => <Text size="sm" numeric as="span">{money.format(row.amount)}</Text>,
    },
    {
      key: 'actions',
      header: '',
      align: 'end',
      width: '3rem',
      cell: () => (
        <DropdownMenu
          trigger={<Button size="sm" variant="ghost" tone="neutral" iconStart={<MoreHorizontal size={16} />} aria-label="Row actions" />}
          items={[
            { label: 'Edit', icon: <Pencil size={14} />, shortcut: '⌘E' },
            { label: 'Duplicate', icon: <Copy size={14} /> },
            { separator: true },
            { label: 'Delete', icon: <Trash2 size={14} />, tone: 'danger' },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="demo">
      <div className="demo__stage" data-layout="block">
        <Stack gap={4}>
          <Stack direction="row" gap={2} wrap>
            <Button size="sm" variant="outline" tone="neutral" onClick={() => setLoading((v) => !v)}>
              Toggle loading
            </Button>
            <Button size="sm" variant="outline" tone="neutral" onClick={() => setEmpty((v) => !v)}>
              Toggle empty
            </Button>
          </Stack>

          {loading ? (
            <DataTable.Skeleton columns={6} rows={5} />
          ) : (
            <DataTable
              label="Invoices"
              columns={columns}
              rows={empty ? [] : rows}
              rowKey={(row) => row.id}
              sort={sort}
              onSortChange={setSort}
              empty={
                <EmptyState
                  icon={<Inbox size={22} />}
                  title="No invoices yet"
                  description="They appear here once your first customer is billed."
                  actions={<Button size="sm">Create an invoice</Button>}
                />
              }
            />
          )}

          <Pagination page={page} pageSize={20} total={137} onPageChange={setPage} />
        </Stack>
      </div>
      <CodeBlock bare code={`const [sort, setSort] = useState<SortState | null>({ column: 'issued', direction: 'desc' });

<DataTable
  label="Invoices"
  columns={columns}
  rows={rows}
  rowKey={(row) => row.id}
  sort={sort}
  onSortChange={setSort}
  empty={<EmptyState title="No invoices yet" />}
/>

<Pagination page={page} pageSize={20} total={137} onPageChange={setPage} />`} />
    </div>
  );
}

export function PaginationDemo() {
  const [page, setPage] = useState(7);
  return (
    <div className="demo">
      <div className="demo__stage" data-layout="block">
        <Stack gap={5}>
          <Pagination page={page} pageSize={10} total={300} onPageChange={setPage} />
          <Pagination page={2} pageSize={10} total={45} onPageChange={() => {}} showSummary={false} />
          <Pagination page={1} pageSize={20} total={0} onPageChange={() => {}} />
        </Stack>
      </div>
      <CodeBlock bare code={`<Pagination page={page} pageSize={10} total={300} onPageChange={setPage} />`} />
    </div>
  );
}
