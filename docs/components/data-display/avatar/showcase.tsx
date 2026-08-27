'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import AvatarBasic from './basic';
import AvatarType from './type';
import AvatarDynamic from './dynamic';
import AvatarBadge from './badge';
import AvatarGroup from './group';
import AvatarMaxCount from './max-count';
import AvatarResponsive from './responsive';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "Three sizes and two shapes are available.", Component: AvatarBasic },
  { file: "type", title: "Type", description: "Image, Icon and letter are supported, and the latter two kinds of avatar can have custom colors and background colors.", Component: AvatarType },
  { file: "dynamic", title: "Autoset Font Size", description: "For letter type Avatar, when the letters are too long to display, the font size can be automatically adjusted according to the width of the Avatar. You can also use gap to set the unit distance between left and right sides.", Component: AvatarDynamic },
  { file: "badge", title: "With Badge", description: "Usually used for reminders and notifications.", Component: AvatarBadge },
  { file: "group", title: "Avatar.Group", description: "Avatar group display.", Component: AvatarGroup },
  { file: "max-count", title: "maxCount includes overflow", description: "Wrap Avatar.Group with HOC to add overflowInFinal prop. When enabled, max.count represents the total number of elements to display and reserves 1 slot for the overflow indicator.", Component: AvatarMaxCount },
  { file: "responsive", title: "Responsive Size", description: "Avatar size can be automatically adjusted based on the screen size.", Component: AvatarResponsive },
];

export function AvatarShowcase() {
  return <Showcase section="data-display" component="avatar" demos={demos} sources={sources} cols={2} />;
}
