'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import CascaderBasic from './basic';
import CascaderDefaultValue from './default-value';
import CascaderCustomTrigger from './custom-trigger';
import CascaderHover from './hover';
import CascaderDisabledOption from './disabled-option';
import CascaderChangeOnSelect from './change-on-select';
import CascaderMultiple from './multiple';
import CascaderShowCheckedStrategy from './showCheckedStrategy';
import CascaderSize from './size';
import CascaderCustomRender from './custom-render';
import CascaderSearch from './search';
import CascaderLazy from './lazy';
import CascaderFieldsName from './fields-name';
import CascaderSuffix from './suffix';
import CascaderCustomDropdown from './custom-dropdown';
import CascaderPlacement from './placement';
import CascaderVariant from './variant';
import CascaderStatus from './status';
import CascaderStyleClass from './style-class';
import CascaderPanel from './panel';

const demos: OfficialDemo[] = [
  { file: 'basic', title: 'Basic', description: 'Cascade selection box for selecting province/city/district.', Component: CascaderBasic },
  { file: 'default-value', title: 'Default value', description: 'Specifies default value by an array.', Component: CascaderDefaultValue },
  { file: 'custom-trigger', title: 'Custom trigger', description: 'Separate trigger button and result.', Component: CascaderCustomTrigger },
  { file: 'hover', title: 'Hover', description: 'Hover to expand sub menu, click to select option.', Component: CascaderHover },
  { file: 'disabled-option', title: 'Disabled option', description: 'Disable option by specifying the disabled property in options.', Component: CascaderDisabledOption },
  { file: 'change-on-select', title: 'Change on select', description: 'Allows the selection of only parent options.', Component: CascaderChangeOnSelect },
  { file: 'multiple', title: 'Multiple', description: 'Select multiple options. Disable the checkbox by adding the disableCheckbox property and selecting a specific item. The style of the disable can be modified by the className.', Component: CascaderMultiple },
  { file: 'showCheckedStrategy', title: 'ShowCheckedStrategy', description: 'Shows a selected item in a box using showCheckedStrategy.', Component: CascaderShowCheckedStrategy },
  { file: 'size', title: 'Size', description: 'Cascade selection box of different sizes.', Component: CascaderSize },
  { file: 'custom-render', title: 'Custom render', description: 'For instance, add an external link after the selected value.', Component: CascaderCustomRender },
  { file: 'search', title: 'Search', description: "Search and select options directly. Cascader[showSearch] doesn't support search on server.", Component: CascaderSearch },
  { file: 'lazy', title: 'Load Options Lazily', description: 'Load options lazily with loadData. Note: loadData cannot work with showSearch.', Component: CascaderLazy },
  { file: 'fields-name', title: 'Custom Field Names', description: 'Custom field names.', Component: CascaderFieldsName },
  { file: 'suffix', title: 'Prefix and Suffix', description: 'Use prefix to customize the prefix content, use suffixIcon to customize the selection box suffix icon, and use expandIcon to customize the current item expand icon.', Component: CascaderSuffix },
  { file: 'custom-dropdown', title: 'Custom dropdown', description: 'Customize the dropdown menu via popupRender.', Component: CascaderCustomDropdown },
  { file: 'placement', title: 'Placement', description: 'You can manually specify the position of the popup via placement.', Component: CascaderPlacement },
  { file: 'variant', title: 'Variants', description: 'Variants of Cascader, there are four variants: outlined, filled, borderless and underlined.', Component: CascaderVariant },
  { file: 'status', title: 'Status', description: 'Add status to Cascader with status, which could be error or warning.', Component: CascaderStatus },
  { file: 'style-class', title: 'Custom semantic dom styling', description: 'You can customize the semantic dom style of Cascader by passing objects/functions through classNames and styles.', Component: CascaderStyleClass },
  { file: 'panel', title: 'Panel', description: 'Used for inline view case.', Component: CascaderPanel },
];

export function CascaderShowcase() {
  return <Showcase section="data-entry" component="cascader" demos={demos} sources={sources} cols={2} />;
}
