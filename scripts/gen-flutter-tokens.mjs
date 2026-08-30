/**
 * Generates the Flutter package's Skin tokens from the CSS Skins, so web and Flutter cannot
 * drift apart. The CSS files are the source of truth; `packages/ui_flutter/lib/src/tokens/
 * generated/skins.g.dart` is a build artefact.
 *
 * This resolves the real cascade — specificity then document order — rather than assuming a
 * later file always wins, because `:root[data-theme="dark"]` in the base outranks `:root` in a
 * Skin. Colours are emitted as oklch triples, not sRGB hex: the conversion and the oklch mixing
 * that `tinted` and `gradient` need both happen in Dart, so one implementation serves both.
 *
 * Run `node scripts/gen-flutter-tokens.mjs` to write, `--check` to fail when the artefact is stale.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'packages/ui_flutter/lib/src/tokens/generated/skins.g.dart');

/** The base Skin every Skin file layers on top of, then the Skins themselves. */
const BASE = 'packages/ui/src/tokens/skin.css';
const SKINS = [
  { name: 'ceebee', file: null, doc: 'The default Ceebee Skin, defined by the base tokens alone.' },
  { name: 'astra', file: 'packages/ui/src/skins/astra.css', doc: 'The violet-to-blue gradient dashboard look.' },
  { name: 'clarity', file: 'packages/ui/src/skins/clarity.css', doc: "CeeBee's content-first glass Skin." },
];

/**
 * Every token the Flutter package carries, and how to read it. A token in the CSS with no entry
 * here throws: adding one to a Skin has to be a decision on both sides, not a silent omission.
 */
const SCHEMA = {
  '--cb-hue-brand': { kind: 'skip' },
  '--cb-hue-info': { kind: 'skip' },
  '--cb-hue-success': { kind: 'skip' },
  '--cb-hue-warning': { kind: 'skip' },
  '--cb-hue-danger': { kind: 'skip' },

  '--cb-brand-50': { kind: 'color', field: 'brand50' },
  '--cb-brand-100': { kind: 'color', field: 'brand100' },
  '--cb-brand-200': { kind: 'color', field: 'brand200' },
  '--cb-brand-300': { kind: 'color', field: 'brand300' },
  '--cb-brand-400': { kind: 'color', field: 'brand400' },
  '--cb-brand-500': { kind: 'color', field: 'brand500' },
  '--cb-brand-600': { kind: 'color', field: 'brand600' },
  '--cb-brand-700': { kind: 'color', field: 'brand700' },

  '--cb-bg': { kind: 'color', field: 'bg' },
  '--cb-bg-subtle': { kind: 'color', field: 'bgSubtle' },
  '--cb-surface': { kind: 'color', field: 'surface' },
  '--cb-surface-raised': { kind: 'color', field: 'surfaceRaised' },
  '--cb-border': { kind: 'color', field: 'border' },
  '--cb-border-strong': { kind: 'color', field: 'borderStrong' },

  '--cb-fg': { kind: 'color', field: 'fg' },
  '--cb-fg-muted': { kind: 'color', field: 'fgMuted' },
  '--cb-fg-subtle': { kind: 'color', field: 'fgSubtle' },
  '--cb-fg-on-brand': { kind: 'color', field: 'fgOnBrand' },

  '--cb-tone-neutral': { kind: 'color', field: 'toneNeutral' },
  '--cb-tone-brand': { kind: 'color', field: 'toneBrand' },
  '--cb-tone-info': { kind: 'color', field: 'toneInfo' },
  '--cb-tone-success': { kind: 'color', field: 'toneSuccess' },
  '--cb-tone-warning': { kind: 'color', field: 'toneWarning' },
  '--cb-tone-danger': { kind: 'color', field: 'toneDanger' },

  '--cb-decor-violet': { kind: 'color', field: 'decorViolet' },
  '--cb-decor-blue': { kind: 'color', field: 'decorBlue' },
  '--cb-decor-teal': { kind: 'color', field: 'decorTeal' },
  '--cb-decor-green': { kind: 'color', field: 'decorGreen' },
  '--cb-decor-amber': { kind: 'color', field: 'decorAmber' },
  '--cb-decor-rose': { kind: 'color', field: 'decorRose' },

  '--cb-scrim': { kind: 'color', field: 'scrim' },
  '--cb-scrim-strong': { kind: 'color', field: 'scrimStrong' },
  '--cb-on-warning': { kind: 'color', field: 'onWarning' },

  '--cb-shadow-none': { kind: 'shadow', field: 'shadowNone' },
  '--cb-shadow-sm': { kind: 'shadow', field: 'shadowSm' },
  '--cb-shadow-md': { kind: 'shadow', field: 'shadowMd' },
  '--cb-shadow-lg': { kind: 'shadow', field: 'shadowLg' },

  '--cb-paper-bg': { kind: 'color', field: 'paperBg' },
  '--cb-paper-bg-warm': { kind: 'color', field: 'paperBgWarm' },
  '--cb-paper-border': { kind: 'color', field: 'paperBorder' },
  '--cb-paper-fg': { kind: 'color', field: 'paperFg' },
  '--cb-paper-tape': { kind: 'color', field: 'paperTape' },
  '--cb-paper-shadow': { kind: 'shadow', field: 'paperShadow' },
  '--cb-sticker-shadow': { kind: 'shadow', field: 'stickerShadow' },

  '--cb-glass-bg': { kind: 'color', field: 'glassBg' },
  '--cb-glass-bg-opaque': { kind: 'color', field: 'glassBgOpaque' },
  '--cb-glass-border': { kind: 'color', field: 'glassBorder' },
  '--cb-glass-border-strong': { kind: 'color', field: 'glassBorderStrong' },
  '--cb-glass-blur': { kind: 'length', field: 'glassBlur' },
  '--cb-glass-saturation': { kind: 'number', field: 'glassSaturation' },
  '--cb-glass-specular': { kind: 'gradient', field: 'glassSpecular' },
  '--cb-glass-inset': { kind: 'shadow', field: 'glassInset' },

  '--cb-glass-clear-bg': { kind: 'color', field: 'glassClearBg' },
  '--cb-glass-clear-border': { kind: 'color', field: 'glassClearBorder' },
  '--cb-glass-clear-blur': { kind: 'length', field: 'glassClearBlur' },
  '--cb-glass-clear-saturation': { kind: 'number', field: 'glassClearSaturation' },
  '--cb-glass-clear-specular': { kind: 'gradient', field: 'glassClearSpecular' },
  '--cb-glass-clear-inset': { kind: 'shadow', field: 'glassClearInset' },

  '--cb-tint-strength': { kind: 'number', field: 'tintStrength' },
  '--cb-gradient-angle': { kind: 'angle', field: 'gradientAngle' },

  '--cb-font-sans': { kind: 'fontStack', field: 'fontSans' },
  '--cb-font-mono': { kind: 'fontStack', field: 'fontMono' },
};

