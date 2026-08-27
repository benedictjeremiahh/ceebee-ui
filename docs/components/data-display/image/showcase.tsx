'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import ImageBasic from './basic';
import ImagePlaceholder from './placeholder';
import ImageFallback from './fallback';
import ImagePreviewGroup from './preview-group';
import ImagePreviewGroupVisible from './preview-group-visible';
import ImagePreviewSrc from './previewSrc';
import ImageControlledPreview from './controlled-preview';
import ImageToolbarRender from './toolbarRender';
import ImageImageRender from './imageRender';
import ImageMask from './mask';
import ImageStyleClass from './style-class';
import ImageNested from './nested';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic Usage", description: "Click the image to zoom in.", Component: ImageBasic },
  { file: "placeholder", title: "Progressive Loading", description: "Set placeholder via placeholder prop. When placeholder is { progress: true }, it shows a watercolor ink loading animation; when set to { progress: { percent: number } }, it shows a progress bar; you can also pass a custom React node as placeholder.", Component: ImagePlaceholder },
  { file: "fallback", title: "Fault tolerant", description: "Load failed to display image placeholder.", Component: ImageFallback },
  { file: "preview-group", title: "Multiple image preview", description: "Click the left and right switch buttons to preview multiple images.", Component: ImagePreviewGroup },
  { file: "preview-group-visible", title: "Preview from one image", description: "Preview a collection from one image.", Component: ImagePreviewGroupVisible },
  { file: "previewSrc", title: "Custom preview image", description: "You can set different preview image.", Component: ImagePreviewSrc },
  { file: "controlled-preview", title: "Controlled Preview", description: "You can make preview controlled.", Component: ImageControlledPreview },
  { file: "toolbarRender", title: "Custom toolbar render", description: "You can customize the toolbar and add a button for downloading the original image or downloading the flipped and rotated image.", Component: ImageToolbarRender },
  { file: "imageRender", title: "Custom preview render", description: "You can customize the preview content.", Component: ImageImageRender },
  { file: "mask", title: "preview mask", description: "mask effect.", Component: ImageMask },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Image by passing objects/functions through classNames and styles.", Component: ImageStyleClass },
  { file: "nested", title: "nested", description: "Nested in the modal", Component: ImageNested },
];

export function ImageShowcase() {
  return <Showcase section="data-display" component="image" demos={demos} sources={sources} cols={2} />;
}
