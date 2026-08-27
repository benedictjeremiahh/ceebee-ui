'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import PopoverBasic from './basic';
import PopoverTriggerType from './triggerType';
import PopoverPlacement from './placement';
import PopoverArrow from './arrow';
import PopoverShift from './shift';
import PopoverControl from './control';
import PopoverHoverWithClick from './hover-with-click';
import PopoverStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "The most basic example. The size of the floating layer depends on the contents region.", Component: PopoverBasic },
  { file: "triggerType", title: "Three ways to trigger", description: "Mouse to click, focus and move in.", Component: PopoverTriggerType },
  { file: "placement", title: "Placement", description: "There are 12 placement options available.", Component: PopoverPlacement },
  { file: "arrow", title: "Arrow", description: "Hide arrow by arrow.", Component: PopoverArrow },
  { file: "shift", title: "Auto Shift", description: "Auto adjust Popup and arrow position when Popover is close to the edge of the screen. Will be out of screen when exceed limitation.", Component: PopoverShift, iframe: 300 },
  { file: "control", title: "Controlling the close of the dialog", description: "Use open prop to control the display of the card.", Component: PopoverControl },
  { file: "hover-with-click", title: "Hover with click popover", description: "The following example shows how to create a popover which can be hovered and clicked.", Component: PopoverHoverWithClick },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Popover by passing objects/functions through classNames and styles.", Component: PopoverStyleClass },
];

export function PopoverShowcase() {
  return <Showcase section="data-display" component="popover" demos={demos} sources={sources} cols={2} />;
}
