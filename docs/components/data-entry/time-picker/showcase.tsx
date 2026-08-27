'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import TimePickerBasic from './basic';
import TimePickerValue from './value';
import TimePickerSize from './size';
import TimePickerNeedConfirm from './need-confirm';
import TimePickerDisabled from './disabled';
import TimePickerHideColumn from './hide-column';
import TimePickerIntervalOptions from './interval-options';
import TimePickerAddon from './addon';
import TimePicker12hours from './12hours';
import TimePickerChangeOnScroll from './change-on-scroll';
import TimePickerRangePicker from './range-picker';
import TimePickerVariant from './variant';
import TimePickerStatus from './status';
import TimePickerSuffix from './suffix';
import TimePickerStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "Click TimePicker, and then we could select or input a time in panel.", Component: TimePickerBasic },
  { file: "value", title: "Under Control", description: "value and onChange should be used together,", Component: TimePickerValue },
  { file: "size", title: "Three Sizes", description: "The input box comes in three sizes: large, medium and small. Large is used in the form, while the medium size is the default.", Component: TimePickerSize },
  { file: "need-confirm", title: "Need Confirm", description: "TimePicker will automatically determine whether to show a confirm button according to the picker property. You can also set the needConfirm property to determine whether to show a confirm button. When needConfirm is set, the user must click the confirm button to complete the selection. Otherwise, the selection will be submitted when the picker loses focus or select a time.", Component: TimePickerNeedConfirm },
  { file: "disabled", title: "disabled", description: "A disabled state of the TimePicker.", Component: TimePickerDisabled },
  { file: "hide-column", title: "Hour and minute", description: "While part of format is omitted, the corresponding column in panel will disappear, too.", Component: TimePickerHideColumn },
  { file: "interval-options", title: "interval option", description: "Show stepped options by hourStep minuteStep secondStep.", Component: TimePickerIntervalOptions },
  { file: "addon", title: "Addon", description: "Render addon contents to time picker panel's bottom.", Component: TimePickerAddon },
  { file: "12hours", title: "12 hours", description: "TimePicker of 12 hours format, with default format h:mm:ss a.", Component: TimePicker12hours },
  { file: "change-on-scroll", title: "Change on scroll", description: "Use changeOnScroll and needConfirm to change the value when scrolling.", Component: TimePickerChangeOnScroll },
  { file: "range-picker", title: "Time Range Picker", description: "Use time range picker with TimePicker.RangePicker.", Component: TimePickerRangePicker },
  { file: "variant", title: "Variants", description: "Variants of TimePicker, there are four variants: outlined filled borderless and underlined.", Component: TimePickerVariant },
  { file: "status", title: "Status", description: "Add status to TimePicker with status, which could be error or warning.", Component: TimePickerStatus },
  { file: "suffix", title: "Prefix and Suffix", description: "Custom prefix and suffixIcon.", Component: TimePickerSuffix },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of TimePicker by passing objects/functions through classNames and styles.", Component: TimePickerStyleClass },
];

export function TimePickerShowcase() {
  return <Showcase section="data-entry" component="time-picker" demos={demos} sources={sources} cols={2} />;
}
