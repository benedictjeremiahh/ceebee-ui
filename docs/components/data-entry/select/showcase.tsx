'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import SelectBasic from './basic';
import SelectSearch from './search';
import SelectSearchFilterOption from './search-filter-option';
import SelectSearchMultiField from './search-multi-field';
import SelectMultiple from './multiple';
import SelectSize from './size';
import SelectOptionRender from './option-render';
import SelectSearchSort from './search-sort';
import SelectTags from './tags';
import SelectOptgroup from './optgroup';
import SelectCoordinate from './coordinate';
import SelectLabelInValue from './label-in-value';
import SelectAutomaticTokenization from './automatic-tokenization';
import SelectCustomTokenization from './custom-tokenization';
import SelectSelectUsers from './select-users';
import SelectSuffix from './suffix';
import SelectCustomDropdownMenu from './custom-dropdown-menu';
import SelectHideSelected from './hide-selected';
import SelectVariant from './variant';
import SelectCustomTagRender from './custom-tag-render';
import SelectCustomLabelRender from './custom-label-render';
import SelectResponsive from './responsive';
import SelectBigData from './big-data';
import SelectStatus from './status';
import SelectPlacement from './placement';
import SelectMaxCount from './maxCount';
import SelectStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic Usage", description: "Basic Usage.", Component: SelectBasic },
  { file: "search", title: "Select with search field", description: "Search the options while expanded.", Component: SelectSearch },
  { file: "search-filter-option", title: "Custom Search", description: "Customize search using filterOption.", Component: SelectSearchFilterOption },
  { file: "search-multi-field", title: "Multi field search", description: "Use optionFilterProp for multi-field search.", Component: SelectSearchMultiField },
  { file: "multiple", title: "multiple selection", description: "Multiple selection, selecting from existing items.", Component: SelectMultiple },
  { file: "size", title: "Sizes", description: "The height of the input field for the select defaults to 32px. If size is set to large, the height will be 40px, and if set to small, 24px.", Component: SelectSize },
  { file: "option-render", title: "Custom dropdown options", description: "Use optionRender to customize the rendering dropdown options", Component: SelectOptionRender },
  { file: "search-sort", title: "Search with sort", description: "Search the options with sorting.", Component: SelectSearchSort },
  { file: "tags", title: "Tags", description: "Allow user to select tags from list or input custom tag.", Component: SelectTags },
  { file: "optgroup", title: "Option Group", description: "Using OptGroup to group the options.", Component: SelectOptgroup },
  { file: "coordinate", title: "coordinate", description: "Coordinating the selection of provinces and cities is a common use case and demonstrates how selection can be coordinated. Cascader component is strongly recommended in this case.", Component: SelectCoordinate },
  { file: "label-in-value", title: "Get value of selected item", description: "As a default behavior, the onChange callback can only get the value of the selected item. The labelInValue prop can be used to get the label property of the selected item. The label of the selected item will be packed as an object for passing to the onChange callback.", Component: SelectLabelInValue },
  { file: "automatic-tokenization", title: "Automatic tokenization", description: "Try to copy Lucy,Jack and paste to the input. Only available in tags and multiple mode.", Component: SelectAutomaticTokenization },
  { file: "custom-tokenization", title: "Custom tokenization", description: "Customize tokenization logic to split input with your own rules.", Component: SelectCustomTokenization },
  { file: "select-users", title: "Search and Select Users", description: "A complete multiple select sample with remote search, debounce fetch, ajax callback order flow, and loading state.", Component: SelectSelectUsers },
  { file: "suffix", title: "Prefix and Suffix", description: "Custom prefix and suffixIcon.", Component: SelectSuffix },
  { file: "custom-dropdown-menu", title: "Custom dropdown", description: "Customize the dropdown menu via popupRender. If you want to close the dropdown after clicking the custom content, you need to control open prop, here is an codesandbox.", Component: SelectCustomDropdownMenu },
  { file: "hide-selected", title: "Hide Already Selected", description: "Hide already selected options in the dropdown.", Component: SelectHideSelected },
  { file: "variant", title: "Variants", description: "Variants of Select, there are four variants: outlined filled borderless and underlined.", Component: SelectVariant },
  { file: "custom-tag-render", title: "Custom Tag Render", description: "Allows for custom rendering of tags.", Component: SelectCustomTagRender },
  { file: "custom-label-render", title: "Custom Selected Label Render", description: "Allows custom rendering of the currently selected label, which can be used for value backfill but the corresponding option is missing and does not want to directly render the value.", Component: SelectCustomLabelRender },
  { file: "responsive", title: "Responsive maxTagCount", description: "Auto collapse to tag with responsive case. Not recommend use in large form case since responsive calculation has a perf cost.", Component: SelectResponsive },
  { file: "big-data", title: "Big Data", description: "Select use virtual scroll which get better performance, turn off it by setting virtual={false}.", Component: SelectBigData },
  { file: "status", title: "Status", description: "Add status to Select with status, which could be error or warning.", Component: SelectStatus },
  { file: "placement", title: "Placement", description: "You can manually specify the position of the popup via placement.", Component: SelectPlacement },
  { file: "maxCount", title: "Max Count", description: "You can set the maxCount prop to control the max number of items can be selected. When the limit is exceeded, the options will become disabled.", Component: SelectMaxCount },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Select by passing objects/functions through classNames and styles.", Component: SelectStyleClass },
];

export function SelectShowcase() {
  return <Showcase section="data-entry" component="select" demos={demos} sources={sources} cols={2} />;
}
