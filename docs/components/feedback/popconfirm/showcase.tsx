'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import PopconfirmBasic from './basic';
import PopconfirmLocale from './locale';
import PopconfirmPlacement from './placement';
import PopconfirmShift from './shift';
import PopconfirmDynamicTrigger from './dynamic-trigger';
import PopconfirmIcon from './icon';
import PopconfirmAsync from './async';
import PopconfirmPromise from './promise';
import PopconfirmStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "The basic example supports the title and description props of confirmation. > description is supported in version 5.1.0.", Component: PopconfirmBasic },
  { file: "locale", title: "Locale text", description: "Set okText and cancelText props to customize the button's labels.", Component: PopconfirmLocale },
  { file: "placement", title: "Placement", description: "There are 12 placement options available. Use arrow: { pointAtCenter: true } if you want the arrow to point at the center of target.", Component: PopconfirmPlacement },
  { file: "shift", title: "Auto Shift", description: "Auto adjust Popup and arrow position when Popconfirm is close to the edge of the screen. Will be out of screen when exceed limitation.", Component: PopconfirmShift, iframe: 300 },
  { file: "dynamic-trigger", title: "Conditional trigger", description: "Make it pop up under some conditions.", Component: PopconfirmDynamicTrigger },
  { file: "icon", title: "Customize icon", description: "Set icon props to customize the icon.", Component: PopconfirmIcon },
  { file: "async", title: "Asynchronously close", description: "Asynchronously close a popconfirm when a the OK button is pressed. For example, you can use this pattern when you submit a form.", Component: PopconfirmAsync },
  { file: "promise", title: "Asynchronously close on Promise", description: "Asynchronously close a popconfirm when the OK button is pressed. For example, you can use this pattern when you submit a form.", Component: PopconfirmPromise },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Popconfirm by passing objects/functions through classNames and styles.", Component: PopconfirmStyleClass },
];

export function PopconfirmShowcase() {
  return <Showcase section="feedback" component="popconfirm" demos={demos} sources={sources} cols={2} />;
}
