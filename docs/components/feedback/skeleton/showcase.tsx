'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import SkeletonBasic from './basic';
import SkeletonComplex from './complex';
import SkeletonActive from './active';
import SkeletonElement from './element';
import SkeletonChildren from './children';
import SkeletonList from './list';
import SkeletonStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "Simplest Skeleton usage.", Component: SkeletonBasic },
  { file: "complex", title: "Complex combination", description: "Complex combination with avatar and multiple paragraphs.", Component: SkeletonComplex },
  { file: "active", title: "Active Animation", description: "Display active animation.", Component: SkeletonActive },
  { file: "element", title: "Button/Avatar/Input/Image/Node", description: "Skeleton Button, Avatar, Input, Image and Node.", Component: SkeletonElement },
  { file: "children", title: "Contains sub component", description: "Skeleton contains sub component.", Component: SkeletonChildren },
  { file: "list", title: "List", description: "Use skeleton in list component.", Component: SkeletonList },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Skeleton by passing objects or functions through classNames and styles.", Component: SkeletonStyleClass },
];

export function SkeletonShowcase() {
  return <Showcase section="feedback" component="skeleton" demos={demos} sources={sources} />;
}
