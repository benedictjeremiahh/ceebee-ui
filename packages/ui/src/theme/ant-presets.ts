import presets from './ant-presets.json';

/**
 * Ant's preset colours — `<Tag color="gold">`, a Badge's `color="green"` — take their text from step 7
 * of Ant's own palette, their ground from step 1 and their fill from step 6, none of which the skin
 * feeds. Ant's stock steps fail WCAG AA: gold text on its ground measured 2.76:1, green 3.37:1, and a
 * category tag ("liability", "revenue") has no semantic tone to switch to. So the four steps a preset
 * paints with are designed here per mode — one hue per preset, one lightness and chroma per step — and
 * checked in `tone-contrast.spec.ts`. The numbers live in `ant-presets.json` so the server seed
 * generator reads the same ones.
 */
export type PresetMode = 'light' | 'dark';

/** oklch → sRGB, clamped, as the `rgba()` string Ant's token pipeline expects. */
export function oklchToRgba(lightness: number, chroma: number, hueDegrees: number): string {
  const hue = (hueDegrees * Math.PI) / 180;
  const a = chroma * Math.cos(hue);
  const b = chroma * Math.sin(hue);
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  const [r = 0, g = 0, bl = 0] = linear.map((c) => {
    const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
    return Math.round(Math.min(1, Math.max(0, v)) * 255);
  });
  return `rgba(${r}, ${g}, ${bl}, 1)`;
}

/** The preset palette steps Ant reads, for one mode: `gold1` ground, `gold3` border, `gold6` fill, `gold7` text. */
export function antPresetTokens(mode: PresetMode): Record<string, string> {
  const steps = presets[mode];
  const paint = (step: number[], hue: number) => oklchToRgba(step[0] ?? 0, step[1] ?? 0, hue);
  const out: Record<string, string> = {};
  for (const [name, hue] of Object.entries(presets.hues)) {
    out[`${name}1`] = paint(steps.ground, hue);
    out[`${name}3`] = paint(steps.border, hue);
    out[`${name}6`] = paint(steps.fill, hue);
    out[`${name}7`] = paint(steps.text, hue);
  }
  return out;
}
