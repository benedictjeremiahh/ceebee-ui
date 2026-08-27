'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import SegmentedBasic from './basic';
import SegmentedVertical from './vertical';
import SegmentedBlock from './block';
import SegmentedShape from './shape';
import SegmentedDisabled from './disabled';
import SegmentedControlled from './controlled';
import SegmentedCustom from './custom';
import SegmentedDynamic from './dynamic';
import SegmentedSize from './size';
import SegmentedWithIcon from './with-icon';
import SegmentedIconOnly from './icon-only';
import SegmentedWithName from './with-name';
import SegmentedStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "The most basic usage.", Component: SegmentedBasic },
  { file: "vertical", title: "Vertical Direction", description: "Make it vertical.", Component: SegmentedVertical },
  { file: "block", title: "Block Segmented", description: "block property will make the Segmented fit to its parent width.", Component: SegmentedBlock },
  { file: "shape", title: "Round shape", description: "Round shape of Segmented.", Component: SegmentedShape },
  { file: "disabled", title: "Disabled", description: "Disabled Segmented.", Component: SegmentedDisabled },
  { file: "controlled", title: "Controlled mode", description: "Controlled Segmented.", Component: SegmentedControlled },
  { file: "custom", title: "Custom Render", description: "Custom each Segmented Item.", Component: SegmentedCustom },
  { file: "dynamic", title: "Dynamic", description: "Load options dynamically.", Component: SegmentedDynamic },
  { file: "size", title: "Three sizes of Segmented", description: "There are three sizes of a Segmented component: large (40px), medium (32px), and small (24px).", Component: SegmentedSize },
  { file: "with-icon", title: "With Icon", description: "Set icon for Segmented Item. icon also accepts a bare <svg> element from a third-party icon library, which stays vertically centred with the label.", Component: SegmentedWithIcon },
  { file: "icon-only", title: "With Icon only", description: "Set icon without label for Segmented Item.", Component: SegmentedIconOnly },
  { file: "with-name", title: "With name", description: "Passing the name property to all input[type=\"radio\"] that are in the same Segmented. It is usually used to let the browser see your Segmented as a real \"group\" and keep the default behavior. For example, using left/right keyboard arrow to change your selection that in the same Segmented.", Component: SegmentedWithName },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of the Segmented by passing objects/functions through classNames and styles.", Component: SegmentedStyleClass },
];

export function SegmentedShowcase() {
  return <Showcase section="data-display" component="segmented" demos={demos} sources={sources} cols={2} />;
}
