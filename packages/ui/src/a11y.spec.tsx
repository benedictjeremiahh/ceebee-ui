import { render } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import { Alert } from './feedback/alert.js';
import { Badge } from './feedback/badge.js';
import { Breadcrumbs } from './nav/breadcrumbs.js';
import { Checkbox, RadioGroup, Switch } from './form/choice.js';
import { DataTable, type Column } from './data/table.js';
import { EmptyState } from './feedback/empty-state.js';
import { Field } from './form/field.js';
import { Leaderboard } from './data/leaderboard.js';
import { Pagination } from './data/pagination.js';
import { ProgressBar, Spinner } from './feedback/progress.js';
import { ProgressRing } from './data/progress-ring.js';
import { Stepper } from './nav/stepper.js';
import { TextInput } from './form/text-input.js';
import { Timeline } from './data/timeline.js';

interface Row {
  id: string;
  name: string;
}

const COLUMNS: Array<Column<Row>> = [
  { key: 'name', header: 'Name', cell: (row) => row.name, sortable: true },
];

/**
 * A real audit runs against a browser; this catches the rules that hold in jsdom — names,
 * roles, labels, list and table structure — so a regression in wiring fails the build rather
 * than waiting to be noticed on screen.
 */
async function violationsIn(ui: React.ReactElement): Promise<string[]> {
  const { container } = render(ui);
  const results = await axe.run(container, {
    // Colour contrast needs real rendering; it is measured separately against the running site.
    rules: { 'color-contrast': { enabled: false } },
  });
  return results.violations.map((violation) => `${violation.id}: ${violation.help}`);
}

describe('accessibility', () => {
  it('form controls carry names and wiring', async () => {
    expect(
      await violationsIn(
        <div>
          <Field label="Email" hint="Work address" error="Already taken">
            <TextInput />
          </Field>
          <Checkbox label="Email me receipts" description="One per payment" />
          <Switch label="Reduce motion" />
          <RadioGroup
            label="Billing period"
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' },
            ]}
          />
        </div>,
      ),
    ).toEqual([]);
  });

  it('data display keeps its structure', async () => {
    expect(
      await violationsIn(
        <div>
          <DataTable
            label="People"
            columns={COLUMNS}
            rows={[{ id: '1', name: 'Ada Putri' }]}
            rowKey={(row) => row.id}
            sort={null}
            onSortChange={() => {}}
          />
          <Pagination page={1} pageSize={10} total={40} onPageChange={() => {}} />
          <Leaderboard label="Weekly leaders" entries={[{ id: '1', name: 'Ada Putri', score: '10' }]} />
          <Timeline entries={[{ time: '09:00', title: 'Created' }]} />
          <ProgressRing value={40} label="Task progress" />
          <ProgressBar value={40} label="Upload" />
          <Spinner label="Loading" />
        </div>,
      ),
    ).toEqual([]);
  });

  it('navigation and feedback announce themselves', async () => {
    expect(
      await violationsIn(
        <div>
          <Breadcrumbs items={[{ label: 'Workspace', href: '#' }, { label: 'Billing' }]} />
          <Stepper current={1} steps={[{ label: 'Account' }, { label: 'Workspace' }]} />
          <Alert tone="danger" title="Payment failed" onDismiss={() => {}} />
          <Badge tone="success" dot>
            Live
          </Badge>
          <EmptyState title="No invoices yet" description="They appear here once billed." />
        </div>,
      ),
    ).toEqual([]);
  });
});
