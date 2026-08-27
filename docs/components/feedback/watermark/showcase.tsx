'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import WatermarkBasic from './basic';
import WatermarkMultiLine from './multi-line';
import WatermarkImage from './image';
import WatermarkCustom from './custom';
import WatermarkPortal from './portal';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "The most basic usage.", Component: WatermarkBasic },
  { file: "multi-line", title: "Multi-line watermark", description: "Use content to set an array of strings and WatermarkText to specify multi-line text watermark content with custom font styles per line.", Component: WatermarkMultiLine },
  { file: "image", title: "Image watermark", description: "Specify the image address via image. To ensure that the image is high definition and not stretched, set the width and height, and upload at least twice the width and height of the logo image address.", Component: WatermarkImage },
  { file: "custom", title: "Custom configuration", description: "Preview the watermark effect by configuring custom parameters.", Component: WatermarkCustom },
  { file: "portal", title: "Modal or Drawer", description: "Use in Modal and Drawer.", Component: WatermarkPortal },
];

export function WatermarkShowcase() {
  return <Showcase section="feedback" component="watermark" demos={demos} sources={sources} />;
}
