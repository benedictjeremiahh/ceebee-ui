import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { OrgChart } from './org-chart.js';
import type { OrgChartNode } from './org-chart.types.js';

const root: OrgChartNode = { id: 'root-a', name: 'Avery', children: [
  { id: 'child-a', name: 'Blair', children: [{ id: 'leaf-a', name: 'Casey' }] },
] };
const otherRoot: OrgChartNode = { id: 'root-b', name: 'Devon' };
const people: OrgChartNode[] = [root, otherRoot];

describe('OrgChart', () => {
  it('renders a localized skeleton on the server before loading the browser layout', () => {
    const html = renderToString(<OrgChart nodes={people} label="Organization" loadingLabel="Loading team" />);
    expect(html).toContain('Loading team');
    expect(html).not.toContain('Avery');
  });

  it('starts expanded and renders independent roots without a synthetic person', async () => {
    render(<OrgChart nodes={people} label="Organization" />);
    expect(await screen.findByRole('region', { name: 'Organization' })).toBeInTheDocument();
    expect(await screen.findByText('Casey', {}, { timeout: 5000 })).toBeInTheDocument();
    expect(screen.getByText('Avery')).toBeInTheDocument();
    expect(screen.getByText('Devon')).toBeInTheDocument();
    expect(screen.queryByText(/organization root/i)).not.toBeInTheDocument();
  });

  it('uses a focused native button to collapse and expand while retaining focus', async () => {
    const user = userEvent.setup();
    render(<OrgChart nodes={people} label="Organization" getCountLabel={(count) => `${count} reports`}
      getToggleLabel={(node, expanded) => `${expanded ? 'Collapse' : 'Expand'} ${node.name}`} />);
    const toggle = await screen.findByRole('button', { name: 'Collapse Avery' });
    expect(toggle).toHaveTextContent('1 reports');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    toggle.focus();
    await user.keyboard('{Enter}');
    await waitFor(() => expect(toggle).toHaveAttribute('aria-expanded', 'false'));
    expect(screen.queryByText('Blair')).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
    await user.keyboard(' ');
    await waitFor(() => expect(toggle).toHaveAttribute('aria-expanded', 'true'));
    expect(screen.getByText('Casey')).toBeInTheDocument();
    expect(toggle).toHaveFocus();
  });

  it('does not render a disclosure button for leaves', async () => {
    render(<OrgChart nodes={people} label="Organization" />);
    await screen.findByText('Casey', {}, { timeout: 5000 });
    expect(screen.queryByRole('button', { name: /Casey/ })).not.toBeInTheDocument();
  });

  it('retains a nested collapsed branch after its ancestor is closed and reopened', async () => {
    const user = userEvent.setup();
    render(<OrgChart nodes={people} label="Organization" />);
    const childToggle = await screen.findByRole('button', { name: 'Collapse Blair' });
    await user.click(childToggle);
    await user.click(screen.getByRole('button', { name: 'Collapse Avery' }));
    await user.click(screen.getByRole('button', { name: 'Expand Avery' }));
    expect(screen.getByRole('button', { name: 'Expand Blair' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Casey')).not.toBeInTheDocument();
  });

  it('keeps collapse state by node id when updated data adds a sibling', async () => {
    const { rerender } = render(<OrgChart nodes={people} label="Organization" />);
    const toggle = await screen.findByRole('button', { name: /Avery/ });
    fireEvent.click(toggle);
    await waitFor(() => expect(toggle).toHaveAttribute('aria-expanded', 'false'));
    fireEvent.click(toggle);
    const nestedToggle = await screen.findByRole('button', { name: /Blair/ });
    fireEvent.click(nestedToggle);
    await waitFor(() => expect(nestedToggle).toHaveAttribute('aria-expanded', 'false'));
    fireEvent.click(toggle);
    await waitFor(() => expect(toggle).toHaveAttribute('aria-expanded', 'false'));
    rerender(<OrgChart nodes={[{ ...root, children: [...(root.children ?? []), { id: 'new', name: 'New person' }] }, otherRoot]} label="Organization" />);
    const updatedRootToggle = screen.getByRole('button', { name: /Avery/ });
    expect(updatedRootToggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Blair')).not.toBeInTheDocument();
    expect(screen.queryByText('New person')).not.toBeInTheDocument();
    fireEvent.click(updatedRootToggle);
    expect(await screen.findByRole('button', { name: /Blair/ })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('New person')).toBeInTheDocument();
  });
});
