'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import DescriptionsBasic from './basic';
import DescriptionsBorder from './border';
import DescriptionsSize from './size';
import DescriptionsResponsive from './responsive';
import DescriptionsVertical from './vertical';
import DescriptionsVerticalBorder from './vertical-border';
import DescriptionsStyleClass from './style-class';
import DescriptionsBlock from './block';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "Simplest Usage.", Component: DescriptionsBasic },
  { file: "border", title: "border", description: "Descriptions with border and background color.", Component: DescriptionsBorder },
  { file: "size", title: "Custom size", description: "Custom sizes to fit in a variety of containers.", Component: DescriptionsSize },
  { file: "responsive", title: "responsive", description: "Responsive configuration enables perfect presentation on small screen devices.", Component: DescriptionsResponsive },
  { file: "vertical", title: "Vertical", description: "Simplest Usage.", Component: DescriptionsVertical },
  { file: "vertical-border", title: "Vertical border", description: "Descriptions with border and background color.", Component: DescriptionsVerticalBorder },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Descriptions by passing objects/functions through classNames and styles.", Component: DescriptionsStyleClass },
  { file: "block", title: "row", description: "Display of the entire line.", Component: DescriptionsBlock },
];

export function DescriptionsShowcase() {
  return <Showcase section="data-display" component="descriptions" demos={demos} sources={sources} />;
}
