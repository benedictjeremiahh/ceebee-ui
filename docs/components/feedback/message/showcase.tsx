'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import MessageHooks from './hooks';
import MessageOther from './other';
import MessageDuration from './duration';
import MessageStack from './stack';
import MessageLoading from './loading';
import MessageThenable from './thenable';
import MessageStyleClass from './style-class';
import MessageUpdate from './update';
import MessageInfo from './info';

const demos: OfficialDemo[] = [
  { file: "hooks", title: "Hooks usage (recommended)", description: "Use message.useMessage to get contextHolder with context accessible issue. Please note that, we recommend to use top level registration instead of message static method, because static method cannot consume context, and ConfigProvider data will not work.", Component: MessageHooks },
  { file: "other", title: "Other types of message", description: "Messages of success, error and warning types.", Component: MessageOther },
  { file: "duration", title: "Customize duration", description: "Customize message display duration from default 3s to 10s.", Component: MessageDuration },
  { file: "stack", title: "Stack", description: "Stack configuration, disabled by default. Messages will be stacked when the amount is over threshold. Only the latest message is shown in the collapsed stack.", Component: MessageStack },
  { file: "loading", title: "Message with loading indicator", description: "Display a global loading indicator, which is dismissed by itself asynchronously.", Component: MessageLoading },
  { file: "thenable", title: "Promise interface", description: "message provides a promise interface for onClose. The above example will display a new message when the old message is about to close.", Component: MessageThenable },
  { file: "style-class", title: "Custom semantic styles", description: "You can customize the semantic dom style of messages with classNames and styles.", Component: MessageStyleClass },
  { file: "update", title: "Update Message Content", description: "Update message content with unique key.", Component: MessageUpdate },
  { file: "info", title: "Static method (deprecated)", description: "Static methods cannot consume Context provided by ConfigProvider. When enable layer, they may also cause style errors. Please use hooks version or App provided instance first.", Component: MessageInfo },
];

export function MessageShowcase() {
  return <Showcase section="feedback" component="message" demos={demos} sources={sources} cols={2} />;
}
