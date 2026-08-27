'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import InputBasic from './basic';
import InputSize from './size';
import InputVariant from './variant';
import InputCompactStyle from './compact-style';
import InputSearchInput from './search-input';
import InputSearchInputLoading from './search-input-loading';
import InputTextarea from './textarea';
import InputAutosizeTextarea from './autosize-textarea';
import InputOtp from './otp';
import InputTooltip from './tooltip';
import InputPresuffix from './presuffix';
import InputPasswordInput from './password-input';
import InputAllowClear from './allowClear';
import InputShowCount from './show-count';
import InputAdvanceCount from './advance-count';
import InputStatus from './status';
import InputFocus from './focus';
import InputStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic usage", description: "Basic usage example.", Component: InputBasic },
  { file: "size", title: "Three sizes of Input", description: "There are three sizes of an Input box: large (40px), medium (32px) and small (24px).", Component: InputSize },
  { file: "variant", title: "Variants", description: "Variants of Input, there are four variants: outlined filled borderless and underlined.", Component: InputVariant },
  { file: "compact-style", title: "Compact Style", description: "Use Space.Compact create compact style, See the Space.Compact documentation for more.", Component: InputCompactStyle },
  { file: "search-input", title: "Search box", description: "Example of creating a search box by grouping a standard input with a search button.", Component: InputSearchInput },
  { file: "search-input-loading", title: "Search box with loading", description: "Search loading when onSearch.", Component: InputSearchInputLoading },
  { file: "textarea", title: "TextArea", description: "For multi-line input.", Component: InputTextarea },
  { file: "autosize-textarea", title: "Autosizing the height to fit the content", description: "autoSize prop for a textarea type of Input makes the height to automatically adjust based on the content. An option object can be provided to autoSize to specify the minimum and maximum number of lines the textarea will automatically adjust.", Component: InputAutosizeTextarea },
  { file: "otp", title: "OTP", description: "One time password input.", Component: InputOtp },
  { file: "tooltip", title: "Format Tooltip Input", description: "You can use the Input in conjunction with Tooltip component to create a Numeric Input, which can provide a good experience for extra-long content display.", Component: InputTooltip },
  { file: "presuffix", title: "prefix and suffix", description: "Add a prefix or suffix icons inside input. Note: The suffix prop for Input.Password is supported starting from version 5.27.0.", Component: InputPresuffix },
  { file: "password-input", title: "Password box", description: "Input type of password.", Component: InputPasswordInput },
  { file: "allowClear", title: "With clear icon", description: "Input box with the remove icon, click the icon to delete everything.", Component: InputAllowClear },
  { file: "show-count", title: "With character counting", description: "Show character counting.", Component: InputShowCount },
  { file: "advance-count", title: "= 5.10.0\">Custom count logic", description: "It is necessary to customize the counting ability in some scenarios (such as emoji length is counted as 1), which can be achieved through the count attribute. Use count.max attribute exceeds the limit of the native maxLength.", Component: InputAdvanceCount },
  { file: "status", title: "Status", description: "Add status to Input with status, which could be error or warning.", Component: InputStatus },
  { file: "focus", title: "Focus", description: "Focus with additional option.", Component: InputFocus },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Input by passing objects/functions through classNames and styles.", Component: InputStyleClass },
];

export function InputShowcase() {
  return <Showcase section="data-entry" component="input" demos={demos} sources={sources} cols={2} />;
}