/* ---------------------------------------------------------------- CSS reading */

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/**
 * Flattens a stylesheet into declaration blocks tagged with their media condition and selector.
 * Only the two shapes these files use are understood — a top-level rule and a rule inside one
 * `@media` — and anything else throws rather than being skipped quietly.
 */
function readRules(css, file) {
  const rules = [];
  const source = stripComments(css);
  let i = 0;

  while (i < source.length) {
    const next = source.indexOf('{', i);
    if (next === -1) {
      if (source.slice(i).trim()) throw new Error(`Trailing content in ${file}: ${source.slice(i).trim().slice(0, 40)}`);
      break;
    }
    const head = source.slice(i, next).trim();
    const body = readBlock(source, next);

    if (head.startsWith('@media')) {
      const condition = head.slice('@media'.length).trim();
      let j = 0;
      while (j < body.text.length) {
        const inner = body.text.indexOf('{', j);
        if (inner === -1) {
          if (body.text.slice(j).trim()) throw new Error(`Trailing content in ${file} @media: ${body.text.slice(j).trim().slice(0, 40)}`);
          break;
        }
        const innerHead = body.text.slice(j, inner).trim();
        const innerBody = readBlock(body.text, inner);
        rules.push({ file, media: condition, selector: innerHead, decls: readDecls(innerBody.text, file) });
        j = innerBody.end;
      }
    } else if (head.startsWith('@')) {
      throw new Error(`Unsupported at-rule in ${file}: ${head}`);
    } else {
      rules.push({ file, media: null, selector: head, decls: readDecls(body.text, file) });
    }
    i = body.end;
  }
  return rules;
}

function readBlock(source, openIndex) {
  let depth = 0;
  for (let i = openIndex; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}') {
      depth -= 1;
      if (depth === 0) return { text: source.slice(openIndex + 1, i), end: i + 1 };
    }
  }
  throw new Error('Unbalanced block.');
}

function readDecls(text, file) {
  const decls = new Map();
  for (const part of splitTopLevel(text, ';')) {
    const decl = part.trim();
    if (!decl) continue;
    const colon = decl.indexOf(':');
    if (colon === -1) throw new Error(`Malformed declaration in ${file}: ${decl}`);
    decls.set(decl.slice(0, colon).trim(), decl.slice(colon + 1).trim());
  }
  return decls;
}

