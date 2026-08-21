'use client';

import { Popover as BasePopover } from '@base-ui/react/popover';
import { X } from 'lucide-react';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { useLabels } from '../lib/labels.js';
import { cn } from '../lib/cn.js';
import { ArrowShape, type Align, type Side } from '../overlay/popover.js';

export interface CoachmarkProps {
  open: boolean;
  /** The element being pointed at. Already resolved — a Tour does the resolving. */
  anchor: Element | null;
  title: ReactNode;
  children?: ReactNode;
  side?: Side;
  align?: Align;
  /** Dims the page and cuts a hole around the anchor. A number sets the hole's padding in px. */
  spotlight?: boolean | number;
  /** e.g. `{ current: 2, total: 5 }` — rendered as "2 of 5" and announced. */
  progress?: { current: number; total: number };
  actions?: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

/**
 * One anchored bubble pointing at one element. It knows nothing about sequence and nothing
 * about who has seen it — those are Tour and the Seen Store (ADR 0006).
 */
export function Coachmark({
  open,
  anchor,
  title,
  children,
  side = 'bottom',
  align = 'center',
  spotlight = true,
  progress,
  actions,
  onDismiss,
  className,
}: CoachmarkProps) {
  const labels = useLabels();
  const rect = useAnchorRect(anchor, open && spotlight !== false);
  const padding = typeof spotlight === 'number' ? spotlight : 8;

  return (
    <>
      {rect ? (
        <div
          className="cb-spotlight"
          aria-hidden="true"
          onClick={onDismiss}
          style={
            {
              '--cb-spotlight-x': `${rect.left - padding}px`,
              '--cb-spotlight-y': `${rect.top - padding}px`,
              '--cb-spotlight-w': `${rect.width + padding * 2}px`,
              '--cb-spotlight-h': `${rect.height + padding * 2}px`,
            } as CSSProperties
          }
        />
      ) : null}

      <BasePopover.Root open={open && Boolean(anchor)} onOpenChange={(next) => !next && onDismiss?.()}>
        <BasePopover.Portal>
          <BasePopover.Positioner
            className="cb-coachmark__positioner"
            anchor={anchor}
            side={side}
            align={align}
            sideOffset={12}
          >
            <BasePopover.Popup className={cn('cb-coachmark', className)}>
              <BasePopover.Arrow className="cb-popover__arrow">
                <ArrowShape />
              </BasePopover.Arrow>

              <div className="cb-coachmark__head">
                <p className="cb-coachmark__title">{title}</p>
                {onDismiss ? (
                  <button
                    type="button"
                    className="cb-coachmark__close"
                    aria-label={labels.dismiss}
                    onClick={onDismiss}
                  >
                    <X size={16} />
                  </button>
                ) : null}
              </div>

              {children ? <div className="cb-coachmark__body">{children}</div> : null}

              {progress || actions ? (
                <div className="cb-coachmark__foot">
                  {progress ? (
                    <span className="cb-coachmark__progress">
                      {labels.progress(progress.current, progress.total)}
                    </span>
                  ) : (
                    <span />
                  )}
                  {actions ? <div className="cb-coachmark__actions">{actions}</div> : null}
                </div>
              ) : null}
            </BasePopover.Popup>
          </BasePopover.Positioner>
        </BasePopover.Portal>
      </BasePopover.Root>
    </>
  );
}

/**
 * Tracks the anchor's position. Scroll and resize both move it, and a coachmark whose hole
 * has drifted off its target is worse than no coachmark at all.
 */
function useAnchorRect(anchor: Element | null, active: boolean): DOMRect | null {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!anchor || !active) {
      setRect(null);
      return;
    }
    const measure = () => setRect(anchor.getBoundingClientRect());
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(anchor);
    window.addEventListener('scroll', measure, true);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('resize', measure);
    };
  }, [anchor, active]);

  return rect;
}
