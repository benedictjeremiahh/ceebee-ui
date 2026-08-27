'use client';

import { useEffect, type ComponentType } from 'react';
import { App } from '@ceebee/ui/client';
import ValidateScrollToField from './validate-scroll-to-field';

const demos: Record<string, ComponentType> = {
  'validate-scroll-to-field': ValidateScrollToField,
};

/**
 * This demo renders in a frame of its own because it scrolls the viewport to the first invalid field, which
 * only reads correctly in a document of its own rather than inside the docs page.
 */
export function FormIframeDemo({ demo }: { demo: string }) {
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
