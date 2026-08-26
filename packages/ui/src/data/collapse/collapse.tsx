'use client';

import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn.js';
import { CollapseSkeleton } from './collapse.skeleton.js';

export interface CollapseItem {
  key: string;
  label: ReactNode;
  children: ReactNode;
  disabled?: boolean;
}

export interface CollapseProps {
  items: CollapseItem[];
  /** One key in single mode; an array of keys when `multiple` is true. */
  value?: string | string[];
  /** Initial key or keys for an uncontrolled Collapse. */
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[] | undefined) => void;
  multiple?: boolean;
  size?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
  expandIconPosition?: 'start' | 'end';
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  disabled?: boolean;
  /** Keeps closed panels in the DOM, for content whose local state must survive toggles. */
  keepMounted?: boolean;
  /** Allows browser page search to reveal matching content in closed panels. */
  hiddenUntilFound?: boolean;
  motion?: boolean;
  className?: string;
}

function normalizeValue(value: string | string[] | undefined, multiple: boolean) {
  if (value == null) return undefined;
  if (Array.isArray(value)) return multiple ? value : value.slice(0, 1);
  return [value];
}

function CollapseRoot({
  items,
  value,
  defaultValue,
  onValueChange,
  multiple = false,
  size = 'md',
  bordered = true,
  expandIconPosition = 'start',
  headingLevel = 3,
  disabled = false,
  keepMounted = false,
  hiddenUntilFound = false,
  motion = true,
  className,
}: CollapseProps) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  return (
    <BaseAccordion.Root
      value={normalizeValue(value, multiple)}
      defaultValue={normalizeValue(defaultValue, multiple)}
      onValueChange={(next) => onValueChange?.(multiple ? next.map(String) : next[0] == null ? undefined : String(next[0]))}
      multiple={multiple}
      disabled={disabled}
      keepMounted={hiddenUntilFound ? undefined : keepMounted}
      hiddenUntilFound={hiddenUntilFound}
      className={cn(
        'cb-collapse',
        `cb-collapse--${size}`,
        bordered && 'cb-collapse--bordered',
        expandIconPosition === 'end' && 'cb-collapse--icon-end',
        !motion && 'cb-collapse--motionless',
        className,
      )}
    >
      {items.map((item) => (
        <BaseAccordion.Item
          key={item.key}
          value={item.key}
          disabled={item.disabled}
          className="cb-collapse__item"
        >
          <BaseAccordion.Header render={<Heading className="cb-collapse__heading" />}>
            <BaseAccordion.Trigger className="cb-collapse__trigger">
              <span className="cb-collapse__icon" aria-hidden="true">
                <ChevronDown />
              </span>
              <span className="cb-collapse__label">{item.label}</span>
            </BaseAccordion.Trigger>
          </BaseAccordion.Header>
          <BaseAccordion.Panel className="cb-collapse__panel">
            <div className="cb-collapse__content">{item.children}</div>
          </BaseAccordion.Panel>
        </BaseAccordion.Item>
      ))}
    </BaseAccordion.Root>
  );
}

/** A disclosure group. Base UI owns expansion state, button semantics, and panel association. */
export const Collapse = Object.assign(CollapseRoot, {
  Skeleton: CollapseSkeleton,
});
