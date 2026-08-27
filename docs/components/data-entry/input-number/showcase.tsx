'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import InputNumberBasic from './basic';
import InputNumberSize from './size';
import InputNumberDisabled from './disabled';
import InputNumberDigit from './digit';
import InputNumberFormatter from './formatter';
import InputNumberKeyboard from './keyboard';
import InputNumberChangeOnWheel from './change-on-wheel';
import InputNumberVariant from './variant';
import InputNumberSpinner from './spinner';
import InputNumberOutOfRange from './out-of-range';
import InputNumberPresuffix from './presuffix';
import InputNumberStatus from './status';
import InputNumberFocus from './focus';
import InputNumberStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "Numeric-only input box.", Component: InputNumberBasic },
  { file: "size", title: "Sizes", description: "There are three sizes available to a numeric input box. By default, the size is 32px. The two additional sizes are large and small which means 40px and 24px, respectively.", Component: InputNumberSize },
  { file: "disabled", title: "Disabled", description: "Click the button to toggle between available and disabled states.", Component: InputNumberDisabled },
  { file: "digit", title: "High precision decimals", description: "Use stringMode to support high precision decimals support. onChange will return string value instead. You need polyfill of BigInt if browser not support.", Component: InputNumberDigit },
  { file: "formatter", title: "Formatter", description: "Display value within it's situation with formatter, and we usually use parser at the same time. A currency wrapper is the usual pairing for it.", Component: InputNumberFormatter },
  { file: "keyboard", title: "Keyboard", description: "Control keyboard behavior by keyboard.", Component: InputNumberKeyboard },
  { file: "change-on-wheel", title: "Wheel", description: "Control with mouse wheel.", Component: InputNumberChangeOnWheel },
  { file: "variant", title: "Variants", description: "Variants of InputNumber, there are four variants: outlined filled borderless and underlined.", Component: InputNumberVariant },
  { file: "spinner", title: "Spinner", description: "Digit spinner.", Component: InputNumberSpinner },
  { file: "out-of-range", title: "Out of range", description: "Show warning style when value is out of range by control.", Component: InputNumberOutOfRange },
  { file: "presuffix", title: "Prefix / Suffix", description: "Add a prefix or suffix inside input.", Component: InputNumberPresuffix },
  { file: "status", title: "Status", description: "Add status to InputNumber with status, which could be error or warning.", Component: InputNumberStatus },
  { file: "focus", title: "Focus", description: "Focus with additional option.", Component: InputNumberFocus },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of the InputNumber by passing objects/functions through classNames and styles.", Component: InputNumberStyleClass },
];

export function InputNumberShowcase() {
  return <Showcase section="data-entry" component="input-number" demos={demos} sources={sources} cols={2} />;
}
