'use client';

import { useEffect, type ComponentType } from 'react';
import { App } from '@ceebee/ui/client';
import Banner from './banner';

const demos: Record<string, ComponentType> = {
  'banner': Banner,
};

/**
 * This demo renders in a frame of its own because it measures the viewport, which the docs page is not.
 */
export function AlertIframeDemo({ demo }: { demo: string }) {
  const Component = demos[demo];

  useEffect(() => {
    const skin = new URLSearchParams(window.location.search).get('skin');
    if (!skin || skin === 'default') return;
    const link = document.createElement('link');
    link.id = 'cb-skin';
    link.rel = 'stylesheet';
    link.href = `/skins/${skin}.css`;
    document.head.append(link);
    return () => link.remove();
  }, []);

  return Component ? <App className="docs__app-frame"><Component /></App> : null;
}
