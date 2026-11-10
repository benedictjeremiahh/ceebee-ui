'use client';

import { Collapse as AntCollapse } from 'antd';
import type { CollapseProps } from 'antd';
import { Children, cloneElement, forwardRef, isValidElement, useRef } from 'react';
import type { ComponentProps, DOMAttributes, KeyboardEvent } from 'react';

export type { CollapseProps } from 'antd';

/** Only the pinned runtime's direct header/title/icon trigger, never nested interactive content. */
function spaceTrigger(event: KeyboardEvent<HTMLDivElement>): HTMLElement | null {
  const target = event.target;
  const header = event.currentTarget.firstElementChild;
  if (!(target instanceof HTMLElement) || !header
    || (target !== header && target.parentElement !== header)
    || !['DIV', 'SPAN'].includes(target.tagName)
    || !['button', 'tab'].includes(target.getAttribute('role') ?? '')
    || !target.hasAttribute('aria-expanded') || target.getAttribute('aria-disabled') === 'true'
    || target.ownerDocument.activeElement !== target) return null;
  return target;
}

type LegacyPanelProps = ComponentProps<typeof AntCollapse.Panel> & DOMAttributes<HTMLDivElement>;

const CollapseRoot = forwardRef<HTMLDivElement, CollapseProps>(function CollapseRoot({ items, children, ...props }, ref) {
  const pressed = useRef<HTMLElement | null>(null);
  const withSpaceKeys = ({ onKeyDown, onKeyUp, onBlur }: DOMAttributes<HTMLDivElement>): DOMAttributes<HTMLDivElement> => ({
    onKeyDown(event) {
      onKeyDown?.(event);
      if (event.key !== ' ' || event.altKey || event.ctrlKey || event.metaKey || event.defaultPrevented) return;
      const trigger = spaceTrigger(event);
      if (!trigger) return;
      event.preventDefault();
      if (!event.repeat) pressed.current = trigger;
    },
    onKeyUp(event) {
      onKeyUp?.(event);
      if (event.key !== ' ') return;
      const previous = pressed.current;
      pressed.current = null;
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const trigger = spaceTrigger(event);
      if (!trigger || trigger !== previous) return;
      event.preventDefault();
      // Ant retains ownership of state, disabled rules, accordion behavior and onChange.
      trigger.click();
    },
    onBlur(event) {
      onBlur?.(event);
      if (event.target === pressed.current) pressed.current = null;
    },
  });
  const keyedItems = items?.map(item => ({ ...item, ...withSpaceKeys(item) }));
  const keyedChildren = items ? children : Children.map(children, child =>
    isValidElement<LegacyPanelProps>(child) && child.type === AntCollapse.Panel
      ? cloneElement(child, withSpaceKeys(child.props)) : child);
  return <AntCollapse {...props} items={keyedItems} ref={ref}>{keyedChildren}</AntCollapse>;
});

/** Ant Collapse with Space activation on key release and unchanged upstream panel geometry. */
export const Collapse: typeof AntCollapse = Object.assign(CollapseRoot, { Panel: AntCollapse.Panel });
