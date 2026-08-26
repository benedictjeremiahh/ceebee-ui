"use client";

import { Children, Fragment, isValidElement, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode, useRef, useState } from 'react';
import { SplitterSkeleton } from './splitter.skeleton.js';

export type SplitterOrientation = 'horizontal' | 'vertical';
export type SplitterHandleSize = 'sm' | 'md' | 'lg';

export interface SplitterProps {
  /** Percentage assigned to the first pane. Supplying this makes the Splitter controlled. */
  size?: number;
  /** Initial percentage assigned to the first pane when uncontrolled. */
  defaultSize?: number;
  /** Lowest allowed percentage for the first pane. */
  minSize?: number;
  /** Highest allowed percentage for the first pane. */
  maxSize?: number;
  onSizeChange?: (size: number) => void;
  orientation?: SplitterOrientation;
  /** Handle geometry only; it does not alter the resize contract. */
  handleSize?: SplitterHandleSize;
  disabled?: boolean;
  /** Accessible name for the separator. */
  handleLabel?: string;
  children: ReactNode;
}

function clampSize(value: number, minSize: number, maxSize: number) {
  return Math.min(maxSize, Math.max(minSize, Math.round(value)));
}

function finiteValue(value: number | undefined, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function normalizedBounds(minSize: number, maxSize: number) {
  const min = Math.min(100, Math.max(0, Math.round(finiteValue(minSize, 0))));
  const max = Math.min(100, Math.max(min, Math.round(finiteValue(maxSize, 100))));
  return { min, max };
}

function paneChildren(children: ReactNode): ReactNode[] {
  return Children.toArray(children).flatMap((child) =>
    isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment
      ? paneChildren(child.props.children)
      : [child],
  );
}

function SplitterRoot({
  size,
  defaultSize = 50,
  minSize = 0,
  maxSize = 100,
  onSizeChange,
  orientation = 'horizontal',
  handleSize = 'md',
  disabled = false,
  handleLabel = 'Resize panes',
  children,
}: SplitterProps) {
  const panes = paneChildren(children);
  if (panes.length !== 2) {
    throw new Error('Splitter requires exactly two pane children.');
  }

  const rootRef = useRef<HTMLDivElement>(null);
  const grabOffsetRef = useRef(0);
  const [uncontrolledSize, setUncontrolledSize] = useState(() => finiteValue(defaultSize, 50));
  const { min, max } = normalizedBounds(minSize, maxSize);
  const currentSize = clampSize(size === undefined ? uncontrolledSize : finiteValue(size, 50), min, max);

  const setSize = (nextSize: number) => {
    if (disabled) return;
    const next = clampSize(nextSize, min, max);
    if (size === undefined) setUncontrolledSize(next);
    onSizeChange?.(next);
  };

  const sizeFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const rootRect = rootRef.current?.getBoundingClientRect();
    const handleRect = event.currentTarget.getBoundingClientRect();
    if (!rootRect) return;
    const rootLength = orientation === 'horizontal' ? rootRect.width : rootRect.height;
    const handleLength = orientation === 'horizontal' ? handleRect.width : handleRect.height;
    const availableLength = rootLength - handleLength;
    if (availableLength <= 0) return;
    const rootStart = orientation === 'horizontal' ? rootRect.left : rootRect.top;
    const pointerPosition = orientation === 'horizontal' ? event.clientX : event.clientY;
    setSize(((pointerPosition - rootStart - grabOffsetRef.current) / availableLength) * 100);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    const handleRect = event.currentTarget.getBoundingClientRect();
    const handleStart = orientation === 'horizontal' ? handleRect.left : handleRect.top;
    const pointerPosition = orientation === 'horizontal' ? event.clientX : event.clientY;
    grabOffsetRef.current = pointerPosition - handleStart;
    event.currentTarget.setPointerCapture(event.pointerId);
    sizeFromPointer(event);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!disabled && event.currentTarget.hasPointerCapture(event.pointerId)) sizeFromPointer(event);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      sizeFromPointer(event);
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handlePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const decrease = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    const increase = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    if (event.key === decrease) {
      event.preventDefault();
      setSize(currentSize - 1);
    } else if (event.key === increase) {
      event.preventDefault();
      setSize(currentSize + 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setSize(min);
    } else if (event.key === 'End') {
      event.preventDefault();
      setSize(max);
    }
  };

  const style = {
    '--cb-splitter-first-grow': String(currentSize),
    '--cb-splitter-second-grow': String(100 - currentSize),
  } as CSSProperties;
  return (
    <div
      ref={rootRef}
      className={`cb-splitter cb-splitter--${orientation} cb-splitter--handle-${handleSize}${disabled ? ' cb-splitter--disabled' : ''}`}
      style={style}
    >
      <div className="cb-splitter__pane cb-splitter__pane--first">{panes[0]}</div>
      <div
        className="cb-splitter__handle"
        role="separator"
        aria-orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'}
        aria-valuenow={currentSize}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label={handleLabel}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      />
      <div className="cb-splitter__pane cb-splitter__pane--second">{panes[1]}</div>
    </div>
  );
}

export const Splitter = Object.assign(SplitterRoot, { Skeleton: SplitterSkeleton });
