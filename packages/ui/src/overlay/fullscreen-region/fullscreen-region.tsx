'use client';
import { ConfigProvider } from 'antd';
import type { ReactNode } from 'react';
import { useCallback, useContext, useRef } from 'react';
import { Button } from '../../form/button.js';
import { useRegionFullscreen } from '../../lib/use-region-fullscreen.js';
import './fullscreen-region.css';

export interface FullscreenRegionLabels {
  enter: string;
  exit: string;
  expand: string;
  collapse: string;
  hint: string;
  expandedHint: string;
}

export interface FullscreenRegionProps {
  label: string;
  labels: FullscreenRegionLabels;
  toolbar?: ReactNode;
  children: ReactNode;
}

export function FullscreenRegion({ label, labels, toolbar, children }: FullscreenRegionProps) {
  const region = useRef<HTMLElement>(null);
  const fullscreen = useRegionFullscreen(region);
  const parentGetPopupContainer = useContext(ConfigProvider.ConfigContext).getPopupContainer;
  const getPopupContainer = useCallback((triggerNode?: HTMLElement) => {
    const element = region.current;
    if (element && (document.fullscreenElement === element || fullscreen.mode === 'window')) return element;
    if (parentGetPopupContainer) return parentGetPopupContainer(triggerNode);
    return document.body;
  }, [fullscreen.mode, parentGetPopupContainer]);
  const controlLabel = fullscreen.mode === 'native' ? labels.exit
    : fullscreen.mode === 'window' ? labels.collapse
      : fullscreen.available ? labels.enter : labels.expand;

  return <ConfigProvider getPopupContainer={getPopupContainer}>
    <section ref={region} className="cb-fullscreen-region" data-mode={fullscreen.mode}
      role="region" aria-label={label} tabIndex={-1}>
      <div className="cb-fullscreen-region__toolbar">
        <div className="cb-fullscreen-region__tools">{toolbar}</div>
        <Button size="small" htmlType="button" aria-pressed={fullscreen.mode !== 'inline'} onClick={fullscreen.toggle}>
          {controlLabel}
        </Button>
      </div>
      {fullscreen.mode !== 'inline' ? <p className="cb-fullscreen-region__hint" role="status">
        {fullscreen.mode === 'native' ? labels.hint : labels.expandedHint}
      </p> : null}
      <div className="cb-fullscreen-region__content">{children}</div>
    </section>
  </ConfigProvider>;
}
