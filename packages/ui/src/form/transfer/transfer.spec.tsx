import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Transfer } from './transfer.js';

const items = [
  { key: 'alpha', label: 'Alpha' },
  { key: 'bravo', label: 'Bravo', disabled: true },
  { key: 'charlie', label: 'Charlie', description: 'Available record' },
];

describe('Transfer', () => {
  it('uses two persistent labelled checkbox lists rather than a menu, dialog, or drag surface', () => {
    render(<Transfer items={items} sourceTitle="Available records" targetTitle="Assigned records" />);
    expect(screen.getByRole('group', { name: 'Available records' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Assigned records' })).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(3);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('owns transient checkbox selection and moves only enabled selected records in uncontrolled assignment mode', () => {
    render(<Transfer items={items} defaultTargetKeys={['charlie']} />);
    const alpha = screen.getByRole('checkbox', { name: 'Alpha' });
    const bravo = screen.getByRole('checkbox', { name: 'Bravo' });
    expect(bravo).toBeDisabled();
    fireEvent.click(alpha);
    expect(alpha).toBeChecked();
    fireEvent.click(screen.getByRole('button', { name: 'Move selected to target' }));
    expect(screen.getByRole('group', { name: 'Available' })).not.toHaveTextContent('Alpha');
    expect(screen.getByRole('group', { name: 'Selected' })).toHaveTextContent('Alpha');
    expect(screen.getByRole('button', { name: 'Move selected to target' })).toBeDisabled();
  });

  it('reports controlled assignment requests without changing the caller-owned target list', () => {
    const onTargetKeysChange = vi.fn();
    render(<Transfer items={items} targetKeys={['charlie']} onTargetKeysChange={onTargetKeysChange} />);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Alpha' }));
    fireEvent.click(screen.getByRole('button', { name: 'Move selected to target' }));
    expect(onTargetKeysChange).toHaveBeenLastCalledWith(['charlie', 'alpha']);
    expect(screen.getByRole('group', { name: 'Available' })).toHaveTextContent('Alpha');
    expect(screen.getByRole('group', { name: 'Selected' })).not.toHaveTextContent('Alpha');
    expect(screen.getByRole('checkbox', { name: 'Alpha' })).toBeChecked();
  });

  it('clears controlled transient selection only after the caller confirms an item moved sides', () => {
    const onTargetKeysChange = vi.fn();
    const { rerender } = render(<Transfer items={items} targetKeys={[]} onTargetKeysChange={onTargetKeysChange} />);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Alpha' }));
    fireEvent.click(screen.getByRole('button', { name: 'Move selected to target' }));
    expect(screen.getByRole('checkbox', { name: 'Alpha' })).toBeChecked();
    rerender(<Transfer items={items} targetKeys={['alpha']} onTargetKeysChange={onTargetKeysChange} />);
    expect(screen.getByRole('group', { name: 'Selected' })).toHaveTextContent('Alpha');
    expect(screen.getByRole('checkbox', { name: 'Alpha' })).not.toBeChecked();
  });

  it('keeps all selection and movement inert when disabled', () => {
    const onTargetKeysChange = vi.fn();
    render(<Transfer items={items} disabled onTargetKeysChange={onTargetKeysChange} />);
    expect(screen.getByRole('checkbox', { name: 'Alpha' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Move selected to target' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Move selected to target' }));
    expect(onTargetKeysChange).not.toHaveBeenCalled();
  });

  it('keeps a checkbox name to its label and announces its description once', () => {
    render(<Transfer items={items} />);
    const charlie = screen.getByRole('checkbox', { name: 'Charlie' });
    expect(charlie).toHaveAccessibleName('Charlie');
    expect(charlie).toHaveAccessibleDescription('Available record');
  });

  it('rejects duplicate item keys before rendering ambiguous list identity', () => {
    expect(() => render(<Transfer items={[{ key: 'same', label: 'One' }, { key: 'same', label: 'Two' }]} />)).toThrow('keys must be unique');
  });
});

describe('Transfer.Skeleton', () => {
  it('keeps two-list geometry without interactive controls', () => {
    render(<Transfer.Skeleton items={2} />);
    expect(document.querySelector('.cb-transfer--skeleton')).toHaveAttribute('aria-hidden', 'true');
    expect(document.querySelectorAll('.cb-transfer__list')).toHaveLength(2);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
