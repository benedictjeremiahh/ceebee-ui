'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import BadgeBasic from './basic';
import BadgeNoWrapper from './no-wrapper';
import BadgeOverflow from './overflow';
import BadgeDot from './dot';
import BadgeChange from './change';
import BadgeLink from './link';
import BadgeOffset from './offset';
import BadgeSize from './size';
import BadgeStatus from './status';
import BadgeColorful from './colorful';
import BadgeRibbon from './ribbon';
import BadgeStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "Simplest Usage. Badge will be hidden when count is 0, but we can use showZero to show it.", Component: BadgeBasic },
  { file: "no-wrapper", title: "Standalone", description: "Used in standalone when children is empty.", Component: BadgeNoWrapper },
  { file: "overflow", title: "Overflow Count", description: "${overflowCount}+ is displayed when count is larger than overflowCount. The default value of overflowCount is 99.", Component: BadgeOverflow },
  { file: "dot", title: "Red badge", description: "This will simply display a red badge, without a specific count. If count equals 0, it won't display the dot.", Component: BadgeDot },
  { file: "change", title: "Dynamic", description: "The count will be animated as it changes.", Component: BadgeChange },
  { file: "link", title: "Clickable", description: "The badge can be wrapped with a tag to make it linkable.", Component: BadgeLink },
  { file: "offset", title: "Offset", description: "Set offset of the badge dot, the format is [left, top], which represents the offset of the status dot from the left and top of the default position.", Component: BadgeOffset },
  { file: "size", title: "Size", description: "Set size of numeral Badge.", Component: BadgeSize },
  { file: "status", title: "Status", description: "Standalone badge with status.", Component: BadgeStatus },
  { file: "colorful", title: "Colorful Badge", description: "We preset a series of colorful Badge styles for use in different situations. You can also set it to a hex color string for custom color.", Component: BadgeColorful },
  { file: "ribbon", title: "Ribbon", description: "Use ribbon badge.", Component: BadgeRibbon },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Badge by passing objects/functions through classNames and styles.", Component: BadgeStyleClass },
];

export function BadgeShowcase() {
  return <Showcase section="data-display" component="badge" demos={demos} sources={sources} cols={2} />;
}
