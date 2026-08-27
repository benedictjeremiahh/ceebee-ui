'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import ModalBasic from './basic';
import ModalAsync from './async';
import ModalFooter from './footer';
import ModalMask from './mask';
import ModalLoading from './loading';
import ModalFooterRender from './footer-render';
import ModalHooks from './hooks';
import ModalLocale from './locale';
import ModalManual from './manual';
import ModalPosition from './position';
import ModalButtonProps from './button-props';
import ModalModalRender from './modal-render';
import ModalWidth from './width';
import ModalStaticInfo from './static-info';
import ModalConfirm from './confirm';
import ModalConfirmRouter from './confirm-router';
import ModalStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic", description: "Basic modal.", Component: ModalBasic },
  { file: "async", title: "Asynchronously close", description: "Asynchronously close a modal dialog when the OK button is pressed. For example, you can use this pattern when you submit a form.", Component: ModalAsync },
  { file: "footer", title: "Customized Footer", description: "A more complex example which define a customized footer button bar. The dialog will change to loading state after clicking the submit button, and when the loading is done, the modal dialog will be closed. You could set footer to null if you don't need default footer buttons.", Component: ModalFooter },
  { file: "mask", title: "mask", description: "mask effect.", Component: ModalMask },
  { file: "loading", title: "Loading", description: "Set the loading status of Modal.", Component: ModalLoading },
  { file: "footer-render", title: "Customized Footer render function", description: "Customize the footer rendering function to support extensions on top of the original.", Component: ModalFooterRender },
  { file: "hooks", title: "Use hooks to get context", description: "Use Modal.useModal to get contextHolder with context accessible issue. Only hooks method support Promise await operation.", Component: ModalHooks },
  { file: "locale", title: "Internationalization", description: "To customize the text of the buttons, you need to set okText and cancelText props.", Component: ModalLocale },
  { file: "manual", title: "Manual to update destroy", description: "Manually updating and destroying a modal through instance.", Component: ModalManual },
  { file: "position", title: "To customize the position of modal", description: "You can use centered,style.top or other styles to set position of modal dialog.", Component: ModalPosition },
  { file: "button-props", title: "Customize footer buttons props", description: "Passing okButtonProps and cancelButtonProps will customize the OK button and cancel button props.", Component: ModalButtonProps },
  { file: "modal-render", title: "Custom modal content render", description: "Custom modal content render. use react-draggable implements draggable.", Component: ModalModalRender },
  { file: "width", title: "To customize the width of modal", description: "Use width to set the width of the modal dialog.", Component: ModalWidth },
  { file: "static-info", title: "Static Method", description: "Static methods cannot consume Context provided by ConfigProvider. When enable layer, they may also cause style errors. Please use hooks version or App provided instance first.", Component: ModalStaticInfo },
  { file: "confirm", title: "Static confirmation", description: "Use confirm() to show a confirmation modal dialog. Let onCancel/onOk function return a promise object to delay closing the dialog.", Component: ModalConfirm },
  { file: "confirm-router", title: "destroy confirmation modal dialog", description: "Modal.destroyAll() will destroy all confirmation modal dialogs. Usually, you can use it in router change event to destroy confirm modal dialog automatically.", Component: ModalConfirmRouter },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Modal by passing objects or functions through classNames and styles.", Component: ModalStyleClass },
];

export function ModalShowcase() {
  return <Showcase section="feedback" component="modal" demos={demos} sources={sources} cols={2} />;
}
