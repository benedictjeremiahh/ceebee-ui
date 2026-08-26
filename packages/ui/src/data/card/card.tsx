import type { ReactNode } from 'react';
import { Grid, type GridProps } from '../../foundation/layout.js';
import {
  Surface,
  type GlassStyle,
  type SurfaceVariant,
} from '../../foundation/surface.js';
import { cn, type DecorHue, type Tone } from '../../lib/cn.js';
import { CardSkeleton, CardSkeletonContent } from './card.skeleton.js';

export interface CardProps {
  title?: ReactNode;
  extra?: ReactNode;
  cover?: ReactNode;
  /** A composed Tabs instance. Tabs owns selection state and keyboard behaviour. */
  tabs?: ReactNode;
  /** Controls placed in the footer region. Card does not own their behaviour. */
  actions?: ReactNode;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: SurfaceVariant;
  glassStyle?: GlassStyle;
  tone?: Tone;
  hue?: DecorHue;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg' | 'xl';
  bordered?: boolean;
  hoverable?: boolean;
  /** Tighter geometry for a Card nested inside another Card. */
  nested?: boolean;
  loading?: boolean;
  asSection?: boolean;
  className?: string;
}

function CardRoot({
  title,
  extra,
  cover,
  tabs,
  actions,
  children,
  size = 'md',
  variant = 'plain',
  glassStyle = 'regular',
  tone = 'neutral',
  hue,
  elevation = 'sm',
  radius = 'lg',
  bordered = true,
  hoverable = false,
  nested = false,
  loading = false,
  asSection = false,
  className,
}: CardProps) {
  const hasHeader = title != null || extra != null;
  const hasBody = loading || children != null;

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
      asSection={asSection}
      className={cn(
        'cb-card',
        `cb-card--${size}`,
        hoverable && 'cb-card--hoverable',
        nested && 'cb-card--nested',
        className,
      )}
    >
      {cover ? <div className="cb-card__cover">{cover}</div> : null}

      {hasHeader ? (
        <header className="cb-card__header">
          {title != null ? <div className="cb-card__title">{title}</div> : null}
          {extra != null ? <div className="cb-card__extra">{extra}</div> : null}
        </header>
      ) : null}

      {tabs ? <div className="cb-card__tabs">{tabs}</div> : null}

      {hasBody ? (
        <div className="cb-card__body" aria-busy={loading || undefined}>
          {loading ? <CardSkeletonContent /> : children}
        </div>
      ) : null}

      {actions ? <footer className="cb-card__actions">{actions}</footer> : null}
    </Surface>
  );
}

export interface CardMetaProps {
  avatar?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
}

function CardMeta({ avatar, title, description, className }: CardMetaProps) {
  return (
    <div className={cn('cb-card-meta', className)}>
      {avatar ? <div className="cb-card-meta__avatar">{avatar}</div> : null}
      <div className="cb-card-meta__content">
        {title != null ? <div className="cb-card-meta__title">{title}</div> : null}
        {description != null ? <div className="cb-card-meta__description">{description}</div> : null}
      </div>
    </div>
  );
}

export interface CardGridProps extends Omit<GridProps, 'children'> {
  children?: ReactNode;
}

function CardGrid({ columns = 3, gap = 0, minItemWidth, className, children }: CardGridProps) {
  return (
    <Grid
      columns={columns}
      gap={gap}
      minItemWidth={minItemWidth}
      className={cn('cb-card-grid', className)}
    >
      {children}
    </Grid>
  );
}

/** A non-interactive Surface composition for content about one subject. */
export const Card = Object.assign(CardRoot, {
  Meta: CardMeta,
  Grid: CardGrid,
  Skeleton: CardSkeleton,
});
