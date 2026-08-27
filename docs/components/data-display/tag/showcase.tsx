'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import TagBasic from './basic';
import TagColorful from './colorful';
import TagControl from './control';
import TagCheckable from './checkable';
import TagAnimation from './animation';
import TagIcon from './icon';
import TagStatus from './status';
import TagDraggable from './draggable';
import TagStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "Usage of basic Tag, and it could be closable and customize close button by set closeIcon property, will display default close button when closeIcon is setting to true. Closable Tag supports onClose events.", Component: TagBasic },
  { file: "colorful", title: "Colorful Tag", description: "We preset a series of colorful tag styles for use in different situations. You can also set it to a hex color string for custom color.", Component: TagColorful },
  { file: "control", title: "Add & Remove Dynamically", description: "Generating a set of Tags by array, you can add and remove dynamically.", Component: TagControl },
  { file: "checkable", title: "Checkable", description: "CheckableTag works like Checkbox, click it to toggle checked state. CheckableTagGroup provides function that is similar to CheckboxGroup or RadioGroup. > CheckableTag is absolute controlled component and has no uncontrolled mode.", Component: TagCheckable },
  { file: "animation", title: "Animate", description: "Animating the Tag by using motion.", Component: TagAnimation },
  { file: "icon", title: "Icon", description: "You can add a custom icon to the tag via the icon prop. Note that the icon prop for CheckableTag is only supported in version >=5.27.0. If you need to control the icon position, please use the <XXXIcon /> component directly in children instead of the icon prop. icon also accepts a bare <svg> element from a third-party icon library. It stays vertically centred with the label whether it is sized in em or in px.", Component: TagIcon },
  { file: "status", title: "Status Tag", description: "We preset five different colors, you can set color property such as success,processing,error,default and warning to indicate specific status.", Component: TagStatus },
  { file: "draggable", title: "Draggable Tag", description: "Draggable tags using dnd kit.", Component: TagDraggable },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Tag by passing objects/functions through classNames and styles.", Component: TagStyleClass },
];

export function TagShowcase() {
  return <Showcase section="data-display" component="tag" demos={demos} sources={sources} cols={2} />;
}
