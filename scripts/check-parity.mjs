import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const config = JSON.parse(readFileSync(resolve(root, 'docs/parity.config.json'), 'utf8'));
const ledger = JSON.parse(readFileSync(resolve(root, 'docs/parity.generated.json'), 'utf8'));

if (ledger.generatedFrom.version !== config.antDesign.version || ledger.generatedFrom.commit !== config.antDesign.commit) {
  throw new Error('The parity ledger was not generated from the configured source pin.');
}

for (const [name, , docsPage] of config.components) {
  const component = ledger.components[name];
  if (!component) throw new Error(`Missing parity record for ${name}.`);
  if (!existsSync(resolve(root, docsPage))) throw new Error(`${name} points to missing docs page ${docsPage}.`);
  const missing = Object.values(component.missing).flat();
  if (component.status === 'proven' && missing.length > 0) throw new Error(`${name} is marked proven with ${missing.length} missing parity items.`);
}

console.log(`Catalog ledger ${ledger.generatedFrom.version} is structurally valid: ${ledger.summary.components} components, ${ledger.summary.officialExamples} examples, ${ledger.summary.apiEntries} API entries.`);