/** Splits on a separator that is not inside parentheses — commas inside `oklch(... / ...)` stay put. */
function splitTopLevel(text, separator) {
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === '(') depth += 1;
    else if (ch === ')') depth -= 1;
    else if (ch === separator && depth === 0) {
      parts.push(text.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(text.slice(start));
  return parts;
}

/* ---------------------------------------------------------------- the cascade */

/**
 * Specificity as the cascade actually computes it, because the answer is not obvious here:
 * `:root[data-theme="dark"]` in the base Skin outranks `:root` in a Skin file loaded after it,
 * while `:root` inside `@media (prefers-contrast: more)` does not — a media query changes when a
 * rule applies, never how strongly.
 */
const SELECTOR_WEIGHT = {
  ':root': 10,
  ':root:not([data-theme="light"])': 20,
  ':root[data-theme="dark"]': 20,
  'html:root': 11,
  'html:root:not([data-theme="light"])': 21,
  'html:root[data-theme="dark"]': 21,
  html: null,
  body: null,
};

/** A selector list takes the weight of its strongest member, as the cascade does. */
function specificity(selector, file) {
  let weight = null;
  for (const one of selectorList(selector)) {
    if (!(one in SELECTOR_WEIGHT)) throw new Error(`Unmapped selector in ${file}: ${one}`);
    const value = SELECTOR_WEIGHT[one];
    if (value !== null) weight = Math.max(weight ?? 0, value);
  }
  return weight;
}

function selectorList(selector) {
  return selector.split(',').map((s) => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
}

function applies(rule, { brightness, contrast }) {
  if (rule.media === '(prefers-color-scheme: dark)' && brightness !== 'dark') return false;
  if (rule.media === '(prefers-contrast: more)' && contrast !== 'more') return false;
  if (rule.media && !['(prefers-color-scheme: dark)', '(prefers-contrast: more)'].includes(rule.media)) {
    throw new Error(`Unmapped media condition in ${rule.file}: ${rule.media}`);
  }
  for (const selector of selectorList(rule.selector)) {
    if (selector === ':root') return true;
    if (selector === 'html:root') return true;
    // The document always states its Theme in Flutter, so "not explicitly light" means dark.
    if (
      [
        ':root:not([data-theme="light"])',
        'html:root:not([data-theme="light"])',
      ].includes(selector) && brightness === 'dark'
    ) return true;
    if (
      [':root[data-theme="dark"]', 'html:root[data-theme="dark"]'].includes(selector) &&
      brightness === 'dark'
    ) return true;
  }
  return false;
}

function resolveTokens(rules, condition) {
  const applicable = rules
    .map((rule, order) => ({ rule, order, weight: specificity(rule.selector, rule.file) }))
    .filter(({ rule, weight }) => weight !== null && applies(rule, condition))
    .sort((a, b) => (a.weight - b.weight) || (a.order - b.order));

  const tokens = new Map();
  for (const { rule } of applicable) {
    for (const [name, value] of rule.decls) {
      if (!name.startsWith('--cb-')) continue;
      tokens.set(name, value);
    }
  }
  return tokens;
}

/** Substitutes `var(--x)` until no reference is left, so the emitted value stands alone. */
function deref(value, tokens, seen = new Set()) {
  return value.replace(/var\((--[a-z0-9-]+)\)/gi, (_, name) => {
    if (seen.has(name)) throw new Error(`Circular token reference at ${name}.`);
    const target = tokens.get(name);
    if (target === undefined) throw new Error(`Token ${name} referenced but never defined.`);
    return deref(target, tokens, new Set([...seen, name]));
  });
}

/* ---------------------------------------------------------------- value parsing */

const OKLCH = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+)\s*)?\)$/;

function parseColor(value, where) {
  const raw = value.trim();
  if (raw === 'transparent') return 'CbOklch.transparent';
  const match = OKLCH.exec(raw);
  if (!match) throw new Error(`Unsupported colour at ${where}: ${raw}`);
  const [, l, c, h, alpha] = match;
  const args = [num(l), num(c), num(h)];
  return alpha === undefined
    ? `CbOklch(${args.join(', ')})`
    : `CbOklch(${args.join(', ')}, alpha: ${num(alpha)})`;
}

function num(text) {
  const value = Number(text);
  if (!Number.isFinite(value)) throw new Error(`Not a number: ${text}`);
  return Number.isInteger(value) ? `${value}.0` : `${value}`;
}

function parseLength(value, where) {
  const raw = value.trim();
  const px = /^(-?[\d.]+)px$/.exec(raw);
  if (px) return num(px[1]);
  const rem = /^(-?[\d.]+)rem$/.exec(raw);
  if (rem) return num(String(Number(rem[1]) * REM));
  throw new Error(`Expected a px or rem length at ${where}: ${value}`);
}

function parseAngle(value, where) {
  const match = /^([\d.]+)deg$/.exec(value.trim());
  if (!match) throw new Error(`Expected a deg angle at ${where}: ${value}`);
  return num(match[1]);
}

/**
 * A shadow list, inset or outset. Flutter has no inset shadow, so the inset entries survive as
 * data and `CbSurface` paints them as edge lines — dropping them would cost the material its rim.
 */
