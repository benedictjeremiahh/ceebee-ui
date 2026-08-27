'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import TimelineBasic from './basic';
import TimelineVariant from './variant';
import TimelinePending from './pending';
import TimelineAlternate from './alternate';
import TimelineHorizontal from './horizontal';
import TimelineCustom from './custom';
import TimelineEnd from './end';
import TimelineTitle from './title';
import TimelineTitleSpan from './title-span';
import TimelineSemantic from './semantic';
import TimelineStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "Basic timeline.", Component: TimelineBasic },
  { file: "variant", title: "Variant", description: "Use the variant to set the style of the timeline.", Component: TimelineVariant },
  { file: "pending", title: "Loading and Reversing", description: "Node supports loading to indicate loading, and reverse property to control the order of nodes.", Component: TimelinePending },
  { file: "alternate", title: "Alternate", description: "Alternate timeline.", Component: TimelineAlternate },
  { file: "horizontal", title: "Horizontal", description: "Horizontal layout.", Component: TimelineHorizontal },
  { file: "custom", title: "Custom", description: "Set a node as an icon or other custom element.", Component: TimelineCustom },
  { file: "end", title: "End alternate", description: "End alternate timeline.", Component: TimelineEnd },
  { file: "title", title: "Title", description: "Use title show time alone.", Component: TimelineTitle },
  { file: "title-span", title: "Title Offset", description: "Use titleSpan to set the title span space.", Component: TimelineTitleSpan },
  { file: "semantic", title: "Semantic Sample", description: "Achieve richer custom styles by using semantic structure.", Component: TimelineSemantic },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Timeline by passing objects/functions through classNames and styles.", Component: TimelineStyleClass },
];

export function TimelineShowcase() {
  return <Showcase section="data-display" component="timeline" demos={demos} sources={sources} cols={2} />;
}
