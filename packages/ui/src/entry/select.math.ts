/**
 * How wide a Select is by default: as wide as its longest option, between a floor and a cap.
 *
 * Measured in `ch` from the labels' length rather than from rendered text, so it is the same on the server
 * and the client and needs no layout pass; `ch` is the width of a "0", close enough for a field that also
 * caps itself and hands the rest to an ellipsis with a tooltip. 4.5rem is the padding, the arrow and the
 * clear button.
 */
export const SELECT_MIN = '12rem';
export const SELECT_MAX = '28rem';
/** How much wider than its field the dropdown may grow, so options are read whole where there is room. */
export const SELECT_POPUP_MAX = '32rem';

function written(value: unknown): number {
  return typeof value === 'string' || typeof value === 'number' ? String(value).length : 0;
}

/**
 * The length of the longest written label; an option whose label is not text counts its value. Options are
 * read as plain objects, because a consumer's option type may carry anything beside `label` and `value`.
 */
export function longestLabel(options: readonly object[] | undefined): number {
  let longest = 0;
  for (const option of options ?? []) {
    const nested = 'options' in option && Array.isArray(option.options) ? option.options : null;
    const own = nested
      ? longestLabel(nested)
      : written('label' in option ? option.label : undefined) || written('value' in option ? option.value : undefined);
    longest = Math.max(longest, own);
  }
  return longest;
}

export function selectWidth(longest: number): string {
  return longest === 0 ? SELECT_MIN : `clamp(${SELECT_MIN}, calc(${longest}ch + 4.5rem), ${SELECT_MAX})`;
}
