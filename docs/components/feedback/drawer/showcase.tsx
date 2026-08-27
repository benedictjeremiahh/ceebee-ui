'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import DrawerBasicRight from './basic-right';
import DrawerPlacement from './placement';
import DrawerResizable from './resizable';
import DrawerLoading from './loading';
import DrawerExtra from './extra';
import DrawerRenderInCurrent from './render-in-current';
import DrawerFormInDrawer from './form-in-drawer';
import DrawerUserProfile from './user-profile';
import DrawerMultiLevelDrawer from './multi-level-drawer';
import DrawerSize from './size';
import DrawerMask from './mask';
import DrawerClosablePlacement from './closable-placement';
import DrawerStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic-right", title: "Basic", description: "Basic drawer.", Component: DrawerBasicRight },
  { file: "placement", title: "Custom Placement", description: "The Drawer can appear from any edge of the screen.", Component: DrawerPlacement },
  { file: "resizable", title: "Resizable", description: "Resizable drawer that allows users to adjust the drawer's width or height by dragging the edge.", Component: DrawerResizable },
  { file: "loading", title: "Loading", description: "Set the loading status of Drawer.", Component: DrawerLoading },
  { file: "extra", title: "Extra Actions", description: "Extra actions should be placed at corner of drawer in Ceebee UI, you can use extra prop for that.", Component: DrawerExtra },
  { file: "render-in-current", title: "Render in current dom", description: "Render in current dom. custom container, check getContainer. > Note: style and className props are moved to Drawer panel in v5 which is aligned with Modal component. Original style and className props are replaced by rootStyle and rootClassName. > When getContainer returns a DOM node, you need to manually set rootStyle to { position: 'absolute' }, see #41951.", Component: DrawerRenderInCurrent },
  { file: "form-in-drawer", title: "Submit form in drawer", description: "Use a form in Drawer with a submit button.", Component: DrawerFormInDrawer },
  { file: "user-profile", title: "Preview drawer", description: "Use Drawer to quickly preview details of an object, such as those in a list.", Component: DrawerUserProfile },
  { file: "multi-level-drawer", title: "Multi-level drawer", description: "Open a new drawer on top of an existing drawer to handle multi branch tasks.", Component: DrawerMultiLevelDrawer },
  { file: "size", title: "Preset size", description: "The default width (or height) of Drawer is 378px, and there is a preset large size 736px.", Component: DrawerSize },
  { file: "mask", title: "mask", description: "mask effect.", Component: DrawerMask },
  { file: "closable-placement", title: "Closable placement", description: "Drawer with closable placement, customize the close placement to the end, defaults to start.", Component: DrawerClosablePlacement },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Drawer by passing objects or functions through classNames and styles.", Component: DrawerStyleClass },
];

export function DrawerShowcase() {
  return <Showcase section="feedback" component="drawer" demos={demos} sources={sources} cols={2} />;
}
