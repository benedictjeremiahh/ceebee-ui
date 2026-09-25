'use client';

import { Select as AntSelect } from 'antd';
import type { SelectProps as AntSelectProps } from 'antd';
import type { BaseOptionType, DefaultOptionType } from 'antd/es/select/index.js';
import type { CSSProperties } from 'react';
import { useRef } from 'react';
import { longestLabel, selectWidth, SELECT_POPUP_MAX } from './select.math.js';
import { TruncatedLabel } from './truncated-label.js';
import './select.css';

/* The value type defaults to Ant's own default (`any`), not `unknown`: a narrower default would break every
   consumer that relied on Ant's, which is the one thing a drop-in default must not do. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SelectProps<V = any, O extends BaseOptionType | DefaultOptionType = DefaultOptionType> = AntSelectProps<V, O>;

type Styles = AntSelectProps['styles'];

/** The dropdown may be wider than its field, up to a cap; a consumer's own popup styles still win. */
function withPopupCap<S extends Styles>(styles: S): S | Styles {
  if (typeof styles === 'function') return styles;
  const popupRoot: CSSProperties = { maxInlineSize: SELECT_POPUP_MAX, ...styles?.popup?.root };
  return { ...styles, popup: { ...styles?.popup, root: popupRoot } };
}

function setsWidth(style: CSSProperties | undefined): boolean {
  return style?.width !== undefined || style?.inlineSize !== undefined;
}

/**
 * Ant Design's Select with defaults for the text it holds (ceebee-ui#45): long options — a job, a vendor, a
 * stock location path — were cut off in a field narrower than the space it had.
 *
 * - The field is as wide as the longest option it has held, between 12rem and 28rem, and never wider than its container,
 *   so it takes the full width on a phone. A consumer that sets a width keeps it.
 * - The dropdown may be wider than the field, up to 32rem, so options are read whole where there is room.
 * - What still does not fit ellipsises, and the selected value and each option show their whole text in a
 *   tooltip when — and only when — they are cut. A consumer's own `labelRender` or `optionRender` replaces
 *   this for what it renders.
 *
 * Everything else is Ant's contract, untouched.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SelectRoot<V = any, O extends BaseOptionType | DefaultOptionType = DefaultOptionType>({
  style, styles, labelRender, optionRender, popupMatchSelectWidth, options, className, ...props
}: SelectProps<V, O>) {
  /* Only ever widens: a select that searches the server swaps its options on every keystroke, and a field
     that shrank and grew with them would jump under the cursor. */
  const widest = useRef(0);
  widest.current = Math.max(widest.current, longestLabel(options));
  const width = setsWidth(style) ? undefined : selectWidth(widest.current);
  return (
    <AntSelect<V, O>
      {...props}
      options={options}
      className={className ? `cb-select ${className}` : 'cb-select'}
      style={width ? { inlineSize: width, ...style } : style}
      styles={withPopupCap(styles)}
      popupMatchSelectWidth={popupMatchSelectWidth ?? false}
      labelRender={labelRender ?? ((label) => <TruncatedLabel>{label.label ?? label.value}</TruncatedLabel>)}
      optionRender={optionRender ?? ((option) => <TruncatedLabel>{option.label ?? option.value}</TruncatedLabel>)}
    />
  );
}

export const Select: typeof SelectRoot & Omit<typeof AntSelect, never> = Object.assign(SelectRoot, AntSelect);
