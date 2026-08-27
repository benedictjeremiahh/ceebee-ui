'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import RateBasic from './basic';
import RateSize from './size';
import RateHalf from './half';
import RateText from './text';
import RateDisabled from './disabled';
import RateClear from './clear';
import RateCharacter from './character';
import RateCharacterFunction from './character-function';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "The simplest usage.", Component: RateBasic },
  { file: "size", title: "Sizes", description: "Three sizes.", Component: RateSize },
  { file: "half", title: "Half star", description: "Support select half star.", Component: RateHalf },
  { file: "text", title: "Show copywriting", description: "Add copywriting in rate components.", Component: RateText },
  { file: "disabled", title: "Read only", description: "Read only, can't use mouse to interact.", Component: RateDisabled },
  { file: "clear", title: "Clear star", description: "Allow clearing the rating when clicking the same star again.", Component: RateClear },
  { file: "character", title: "Other Character", description: "Replace the default star to other character like alphabet, digit, iconfont or even Chinese word.", Component: RateCharacter },
  { file: "character-function", title: "Customize character", description: "Can customize each character using (RateProps) => ReactNode.", Component: RateCharacterFunction },
];

export function RateShowcase() {
  return <Showcase section="data-entry" component="rate" demos={demos} sources={sources} cols={2} />;
}
