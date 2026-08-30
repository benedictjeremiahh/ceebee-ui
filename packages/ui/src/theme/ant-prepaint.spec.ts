import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC = join(process.cwd(), 'packages/ui/src');
const prepaint = readFileSync(join(SRC, 'theme/ant-prepaint.css'), 'utf8');

/** Prose in a comment can read like a declaration, so every scan works on the stripped source. */
const declarations = prepaint.replace(/\/\*[\s\S]*?\*\//g, '');

const declaredTokens = new Set(
  readdirSync(join(SRC, 'tokens'))
    .filter((name) => name.endsWith('.css'))
    .flatMap((name) => [...readFileSync(join(SRC, 'tokens', name), 'utf8')
      .matchAll(/(--cb-[\w-]+)\s*:/g)].map((match) => match[1]!)),
);

/* Nothing here may outrank the runtime that owns these components: the whole contract is that Ant's
   own rule wins the moment it arrives. A selector that escapes `:where()` would keep winning and
   silently reskin Ant instead of standing in for it. */
function selectors() {
  return declarations
    .split('}')
    .map((block) => block.split('{')[0]!.trim())
    .filter(Boolean);
}

/** Splits on commas that separate whole selectors, not the ones inside `:where(...)`. */
function compounds(selector: string) {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const character of selector) {
    if (character === '(') depth += 1;
    if (character === ')') depth -= 1;
    if (character === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    current += character;
  }
  parts.push(current.trim());
  return parts.filter(Boolean);
}

/**
 * What is left of a compound once every `:where()` group is removed. A pseudo-element is allowed to
 * remain: it cannot legally sit inside `:where()`, and its element-level weight is still outranked
 * by the same Ant rule that names a class.
 */
function outsideWhere(compound: string) {
  return compound
    .replace(/:where\((?:[^()]|\([^()]*\))*\)/g, '')
    .replace(/::[\w-]+/g, '')
    .trim();
}

describe('the Ant pre-paint fallback', () => {
  it('carries no specificity, so every real Ant rule overrides it', () => {
    const escaping = selectors()
      .flatMap(compounds)
      .filter((compound) => outsideWhere(compound) !== '');

    expect(escaping, `these carry specificity outside :where(): ${escaping.join(' | ')}`).toEqual([]);
  });

  it('reads only declared Ceebee tokens', () => {
    const used = [...declarations.matchAll(/var\((--cb-[\w-]+)\)/g)].map((match) => match[1]!);
    expect(used.length).toBeGreaterThan(0);

    const undeclared = [...new Set(used)].filter((name) => !declaredTokens.has(name));
    expect(undeclared, `undeclared tokens: ${undeclared.join(', ')}`).toEqual([]);
  });

  it('states no constraint property, which an Ant rule cannot override', () => {
    /* `:where()` only guarantees Ant wins for the same property. `min-height` and `min-width` are
       constraints Ant does not set — it sets `height` and `width` — so a value here survived every
       Ant rule and permanently changed the control's geometry. That shipped once: it widened the
       icon-only buttons in a consumer's header until the brand overlapped them at 360px. */
    const properties = [...declarations.matchAll(/^\s*([\w-]+)\s*:/gm)].map((match) => match[1]!);
    const constraints = properties.filter((name) => /^(min|max)-/.test(name));

    expect(constraints, `constraint properties: ${constraints.join(', ')}`).toEqual([]);
  });

  it('states no raw colour, radius, or control size', () => {
    /* AGENTS rule 1. `100%`, `1`, `none`, `auto`, and `transparent` carry no brand decision; a hex,
       an oklch(), or a pixel length would. */
    const values = [...declarations.matchAll(/^\s*[\w-]+:\s*([^;]+);/gm)].map((match) => match[1]!.trim());
    const raw = values.filter((value) => /#[0-9a-f]{3,8}\b|oklch\(|rgba?\(|\d+px|\d*\.?\d+rem/i.test(value));

    expect(raw, `raw values: ${raw.join(' | ')}`).toEqual([]);
  });
});
