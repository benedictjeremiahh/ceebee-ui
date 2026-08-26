import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Listy } from './listy.js';

const items = [
  { id: 'a', group: 'today', label: 'First' },
  { id: 'b', group: 'today', label: 'Second' },
  { id: 'c', group: 'later', label: 'Third' },
];
const stylesheet = readFileSync(join(process.cwd(), 'packages/ui/src/data/listy/listy.css'), 'utf8');

describe('Listy', () => {
  it('preserves native list order and supplied item identity', () => {
    render(<Listy items={items} getKey={(item) => item.id} renderItem={(item) => item.label} aria-label="Activity" />);
    const list = screen.getByRole('list', { name: 'Activity' });
    expect(list).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['First', 'Second', 'Third']);
  });

  it('groups contiguous items with an optional sticky heading without taking focus ownership', () => {
    render(<Listy items={items} getKey={(item) => item.id} getGroup={(item) => ({ key: item.group, label: item.group })} stickyGroupHeadings renderItem={(item) => item.label} />);
    expect(screen.getByText('today')).toHaveAttribute('data-sticky');
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('uses browser-native rendering optimization only when requested', () => {
    const { container } = render(<Listy items={items} getKey={(item) => item.id} optimizeRendering renderItem={(item) => item.label} />);
    expect(container.querySelector('.cb-listy')).toHaveAttribute('data-optimized');
    expect(stylesheet).toContain('contain-intrinsic-block-size: var(--cb-control-height-md)');
  });

  it('rejects duplicate item keys and noncontiguous group identities', () => {
    expect(() => render(<Listy items={[{ id: 'same' }, { id: 'same' }]} getKey={(item) => item.id} renderItem={() => 'item'} />)).toThrow('item keys must be unique');
    expect(() => render(<Listy items={[{ id: 'a', group: 'one' }, { id: 'b', group: 'two' }, { id: 'c', group: 'one' }]} getKey={(item) => item.id} getGroup={(item) => ({ key: item.group, label: item.group })} renderItem={() => 'item'} />)).toThrow('group keys must be contiguous');
  });
});

describe('Listy.Skeleton', () => {
  it('keeps list geometry without interactive rows', () => {
    const { container } = render(<Listy.Skeleton items={3} grouped />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('button')).toBeNull();
  });
});
