'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';

/**
 * Every string the library says out loud. They are here rather than inline because a component
 * that hard-codes "Previous slide" is an English component, and this library is used to build
 * products that are not in English.
 */
export interface Labels {
  dismiss: string;
  close: string;
  clear: string;
  open: string;
  previousSlide: string;
  nextSlide: string;
  /** Given the 1-based slide number. */
  goToSlide: (index: number) => string;
  previousPage: string;
  nextPage: string;
  page: (index: number) => string;
  /** Given the range shown and the total, e.g. "1–20 of 137". */
  pageSummary: (from: number, to: number, total: number) => string;
  chooseDate: string;
  chooseTime: string;
  previousMonth: string;
  nextMonth: string;
  chooseFiles: string;
  chooseFile: string;
  dropFilesHere: string;
  dropFileHere: string;
  removeFile: (name: string) => string;
  increase: string;
  decrease: string;
  expandNavigation: string;
  collapseNavigation: string;
  /** Opens the overflow menu when the tab bar does not fit. */
  moreTabs?: string;
  /** Carousel and image-preview stepping. */
  next: string;
  imagePrevious?: string;
  imageNext?: string;
  imageFlipHorizontal?: string;
  imageFlipVertical?: string;
  imageRotateLeft?: string;
  imageRotateRight?: string;
  imageZoomOut?: string;
  imageZoomIn?: string;
}

export const DEFAULT_LABELS = {
  dismiss: 'Dismiss',
  close: 'Close',
  clear: 'Clear',
  open: 'Open',
  previousSlide: 'Previous slide',
  nextSlide: 'Next slide',
  goToSlide: (index) => `Go to slide ${index}`,
  previousPage: 'Previous page',
  nextPage: 'Next page',
  page: (index) => `Page ${index}`,
  pageSummary: (from, to, total) => `${from}–${to} of ${total}`,
  chooseDate: 'Choose a date',
  chooseTime: 'Choose a time',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  chooseFiles: 'Choose files',
  chooseFile: 'Choose a file',
  dropFilesHere: 'or drop them here',
  dropFileHere: 'or drop it here',
  removeFile: (name) => `Remove ${name}`,
  increase: 'Increase',
  decrease: 'Decrease',
  expandNavigation: 'Expand navigation',
  collapseNavigation: 'Collapse navigation',
  moreTabs: 'More tabs',
  next: 'Next',
  imagePrevious: 'Previous image',
  imageNext: 'Next image',
  imageFlipHorizontal: 'Flip horizontally',
  imageFlipVertical: 'Flip vertically',
  imageRotateLeft: 'Rotate left',
  imageRotateRight: 'Rotate right',
  imageZoomOut: 'Zoom out',
  imageZoomIn: 'Zoom in',
} satisfies Labels;

const LabelsContext = createContext<Labels>(DEFAULT_LABELS);

export interface LabelsProviderProps {
  children: ReactNode;
  /** Only the strings you are replacing; the rest fall back to English. */
  labels: Partial<Labels>;
}

export function LabelsProvider({ children, labels }: LabelsProviderProps) {
  const value = useMemo(() => ({ ...DEFAULT_LABELS, ...labels }), [labels]);
  return <LabelsContext.Provider value={value}>{children}</LabelsContext.Provider>;
}

export function useLabels(): Labels {
  return useContext(LabelsContext);
}
