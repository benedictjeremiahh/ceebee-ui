import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Schedule } from './schedule.js';

/* The substrate measures the DOM to lay its grid out, and jsdom has no layout — rendering the bars here
   throws inside SVAR's grid. The drawn rows are covered by `tests/browser/schedule.spec.ts`, which runs
   in a real browser; what is here is what the component decides before the substrate is involved. */

describe('Schedule', () => {
  it('says so when there is nothing planned, rather than drawing an empty axis', () => {
    render(<Schedule items={[]} />);
    expect(screen.getByText('Nothing is planned yet.')).toBeInTheDocument();
  });

  it('takes an empty message from the caller', () => {
    render(<Schedule items={[]} labels={{ empty: 'Belum ada rencana.' }} />);
    expect(screen.getByText('Belum ada rencana.')).toBeInTheDocument();
  });
});
