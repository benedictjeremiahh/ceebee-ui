import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Field } from '../field.js';
import { Cascader } from './cascader.js';

const stylesheet = readFileSync(join(process.cwd(), 'packages/ui/src/form/cascader/cascader.css'), 'utf8');
const options = [
  {
    key: 'asia', label: 'Asia', children: [
      { key: 'id', label: 'Indonesia', children: [{ key: 'jkt', label: 'Jakarta' }, { key: 'dps', label: 'Bali', disabled: true }] },
      { key: 'jp', label: 'Japan', children: [{ key: 'tyo', label: 'Tokyo' }] },
    ],
  },
  { key: 'europe', label: 'Europe', children: [{ key: 'fr', label: 'France', children: [{ key: 'paris', label: 'Paris' }] }] },
];

describe('Cascader', () => {
  it('opens a labelled first column and retains trigger focus', async () => {
    const user = userEvent.setup();
    render(<Cascader options={options} label="Location" />);
    const trigger = screen.getByRole('combobox', { name: 'Location' });
    await user.click(trigger);
    expect(screen.getByRole('listbox', { name: 'Level 1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Asia' })).toHaveAttribute('tabindex', '-1');
    expect(document.activeElement).toBe(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(screen.getByRole('dialog', { name: 'Cascader options' })).toBeInTheDocument();
  });

  it('navigates columns with keys, skips disabled leaves, and selects only a leaf', () => {
    const onValueChange = vi.fn();
    render(<Cascader options={options} label="Location" onValueChange={onValueChange} />);
    const trigger = screen.getByRole('combobox', { name: 'Location' });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'ArrowRight' });
    expect(screen.getByRole('listbox', { name: 'Level 2' })).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Indonesia' }).id);
    fireEvent.keyDown(trigger, { key: 'ArrowRight' });
    expect(screen.getByRole('listbox', { name: 'Level 3' })).toBeInTheDocument();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(screen.getByRole('option', { name: 'Jakarta' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(onValueChange).toHaveBeenLastCalledWith(['asia', 'id', 'jkt']);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('returns through columns with Left and closes with Escape', () => {
    render(<Cascader options={options} label="Location" defaultValue={['asia', 'id', 'jkt']} />);
    const trigger = screen.getByRole('combobox', { name: 'Location' });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(screen.getByRole('listbox', { name: 'Level 3' })).toBeInTheDocument();
    fireEvent.keyDown(trigger, { key: 'ArrowLeft' });
    expect(screen.queryByRole('listbox', { name: 'Level 3' })).toBeNull();
    expect(screen.getByRole('listbox', { name: 'Level 2' })).toBeInTheDocument();
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('keeps a controlled selection with its caller and wires Field semantics', () => {
    const onValueChange = vi.fn();
    render(<Field label="Location" hint="Choose a leaf" error="Required" required><Cascader options={options} label="Location" value={['asia', 'id', 'jkt']} onValueChange={onValueChange} /></Field>);
    const trigger = screen.getByRole('combobox', { name: 'Location' });
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger).toHaveAttribute('aria-required', 'true');
    expect(trigger.getAttribute('aria-describedby')).toContain('hint');
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('option', { name: 'Europe' }));
    fireEvent.click(screen.getByRole('option', { name: 'France' }));
    fireEvent.click(screen.getByRole('option', { name: 'Paris' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['europe', 'fr', 'paris']);
    expect(trigger).toHaveTextContent('Asia / Indonesia / Jakarta');
  });

  it('rejects duplicate sibling keys, supports repeated branch-local keys, and renders a skeleton', () => {
    expect(() => render(<Cascader label="Location" options={[{ key: 'same', label: 'One' }, { key: 'same', label: 'Two' }]} />)).toThrow('unique sibling keys');
    expect(() => render(<Cascader label="Location" options={[{ key: 'a', label: 'A', children: [{ key: 'same', label: 'A same' }] }, { key: 'b', label: 'B', children: [{ key: 'same', label: 'B same' }] }]} />)).not.toThrow();
    const specialKeys = render(<Cascader label="Special location" options={[{ key: '/', label: 'Slash' }, { key: '_2F', label: 'Encoded-looking' }]} />);
    fireEvent.click(screen.getByRole('combobox', { name: 'Special location' }));
    const specialIds = screen.getAllByRole('option').map((option) => option.id);
    expect(new Set(specialIds).size).toBe(specialIds.length);
    specialKeys.unmount();
    const skeleton = render(<Cascader.Skeleton rows={4} />).container.firstElementChild!;
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    expect(skeleton.querySelector('button')).toBeNull();
  });

  it('keeps state visible when motion is disabled or reduced', () => {
    render(<Cascader options={options} label="Location" motion={false} />);
    expect(screen.getByRole('combobox', { name: 'Location' })).toHaveClass('cb-cascader--motionless');
    expect(stylesheet).toContain('cb-cascader__popup--motionless');
    expect(stylesheet).toContain('@media (prefers-reduced-motion: reduce)');
    expect(stylesheet).not.toMatch(/#[0-9a-f]/i);
  });
});
