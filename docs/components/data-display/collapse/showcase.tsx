'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import CollapseBasic from './basic';
import CollapseSize from './size';
import CollapseAccordion from './accordion';
import CollapseMix from './mix';
import CollapseBorderless from './borderless';
import CollapseCustom from './custom';
import CollapseIcon from './icon';
import CollapseNoarrow from './noarrow';
import CollapseExtra from './extra';
import CollapseGhost from './ghost';
import CollapseCollapsible from './collapsible';
import CollapseStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Collapse", description: "By default, any number of panels can be expanded at a time. The first panel is expanded in this example.", Component: CollapseBasic },
  { file: "size", title: "Size", description: "Ceebee UI supports a default collapse size as well as a large and small size. If a large or small collapse is desired, set the size property to either large or small respectively. Omit the size property for a collapse with the default medium size.", Component: CollapseSize },
  { file: "accordion", title: "Accordion", description: "In accordion mode, only one panel can be expanded at a time.", Component: CollapseAccordion },
  { file: "mix", title: "Nested panel", description: "Collapse is nested inside the Collapse.", Component: CollapseMix },
  { file: "borderless", title: "Borderless", description: "A borderless style of Collapse.", Component: CollapseBorderless },
  { file: "custom", title: "Custom Panel", description: "Customize the background, border, margin styles and icon for each panel.", Component: CollapseCustom },
  { file: "icon", title: "Panel with icon", description: "Add an icon to the panel title. A bare <svg> from a third-party icon library (e.g. lucide, react-icons) stays vertically centred with the title text.", Component: CollapseIcon },
  { file: "noarrow", title: "No arrow", description: "You can hide the arrow icon by passing showArrow={false} to CollapsePanel component.", Component: CollapseNoarrow },
  { file: "extra", title: "Extra node", description: "Render extra element in the top-right corner of each panel.", Component: CollapseExtra },
  { file: "ghost", title: "Ghost Collapse", description: "Making collapse's background to transparent.", Component: CollapseGhost },
  { file: "collapsible", title: "Collapsible", description: "Specify the trigger area of collapsible by collapsible.", Component: CollapseCollapsible },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Collapse by passing objects/functions through classNames and styles.", Component: CollapseStyleClass },
];

export function CollapseShowcase() {
  return <Showcase section="data-display" component="collapse" demos={demos} sources={sources} />;
}
