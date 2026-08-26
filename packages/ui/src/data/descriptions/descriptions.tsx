import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/cn.js';
import { DescriptionsSkeleton } from './descriptions.skeleton.js';

export type DescriptionsSize = 'sm' | 'md' | 'lg';

export interface DescriptionsProps {
  title?: ReactNode;
  extra?: ReactNode;
  children?: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  layout?: 'horizontal' | 'vertical';
  size?: DescriptionsSize;
  bordered?: boolean;
  colon?: boolean;
  className?: string;
}

export interface DescriptionsItemProps {
  label: ReactNode;
  children?: ReactNode;
  span?: 1 | 2 | 3 | 4;
  className?: string;
}

function DescriptionsItem({ label, children, span = 1, className }: DescriptionsItemProps) {
  return (
    <div className={cn('cb-descriptions__item', `cb-descriptions__item--span-${span}`, className)}>
      <dt className="cb-descriptions__label">{label}</dt>
      <dd className="cb-descriptions__value">{children}</dd>
    </div>
  );
}

function DescriptionsRoot({
  title,
  extra,
  children,
  columns = 3,
  layout = 'horizontal',
  size = 'md',
  bordered = false,
  colon = true,
  className,
}: DescriptionsProps) {
  const hasHeader = title != null || extra != null;

  return (
    <section
      className={cn(
        'cb-descriptions',
        `cb-descriptions--${size}`,
        `cb-descriptions--${layout}`,
        bordered && 'cb-descriptions--bordered',
        !colon && 'cb-descriptions--without-colon',
        className,
      )}
      data-columns={columns}
      style={{ '--cb-descriptions-columns': columns } as CSSProperties}
    >
      {hasHeader ? (
        <header className="cb-descriptions__header">
          {title != null ? <div className="cb-descriptions__title">{title}</div> : null}
          {extra != null ? <div className="cb-descriptions__extra">{extra}</div> : null}
        </header>
      ) : null}
      <dl className="cb-descriptions__list">{children}</dl>
    </section>
  );
}

export const Descriptions = Object.assign(DescriptionsRoot, {
  Item: DescriptionsItem,
  Skeleton: DescriptionsSkeleton,
});
