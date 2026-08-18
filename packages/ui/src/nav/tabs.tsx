'use client';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export interface TabItem {
  value: string;
  label: ReactNode;
  /** Count or status shown after the label, e.g. a Badge. */
  adornment?: ReactNode;
  disabled?: boolean;
  content: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: 'underline' | 'pill';
  className?: string;
}

/** Roving focus, panel association, and the moving indicator are Base UI's (ADR 0003). */
export function Tabs({ items, value, defaultValue, onValueChange, variant = 'underline', className }: TabsProps) {
  return (
    <BaseTabs.Root
      value={value}
      defaultValue={defaultValue ?? items[0]?.value}
      onValueChange={(next) => onValueChange?.(String(next))}
      className={cn('cb-tabs', `cb-tabs--${variant}`, className)}
    >
      <BaseTabs.List className="cb-tabs__list">
        {items.map((item) => (
          <BaseTabs.Tab key={item.value} value={item.value} disabled={item.disabled} className="cb-tabs__tab">
            {item.label}
            {item.adornment ? <span className="cb-tabs__adornment">{item.adornment}</span> : null}
          </BaseTabs.Tab>
        ))}
        <BaseTabs.Indicator className="cb-tabs__indicator" />
      </BaseTabs.List>

      {items.map((item) => (
        <BaseTabs.Panel key={item.value} value={item.value} className="cb-tabs__panel">
          {item.content}
        </BaseTabs.Panel>
      ))}
    </BaseTabs.Root>
  );
}
