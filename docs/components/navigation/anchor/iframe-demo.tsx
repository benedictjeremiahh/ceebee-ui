'use client';

import { useEffect, type ComponentType } from 'react';
import { App } from '@ceebee/ui/client';
import Basic from './basic';
import Horizontal from './horizontal';
import Replace from './replace';
import StyleClass from './style-class';
import TargetOffset from './targetOffset';

const demos: Record<string, ComponentType> = {
  basic: Basic,
  horizontal: Horizontal,
  replace: Replace,
  'style-class': StyleClass,
  targetOffset: TargetOffset,
};

export function AnchorIframeDemo({ demo }: { demo: string }) {
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

  // Matches the App wrapper the inline showcase uses, so an isolated demo resolves Ant's reset the
  // same way the embedded ones do.
  return Component ? <App className="docs__app-frame"><Component /></App> : null;
}
