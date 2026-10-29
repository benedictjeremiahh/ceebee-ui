'use client';

import { useEffect } from 'react';

/** Width changes can move the anchor out of view; height-only keyboard changes keep the panel open. */
export function useCalendarResize(open: boolean, dismiss: () => void) {
  useEffect(() => {
    if (!open) return;
    const width = window.innerWidth;
    let dismissed = false;
    const onResize = () => {
      if (dismissed || window.innerWidth === width) return;
      dismissed = true;
      dismiss();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open, dismiss]);
}
