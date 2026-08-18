/** Tour sequencing, kept pure so every edge is assertable (ADR 0012). */

export type TourStatus = 'idle' | 'running' | 'finished' | 'skipped';

export interface TourState {
  index: number;
  status: TourStatus;
}

export type TourAction =
  | { type: 'start' }
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'goto'; index: number }
  | { type: 'skip' }
  | { type: 'finish' };

export const initialTourState: TourState = { index: 0, status: 'idle' };

/**
 * `stepCount` is passed in rather than held in state because steps are props: a tour whose
 * steps change while it runs must not point past the end of the new list.
 */
export function tourReducer(state: TourState, action: TourAction, stepCount: number): TourState {
  const lastIndex = Math.max(stepCount - 1, 0);

  switch (action.type) {
    case 'start':
      return stepCount === 0 ? { index: 0, status: 'finished' } : { index: 0, status: 'running' };
    case 'next':
      if (state.status !== 'running') return state;
      return state.index >= lastIndex
        ? { index: state.index, status: 'finished' }
        : { index: state.index + 1, status: 'running' };
    case 'prev':
      if (state.status !== 'running') return state;
      return { index: Math.max(state.index - 1, 0), status: 'running' };
    case 'goto':
      if (state.status !== 'running') return state;
      return { index: Math.min(Math.max(action.index, 0), lastIndex), status: 'running' };
    case 'skip':
      return { index: state.index, status: 'skipped' };
    case 'finish':
      return { index: state.index, status: 'finished' };
    default:
      return state;
  }
}

/** A tour that ended, either way. Both outcomes mark the Seen Store. */
export function hasEnded(status: TourStatus): boolean {
  return status === 'finished' || status === 'skipped';
}

export type StepTarget =
  | string
  | Element
  | { current: Element | null }
  | (() => Element | null)
  | null;

/**
 * Resolves a step's target. Returns null rather than throwing when the element is not mounted
 * yet — the Tour retries, because a target that appears one frame late is normal, not an error.
 */
export function resolveTarget(target: StepTarget, root: ParentNode): Element | null {
  if (!target) return null;
  if (typeof target === 'string') return root.querySelector(target);
  if (typeof target === 'function') return target();
  if (target instanceof Element) return target;
  if ('current' in target) return target.current;
  return null;
}
