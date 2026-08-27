'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import QrCodeBase from './base';
import QrCodeIcon from './icon';
import QrCodeStatus from './status';
import QrCodeCustomStatusRender from './customStatusRender';
import QrCodeType from './type';
import QrCodeCustomSize from './customSize';
import QrCodeCustomColor from './customColor';
import QrCodeDownload from './download';
import QrCodeErrorlevel from './errorlevel';
import QrCodePopover from './Popover';
import QrCodeStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "base", title: "base", description: "Basic Usage.", Component: QrCodeBase },
  { file: "icon", title: "With Icon", description: "QRCode with Icon.", Component: QrCodeIcon },
  { file: "status", title: "other status", description: "The status can be controlled by the value status, four values \u200b\u200bof active, expired, loading, scanned are provided.", Component: QrCodeStatus },
  { file: "customStatusRender", title: "custom status render", description: "You can control the rendering logic of the QR code in different states through the value of statusRender.", Component: QrCodeCustomStatusRender },
  { file: "type", title: "Custom Render Type", description: "Customize the rendering results by type, provide options canvas and svg.", Component: QrCodeType },
  { file: "customSize", title: "Custom Size", description: "Custom Size.", Component: QrCodeCustomSize },
  { file: "customColor", title: "Custom Color", description: "Custom Color.", Component: QrCodeCustomColor },
  { file: "download", title: "Download QRCode", description: "A way to download QRCode.", Component: QrCodeDownload },
  { file: "errorlevel", title: "Error Level", description: "set Error Level.", Component: QrCodeErrorlevel },
  { file: "Popover", title: "Advanced Usage", description: "With Popover.", Component: QrCodePopover },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of QRCode by passing objects/functions through classNames and styles.", Component: QrCodeStyleClass },
];

export function QRCodeShowcase() {
  return <Showcase section="data-display" component="qr-code" demos={demos} sources={sources} cols={2} />;
}
