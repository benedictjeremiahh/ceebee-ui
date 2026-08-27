'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import SwitchBasic from './basic';
import SwitchDisabled from './disabled';
import SwitchText from './text';
import SwitchSize from './size';
import SwitchLoading from './loading';
import SwitchStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: 'basic', title: 'Basic', description: 'The most basic usage.', Component: SwitchBasic },
  { file: 'disabled', title: 'Disabled', description: 'Disabled state of Switch.', Component: SwitchDisabled },
  { file: 'text', title: 'Text & icon', description: 'With text and icon.', Component: SwitchText },
  { file: 'size', title: 'Two sizes', description: 'size="small" represents a small sized switch.', Component: SwitchSize },
  { file: 'loading', title: 'Loading', description: 'Mark a pending state of switch.', Component: SwitchLoading },
  { file: 'style-class', title: 'Custom semantic dom styling', description: 'You can customize the semantic dom style of Switch by passing objects/functions through classNames and styles.', Component: SwitchStyleClass },
];

export function SwitchShowcase() {
  return <Showcase section="data-entry" component="switch" demos={demos} sources={sources} cols={2} />;
}
