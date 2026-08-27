#!/usr/bin/env node
// The docs pages are the library's only demonstration of itself, so their shape is a contract
// rather than a matter of taste. This checks the part of that contract a machine can see: that
// every component page shows the component running, that every example carries the source it
// claims to be, that nothing is rendered outside the example frame, and that the sections arrive
// in one order across the whole catalog.
//
// Run with `pnpm check:docs`. The rules are documented in docs/authoring-pages.md.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const APP = join(ROOT, 'docs/app');
const CAPABILITY_LEDGER = JSON.parse(
  readFileSync(join(ROOT, 'docs/component-capabilities.json'), 'utf8'),
);

/** Pages that are not a component reference and so do not carry the component-page contract. */
const NOT_A_COMPONENT_PAGE = new Set([
  'app/page.mdx',
  'app/theming/page.mdx',
  'app/labels/page.mdx',
  'app/motion/page.mdx',
]);

/** The recipes are compositions of documented components, not components; they carry their own shape. */
const isRecipe = (id) => id.startsWith('app/recipes/');

/** Components rendered directly in MDX prose on purpose — they are the page's own furniture. */
const PROSE_COMPONENTS = new Set(['Demo', 'PropsTable', 'Guidance', 'CodeBlock', 'Text', 'Callout']);

/** The canonical order. A page may omit any of these, but may not present them out of order. */
const SECTION_ORDER = ['Playground', 'Usage', '*', 'Props', 'Skeleton', 'Keyboard', 'Tokens'];

/**
 * What each library entry actually exports. A page that imports a client component from the server
 * entry builds cleanly in the editor and fails in the browser with a blank page, which is the one
 * kind of broken example a reader cannot diagnose — so it is checked here rather than found later.
 */
function entryExports(file) {
  const source = readFileSync(join(ROOT, 'packages/ui/src', file), 'utf8');
  const names = new Set();
  for (const [, list] of source.matchAll(/export\s+(?:type\s+)?\{([\s\S]*?)\}\s+from/g)) {
    for (const part of list.split(',')) {
      const name = part.trim().split(/\s+as\s+/).pop()?.trim();
      if (name) names.add(name);
    }
  }
  return names;
}

const ENTRIES = { '@ceebee/ui': entryExports('index.ts'), '@ceebee/ui/client': entryExports('client.ts') };

function mdxPages(dir, found = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) mdxPages(path, found);
    else if (entry === 'page.mdx') found.push(path);
  }
  return found;
}

/**
 * MDX has three kinds of code that must not be read as page content: fenced blocks, the template
 * literals passed to `code={...}`, and JSX inside those. Everything this file checks is about what
 * the page *renders*, so all three are removed before anything else looks at a line.
 */
function renderedLines(source) {
  const lines = source.split('\n');
  const rendered = [];
  let inFence = false;
  let inTemplate = false;

  lines.forEach((line, index) => {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;

    // A line can both open a template literal and carry rendered JSX before it, so the two halves
    // are separated rather than the whole line being kept or dropped.
    let text = line.replace(/`[^`]*`/g, '``');
    const odd = (text.match(/`/g) || []).length % 2 === 1;
    if (inTemplate) text = odd ? text.slice(text.indexOf('`') + 1) : '';
    else if (odd) text = text.slice(0, text.indexOf('`'));
    if (odd) inTemplate = !inTemplate;

    rendered.push({ number: index + 1, text });
  });

  return rendered;
}

/**
 * The component names an example's stage renders, and the ones its code claims. A stage imports
 * `WatermarkSkeleton` where the public API reads `Watermark.Skeleton`, and wraps a stateful example
 * in a `SomethingDemo`; both are the same component under a different local name, so each name
 * also contributes its base.
 */
function componentsIn(text) {
  const names = new Set();
  for (const [, name] of text.matchAll(/<([A-Z][A-Za-z0-9]*)/g)) {
    names.add(name);
    const base = name.replace(/(?:Skeleton|Demo|Playground|Showcase)$/, '');
    if (base) names.add(base);
  }
  return names;
}

/**
 * Each `<Demo …>…</Demo>` as a pair: the attributes it was opened with, and the children it
 * renders. Written as a scan rather than a regex because a demo's children routinely contain
 * both `>` and nested elements.
 */
