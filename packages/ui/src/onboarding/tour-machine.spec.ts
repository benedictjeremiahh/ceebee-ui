import { describe, expect, it } from 'vitest';
import {
  hasEnded,
  initialTourState,
  resolveTarget,
  tourReducer,
  type TourState,
} from './tour-machine.js';

const running = (index: number): TourState => ({ index, status: 'running' });

describe('tourReducer', () => {
  it('starts at the first step', () => {
    expect(tourReducer(initialTourState, { type: 'start' }, 3)).toEqual({ index: 0, status: 'running' });
  });

  it('finishes immediately when there are no steps rather than pointing at nothing', () => {
    expect(tourReducer(initialTourState, { type: 'start' }, 0)).toEqual({ index: 0, status: 'finished' });
  });

  it('advances, and finishing is what next does on the last step', () => {
    expect(tourReducer(running(0), { type: 'next' }, 3)).toEqual({ index: 1, status: 'running' });
    expect(tourReducer(running(2), { type: 'next' }, 3)).toEqual({ index: 2, status: 'finished' });
  });

  it('will not step back off the front', () => {
    expect(tourReducer(running(0), { type: 'prev' }, 3)).toEqual({ index: 0, status: 'running' });
  });

  it('clamps goto into the step list', () => {
    expect(tourReducer(running(0), { type: 'goto', index: 9 }, 3).index).toBe(2);
    expect(tourReducer(running(2), { type: 'goto', index: -4 }, 3).index).toBe(0);
  });

  it('ignores movement once the tour has ended', () => {
    const ended = tourReducer(running(1), { type: 'skip' }, 3);
    expect(tourReducer(ended, { type: 'next' }, 3)).toEqual(ended);
    expect(tourReducer(ended, { type: 'prev' }, 3)).toEqual(ended);
  });

  it('does not point past the end when the step list shrinks mid-tour', () => {
    expect(tourReducer(running(4), { type: 'next' }, 2)).toEqual({ index: 4, status: 'finished' });
    expect(tourReducer(running(4), { type: 'goto', index: 4 }, 2).index).toBe(1);
  });

  it('treats both endings as ended, because both mark the Seen Store', () => {
    expect(hasEnded('finished')).toBe(true);
    expect(hasEnded('skipped')).toBe(true);
    expect(hasEnded('running')).toBe(false);
  });
});

describe('resolveTarget', () => {
  it('resolves selectors, elements, refs and callbacks', () => {
    const root = document.createElement('div');
    const target = document.createElement('button');
    target.id = 'save';
    root.append(target);

    expect(resolveTarget('#save', root)).toBe(target);
    expect(resolveTarget(target, root)).toBe(target);
    expect(resolveTarget({ current: target }, root)).toBe(target);
    expect(resolveTarget(() => target, root)).toBe(target);
  });

  it('returns null for a target that is not mounted yet instead of throwing', () => {
    const root = document.createElement('div');
    expect(resolveTarget('#not-here', root)).toBeNull();
    expect(resolveTarget({ current: null }, root)).toBeNull();
    expect(resolveTarget(null, root)).toBeNull();
  });
});
