import { createContext } from 'react';

/** Prevent transient hover UI from intercepting an active drag's cancellation keys. */
export const DragActiveContext = createContext(false);
