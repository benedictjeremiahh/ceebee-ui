'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import TooltipBasic from './basic';
import TooltipSmoothTransition from './smooth-transition';
import TooltipPlacement from './placement';
import TooltipArrow from './arrow';
import TooltipShift from './shift';
import TooltipColorful from './colorful';
import TooltipDisabled from './disabled';
import TooltipWrapCustomComponent from './wrap-custom-component';
import TooltipStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "The simplest usage.", Component: TooltipBasic },
  { file: "smooth-transition", title: "Smooth Transition", description: "Configure Tooltip unique display through ConfigProvider global configuration to achieve smooth transition effects with only one Tooltip displayed at a time.", Component: TooltipSmoothTransition },
  { file: "placement", title: "Placement", description: "There are 12 placement options available.", Component: TooltipPlacement },
  { file: "arrow", title: "Arrow", description: "Support show, hide or keep arrow in the center.", Component: TooltipArrow },
  { file: "shift", title: "Auto Shift", description: "Auto adjust Popup and arrow position when Tooltip is close to the edge of the screen. Will be out of screen when exceed limitation.", Component: TooltipShift, iframe: 300 },
  { file: "colorful", title: "Colorful Tooltip", description: "We preset a series of colorful Tooltip styles for use in different situations.", Component: TooltipColorful },
  { file: "disabled", title: "Disabled", description: "The Tooltip can be disabled by setting title={null} or title=\"\".", Component: TooltipDisabled },
  { file: "wrap-custom-component", title: "Wrap custom component", description: "Use with a custom component.", Component: TooltipWrapCustomComponent },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Tooltip by passing objects/functions through classNames and styles.", Component: TooltipStyleClass },
];

export function TooltipShowcase() {
  return <Showcase section="data-display" component="tooltip" demos={demos} sources={sources} cols={2} />;
}