function parseShadows(value, where) {
  const raw = value.trim();
  if (raw === '0 0 transparent') return '<CbShadow>[]';
  const shadows = splitTopLevel(raw, ',').map((part) => {
    const tokens = part.trim().split(/\s+(?![^(]*\))/);
    const inset = tokens[0] === 'inset';
    const body = inset ? tokens.slice(1) : tokens;
    if (body.length !== 4) throw new Error(`Unsupported shadow at ${where}: ${part}`);
    const [x, y, blur, color] = body;
    return `CbShadow(offsetX: ${parseZeroOrPx(x, where)}, offsetY: ${parseZeroOrPx(y, where)}, `
      + `blur: ${parseZeroOrPx(blur, where)}, color: ${parseColor(color, where)}, inset: ${inset})`;
  });
  return `<CbShadow>[${shadows.join(', ')}]`;
}

function parseZeroOrPx(value, where) {
  if (value === '0') return '0.0';
  return parseLength(value, where);
}

function parseGradient(value, where) {
  const match = /^linear-gradient\(([\s\S]*)\)$/.exec(value.trim());
  if (!match) throw new Error(`Expected a linear-gradient at ${where}: ${value}`);
  const parts = splitTopLevel(match[1], ',').map((p) => p.trim());
  const angle = parseAngle(parts[0], where);
  const stops = parts.slice(1).map((part, index, all) => {
    const position = /\s([\d.]+)%$/.exec(part);
    const color = position ? part.slice(0, position.index).trim() : part;
    const at = position ? Number(position[1]) / 100 : index / Math.max(1, all.length - 1);
    return `CbGradientStop(${parseColor(color, where)}, ${num(String(at))})`;
  });
  return `CbGradient(angle: ${angle}, stops: <CbGradientStop>[${stops.join(', ')}])`;
}

/**
 * A CSS font stack names generic families a platform resolves; Flutter needs real family names.
 * The generics are dropped and the rest become a fallback chain over the platform default.
 */
const CSS_GENERIC_FAMILIES = new Set([
  'ui-sans-serif', 'ui-monospace', 'system-ui', 'sans-serif', 'serif', 'monospace', 'cursive', 'fantasy',
]);

