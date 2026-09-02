'use client';

import { Button } from 'antd';
import { Maximize2, Minimize2, Minus, Plus, RotateCcw } from 'lucide-react';
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type WheelEvent,
} from 'react';
import { useMotionSettings } from '../../motion/motion-provider.js';
import { PanZoomCanvasSkeleton, type PanZoomCanvasSkeletonProps } from './pan-zoom-canvas.skeleton.js';

export interface PanZoomCanvasProps {
  label: string;
  children: ReactNode;
  hint?: string;
  zoomInLabel?: string;
  zoomOutLabel?: string;
  resetLabel?: string;
  zoomStatusLabel?: string;
  /* A canvas is usually laid out inside a page column that is narrower than the diagram it holds.
     Fullscreen hands it the whole viewport without the consumer building a second surface for it. */
  fullscreenLabel?: string;
  exitFullscreenLabel?: string;
  motion?: boolean;
}

interface Point {
  x: number;
  y: number;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 2;
const SCALE_STEP = 0.25;

function clampScale(value: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
}

function distance([first, second]: Point[]) {
  return Math.hypot(second!.x - first!.x, second!.y - first!.y);
}

function PanZoomCanvasRoot({
  label,
  children,
  hint,
  zoomInLabel = 'Zoom in',
  zoomOutLabel = 'Zoom out',
  resetLabel = 'Reset canvas',
  zoomStatusLabel = 'Canvas zoom',
  fullscreenLabel = 'Enter fullscreen',
  exitFullscreenLabel = 'Exit fullscreen',
  motion: motionEnabled = true,
}: PanZoomCanvasProps) {
  const motionSettings = useMotionSettings();
  const rootRef = useRef<HTMLElement>(null);
  /* Resolved after mount so the server and the first client render agree, and so a browser without
     the API is offered nothing rather than a control that does nothing. */
  const [fullscreenAvailable, setFullscreenAvailable] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const pointers = useRef(new Map<number, Point>());
  const dragOrigin = useRef<{ point: Point; pan: Point } | null>(null);
  const pinchOrigin = useRef<{ distance: number; scale: number } | null>(null);
  const stepRef = useRef<HTMLSpanElement>(null);
  const shouldAnimate = motionEnabled && motionSettings.enabled;

  /* The browser owns the fullscreen surface: it promotes the element above every stacking context,
     keeps focus inside it, and closes it on Escape. Nothing here re-implements dismissal or focus. */
  useEffect(() => {
    setFullscreenAvailable(typeof document !== 'undefined' && document.fullscreenEnabled === true && typeof rootRef.current?.requestFullscreen === 'function');
    function onChange() {
      setFullscreen(document.fullscreenElement === rootRef.current);
    }
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  function toggleFullscreen() {
    if (document.fullscreenElement === rootRef.current) {
      void document.exitFullscreen();
      return;
    }
    void rootRef.current?.requestFullscreen();
  }

  function reset() {
    setPan({ x: 0, y: 0 });
    setScale(1);
  }

  function zoom(delta: number) {
    setScale((current) => clampScale(current + delta));
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const movement: Record<string, Point> = {
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
    };
    if (movement[event.key]) {
      event.preventDefault();
      setPan((current) => ({ x: current.x + movement[event.key]!.x, y: current.y + movement[event.key]!.y }));
      return;
    }
    if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      zoom(SCALE_STEP);
    }
    if (event.key === '-') {
      event.preventDefault();
      zoom(-SCALE_STEP);
    }
    if (event.key === '0' || event.key === 'Home') {
      event.preventDefault();
      reset();
    }
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest('a, button, input, select, textarea')) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = [...pointers.current.values()];
    if (points.length === 1) dragOrigin.current = { point: points[0]!, pan };
    if (points.length === 2) pinchOrigin.current = { distance: distance(points), scale };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = [...pointers.current.values()];
    if (points.length === 2 && pinchOrigin.current) {
      const nextDistance = distance(points);
      setScale(clampScale(pinchOrigin.current.scale * (nextDistance / pinchOrigin.current.distance)));
      return;
    }
    if (points.length === 1 && dragOrigin.current) {
      const step = stepRef.current?.getBoundingClientRect().width || 1;
      setPan({
        x: dragOrigin.current.pan.x + (points[0]!.x - dragOrigin.current.point.x) / step,
        y: dragOrigin.current.pan.y + (points[0]!.y - dragOrigin.current.point.y) / step,
      });
    }
  }

  function releasePointer(event: PointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId);
    pinchOrigin.current = null;
    const remaining = [...pointers.current.values()];
    dragOrigin.current = remaining.length === 1 ? { point: remaining[0]!, pan } : null;
  }

  function onWheel(event: WheelEvent<HTMLDivElement>) {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    zoom(event.deltaY < 0 ? SCALE_STEP : -SCALE_STEP);
  }

  const transformStyle = {
    '--cb-pan-zoom-x': pan.x,
    '--cb-pan-zoom-y': pan.y,
    '--cb-pan-zoom-scale': scale,
  } as CSSProperties;

  return (
    <section ref={rootRef} className="cb-pan-zoom-canvas" data-motion={String(shouldAnimate)} data-fullscreen={String(fullscreen)}>
      <div className="cb-pan-zoom-canvas__toolbar">
        {hint ? <p className="cb-pan-zoom-canvas__hint">{hint}</p> : <span />}
        <div className="cb-pan-zoom-canvas__controls">
          <Button type="text" size="small" icon={<Minus aria-hidden="true" />} aria-label={zoomOutLabel} onClick={() => zoom(-SCALE_STEP)} disabled={scale <= MIN_SCALE} />
          <output className="cb-pan-zoom-canvas__zoom" aria-label={zoomStatusLabel}>{Math.round(scale * 100)}%</output>
          <Button type="text" size="small" icon={<Plus aria-hidden="true" />} aria-label={zoomInLabel} onClick={() => zoom(SCALE_STEP)} disabled={scale >= MAX_SCALE} />
          <Button type="text" size="small" icon={<RotateCcw aria-hidden="true" />} aria-label={resetLabel} onClick={reset} />
          {fullscreenAvailable ? (
            <Button
              type="text"
              size="small"
              icon={fullscreen ? <Minimize2 aria-hidden="true" /> : <Maximize2 aria-hidden="true" />}
              aria-label={fullscreen ? exitFullscreenLabel : fullscreenLabel}
              aria-pressed={fullscreen}
              onClick={toggleFullscreen}
            />
          ) : null}
        </div>
      </div>
      <div
        className="cb-pan-zoom-canvas__viewport"
        role="region"
        aria-label={label}
        tabIndex={0}
        data-pan-x={pan.x}
        data-pan-y={pan.y}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={releasePointer}
        onPointerCancel={releasePointer}
        onWheel={onWheel}
      >
        <span ref={stepRef} className="cb-pan-zoom-canvas__step" aria-hidden="true" />
        <div className="cb-pan-zoom-canvas__content" style={transformStyle}>{children}</div>
      </div>
    </section>
  );
}

export const PanZoomCanvas = Object.assign(PanZoomCanvasRoot, { Skeleton: PanZoomCanvasSkeleton });
export type { PanZoomCanvasSkeletonProps };