function demoBlocks(source) {
  const blocks = [];
  let cursor = 0;

  while (true) {
    const start = source.indexOf('<Demo', cursor);
    if (start === -1) break;

    const openEnd = findOpenTagEnd(source, start);
    if (openEnd === -1) break;

    const attributes = source.slice(start, openEnd);
    const selfClosing = source[openEnd - 1] === '/';
    const close = selfClosing ? openEnd : source.indexOf('</Demo>', openEnd);
    const children = selfClosing || close === -1 ? '' : source.slice(openEnd + 1, close);

    blocks.push({
      line: source.slice(0, start).split('\n').length,
      attributes,
      children,
    });
    cursor = close === -1 ? openEnd : close + 1;
  }

  return blocks;
}

/** The index of the `>` that closes an opening tag, skipping the ones inside braces and strings. */
function findOpenTagEnd(source, start) {
  let braces = 0;
  let quote = null;
  for (let i = start; i < source.length; i += 1) {
    const char = source[i];
    if (quote) {
      if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === '`') quote = char;
    else if (char === '{') braces += 1;
    else if (char === '}') braces -= 1;
    else if (char === '>' && braces === 0) return i;
  }
  return -1;
}

function check(path) {
  const id = relative(ROOT, path).replace('docs/', '');
  const source = readFileSync(path, 'utf8');
  const rendered = renderedLines(source);
  const problems = [];
  const report = (line, message) => problems.push({ line, message });

  const componentPage = !NOT_A_COMPONENT_PAGE.has(id) && !isRecipe(id);

  // 0. Everything the page imports from the library is actually there, on that side of the client
  //    boundary.
  const fromClientEntry = new Set();
  for (const match of source.matchAll(/^import\s+(?:type\s+)?\{([^}]*)\}\s+from\s+'(@ceebee\/ui(?:\/client)?)';/gm)) {
    const exported = ENTRIES[match[2]];
    const other = match[2] === '@ceebee/ui' ? '@ceebee/ui/client' : '@ceebee/ui';
    const line = source.slice(0, match.index).split('\n').length;
    for (const part of match[1].split(',')) {
      const name = part.trim();
      if (!name) continue;
      if (match[2] === '@ceebee/ui/client') fromClientEntry.add(name);
      if (exported.has(name)) continue;
      const hint = ENTRIES[other].has(name) ? ` It is exported from '${other}'.` : '';
      report(line, `'${match[2]}' does not export ${name}; the example will not render.${hint}`);
    }
  }

  // 0b. An MDX page is a Server Component, so a client component reaches it as a client reference
  //     rather than the function itself — and the statics attached with Object.assign do not
  //     survive that crossing. `Watermark.Skeleton` therefore throws at render time where
  //     `Result.Skeleton` is fine. Stage the standalone export instead for anything client-bound.
  for (const { number, text } of rendered) {
    for (const [, dotted, member] of text.matchAll(/<([A-Z][A-Za-z0-9]*)\.([A-Z][A-Za-z0-9]*)/g)) {
      if (!fromClientEntry.has(dotted)) continue;
      report(
        number,
        `${dotted}.${member} comes from '@ceebee/ui/client', so its compound statics are lost crossing into this Server Component. Import ${dotted}${member} and stage that instead.`,
      );
    }
  }

  // 1. Every example carries its source, and the source describes the example.
  if (/<Demo[\s>]/.test(source) && !/^import\s+\{[^}]*\bDemo\b[^}]*\}\s+from\s+'[^']*components\/demo'/m.test(source)) {
    report(1, 'The page uses <Demo> without importing it; MDX fails at render time, not at build.');
  }
  for (const block of demoBlocks(source)) {
    const code = block.attributes.match(/\bcode=\{`([\s\S]*?)`\}/);
    if (!code) {
      report(block.line, 'Demo has no code prop; an example without its source is half a demo.');
      continue;
    }
    if (!code[1].trim()) {
      report(block.line, 'Demo has an empty code prop.');
      continue;
    }
    const staged = componentsIn(block.children);
    const claimed = componentsIn(code[1]);
    if (staged.size > 0 && claimed.size > 0) {
      const shared = [...staged].some((name) => claimed.has(name));
      if (!shared) {
        report(
          block.line,
          `Demo code mentions ${[...claimed].join(', ')} but the stage renders ${[...staged].join(', ')}.`,
        );
      }
    }
  }

  // 2. Nothing renders outside the example frame. A component dropped straight into the prose has
  //    no source beside it, no stage around it, and no containment when it is fixed or sticky.
  let insideElement = 0;
  for (const { number, text } of rendered) {
    const opening = text.match(/^<([A-Z][A-Za-z0-9.]*)/);
    if (insideElement === 0 && opening) {
      const root = opening[1].split('.')[0];
      const isDemoComponent = /(?:Demo|Playground|Showcase)$/.test(root);
      if (!PROSE_COMPONENTS.has(root) && !isDemoComponent) {
        report(number, `<${opening[1]}> renders outside a Demo; wrap it in one so it has a stage and its source.`);
      }
    }
    insideElement += (text.match(/<[A-Z]/g) || []).length - (text.match(/<\/[A-Z]/g) || []).length;
    insideElement -= (text.match(/\/>\s*$/) || []).length;
    if (insideElement < 0) insideElement = 0;
  }

  if (!componentPage) return { id, problems };

  // 3. A component page states what it is, shows it running, lists its props, and says when not
  //    to reach for it.
  // Atom, Composition, and Widget are the three docs tiers CONTEXT.md defines; a page may not
  // invent a fourth.
  const title = source.match(/^# (.+)$/m);
  const label = title?.[1].match(/<span className="docs__label">([A-Za-z]+)<\/span>/);
  if (!label) {
    report(1, 'The title carries no docs__label; every component page states its tier.');
  } else if (!['Atom', 'Composition', 'Widget'].includes(label[1])) {
    report(1, `"${label[1]}" is not a docs tier; CONTEXT.md defines Atom, Composition, and Widget.`);
  }
  const hasLiveExample =
    /<Demo[\s>]/.test(source) || /<[A-Z][A-Za-z0-9]*(?:Demo|Playground|Showcase)\b/.test(source);
  if (!hasLiveExample) report(1, 'No live example: the page describes the component without running it.');
  if (!/<PropsTable\b/.test(source)) report(1, 'No PropsTable.');
  if (!/<Guidance\b/.test(source)) report(1, 'No Guidance pair.');

  // 4. The sections arrive in one order across the catalog.
  const headings = [...source.matchAll(/^## (.+)$/gm)].map((match) => ({
    title: match[1].trim(),
    index: match.index,
    line: source.slice(0, match.index).split('\n').length,
  }));

  // Native Ceebee pages open on a canonical live example. Catalog pages follow the upstream
  // information architecture instead: "When to use" explains the choice, then "Examples" starts
  // the live gallery. Both keep the first meaningful interaction near the top without requiring a
  // duplicate, untitled card above the upstream example set.
  if (headings.length > 0) {
    const first = headings[0];
    const opening = source.slice(first.index, headings[1]?.index ?? source.length);
    const opensLive =
      /<Demo[\s>]/.test(opening) || /<[A-Z][A-Za-z0-9]*(?:Demo|Playground|Showcase)\b/.test(opening);
    const examples = headings.find((heading) => heading.title === 'Examples');
    const examplesSection = examples
      ? source.slice(examples.index, headings.find((heading) => heading.index > examples.index)?.index ?? source.length)
      : '';
    const examplesOpenLive =
      /<Demo[\s>]/.test(examplesSection) || /<[A-Z][A-Za-z0-9]*(?:Demo|Playground|Showcase)\b/.test(examplesSection);
    if (!opensLive && !examplesOpenLive) {
      report(first.line, `The page opens on "## ${first.title}" with no live example and has no live Examples gallery.`);
    }
  }
  let rank = -1;
  for (const heading of headings) {
    const position = SECTION_ORDER.indexOf(heading.title);
    if (position === -1) continue; // a free-form section, allowed between Usage and Props
    if (position < rank) {
      report(heading.line, `"## ${heading.title}" is out of order; the order is ${SECTION_ORDER.filter((s) => s !== '*').join(' → ')}.`);
    }
    rank = Math.max(rank, position);
  }

  return { id, problems };
}

