'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import MentionsBasic from './basic';
import MentionsSize from './size';
import MentionsVariant from './variant';
import MentionsAsync from './async';
import MentionsForm from './form';
import MentionsPrefix from './prefix';
import MentionsReadonly from './readonly';
import MentionsPlacement from './placement';
import MentionsPopupRender from './popupRender';
import MentionsAllowClear from './allowClear';
import MentionsAutoSize from './autoSize';
import MentionsStatus from './status';
import MentionsStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "Basic usage.", Component: MentionsBasic },
  { file: "size", title: "Size", description: "Configure size via size property.", Component: MentionsSize },
  { file: "variant", title: "Variants", description: "Variants of Mentions, there are four variants: outlined filled borderless and underlined.", Component: MentionsVariant },
  { file: "async", title: "Asynchronous loading", description: "async.", Component: MentionsAsync },
  { file: "form", title: "With Form", description: "Controlled mode, for example, to work with Form.", Component: MentionsForm },
  { file: "prefix", title: "Customize Trigger Token", description: "Customize Trigger Token by prefix props. Default to @, Array<string> also supported.", Component: MentionsPrefix },
  { file: "readonly", title: "disabled or readOnly", description: "Configure disabled and readOnly.", Component: MentionsReadonly },
  { file: "placement", title: "Placement", description: "Change the suggestions placement.", Component: MentionsPlacement },
  { file: "popupRender", title: "Customize Popup", description: "Customize the dropdown menu rendering via popupRender.", Component: MentionsPopupRender },
  { file: "allowClear", title: "With clear icon", description: "Customize clear button.", Component: MentionsAllowClear },
  { file: "autoSize", title: "autoSize", description: "Height autoSize.", Component: MentionsAutoSize },
  { file: "status", title: "Status", description: "Add status to Mentions with status, which could be error or warning.", Component: MentionsStatus },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Mentions by passing objects/functions through classNames and styles. For example, set the textarea to be resizable.", Component: MentionsStyleClass },
];

export function MentionsShowcase() {
  return <Showcase section="data-entry" component="mentions" demos={demos} sources={sources} cols={2} />;
}
