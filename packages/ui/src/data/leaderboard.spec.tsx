import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Leaderboard } from './leaderboard.js';

const ENTRIES = [
  { id: '1', name: 'Ada Putri', score: '2,480' },
  { id: '2', name: 'Rio Hakim', score: '2,150', you: true },
  { id: '3', name: 'Sarah Chen', score: '1,990' },
];

describe('Leaderboard', () => {
  it('is a named ordered list, so the ranking is read out rather than inferred', () => {
    render(<Leaderboard label="Weekly leaders" entries={ENTRIES} />);
    const list = screen.getByRole('list', { name: 'Weekly leaders' });
    expect(list.tagName).toBe('OL');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('marks the viewer wherever they sit', () => {
    render(<Leaderboard label="Weekly leaders" entries={ENTRIES} />);
    expect(screen.getByText('You')).toBeInTheDocument();
  });

  it('medals only the top three, and only when asked', () => {
    const { container, rerender } = render(<Leaderboard label="Weekly leaders" entries={ENTRIES} />);
    expect(container.querySelectorAll('[data-rank]')).toHaveLength(3);

    rerender(<Leaderboard label="Weekly leaders" entries={ENTRIES} medals={false} />);
    expect(container.querySelectorAll('[data-rank]')).toHaveLength(0);
  });
});
