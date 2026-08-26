import type { ReactNode } from 'react';
import { cn } from '../../lib/cn.js';
import { AnchorSkeleton, type AnchorSkeletonProps } from './anchor.skeleton.js';

export type AnchorTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
export type AnchorOrientation = 'vertical' | 'horizontal';
export type AnchorSize = 'sm' | 'md' | 'lg';

export interface AnchorItem {
  id: string;
  label: ReactNode;
  href: `#${string}`;
  children?: AnchorItem[];
}

export interface AnchorProps {
  items: AnchorItem[];
  activeId?: string;
  orientation?: AnchorOrientation;
  size?: AnchorSize;
  tone?: AnchorTone;
  motion?: boolean;
  'aria-label'?: string;
}

/**
 * Server-safe in-page navigation. The consuming app owns active-section observation and routing;
 * Anchor only renders native hash links and exposes the supplied active state.
 */
function AnchorRoot({
  items,
  activeId,
  orientation = 'vertical',
  size = 'md',
  tone = 'brand',
  motion = true,
  'aria-label': ariaLabel = 'On this page',
}: AnchorProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        'cb-anchor',
        `cb-anchor--${orientation}`,
        `cb-anchor--${size}`,
        `cb-anchor--${tone}`,
        !motion && 'cb-anchor--motion-off',
      )}
    >
      <AnchorList items={items} activeId={activeId} />
    </nav>
  );
}

function AnchorList({ items, activeId, nested = false }: { items: AnchorItem[]; activeId?: string; nested?: boolean }) {
  return (
    <ul className={cn('cb-anchor__list', nested && 'cb-anchor__list--nested')}>
      {items.map((item) => (
        <li className="cb-anchor__item" key={item.id}>
          <a className="cb-anchor__link" href={item.href} aria-current={activeId === item.id ? 'location' : undefined}>
            {item.label}
          </a>
          {item.children?.length ? <AnchorList items={item.children} activeId={activeId} nested /> : null}
        </li>
      ))}
    </ul>
  );
}

export const Anchor = Object.assign(AnchorRoot, { Skeleton: AnchorSkeleton });

export type { AnchorSkeletonProps };