/**
 * A demo written as a React component uses the same frame as one written in MDX. The moment a file
 * builds its own `<div className="demo">`, that page stops matching the rest of the catalog as soon
 * as the shared frame changes — which is how the frame drifted in the first place.
 */
function checkHandRolledFrames() {
  const problems = [];
  const search = (dir) => {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) {
        if (entry !== 'node_modules' && entry !== '.next') search(path);
      } else if (entry.endsWith('.tsx') && entry !== 'demo.tsx') {
        const source = readFileSync(path, 'utf8');
        if (source.includes('className="demo"') || source.includes('className="demo__stage"')) {
          problems.push({
            line: source.slice(0, source.indexOf('className="demo')).split('\n').length,
            message: 'Builds its own demo frame; return <Demo> from components/demo instead.',
          });
        }
      }
    }
  };
  search(join(ROOT, 'docs/components'));
  search(APP);
  return { id: 'docs/**/*.tsx', problems };
}

/**
 * A component is not complete because its page exists. The capability ledger records the public
 * claim and the exact docs, tests, and exports that prove it. Planned and deliberately absent
 * capabilities remain visible without pretending that they already ship.
 */
function checkCapabilityLedger() {
  const problems = [];
  const report = (message) => problems.push({ line: 1, message });
  const decisions = new Set(['supported', 'planned', 'replaced', 'deliberately-absent']);
  const names = new Set();

  if (CAPABILITY_LEDGER.schemaVersion !== 1) report('Unsupported capability-ledger schema version.');

  for (const component of CAPABILITY_LEDGER.components ?? []) {
    if (names.has(component.name)) report(`Duplicate component ${component.name}.`);
    names.add(component.name);

    const docsPath = join(ROOT, component.docsPage);
    let docs = '';
    try {
      docs = readFileSync(docsPath, 'utf8');
    } catch {
      report(`${component.name} points to missing docs page ${component.docsPage}.`);
      continue;
    }

    if (!docs.includes(`# ${component.name} <span className="docs__label">${component.tier}</span>`)) {
      report(`${component.name} tier does not match its docs title.`);
    }

    const entry = ENTRIES[component.publicExports?.entry];
    if (!entry) report(`${component.name} names an unknown public entry ${component.publicExports?.entry}.`);
    for (const name of component.publicExports?.names ?? []) {
      if (entry && !entry.has(name)) report(`${component.name} claims missing public export ${name}.`);
    }

    for (const section of component.requiredSections ?? []) {
      if (!docs.includes(`## ${section}`)) report(`${component.name} docs are missing required section "${section}".`);
    }

    const capabilityIds = new Set();
    let hasPlannedCapability = false;
    for (const capability of component.capabilities ?? []) {
      const label = `${component.name}.${capability.id}`;
      if (capabilityIds.has(capability.id)) report(`Duplicate capability ${label}.`);
      capabilityIds.add(capability.id);
      if (!decisions.has(capability.decision)) report(`${label} has unknown decision ${capability.decision}.`);

      if (capability.decision === 'supported') {
        if (!capability.docsEvidence?.length) report(`${label} has no docs evidence.`);
        if (!capability.testEvidence?.length) report(`${label} has no public-interface test evidence.`);
        for (const evidence of capability.docsEvidence ?? []) {
          if (!docs.includes(evidence)) report(`${label} docs evidence is missing: ${evidence}`);
        }
        for (const evidence of capability.testEvidence ?? []) {
          let test = '';
          try {
            test = readFileSync(join(ROOT, evidence.file), 'utf8');
          } catch {
            report(`${label} points to missing test file ${evidence.file}.`);
            continue;
          }
          if (!test.includes(evidence.contains)) report(`${label} test evidence is missing: ${evidence.contains}`);
        }
      } else {
        if (!capability.rationale?.trim()) report(`${label} needs a rationale for decision ${capability.decision}.`);
        if (capability.decision === 'planned') hasPlannedCapability = true;
      }
    }

    if (component.completion === 'complete' && hasPlannedCapability) {
      report(`${component.name} is marked complete while planned capabilities remain.`);
    }
    if (!['complete', 'partial'].includes(component.completion)) {
      report(`${component.name} has unknown completion ${component.completion}.`);
    }
  }

  return { id: 'docs/component-capabilities.json', problems };
}

const results = [...mdxPages(APP).map(check), checkHandRolledFrames(), checkCapabilityLedger()].sort((a, b) =>
  a.id.localeCompare(b.id),
);
const failing = results.filter((result) => result.problems.length > 0);

for (const result of failing) {
  console.log(`\n${result.id}`);
  for (const problem of result.problems) console.log(`  ${result.id}:${problem.line}  ${problem.message}`);
}

const total = failing.reduce((sum, result) => sum + result.problems.length, 0);
if (total === 0) {
  const capabilities = CAPABILITY_LEDGER.components.flatMap((component) => component.capabilities);
  const supported = capabilities.filter((capability) => capability.decision === 'supported').length;
  const open = capabilities.filter((capability) => capability.decision === 'planned').length;
  console.log(`All ${results.length - 1} docs pages match the page contract.`);
  console.log(`Capability ledger proves ${supported} supported capabilities; ${open} remain explicitly planned.`);
  process.exit(0);
}
console.log(`\n${total} problem(s) across ${failing.length} of ${results.length} pages.`);
process.exit(1);
