'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import StatisticBasic from './basic';
import StatisticUnit from './unit';
import StatisticAnimated from './animated';
import StatisticCard from './card';
import StatisticTimer from './timer';
import StatisticStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "Simplest Usage.", Component: StatisticBasic },
  { file: "unit", title: "Unit", description: "Add unit through prefix and suffix.", Component: StatisticUnit },
  { file: "animated", title: "Animated number", description: "Animated number with react-countup.", Component: StatisticAnimated },
  { file: "card", title: "In Card", description: "Display statistic data in Card.", Component: StatisticCard, background: 'grey' },
  { file: "timer", title: "Timer", description: "Timer component.", Component: StatisticTimer },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of the Statistic by passing objects/functions through classNames and styles.", Component: StatisticStyleClass },
];

export function StatisticShowcase() {
  return <Showcase section="data-display" component="statistic" demos={demos} sources={sources} cols={2} />;
}
