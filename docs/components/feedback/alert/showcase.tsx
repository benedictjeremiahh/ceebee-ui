'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import AlertBasic from './basic';
import AlertStyle from './style';
import AlertFilled from './filled';
import AlertClosable from './closable';
import AlertDescription from './description';
import AlertIcon from './icon';
import AlertBanner from './banner';
import AlertLoopBanner from './loop-banner';
import AlertSmoothClosed from './smooth-closed';
import AlertErrorBoundary from './error-boundary';
import AlertAction from './action';
import AlertCustomTitleAlignment from './custom-title-alignment';
import AlertStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "The simplest usage for short messages.", Component: AlertBasic },
  { file: "style", title: "More types", description: "There are 4 types of Alert: success, info, warning, error.", Component: AlertStyle },
  { file: "filled", title: "Filled", description: "Hide the border with variant=\"filled\".", Component: AlertFilled },
  { file: "closable", title: "Closable", description: "To show close button.", Component: AlertClosable },
  { file: "description", title: "Description", description: "Additional description for alert message.", Component: AlertDescription },
  { file: "icon", title: "Icon", description: "A relevant icon will make information clearer and more friendly.", Component: AlertIcon },
  { file: "banner", title: "Banner", description: "Display Alert as a banner at top of page.", Component: AlertBanner, iframe: 250 },
  { file: "loop-banner", title: "Loop Banner", description: "Show a loop banner by using with react-text-loop-next or react-fast-marquee.", Component: AlertLoopBanner },
  { file: "smooth-closed", title: "Smoothly Unmount", description: "Smoothly unmount Alert upon close.", Component: AlertSmoothClosed },
  { file: "error-boundary", title: "ErrorBoundary", description: "ErrorBoundary Component for making error handling easier in React.", Component: AlertErrorBoundary },
  { file: "action", title: "Custom action", description: "Custom action.", Component: AlertAction },
  { file: "custom-title-alignment", title: "Custom title alignment", description: "When description is not set, Alert vertically centers the icon, content, action, and close button as a group. Ceebee UI does not switch this default layout to flex-start with token-derived offsets because customized styles may change font size, line height, or action size, making those offsets no longer match the actual rendered styles. When a wrapping title should align those elements with the first line, adjust them with semantic styles.", Component: AlertCustomTitleAlignment },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Alert by passing objects/functions through classNames and styles.", Component: AlertStyleClass },
];

export function AlertShowcase() {
  return <Showcase section="feedback" component="alert" demos={demos} sources={sources} cols={2} />;
}
