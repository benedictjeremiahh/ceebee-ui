'use client';

import { Tooltip as AntTooltip } from 'antd';
import type { TooltipProps as AntTooltipProps } from 'antd';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import type { ComponentRef } from 'react';
import { cn } from '../lib/cn.js';
import './tooltip.css';

export type TooltipProps = AntTooltipProps & {
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
};

const TooltipRoot = forwardRef<ComponentRef<typeof AntTooltip>, TooltipProps>(function TooltipRoot(
  {
    open,
    visible,
    defaultOpen,
    defaultVisible,
    onOpenChange,
    onVisibleChange,
    classNames,
    ...props
  },
  ref,
) {
  const controlled = open !== undefined || visible !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? defaultVisible ?? false);
  const effectiveOpen = open ?? visible ?? internalOpen;
  const hasContent = Boolean(props.title || props.overlay || props.title === 0);
  const renderedOpen = controlled || hasContent ? effectiveOpen : false;

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (!controlled) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
    onVisibleChange?.(nextOpen);
  }, [controlled, onOpenChange, onVisibleChange]);

  useEffect(() => {
    if (!renderedOpen) return undefined;
    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      handleOpenChange(false);
    };
    document.addEventListener('keydown', dismissOnEscape, true);
    return () => document.removeEventListener('keydown', dismissOnEscape, true);
  }, [renderedOpen, handleOpenChange]);

  const contentClassNames: TooltipProps['classNames'] = typeof classNames === 'function'
    ? (info) => {
        const resolved = classNames(info) ?? {};
        return { ...resolved, container: cn('cb-tooltip-content', resolved.container) };
      }
    : { ...classNames, container: cn('cb-tooltip-content', classNames?.container) };

  return <AntTooltip {...props} ref={ref} open={renderedOpen} onOpenChange={handleOpenChange}
    classNames={contentClassNames} />;
});

TooltipRoot.displayName = 'Tooltip';

export const Tooltip = Object.assign(TooltipRoot, {
  _InternalPanelDoNotUseOrYouWillBeFired: AntTooltip._InternalPanelDoNotUseOrYouWillBeFired,
});
