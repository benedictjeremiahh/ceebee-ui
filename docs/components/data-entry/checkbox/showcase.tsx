'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import CheckboxBasic from './basic';
import CheckboxDisabled from './disabled';
import CheckboxController from './controller';
import CheckboxGroup from './group';
import CheckboxCheckAll from './check-all';
import CheckboxLayout from './layout';
import CheckboxStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: 'basic', title: 'Basic', description: 'Basic usage of checkbox.', Component: CheckboxBasic },
  { file: 'disabled', title: 'Disabled', description: 'Disabled checkbox.', Component: CheckboxDisabled },
  { file: 'controller', title: 'Controlled Checkbox', description: 'Communicated with other components.', Component: CheckboxController },
  { file: 'group', title: 'Checkbox Group', description: 'Generate a group of checkboxes from an array.', Component: CheckboxGroup },
  { file: 'check-all', title: 'Check all', description: "The indeterminate property can help you to achieve a 'check all' effect.", Component: CheckboxCheckAll },
  { file: 'layout', title: 'Use with Grid', description: 'We can use Checkbox and Grid in Checkbox.Group, to implement complex layout.', Component: CheckboxLayout },
  { file: 'style-class', title: 'Custom semantic dom styling', description: 'You can customize the semantic dom style of Checkbox by passing objects/functions through classNames and styles.', Component: CheckboxStyleClass },
];

export function CheckboxShowcase() {
  return <Showcase section="data-entry" component="checkbox" demos={demos} sources={sources} cols={2} />;
}
