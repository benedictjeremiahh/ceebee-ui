import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export interface Crumb {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: Crumb[];
  /** Collapses the middle when the trail is longer than this. */
  maxItems?: number;
  className?: string;
}

/**
 * Server-safe. The last crumb is the current page: it is text with `aria-current`, not a link,
 * because a link to where you already are is a dead end for keyboard and screen reader users.
 */
export function Breadcrumbs({ items, maxItems = 4, className }: BreadcrumbsProps) {
  const collapsed =
    items.length > maxItems
      ? [items[0]!, { label: '…' } as Crumb, ...items.slice(items.length - (maxItems - 2))]
      : items;

  return (
    <nav className={cn('cb-crumbs', className)} aria-label="Breadcrumb">
      <ol className="cb-crumbs__list">
        {collapsed.map((crumb, index) => {
          const isLast = index === collapsed.length - 1;
          return (
            <li className="cb-crumbs__item" key={`${String(crumb.label)}-${index}`}>
              {isLast ? (
                <span className="cb-crumbs__current" aria-current="page">
                  {crumb.label}
                </span>
              ) : crumb.href ? (
                <a className="cb-crumbs__link" href={crumb.href}>
                  {crumb.label}
                </a>
              ) : (
                <span className="cb-crumbs__text">{crumb.label}</span>
              )}
              {isLast ? null : (
                <ChevronRight size={14} className="cb-crumbs__separator" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
