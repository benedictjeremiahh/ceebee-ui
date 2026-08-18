'use client';

import { useCallback, useEffect, useReducer, useRef, useState, type ReactNode } from 'react';
import { Button } from '../form/button.js';
import { useMotionSettings } from '../motion/motion-provider.js';
import { Coachmark } from './coachmark.js';
import type { Align, Side } from '../overlay/popover.js';
import type { SeenStore } from './seen-store.js';
import {
  hasEnded,
  initialTourState,
  resolveTarget,
  tourReducer,
  type StepTarget,
  type TourAction,
  type TourState,
} from './tour-machine.js';

export interface TourStep {
  target: StepTarget;
  title: ReactNode;
  content?: ReactNode;
  side?: Side;
  align?: Align;
  spotlight?: boolean | number;
}

export interface TourProps {
  /** Stable id — this is what the Seen Store remembers. */
  id: string;
  steps: TourStep[];
  /** Starts the tour when it turns true. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Injected by the app; without one the tour runs every time it is opened (ADR 0006). */
  seenStore?: SeenStore;
  onFinish?: () => void;
  onSkip?: () => void;
  labels?: Partial<Record<'back' | 'next' | 'done' | 'skip', string>>;
}

const DEFAULT_LABELS = { back: 'Back', next: 'Next', done: 'Done', skip: 'Skip' };

/**
 * Sequences Coachmarks. It owns order and nothing else: memory is the Seen Store's, the bubble
 * is the Coachmark's, and the steps belong to the caller.
 */
export function Tour({ id, steps, open = false, onOpenChange, seenStore, onFinish, onSkip, labels }: TourProps) {
  const [state, rawDispatch] = useReducer(
    (current: TourState, action: TourAction) => tourReducer(current, action, steps.length),
    initialTourState,
  );
  const [anchor, setAnchor] = useState<Element | null>(null);
  const { enabled: motionEnabled } = useMotionSettings();
  const [allowed, setAllowed] = useState<boolean | null>(seenStore ? null : true);
  const marked = useRef(false);
  const text = { ...DEFAULT_LABELS, ...labels };

  // Ask the injected store once, before anything is shown.
  useEffect(() => {
    if (!seenStore) return;
    let cancelled = false;
    void Promise.resolve(seenStore.has(id)).then((seen) => {
      if (!cancelled) setAllowed(!seen);
    });
    return () => {
      cancelled = true;
    };
  }, [seenStore, id]);

  useEffect(() => {
    if (open && allowed && state.status === 'idle') rawDispatch({ type: 'start' });
  }, [open, allowed, state.status]);

  // A target can mount a frame late — that is normal, so retry for a few frames before giving up.
  useEffect(() => {
    if (state.status !== 'running') {
      setAnchor(null);
      return;
    }
    const step = steps[state.index];
    if (!step) return;

    let frame = 0;
    let raf = 0;
    const look = () => {
      const found = resolveTarget(step.target, document);
      if (found) {
        setAnchor(found);
        // Feature-detected: not every environment implements it, and a tour must not
        // die because it could not scroll. Reduced motion jumps rather than glides.
        found.scrollIntoView?.({ block: 'center', behavior: motionEnabled ? 'smooth' : 'auto' });
        return;
      }
      if (frame++ < 30) raf = requestAnimationFrame(look);
      else setAnchor(null);
    };
    look();
    return () => cancelAnimationFrame(raf);
  }, [state.status, state.index, steps, motionEnabled]);

  // Finishing and skipping both count as seen; marking runs once.
  useEffect(() => {
    if (!hasEnded(state.status) || marked.current) return;
    marked.current = true;
    void Promise.resolve(seenStore?.mark(id));
    onOpenChange?.(false);
    if (state.status === 'finished') onFinish?.();
    else onSkip?.();
  }, [state.status, seenStore, id, onOpenChange, onFinish, onSkip]);

  const skip = useCallback(() => rawDispatch({ type: 'skip' }), []);

  if (state.status !== 'running' || !allowed) return null;
  const step = steps[state.index];
  if (!step) return null;

  const isLast = state.index === steps.length - 1;

  return (
    <Coachmark
      open
      anchor={anchor}
      title={step.title}
      side={step.side}
      align={step.align}
      spotlight={step.spotlight}
      progress={{ current: state.index + 1, total: steps.length }}
      onDismiss={skip}
      actions={
        <>
          {state.index > 0 ? (
            <Button size="sm" variant="ghost" tone="neutral" onClick={() => rawDispatch({ type: 'prev' })}>
              {text.back}
            </Button>
          ) : (
            <Button size="sm" variant="ghost" tone="neutral" onClick={skip}>
              {text.skip}
            </Button>
          )}
          <Button size="sm" onClick={() => rawDispatch({ type: 'next' })}>
            {isLast ? text.done : text.next}
          </Button>
        </>
      }
    >
      {step.content}
    </Coachmark>
  );
}
