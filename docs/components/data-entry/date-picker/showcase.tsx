'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import DatePickerBasic from './basic';
import DatePickerRangePicker from './range-picker';
import DatePickerMultiple from './multiple';
import DatePickerNeedConfirm from './needConfirm';
import DatePickerSwitchable from './switchable';
import DatePickerFormat from './format';
import DatePickerTime from './time';
import DatePickerMask from './mask';
import DatePickerDateRange from './date-range';
import DatePickerDisabled from './disabled';
import DatePickerDisabledDate from './disabled-date';
import DatePickerAllowEmpty from './allow-empty';
import DatePickerSelectInRange from './select-in-range';
import DatePickerPresetRanges from './preset-ranges';
import DatePickerExtraFooter from './extra-footer';
import DatePickerSize from './size';
import DatePickerCellRender from './cell-render';
import DatePickerComponents from './components';
import DatePickerExternalPanel from './external-panel';
import DatePickerBuddhistEra from './buddhist-era';
import DatePickerStatus from './status';
import DatePickerVariant from './variant';
import DatePickerStyleClass from './style-class';
import DatePickerPlacement from './placement';
import DatePickerSuffix from './suffix';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "Basic use case. Users can select or input a date in a panel.", Component: DatePickerBasic },
  { file: "range-picker", title: "Range Picker", description: "Set range picker type by picker prop.", Component: DatePickerRangePicker },
  { file: "multiple", title: "Multiple", description: "Multiple selections. Does not support showTime and picker=\"time\".", Component: DatePickerMultiple },
  { file: "needConfirm", title: "Need Confirm", description: "DatePicker will automatically determine whether to show a confirm button according to the picker property. You can also set the needConfirm property to determine whether to show a confirm button. When needConfirm is set, the user must click the confirm button to complete the selection. Otherwise, the selection will be submitted when the picker loses focus or selects a date.", Component: DatePickerNeedConfirm },
  { file: "switchable", title: "Switchable picker", description: "Switch in different types of pickers by Select.", Component: DatePickerSwitchable },
  { file: "format", title: "Date Format", description: "We can set the date format by format. When format is an array, the input box can be entered in any of the valid formats of the array.", Component: DatePickerFormat },
  { file: "time", title: "Choose Time", description: "This property provides an additional time selection. When showTime is an Object, its properties will be passed on to the built-in TimePicker.", Component: DatePickerTime },
  { file: "mask", title: "Mask Format", description: "Align the date format. Switch the selection by arrow keys. Will try to align the date to the last valid date when blur.", Component: DatePickerMask },
  { file: "date-range", title: "Limit Date Range", description: "Limit the range of available dates by using minDate and maxDate.", Component: DatePickerDateRange },
  { file: "disabled", title: "Disabled", description: "A disabled state of the DatePicker. You can also set as array to disable one of input.", Component: DatePickerDisabled },
  { file: "disabled-date", title: "Disabled Date & Time", description: "Disable specific dates and times by using disabledDate and disabledTime respectively, and disabledTime only works with showTime.", Component: DatePickerDisabledDate },
  { file: "allow-empty", title: "Allow Empty", description: "Allow empty for the RangePicker. It's useful when you need to keep the \"to date\".", Component: DatePickerAllowEmpty },
  { file: "select-in-range", title: "Select range dates", description: "Using info.from of disabledDate to limit the dynamic date range selection.", Component: DatePickerSelectInRange },
  { file: "preset-ranges", title: "Preset Ranges", description: "We can set preset ranges to RangePicker to improve user experience. Since 5.8.0, preset value supports callback function.", Component: DatePickerPresetRanges },
  { file: "extra-footer", title: "Extra Footer", description: "Render extra footer in panel for customized requirements.", Component: DatePickerExtraFooter },
  { file: "size", title: "Three Sizes", description: "The input box comes in three sizes: small, medium and large. The medium size will be used if size is omitted.", Component: DatePickerSize },
  { file: "cell-render", title: "Customized Cell Rendering", description: "We can customize the rendering of the cells in the calendar by providing a cellRender function to DatePicker.", Component: DatePickerCellRender },
  { file: "components", title: "Customize Panel", description: "Replace panel with components.", Component: DatePickerComponents },
  { file: "external-panel", title: "External use panel", description: "Custom menu, external selection panel.", Component: DatePickerExternalPanel },
  { file: "buddhist-era", title: "Buddhist Era", description: "Use locale to support special calendar format.", Component: DatePickerBuddhistEra },
  { file: "status", title: "Status", description: "Add status to DatePicker with status, which could be error or warning.", Component: DatePickerStatus },
  { file: "variant", title: "Variants", description: "Variants of DatePicker, there are four variants: outlined filled borderless and underlined.", Component: DatePickerVariant },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of DatePicker by passing objects/functions through classNames and styles.", Component: DatePickerStyleClass },
  { file: "placement", title: "Placement", description: "You can manually specify the position of the popup via placement.", Component: DatePickerPlacement },
  { file: "suffix", title: "Prefix and Suffix", description: "Custom prefix and suffixIcon.", Component: DatePickerSuffix },
];

export function DatePickerShowcase() {
  return <Showcase section="data-entry" component="date-picker" demos={demos} sources={sources} cols={2} />;
}
