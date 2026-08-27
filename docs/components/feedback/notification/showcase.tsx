'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import NotificationHooks from './hooks';
import NotificationDuration from './duration';
import NotificationWithIcon from './with-icon';
import NotificationWithBtn from './with-btn';
import NotificationCustomIcon from './custom-icon';
import NotificationPlacement from './placement';
import NotificationUpdate from './update';
import NotificationStack from './stack';
import NotificationShowWithProgress from './show-with-progress';
import NotificationBasic from './basic';
import NotificationProgressColor from './progress-color';
import NotificationStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "hooks", title: "Hooks usage (recommended)", description: "Use notification.useNotification to get contextHolder with context accessible issue. Please note that, we recommend to use top level registration instead of notification static method, because static method cannot consume context, and ConfigProvider data will not work.", Component: NotificationHooks },
  { file: "duration", title: "Duration after which the notification box is closed", description: "Duration can be used to specify how long the notification stays open. After the duration time elapses, the notification closes automatically. If not specified, default value is 4.5 seconds. If you set the value to 0, the notification box will never close automatically.", Component: NotificationDuration },
  { file: "with-icon", title: "Notification with icon", description: "A notification box with a icon at the left side.", Component: NotificationWithIcon },
  { file: "with-btn", title: "Custom close button", description: "To customize the style or font of the close button.", Component: NotificationWithBtn },
  { file: "custom-icon", title: "Customized Icon", description: "The icon can be customized to any react node.", Component: NotificationCustomIcon },
  { file: "placement", title: "Placement", description: "A notification box can appear from the top bottom topLeft topRight bottomLeft or bottomRight of the viewport via placement.", Component: NotificationPlacement },
  { file: "update", title: "Update Message Content", description: "Update content with unique key.", Component: NotificationUpdate },
  { file: "stack", title: "Stack", description: "Stack configuration, enabled by default. Notifications will be stacked when the amount is over threshold. Up to 3 notifications are shown in the collapsed stack.", Component: NotificationStack },
  { file: "show-with-progress", title: "Show with progress", description: "Show progress bar for auto-closing notification.", Component: NotificationShowWithProgress },
  { file: "basic", title: "Static Method (deprecated)", description: "Static methods cannot consume Context provided by ConfigProvider. When enable layer, they may also cause style errors. Please use hooks version or App provided instance first.", Component: NotificationBasic },
  { file: "progress-color", title: "Customize progress bar color", description: "Customize the progress bar color by configuring the component token.", Component: NotificationProgressColor },
  { file: "style-class", title: "Custom semantic styles", description: "You can customize the semantic dom style of Notification with classNames and styles.", Component: NotificationStyleClass },
];

export function NotificationShowcase() {
  return <Showcase section="feedback" component="notification" demos={demos} sources={sources} cols={2} />;
}
