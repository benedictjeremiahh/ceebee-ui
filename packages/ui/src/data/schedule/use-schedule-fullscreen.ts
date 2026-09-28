'use client';
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { isolateSchedule } from './parts/isolate-schedule.js';

type FullscreenMode = 'inline' | 'native' | 'window';

/** Browser-owned fullscreen first; a same-mounted, isolated window view is the explicit fallback. */
export function useScheduleFullscreen(root: RefObject<HTMLDivElement | null>, enabled: boolean) {
  const [mode, setMode] = useState<FullscreenMode>('inline');
  const [available, setAvailable] = useState(false);
  const trigger = useRef<HTMLElement | null>(null);
  const pending = useRef(false);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    if (!enabled) setMode('inline');
    setAvailable(enabled && document.fullscreenEnabled === true && typeof root.current?.requestFullscreen === 'function');
    const element = root.current;
    const onChange = () => {
      if (document.fullscreenElement === element) setMode('native');
      else setMode((previous) => previous === 'native' ? 'inline' : previous);
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => {
      alive.current = false;
      document.removeEventListener('fullscreenchange', onChange);
      if (element && document.fullscreenElement === element) void document.exitFullscreen().catch(() => undefined);
    };
  }, [enabled, root]);

  useEffect(() => {
    if (mode !== 'window' || !root.current) return;
    const restore = isolateSchedule(root.current);
    root.current.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      if (event.target instanceof Element && event.target.closest('[role="dialog"]')) return;
      event.preventDefault();
      setMode('inline');
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      restore();
    };
  }, [mode, root]);

  useEffect(() => {
    if (mode === 'inline' && trigger.current) trigger.current.focus();
  }, [mode]);

  const toggle = useCallback(() => {
    if (!enabled || pending.current || !root.current) return;
    if (mode === 'window') { setMode('inline'); return; }
    if (mode === 'native') { void document.exitFullscreen().catch(() => undefined); return; }
    trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!available) { setMode('window'); return; }
    pending.current = true;
    void root.current.requestFullscreen().then(() => {
      if (alive.current && document.fullscreenElement === root.current) setMode('native');
    }).catch(() => {
      if (alive.current) setMode('window');
    }).finally(() => { pending.current = false; });
  }, [available, enabled, mode, root]);
  return { mode, available, toggle };
}
