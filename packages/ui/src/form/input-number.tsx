'use client';

import { InputNumber as AntInputNumber } from 'antd';
import type { GetRef, InputNumberProps as AntInputNumberProps } from 'antd';
import type { RefAttributes } from 'react';
import { useEffect, useId } from 'react';
import { useLabels } from '../lib/labels.js';

export type InputNumberProps<T extends string | number = string | number> = AntInputNumberProps<T>;
type InputNumberRef = GetRef<typeof AntInputNumber>;

/** Ant 5 spelled these `-handler-up`; Ant 6 renamed them `-action-up`. Both spellings are internal. */
const STEPPERS = [
  { selector: '.ant-input-number-action-up', label: 'increase' },
  { selector: '.ant-input-number-action-down', label: 'decrease' },
] as const;

/**
 * The two stepper controls, in up-then-down order.
 *
 * Ant renders exactly one `role="button"` per stepper and renders up first, so that order holds even
 * if the class names are renamed again. It is only used when the classes are not both found, and a
 * count other than two gives up rather than labelling a control it did not identify — a field whose
 * steppers stay English is better than one whose steppers are named backwards.
 */
function steppersOf(root: HTMLElement): HTMLElement[] {
  const byClass = STEPPERS.map((stepper) => root.querySelector(stepper.selector));
  const matchedControls = byClass.filter((control): control is HTMLElement => control instanceof HTMLElement);
  if (matchedControls.length === STEPPERS.length) return matchedControls;
  const byRole = [...root.querySelectorAll<HTMLElement>('[role="button"]')];
  return byRole.length === 2 ? byRole : [];
}

/**
 * The root of the vendored InputNumber, found from the input rather than from a wrapper.
 *
 * It used to be `<div ref>` around the component, which added a box to every consumer's layout and
 * broke selectors that expect `.ant-input-number` to be a direct child. The input carries an id, and
 * the stepper wrap is a sibling of it inside the same root, so `closest` gets there without a node.
 */
function rootOf(id: string): HTMLElement | null {
  const input = typeof document === 'undefined' ? null : document.getElementById(id);
  return input?.closest<HTMLElement>('.ant-input-number') ?? null;
}

/**
 * Ant Design's InputNumber with the stepper names translated (ceebee-ui#161).
 *
 * `@rc-component/input-number` puts the stepper's accessible name in the element itself and writes it
 * as a literal — `aria-label: isUpAction ? 'Increase Value' : 'Decrease Value'` — with no prop and no
 * locale hook to change it, and `StepHandler` destructures its props without a rest spread, so there is
 * nothing to pass. The name is therefore set on the rendered element. A screen reader on a product that
 * is not in English otherwise announces "Increase Value" against a field labelled in that product's
 * language, and a value that was already given a name by the consumer (day-progress percentage) still
 * does not have its steppers named.
 *
 * Upstream owns the steppers' role, keyboard, focus, hold-to-repeat and geometry, and this changes
 * only their two names: it adds no element, and it leaves the single `role="button"` per stepper that
 * Ant renders, so the click target and the accessibility tree are otherwise Ant's own.
 *
 * Two ways the label comes back are covered. React re-applies the literal whenever the component
 * re-renders on its own — typing does — and the effect covers re-renders driven from here. Nothing is
 * written when the attribute already reads correctly, so the observer settles after one correction
 * instead of looping on its own writes.
 */
function InputNumberRoot<T extends string | number = string | number>({
  id,
  ref,
  ...props
}: InputNumberProps<T> & RefAttributes<InputNumberRef>) {
  const labels = useLabels();
  const generatedId = useId();
  const inputId = id ?? generatedId;

  useEffect(() => {
    const root = rootOf(inputId);
    if (!root) return;
    const label = () => {
      const controls = steppersOf(root);
      for (const [index, control] of controls.entries()) {
        const name = labels[STEPPERS[index]?.label ?? 'increase'];
        if (control.getAttribute('aria-label') !== name) control.setAttribute('aria-label', name);
      }
    };
    label();
    const observer = new MutationObserver(label);
    observer.observe(root, { attributes: true, attributeFilter: ['aria-label'], subtree: true });
    return () => observer.disconnect();
  });

  return <AntInputNumber<T> {...props} id={inputId} ref={ref} />;
}

export const InputNumber: typeof AntInputNumber = Object.assign(InputNumberRoot, AntInputNumber);
