import type { ReactNode } from 'react';
import { cn, type DecorHue } from '../lib/cn.js';
import { Surface } from '../foundation/surface.js';
import { Text } from '../foundation/text.js';
import { Skeleton } from '../feedback/skeleton.js';

export interface StatCardProps {
  label: string;
  value: ReactNode;
  /** Signed change, e.g. `+12.4%`. Direction decides the colour, not the caller. */
  delta?: { value: string; direction: 'up' | 'down' | 'flat' };
  caption?: string;
  hue?: DecorHue;
  icon?: ReactNode;
  /** A Widget (ProgressRing, Sparkline) shown to the side. */
  visual?: ReactNode;
  className?: string;
}

/** The tinted metric tile the reference board repeats on every dashboard. */
export function StatCard({ label, value, delta, caption, hue, icon, visual, className }: StatCardProps) {
  return (
    <Surface variant="tinted" hue={hue} radius="lg" padding="md" className={cn('cb-stat', className)}>
      <div className="cb-stat__head">
        <Text size="sm" tone="muted" weight="medium">
          {label}
        </Text>
        {icon ? <span className="cb-stat__icon">{icon}</span> : null}
      </div>
      <div className="cb-stat__body">
        <div>
          <p className="cb-stat__value cb-numeric">{value}</p>
          {delta ? (
            <span className="cb-stat__delta" data-direction={delta.direction}>
              {delta.value}
            </span>
          ) : null}
          {caption ? (
            <Text size="xs" tone="subtle" className="cb-stat__caption">
              {caption}
            </Text>
          ) : null}
        </div>
        {visual ? <div className="cb-stat__visual">{visual}</div> : null}
      </div>
    </Surface>
  );
}

export interface StatCardSkeletonProps {
  withVisual?: boolean;
  className?: string;
}

/** Built from StatCard's own spacing, so the tile does not resize when data arrives (ADR 0009). */
function StatCardSkeleton({ withVisual = false, className }: StatCardSkeletonProps) {
  return (
    <Surface variant="tinted" radius="lg" padding="md" className={cn('cb-stat', className)}>
      <div className="cb-stat__head">
        <Skeleton width="7rem" height="0.875rem" />
      </div>
      <div className="cb-stat__body">
        <div className="cb-stat__skeleton-col">
          <Skeleton width="5.5rem" height="2rem" />
          <Skeleton width="3.5rem" height="0.75rem" />
        </div>
        {withVisual ? <Skeleton.Circle size="4rem" /> : null}
      </div>
    </Surface>
  );
}

StatCard.Skeleton = StatCardSkeleton;
