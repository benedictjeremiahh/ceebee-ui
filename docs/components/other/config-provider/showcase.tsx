'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import ConfigProviderLocale from './locale';
import ConfigProviderDirection from './direction';
import ConfigProviderSize from './size';
import ConfigProviderTheme from './theme';
import ConfigProviderWave from './wave';
import ConfigProviderHolderRender from './holderRender';

const demos: OfficialDemo[] = [
  { file: "locale", title: "Locale", description: "Components which need localization support are listed here, you can toggle the language in the demo.", Component: ConfigProviderLocale },
  { file: "direction", title: "Direction", description: "Components which support rtl direction are listed here, you can toggle the direction in the demo.", Component: ConfigProviderDirection },
  { file: "size", title: "Component size", description: "Config component default size.", Component: ConfigProviderSize },
  { file: "theme", title: "Theme", description: "Modify theme by theme prop.", Component: ConfigProviderTheme },
  { file: "wave", title: "Custom Wave", description: "Wave effect brings dynamic. Use component to determine which component use it. You can also use HappyProvider from @ant-design/happy-work-theme to implement dynamic wave effect.", Component: ConfigProviderWave },
  { file: "holderRender", title: "Static function", description: "Use holderRender to set the Provider for the static methods message,modal,notification.", Component: ConfigProviderHolderRender },
];

export function ConfigProviderShowcase() {
  return <Showcase section="other" component="config-provider" demos={demos} sources={sources} />;
}
