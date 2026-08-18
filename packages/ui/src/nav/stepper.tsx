import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export interface Step {
  label: ReactNode;
  description?: ReactNode;
}

export interface StepperProps {
  steps: Step[];
  /** Zero-based index of the step in progress. */
  current: number;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

/**
 * Progress through an ordered sequence — the thing Tabs must not be used for. Server-safe:
 * it displays position, it does not navigate.
 */
export function Stepper({ steps, current, orientation = 'horizontal', className }: StepperProps) {
  return (
    <ol className={cn('cb-stepper', `cb-stepper--${orientation}`, className)}>
      {steps.map((step, index) => {
        const state = index < current ? 'done' : index === current ? 'current' : 'todo';
        return (
          <li className="cb-stepper__step" data-state={state} key={index}>
            <span className="cb-stepper__marker" aria-hidden="true">
              {state === 'done' ? <Check size={13} strokeWidth={3} /> : index + 1}
            </span>
            <span className="cb-stepper__text">
              <span className="cb-stepper__label">
                {step.label}
                <span className="cb-visually-hidden">
                  {state === 'done' ? ' (completed)' : state === 'current' ? ' (current step)' : ''}
                </span>
              </span>
              {step.description ? <span className="cb-stepper__description">{step.description}</span> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