function parseFontStack(value) {
  const families = splitTopLevel(value, ',')
    .map((part) => part.trim().replace(/^["']|["']$/g, ''))
    .filter((family) => family && !CSS_GENERIC_FAMILIES.has(family));
  return `<String>[${families.map((f) => JSON.stringify(f)).join(', ')}]`;
}

function emitValue(name, value, where) {
  const entry = SCHEMA[name];
  if (!entry) throw new Error(`Token ${name} has no Flutter mapping (${where}). Add it to SCHEMA.`);
  switch (entry.kind) {
    case 'skip': return null;
    case 'color': return parseColor(value, where);
    case 'number': return num(value.trim());
    case 'length': return parseLength(value, where);
    case 'angle': return parseAngle(value, where);
    case 'shadow': return parseShadows(value, where);
    case 'gradient': return parseGradient(value, where);
    case 'fontStack': return parseFontStack(value);
    default: throw new Error(`Unknown kind ${entry.kind}.`);
  }
}

/* ---------------------------------------------------------------- emission */

function buildVariant(rules, condition, where, sharedTokens) {
  const tokens = resolveTokens(rules, condition);
  const resolvedTokens = new Map([...sharedTokens, ...tokens]);
  const fields = new Map();
  for (const [name, raw] of tokens) {
    const entry = SCHEMA[name];
    if (!entry) throw new Error(`Token ${name} has no Flutter mapping (${where}). Add it to SCHEMA.`);
    if (entry.kind === 'skip') continue;
    fields.set(entry.field, emitValue(name, deref(raw, resolvedTokens), `${where}/${name}`));
  }

  const missing = Object.values(SCHEMA).filter((e) => e.kind !== 'skip' && !fields.has(e.field));
  if (missing.length > 0) throw new Error(`${where} is missing ${missing.map((m) => m.field).join(', ')}.`);
  return fields;
}

function dartName(skin, brightness, contrast) {
  const suffix = contrast === 'more' ? 'HighContrast' : '';
  return `_${skin}${brightness === 'dark' ? 'Dark' : 'Light'}${suffix}`;
}

function emit() {
  const baseCss = readFileSync(resolve(root, BASE), 'utf8');
  const baseRules = readRules(baseCss, BASE);
  const structureCss = readFileSync(resolve(root, 'packages/ui/src/tokens/structure.css'), 'utf8');
  const structureTokens = resolveTokens(
    readRules(structureCss, 'packages/ui/src/tokens/structure.css'),
    { brightness: 'light', contrast: 'normal' },
  );
  const hash = createHash('sha256');
  hash.update(baseCss);
  hash.update(structureCss);

  const variants = [];
  const registry = [];

  for (const skin of SKINS) {
    let rules = baseRules;
    if (skin.file) {
      const css = readFileSync(resolve(root, skin.file), 'utf8');
      hash.update(css);
      rules = [...baseRules, ...readRules(css, skin.file)];
    }
    const entries = [];
    for (const brightness of ['light', 'dark']) {
      for (const contrast of ['normal', 'more']) {
        const where = `${skin.name}/${brightness}/${contrast}`;
        const fields = buildVariant(rules, { brightness, contrast }, where, structureTokens);
        const name = dartName(skin.name, brightness, contrast);
        variants.push({ name, fields, doc: `${skin.doc} (${brightness}${contrast === 'more' ? ', high contrast' : ''})` });
        entries.push({ brightness, contrast, name });
      }
    }
    registry.push({ skin, entries });
  }

  const order = Object.values(SCHEMA).filter((e) => e.kind !== 'skip').map((e) => e.field);
  const body = variants.map((variant) => {
    const args = order.map((field) => `  ${field}: ${variant.fields.get(field)},`).join('\n');
    return `/// ${variant.doc}\nconst CbSkinTokens ${variant.name} = CbSkinTokens(\n${args}\n);`;
  }).join('\n\n');

  const lerp = order.map((field) => {
    const entry = Object.entries(SCHEMA).find(([, e]) => e.field === field)[1];
    switch (entry.kind) {
      case 'color': return `  ${field}: lerpCbOklch(a.${field}, b.${field}, t),`;
      case 'number': case 'length': case 'angle': return `  ${field}: lerpDouble(a.${field}, b.${field}, t)!,`;
      case 'shadow': return `  ${field}: lerpCbShadows(a.${field}, b.${field}, t),`;
      case 'gradient': return `  ${field}: lerpCbGradient(a.${field}, b.${field}, t),`;
      // A font stack has no midpoint worth rendering, so it changes over at the halfway mark.
      case 'fontStack': return `  ${field}: t < 0.5 ? a.${field} : b.${field},`;
      default: throw new Error(`No lerp for kind ${entry.kind}.`);
    }
  }).join('\n');

  const lookup = registry.map(({ skin, entries }) => {
    const rows = entries.map((e) => `    ${brightnessKey(e)}: ${e.name},`).join('\n');
    return `  CbSkin.${skin.name}: <_CbVariantKey, CbSkinTokens>{\n${rows}\n  },`;
  }).join('\n');

  return `// GENERATED FILE — DO NOT EDIT.
//
// Written by scripts/gen-flutter-tokens.mjs from the CSS Skins, which are the source of truth:
//   ${[BASE, ...SKINS.filter((s) => s.file).map((s) => s.file)].join('\n//   ')}
//
// Colours stay in oklch here rather than being flattened to sRGB, so Dart runs the same colour
// space the CSS does — that is what lets a tint mix in oklch instead of approximating it.
//
// Source digest: ${hash.digest('hex').slice(0, 16)}
// Regenerate with: node scripts/gen-flutter-tokens.mjs

part of 'package:ceebee_ui/src/tokens/skin_tokens.dart';

${body}

/// Interpolates every Skin Token, so a Theme or Skin change can be animated rather than snapping.
CbSkinTokens _lerpCbSkinTokens(CbSkinTokens a, CbSkinTokens b, double t) => CbSkinTokens(
${lerp}
);

const Map<CbSkin, Map<_CbVariantKey, CbSkinTokens>> _cbSkinRegistry =
    <CbSkin, Map<_CbVariantKey, CbSkinTokens>>{
${lookup}
};
`;
}

function brightnessKey(entry) {
  const brightness = entry.brightness === 'dark' ? 'dark' : 'light';
  const contrast = entry.contrast === 'more' ? 'HighContrast' : '';
  return `_CbVariantKey.${brightness}${contrast}`;
}


/* ------------------------------------------- structure and motion tokens */

/**
 * Structure and Motion Tokens are stable across Skins, so they resolve from one `:root` with no
 * cascade to weigh. They are still generated rather than hand-copied: a Token that exists in two
 * places drifts, and "no raw values" has to hold on this side of the port too.
 */
const REM = 16;

const STRUCTURE_SCHEMA = {
  '--cb-space-0': { kind: 'rem', field: 'space0' },
  '--cb-space-1': { kind: 'rem', field: 'space1' },
  '--cb-space-2': { kind: 'rem', field: 'space2' },
  '--cb-space-3': { kind: 'rem', field: 'space3' },
  '--cb-space-4': { kind: 'rem', field: 'space4' },
  '--cb-space-5': { kind: 'rem', field: 'space5' },
  '--cb-space-6': { kind: 'rem', field: 'space6' },
  '--cb-space-7': { kind: 'rem', field: 'space7' },
  '--cb-space-8': { kind: 'rem', field: 'space8' },

  '--cb-radius-none': { kind: 'rem', field: 'radiusNone' },
  '--cb-radius-sm': { kind: 'rem', field: 'radiusSm' },
  '--cb-radius-md': { kind: 'rem', field: 'radiusMd' },
  '--cb-radius-lg': { kind: 'rem', field: 'radiusLg' },
  '--cb-radius-xl': { kind: 'rem', field: 'radiusXl' },
  '--cb-radius-full': { kind: 'rem', field: 'radiusFull' },

  '--cb-tilt-left': { kind: 'degree', field: 'tiltLeft' },
  '--cb-tilt-none': { kind: 'degree', field: 'tiltNone' },
  '--cb-tilt-right': { kind: 'degree', field: 'tiltRight' },

  '--cb-text-xs': { kind: 'rem', field: 'textXs' },
  '--cb-text-sm': { kind: 'rem', field: 'textSm' },
  '--cb-text-md': { kind: 'rem', field: 'textMd' },
  '--cb-text-lg': { kind: 'rem', field: 'textLg' },
  '--cb-text-xl': { kind: 'rem', field: 'textXl' },
  '--cb-text-2xl': { kind: 'rem', field: 'text2xl' },
  '--cb-text-3xl': { kind: 'rem', field: 'text3xl' },

  '--cb-leading-tight': { kind: 'number', field: 'leadingTight' },
  '--cb-leading-normal': { kind: 'number', field: 'leadingNormal' },

  '--cb-weight-regular': { kind: 'weight', field: 'weightRegular' },
  '--cb-weight-medium': { kind: 'weight', field: 'weightMedium' },
  '--cb-weight-semibold': { kind: 'weight', field: 'weightSemibold' },

  '--cb-control-height-sm': { kind: 'rem', field: 'controlHeightSm' },
  '--cb-control-height-md': { kind: 'rem', field: 'controlHeightMd' },
  '--cb-control-height-lg': { kind: 'rem', field: 'controlHeightLg' },

  '--cb-sticker-enter-y': { kind: 'rem', field: 'stickerEnterY' },
  '--cb-sticker-exit-x': { kind: 'rem', field: 'stickerExitX' },
  '--cb-sticker-enter-scale': { kind: 'number', field: 'stickerEnterScale' },
  '--cb-sticker-exit-scale': { kind: 'number', field: 'stickerExitScale' },
  '--cb-sticker-exit-rotate': { kind: 'degree', field: 'stickerExitRotate' },

  '--cb-border-width': { kind: 'rem', field: 'borderWidth' },
  '--cb-focus-width': { kind: 'rem', field: 'focusWidth' },
  '--cb-focus-offset': { kind: 'rem', field: 'focusOffset' },
  '--cb-focus-offset-inset': { kind: 'rem', field: 'focusOffsetInset' },

  '--cb-z-base': { kind: 'int', field: 'zBase' },
  '--cb-z-sticky': { kind: 'int', field: 'zSticky' },
  '--cb-z-modal-backdrop': { kind: 'int', field: 'zModalBackdrop' },
  '--cb-z-modal': { kind: 'int', field: 'zModal' },
  '--cb-z-dropdown': { kind: 'int', field: 'zDropdown' },
  '--cb-z-popover': { kind: 'int', field: 'zPopover' },
  '--cb-z-tooltip': { kind: 'int', field: 'zTooltip' },
  '--cb-z-command-backdrop': { kind: 'int', field: 'zCommandBackdrop' },
  '--cb-z-command': { kind: 'int', field: 'zCommand' },
  '--cb-z-toast': { kind: 'int', field: 'zToast' },
  '--cb-z-coachmark-spotlight': { kind: 'int', field: 'zCoachmarkSpotlight' },
  '--cb-z-coachmark': { kind: 'int', field: 'zCoachmark' },
  '--cb-z-overlay': { kind: 'int', field: 'zOverlay' },
};

const MOTION_SCHEMA = {
  '--cb-duration-instant': { kind: 'ms', field: 'instant' },
  '--cb-duration-fast': { kind: 'ms', field: 'fast' },
  '--cb-duration-base': { kind: 'ms', field: 'base' },
  '--cb-duration-slow': { kind: 'ms', field: 'slow' },
  '--cb-duration-deliberate': { kind: 'ms', field: 'deliberate' },
  '--cb-duration-stagger-tight': { kind: 'ms', field: 'staggerTight' },
  '--cb-duration-stagger-standard': { kind: 'ms', field: 'staggerStandard' },
  '--cb-duration-stagger-relaxed': { kind: 'ms', field: 'staggerRelaxed' },

  '--cb-ease-standard': { kind: 'curve', field: 'standard' },
  '--cb-ease-entrance': { kind: 'curve', field: 'entrance' },
  '--cb-ease-exit': { kind: 'curve', field: 'exit' },
  '--cb-ease-emphasis': { kind: 'curve', field: 'emphasis' },

  '--cb-motion-scale': { kind: 'skip' },
};

const SURFACE_SCHEMA = {
  '--cb-surface-tinted-edge-strength': { kind: 'number', field: 'tintedEdgeStrength' },
  '--cb-surface-gradient-start-strength': { kind: 'number', field: 'gradientStartStrength' },
  '--cb-surface-gradient-end-strength': { kind: 'number', field: 'gradientEndStrength' },
  '--cb-surface-gradient-edge-strength': { kind: 'number', field: 'gradientEdgeStrength' },
};

const DATA_VISUALIZATION_SCHEMA = {
  '--cb-mini-chart-track-strength': { kind: 'number', field: 'trackStrength' },
  '--cb-mini-chart-area-strength': { kind: 'number', field: 'areaStrength' },
  '--cb-mini-chart-bar-strength': { kind: 'number', field: 'barStrength' },
  '--cb-mini-chart-line-width': { kind: 'rem', field: 'lineWidth' },
  '--cb-mini-chart-marker-radius': { kind: 'rem', field: 'markerRadius' },
  '--cb-mini-chart-bar-gap': { kind: 'rem', field: 'barGap' },
  '--cb-mini-chart-min-bar': { kind: 'rem', field: 'minBar' },
  '--cb-mini-chart-bar-radius': { kind: 'rem', field: 'barRadius' },
  '--cb-mini-chart-donut-size-sm': { kind: 'rem', field: 'donutSizeSm' },
  '--cb-mini-chart-donut-size-md': { kind: 'rem', field: 'donutSizeMd' },
  '--cb-mini-chart-donut-size-lg': { kind: 'rem', field: 'donutSizeLg' },
  '--cb-mini-chart-donut-thickness-sm': { kind: 'rem', field: 'donutThicknessSm' },
  '--cb-mini-chart-donut-thickness-md': { kind: 'rem', field: 'donutThicknessMd' },
  '--cb-mini-chart-donut-thickness-lg': { kind: 'rem', field: 'donutThicknessLg' },
  '--cb-mini-chart-width-sm': { kind: 'rem', field: 'widthSm' },
  '--cb-mini-chart-width-md': { kind: 'rem', field: 'widthMd' },
  '--cb-mini-chart-width-lg': { kind: 'rem', field: 'widthLg' },
  '--cb-mini-chart-height-sm': { kind: 'rem', field: 'heightSm' },
  '--cb-mini-chart-height-md': { kind: 'rem', field: 'heightMd' },
  '--cb-mini-chart-height-lg': { kind: 'rem', field: 'heightLg' },
  '--cb-mini-chart-padding': { kind: 'rem', field: 'padding' },
};

const SKELETON_SCHEMA = {
  '--cb-skeleton-fill-strength': { kind: 'number', field: 'fillStrength' },
  '--cb-skeleton-opacity-min': { kind: 'number', field: 'opacityMin' },
  '--cb-skeleton-opacity-max': { kind: 'number', field: 'opacityMax' },
};

/** Reads the one `:root` block a Skin-independent stylesheet has, ignoring preference blocks. */
function readRootTokens(file, allowedMedia = []) {
  const css = readFileSync(resolve(root, file), 'utf8');
  const tokens = new Map();
  for (const rule of readRules(css, file)) {
    if (rule.media !== null && !allowedMedia.includes(rule.media)) continue;
    if (rule.media !== null) continue;
    if (!selectorList(rule.selector).includes(':root')) continue;
    for (const [name, value] of rule.decls) if (name.startsWith('--cb-')) tokens.set(name, value);
  }
  return { css, tokens };
}

function emitFlat(file, schema, className, doc, extra = '') {
  const { css, tokens } = readRootTokens(file);
  const lines = [];
  for (const [name, raw] of tokens) {
    const entry = schema[name];
    if (!entry) throw new Error(`Token ${name} has no Flutter mapping (${file}). Add it to the schema.`);
    if (entry.kind === 'skip') continue;
    const value = deref(raw, tokens).trim();
    lines.push(`  static const ${dartType(entry.kind)} ${entry.field} = ${emitFlatValue(entry.kind, value, `${file}/${name}`)};`);
  }
  const missing = Object.values(schema).filter((e) => e.kind !== 'skip' && !lines.some((l) => l.includes(` ${e.field} =`)));
  if (missing.length > 0) throw new Error(`${file} is missing ${missing.map((m) => m.field).join(', ')}.`);

  return { css, text: `// GENERATED FILE — DO NOT EDIT.
//
// Written by scripts/gen-flutter-tokens.mjs from ${file}, which is the source of truth.
// Regenerate with: node scripts/gen-flutter-tokens.mjs

${extra}
/// ${doc}
abstract final class ${className} {
${lines.join('\n')}
}
` };
}

function dartType(kind) {
  if (kind === 'int') return 'int';
  if (kind === 'ms') return 'Duration';
  if (kind === 'curve') return 'Cubic';
  if (kind === 'weight') return 'FontWeight';
  return 'double';
}

function emitFlatValue(kind, value, where) {
  switch (kind) {
    case 'rem': return num(String(remToPx(value, where)));
    case 'number': return num(value);
    case 'degree': {
      const match = /^(-?[\d.]+)deg$/.exec(value);
      if (!match) throw new Error(`Expected a degree value at ${where}: ${value}`);
      return num(match[1]);
    }
    case 'int': {
      if (!/^-?\d+$/.test(value)) throw new Error(`Expected an integer at ${where}: ${value}`);
      return value;
    }
    case 'weight': {
      if (!/^\d00$/.test(value)) throw new Error(`Expected a font weight at ${where}: ${value}`);
      return `FontWeight.w${value[0]}00`;
    }
    case 'ms': {
      const match = /^(\d+)ms$/.exec(value);
      if (!match) throw new Error(`Expected a ms duration at ${where}: ${value}`);
      return `Duration(milliseconds: ${match[1]})`;
    }
    case 'curve': {
      const match = /^cubic-bezier\(([^)]*)\)$/.exec(value);
      if (!match) throw new Error(`Expected a cubic-bezier at ${where}: ${value}`);
      const points = match[1].split(',').map((p) => num(p.trim()));
      if (points.length !== 4) throw new Error(`Expected four control points at ${where}: ${value}`);
      return `Cubic(${points.join(', ')})`;
    }
    default: throw new Error(`Unknown flat kind ${kind}.`);
  }
}

/**
 * Flutter has no rem: a logical pixel is the unit, and the root font size it would scale from is
 * 16. Text sizes stay in logical pixels for the same reason — `MediaQuery.textScaler` is where a
 * reader's own scaling enters, not the Token.
 */
function remToPx(value, where) {
  const trimmed = value.trim();
  if (trimmed === '0') return 0;
  const rem = /^(-?[\d.]+)rem$/.exec(trimmed);
  if (rem) return Number(rem[1]) * REM;
  const px = /^(-?[\d.]+)px$/.exec(trimmed);
  if (px) return Number(px[1]);
  throw new Error(`Expected a rem or px length at ${where}: ${value}`);
}

const structure = emitFlat(
  'packages/ui/src/tokens/structure.css',
  STRUCTURE_SCHEMA,
  'CbStructure',
  'Structure Tokens: spacing, radius, type scale, control geometry, and the stacking ladder.\n/// Stable across Skins — a Skin never overrides these.',
  "import 'package:flutter/widgets.dart';\n",
);

const motion = emitFlat(
  'packages/ui/src/tokens/motion.css',
  MOTION_SCHEMA,
  'CbMotionTokens',
  'Motion Tokens. A component reads one of these; it never writes a duration or a curve.',
  "import 'package:flutter/animation.dart';\n",
);

const surface = emitFlat(
  'packages/ui/src/tokens/surface.css',
  SURFACE_SCHEMA,
  'CbSurfaceTokens',
  'Component Tokens used by every Surface rendering.',
);

const dataVisualization = emitFlat(
  'packages/ui/src/tokens/data-visualization.css',
  DATA_VISUALIZATION_SCHEMA,
  'CbDataVisualizationTokens',
  'Component Tokens shared by every mini-chart rendering.',
);

const skeleton = emitFlat(
  'packages/ui/src/tokens/skeleton.css',
  SKELETON_SCHEMA,
  'CbSkeletonTokens',
  'Component Tokens shared by every Skeleton rendering.',
);

const artefacts = [
  { path: out, text: emit(), label: 'Skin tokens' },
  { path: resolve(root, 'packages/ui_flutter/lib/src/tokens/generated/structure.g.dart'), text: structure.text, label: 'structure tokens' },
  { path: resolve(root, 'packages/ui_flutter/lib/src/tokens/generated/motion.g.dart'), text: motion.text, label: 'motion tokens' },
  { path: resolve(root, 'packages/ui_flutter/lib/src/tokens/generated/surface.g.dart'), text: surface.text, label: 'Surface tokens' },
  { path: resolve(root, 'packages/ui_flutter/lib/src/tokens/generated/data_visualization.g.dart'), text: dataVisualization.text, label: 'data visualization tokens' },
  { path: resolve(root, 'packages/ui_flutter/lib/src/tokens/generated/skeleton.g.dart'), text: skeleton.text, label: 'Skeleton tokens' },
];

if (process.argv.includes('--check')) {
  for (const artefact of artefacts) {
    let current = '';
    try {
      current = readFileSync(artefact.path, 'utf8');
    } catch {
      throw new Error(`The Flutter ${artefact.label} have never been generated. Run node scripts/gen-flutter-tokens.mjs.`);
    }
    if (current !== artefact.text) {
      throw new Error(`The Flutter ${artefact.label} are stale. Run node scripts/gen-flutter-tokens.mjs.`);
    }
  }
  console.log('Flutter Tokens match the CSS Tokens.');
} else {
  for (const artefact of artefacts) {
    writeFileSync(artefact.path, artefact.text);
    console.log(`Wrote ${artefact.path}`);
  }
}
