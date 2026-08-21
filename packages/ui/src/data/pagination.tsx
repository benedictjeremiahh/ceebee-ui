'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLabels } from '../lib/labels.js';
import { cn } from '../lib/cn.js';
import { pageRange } from './table-sort.js';

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  /** Shows "1–20 of 137" beside the controls. */
  showSummary?: boolean;
  siblings?: number;
  className?: string;
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  showSummary = true,
  siblings = 1,
  className,
}: PaginationProps) {
  const labels = useLabels();
  const { items, totalPages, from, to } = pageRange(page, pageSize, total, siblings);
  const current = Math.min(Math.max(page, 1), totalPages);

  return (
    <nav className={cn('cb-pagination', className)} aria-label="Pagination">
      {showSummary ? (
        <p className="cb-pagination__summary">{labels.pageSummary(from, to, total)}</p>
      ) : null}

      <div className="cb-pagination__controls">
        <button
          type="button"
          className="cb-pagination__step"
          aria-label={labels.previousPage}
          disabled={current <= 1}
          onClick={() => onPageChange(current - 1)}
        >
          <ChevronLeft size={16} />
        </button>

        {items.map((item, index) =>
          item === null ? (
            <span className="cb-pagination__gap" key={`gap-${index}`} aria-hidden="true">
              …
            </span>
          ) : (
            <button
              type="button"
              key={item}
              className="cb-pagination__page"
              data-active={item === current || undefined}
              aria-label={labels.page(item)}
              aria-current={item === current ? 'page' : undefined}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          className="cb-pagination__step"
          aria-label={labels.nextPage}
          disabled={current >= totalPages}
          onClick={() => onPageChange(current + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
}
