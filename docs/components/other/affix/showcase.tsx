'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import AffixBasic from './basic';
import AffixOnChange from './on-change';
import AffixTarget from './target';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "The simplest usage.", Component: AffixBasic },
  { file: "on-change", title: "Callback", description: "Callback with affixed state.", Component: AffixOnChange },
  { file: "target", title: "Container to scroll.", description: "Set a target for 'Affix', which is listen to scroll event of target element (default is window).", Component: AffixTarget },
];

export function AffixShowcase() {
  return <Showcase section="other" component="affix" demos={demos} sources={sources} cols={2} />;
}
