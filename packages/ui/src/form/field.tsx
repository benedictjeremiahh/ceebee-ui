'use client';

import { createContext, useContext, useId, type ReactNode } from 'react';
import { cn } from '../lib/cn.js';

interface FieldWiring {
  controlId: string;
  describedBy: string | undefined;
  invalid: boolean;
  required: boolean;
}

const FieldContext = createContext<FieldWiring | null>(null);

/** Inputs read their id and aria wiring from here; standalone use returns null. */
export function useFieldWiring(): FieldWiring | null {
  return useContext(FieldContext);
}

export interface FieldProps {
  label: ReactNode;
  hint?: ReactNode;
  /** A string renders the message; `true` marks invalid without one. */
  error?: ReactNode | boolean;
  required?: boolean;
  /** Hides the label visually while keeping it for screen readers. */
  labelHidden?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Label, hint, error, and the `aria-describedby` / `aria-invalid` links between them —
 * the part that is most often silently wrong. The library owns this and refuses to own
 * form state or validation (ADR 0011).
 */
export function Field({ label, hint, error, required = false, labelHidden = false, className, children }: FieldProps) {
  const base = useId();
  const controlId = `${base}-control`;
  const hintId = hint ? `${base}-hint` : undefined;
  const errorId = error && error !== true ? `${base}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <FieldContext.Provider value={{ controlId, describedBy, invalid: Boolean(error), required }}>
      <div className={cn('cb-field', className)} data-invalid={error ? '' : undefined}>
        <label className={cn('cb-field__label', labelHidden && 'cb-visually-hidden')} htmlFor={controlId}>
          {label}
          {required ? (
            <span className="cb-field__required" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
        {children}
        {hint ? (
          <p className="cb-field__hint" id={hintId}>
            {hint}
          </p>
        ) : null}
        {error && error !== true ? (
          <p className="cb-field__error" id={errorId} role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}
