'use client';

import { Tooltip as AntTooltip } from 'antd';
import type { TooltipProps as AntTooltipProps } from 'antd';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import type { ComponentRef } from 'react';

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

  return <AntTooltip {...props} ref={ref} open={renderedOpen} onOpenChange={handleOpenChange} />;
});

TooltipRoot.displayName = 'Tooltip';

export const Tooltip = Object.assign(TooltipRoot, {
  _InternalPanelDoNotUseOrYouWillBeFired: AntTooltip._InternalPanelDoNotUseOrYouWillBeFired,
});
