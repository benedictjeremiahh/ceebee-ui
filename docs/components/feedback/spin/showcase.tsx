'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import SpinBasic from './basic';
import SpinSize from './size';
import SpinNested from './nested';
import SpinTip from './tip';
import SpinDelayAndDebounce from './delayAndDebounce';
import SpinCustomIndicator from './custom-indicator';
import SpinPercent from './percent';
import SpinStyleClass from './style-class';
import SpinFullscreen from './fullscreen';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic Usage", description: "A simple loading status.", Component: SpinBasic },
  { file: "size", title: "Size", description: "A small Spin is used for loading text, default sized Spin for loading a card-level block, and large Spin used for loading a **page**.", Component: SpinSize },
  { file: "nested", title: "Embedded mode", description: "Embedding content into Spin will set it into loading state.", Component: SpinNested },
  { file: "tip", title: "Customized description", description: "Customize the description text.", Component: SpinTip },
  { file: "delayAndDebounce", title: "Delay", description: "Specifies a delay for loading state. If spinning ends during delay, loading status won't appear.", Component: SpinDelayAndDebounce },
  { file: "custom-indicator", title: "Custom spinning indicator", description: "Use custom loading indicator.", Component: SpinCustomIndicator },
  { file: "percent", title: "Progress", description: "Show the progress. When percent=\"auto\" is set, an indeterminate progress will be displayed.", Component: SpinPercent },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Spin by passing objects/functions through classNames and styles.", Component: SpinStyleClass },
  { file: "fullscreen", title: "Fullscreen", description: "The fullscreen mode is perfect for creating page loaders. It adds a dimmed overlay with a centered spinner.", Component: SpinFullscreen },
];

export function SpinShowcase() {
  return <Showcase section="feedback" component="spin" demos={demos} sources={sources} cols={2} />;
}
