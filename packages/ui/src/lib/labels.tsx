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
  /** Tour buttons. A Tour's own `labels` prop still wins over these. */
  back: string;
  next: string;
  done: string;
  skip: string;
  /** Coachmark and Checklist progress, e.g. "2 of 5". */
  progress: (current: number, total: number) => string;
}

export const DEFAULT_LABELS: Labels = {
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
  back: 'Back',
  next: 'Next',
  done: 'Done',
  skip: 'Skip',
  progress: (current, total) => `${current} of ${total}`,
};

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
