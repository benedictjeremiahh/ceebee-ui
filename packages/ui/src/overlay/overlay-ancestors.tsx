import { createContext, useContext, useMemo, type ReactNode } from 'react';

export type OverlayAncestor = 'drawer' | 'modal';

const OverlayAncestorContext = createContext<readonly OverlayAncestor[]>([]);

/**
 * The overlay call chain above the current component.
 *
 * A portal moves DOM nodes without moving their React context, so a Modal rendered by Drawer
 * content can still tell that it was opened from a Drawer. There are deliberately only two
 * ancestor kinds: stacking is decided from that call chain, not from a caller-supplied number.
 */
export function useOverlayAncestors(): readonly OverlayAncestor[] {
  return useContext(OverlayAncestorContext);
}

export function OverlayAncestorProvider({ ancestor, children }: { ancestor: OverlayAncestor; children: ReactNode }) {
  const ancestors = useOverlayAncestors();
  const value = useMemo(() => [...ancestors, ancestor], [ancestors, ancestor]);
  return <OverlayAncestorContext.Provider value={value}>{children}</OverlayAncestorContext.Provider>;
}
