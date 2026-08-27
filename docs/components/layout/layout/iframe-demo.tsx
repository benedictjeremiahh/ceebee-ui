'use client';

import { useEffect, type ComponentType } from 'react';
import { App } from '@ceebee/ui/client';
import Side from './side';
import Fixed from './fixed';
import FixedSider from './fixed-sider';

const demos: Record<string, ComponentType> = {
  'side': Side,
  'fixed': Fixed,
  'fixed-sider': FixedSider,
};

/**
 * These demos render in frames of their own because they anchor to the viewport, which the docs page is not.
 */
export function LayoutIframeDemo({ demo }: { demo: string }) {
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
