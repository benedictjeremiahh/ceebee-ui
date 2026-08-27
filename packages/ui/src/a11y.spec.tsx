import { render } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import { Donut } from './data/donut.js';
import { Leaderboard } from './data/leaderboard.js';
import { Sparkline } from './data/sparkline.js';
import { Checklist } from './onboarding/checklist.js';

/**
 * A real audit runs against a browser; this catches the rules that hold in jsdom — names,
 * roles, labels, list and table structure — so a regression in wiring fails the build rather
 * than waiting to be noticed on screen.
 *
 * Ant's components carry their own accessibility and Ant tests it; what is asserted here is what
 * this library still draws itself.
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
  it('the widgets this library still draws carry names and structure', async () => {
    expect(
      await violationsIn(
        <div>
          <Leaderboard
            label="Weekly leaders"
            entries={[{ id: '1', name: 'Ada Putri', score: '10' }]}
          />
          <Donut label="Spend by category" slices={[{ label: 'Rent', value: 4 }, { label: 'Food', value: 6 }]} />
          <Sparkline label="Sessions this week" values={[3, 5, 4, 8, 6, 9, 7]} />
          <Checklist
            title="Getting started"
            tasks={[
              { id: 'a', label: 'Create a workspace', done: true },
              { id: 'b', label: 'Invite your team' },
            ]}
          />
        </div>,
      ),
    ).toEqual([]);
  });
});
