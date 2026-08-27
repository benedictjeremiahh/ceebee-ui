'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import EmptyBasic from './basic';
import EmptySimple from './simple';
import EmptyCustomize from './customize';
import EmptyConfigProvider from './config-provider';
import EmptyStyleClass from './style-class';
import EmptyDescription from './description';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "Simplest Usage.", Component: EmptyBasic },
  { file: "simple", title: "Choose image", description: "You can choose another style of image by setting image to Empty.PRESENTED_IMAGE_SIMPLE.", Component: EmptySimple },
  { file: "customize", title: "Customize", description: "Customize image source, image size, description and extra content.", Component: EmptyCustomize },
  { file: "config-provider", title: "ConfigProvider", description: "Use ConfigProvider set global Empty style.", Component: EmptyConfigProvider },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Empty by passing objects/functions through classNames and styles.", Component: EmptyStyleClass },
  { file: "description", title: "No description", description: "Simplest Usage with no description.", Component: EmptyDescription },
];

export function EmptyShowcase() {
  return <Showcase section="data-display" component="empty" demos={demos} sources={sources} />;
}
