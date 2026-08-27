'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import UploadBasic from './basic';
import UploadAvatar from './avatar';
import UploadDefaultFileList from './defaultFileList';
import UploadPictureCard from './picture-card';
import UploadPictureCircle from './picture-circle';
import UploadFileList from './fileList';
import UploadDrag from './drag';
import UploadPaste from './paste';
import UploadDirectory from './directory';
import UploadUploadManually from './upload-manually';
import UploadUploadPngOnly from './upload-png-only';
import UploadPictureStyle from './picture-style';
import UploadPreviewFile from './preview-file';
import UploadMaxCount from './max-count';
import UploadTransformFile from './transform-file';
import UploadObjectStorage from './upload-with-aliyun-oss';
import UploadUploadCustomActionIcon from './upload-custom-action-icon';
import UploadDragSorting from './drag-sorting';
import UploadCropImage from './crop-image';
import UploadCustomizeProgressBar from './customize-progress-bar';
import UploadStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Upload by clicking", description: "Classic mode. File selection dialog pops up when upload button is clicked.", Component: UploadBasic },
  { file: "avatar", title: "Avatar", description: "Click to upload user's avatar, and validate size and format of picture with beforeUpload. > The return value of function beforeUpload can be a Promise to check asynchronously. demo", Component: UploadAvatar },
  { file: "defaultFileList", title: "Default Files", description: "Use defaultFileList for uploaded files when page init.", Component: UploadDefaultFileList },
  { file: "picture-card", title: "Pictures Wall", description: "After users upload picture, the thumbnail will be shown in list. The upload button will disappear when count meets limitation.", Component: UploadPictureCard },
  { file: "picture-circle", title: "Pictures with picture-circle type", description: "Alternative display for picture-card.", Component: UploadPictureCircle },
  { file: "fileList", title: "Complete control over file list", description: "You can gain full control over filelist by configuring fileList. You can accomplish all kinds of customized functions. The following shows two circumstances: 1. limit the number of uploaded files. 2. read from response and show file link.", Component: UploadFileList },
  { file: "drag", title: "Drag and Drop", description: "You can drag files to a specific area, to upload. Alternatively, you can also upload by selecting. We can upload several files at once in modern browsers by giving the input the multiple attribute.", Component: UploadDrag },
  { file: "paste", title: "Paste", description: "Copy the file and paste it anywhere on the page to upload.", Component: UploadPaste },
  { file: "directory", title: "Upload directory", description: "You can select and upload a whole directory. Can still select files when uploading a folder in Safari?", Component: UploadDirectory },
  { file: "upload-manually", title: "Upload manually", description: "Upload files manually after beforeUpload returns false.", Component: UploadUploadManually },
  { file: "upload-png-only", title: "Upload png file only", description: "beforeUpload only prevent upload behavior when return false or reject promise, the prevented file would still show in file list. Here is the example you can keep prevented files out of list by return UPLOAD.LIST_IGNORE.", Component: UploadUploadPngOnly },
  { file: "picture-style", title: "Pictures with list style", description: "If uploaded file is a picture, the thumbnail can be shown. IE8/9 do not support local thumbnail show. Please use thumbUrl instead.", Component: UploadPictureStyle },
  { file: "preview-file", title: "Customize preview file", description: "Customize local preview. Can handle with non-image format files such as video.", Component: UploadPreviewFile },
  { file: "max-count", title: "Max Count", description: "Limit files with maxCount. Will replace current one when maxCount is 1.", Component: UploadMaxCount },
  { file: "transform-file", title: "Transform file before request", description: "Use beforeUpload for transform file before request such as add a watermark.", Component: UploadTransformFile },
  { file: "upload-with-aliyun-oss", title: "Object storage", description: "Upload straight to an object store with a signed policy.", Component: UploadObjectStorage },
  { file: "upload-custom-action-icon", title: "Custom action icon and extra info", description: "Use showUploadList for custom action icons and extra information of files.", Component: UploadUploadCustomActionIcon },
  { file: "drag-sorting", title: "Drag sorting of uploadList", description: "By using itemRender, we can integrate upload with dnd-kit to implement drag sorting of uploadList.", Component: UploadDragSorting },
  { file: "crop-image", title: "Crop image before uploading", description: "Crop an image before uploading it.", Component: UploadCropImage },
  { file: "customize-progress-bar", title: "Customize Progress Bar", description: "Use progress for customize progress bar.", Component: UploadCustomizeProgressBar },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Upload components by passing objects/functions through classNames and styles.", Component: UploadStyleClass },
];

export function UploadShowcase() {
  return <Showcase section="data-entry" component="upload" demos={demos} sources={sources} cols={2} />;
}
