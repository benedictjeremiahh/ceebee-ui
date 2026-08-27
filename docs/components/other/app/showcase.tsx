'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import AppBasic from './basic';
import AppConfig from './config';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "Get instance for message, notification, modal.", Component: AppBasic },
  { file: "config", title: "Hooks config", description: "Config for message, notification.", Component: AppConfig },
];

export function AppShowcase() {
  return <Showcase section="other" component="app" demos={demos} sources={sources} cols={2} />;
}
