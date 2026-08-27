'use client';

import { useEffect, type ComponentType } from 'react';
import { App } from '@ceebee/ui/client';
import Basic from './basic';
import Type from './type';
import Shape from './shape';
import Content from './content';
import Tooltip from './tooltip';
import Group from './group';
import GroupMenu from './group-menu';
import Controlled from './controlled';
import Placement from './placement';
import Draggable from './draggable';
import BackTop from './back-top';
import ProgressRing from './progress-ring';
import Badge from './badge';
import StyleClass from './style-class';

const demos: Record<string, ComponentType> = {
  'basic': Basic,
  'type': Type,
  'shape': Shape,
  'content': Content,
  'tooltip': Tooltip,
  'group': Group,
  'group-menu': GroupMenu,
  'controlled': Controlled,
  'placement': Placement,
  'draggable': Draggable,
  'back-top': BackTop,
  'progress-ring': ProgressRing,
  'badge': Badge,
  'style-class': StyleClass,
};

/**
 * These demos render in frames of their own because they anchor to the viewport, which the docs page is not.
 */
export function FloatButtonIframeDemo({ demo }: { demo: string }) {
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
