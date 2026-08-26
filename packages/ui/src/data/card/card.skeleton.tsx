import { Surface, type GlassStyle, type SurfaceVariant } from '../../foundation/surface.js';
import { Skeleton } from '../../feedback/skeleton.js';
import { cn, type DecorHue, type Tone } from '../../lib/cn.js';

export interface CardSkeletonContentProps {
  lines?: number;
  meta?: boolean;
}

export function CardSkeletonContent({ lines = 3, meta = false }: CardSkeletonContentProps) {
  if (meta) {
    return (
      <div className="cb-card-meta">
        <Skeleton.Circle size="2.5rem" className="cb-card-meta__avatar" />
        <div className="cb-card-meta__content">
          <Skeleton width="45%" height="0.875rem" />
          <Skeleton.Text lines={lines} />
        </div>
      </div>
    );
  }

  return <Skeleton.Text lines={lines} />;
}

export interface CardSkeletonProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: SurfaceVariant;
  glassStyle?: GlassStyle;
  tone?: Tone;
  hue?: DecorHue;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg' | 'xl';
  bordered?: boolean;
  withCover?: boolean;
  withActions?: boolean;
  meta?: boolean;
  lines?: number;
  className?: string;
}

/** Matching Card geometry for a whole Card that has not loaded yet (ADR 0009). */
export function CardSkeleton({
  size = 'md',
  variant = 'plain',
  glassStyle = 'regular',
  tone = 'neutral',
  hue,
  elevation = 'sm',
  radius = 'lg',
  bordered = true,
  withCover = false,
  withActions = false,
  meta = false,
  lines = 3,
  className,
}: CardSkeletonProps) {
  return (
    <Surface
      variant={variant}
      glassStyle={glassStyle}
      tone={tone}
      hue={hue}
      elevation={elevation}
      radius={radius}
      padding="none"
      bordered={bordered}
      className={cn('cb-card', `cb-card--${size}`, 'cb-card--skeleton', className)}
    >
      {withCover ? (
        <div className="cb-card__cover cb-card__skeleton-cover">
          <Skeleton.Rect width="100%" height="100%" radius="sm" />
        </div>
      ) : null}
      <div className="cb-card__body">
        <CardSkeletonContent lines={lines} meta={meta} />
      </div>
      {withActions ? (
        <div className="cb-card__actions cb-card__skeleton-actions">
          <Skeleton width="5rem" height="2rem" />
          <Skeleton width="5rem" height="2rem" />
        </div>
      ) : null}
    </Surface>
  );
}
