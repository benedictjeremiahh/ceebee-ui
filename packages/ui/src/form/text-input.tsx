'use client';

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn, type Size } from '../lib/cn.js';
import { useFieldWiring } from './field.js';

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: Size;
  /** Marks invalid when used outside a Field; inside one, the Field decides. */
  invalid?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { size = 'md', invalid, className, ...rest },
  ref,
) {
  const field = useFieldWiring();
  return (
    <input
      ref={ref}
      className={cn('cb-input', `cb-input--${size}`, className)}
      id={rest.id ?? field?.controlId}
      aria-describedby={rest['aria-describedby'] ?? field?.describedBy}
      aria-invalid={invalid ?? field?.invalid ? true : undefined}
      required={rest.required ?? field?.required}
      {...rest}
    />
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, ...rest },
  ref,
) {
  const field = useFieldWiring();
  return (
    <textarea
      ref={ref}
      className={cn('cb-input', 'cb-input--textarea', className)}
      id={rest.id ?? field?.controlId}
      aria-describedby={rest['aria-describedby'] ?? field?.describedBy}
      aria-invalid={invalid ?? field?.invalid ? true : undefined}
      required={rest.required ?? field?.required}
      {...rest}
    />
  );
});
