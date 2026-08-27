'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import TourBasic from './basic';
import TourNonModal from './non-modal';
import TourPlacement from './placement';
import TourMask from './mask';
import TourIndicator from './indicator';
import TourActionsRender from './actions-render';
import TourGap from './gap';
import TourStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "The most basic usage.", Component: TourBasic },
  { file: "non-modal", title: "Non-modal", description: "Use mask={false} to make Tour non-modal. At the meantime it is recommended to use with type=\"primary\" to emphasize the guide itself.", Component: TourNonModal },
  { file: "placement", title: "Placement", description: "Change the placement of the guide relative to the target, there are 12 placements available. When target={null} the guide will show in the center.", Component: TourPlacement },
  { file: "mask", title: "Custom mask style", description: "Custom mask style.", Component: TourMask },
  { file: "indicator", title: "Custom indicator", description: "Custom indicator.", Component: TourIndicator },
  { file: "actions-render", title: "Custom action", description: "Custom action.", Component: TourActionsRender },
  { file: "gap", title: "Custom highlighted area style", description: "Using gap to control the radius of highlight area and the offset between highlight area and the element. - Setting offset in two directions individually and offset with array type is not supported until 5.9.0.", Component: TourGap },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Tour by passing objects/functions through classNames and styles.", Component: TourStyleClass },
];

export function TourShowcase() {
  return <Showcase section="data-display" component="tour" demos={demos} sources={sources} cols={2} />;
}
