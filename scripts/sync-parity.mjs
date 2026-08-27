import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

/* Upstream's English prose still carries CJK punctuation in places. Fold it to
   ASCII so the ledger reads as one language. */
const FULLWIDTH = { '（': ' (', '）': ')', '，': ', ', '、': ', ', '：': ': ', '；': '; ', '。': '. ', '？': '?', '！': '!' };

const repositoryRoot = resolve(import.meta.dirname, '..');
const config = JSON.parse(readFileSync(resolve(repositoryRoot, 'docs/parity.config.json'), 'utf8'));
const proofs = JSON.parse(readFileSync(resolve(repositoryRoot, 'docs/parity.proofs.json'), 'utf8'));
const componentSources = JSON.parse(readFileSync(resolve(repositoryRoot, 'docs/component-sources.json'), 'utf8'));
const sourceRoot = resolve(process.argv[2] || process.env.ANT_DESIGN_SOURCE || '');

if (!process.argv[2] && !process.env.ANT_DESIGN_SOURCE) {
  throw new Error('Pass the pinned upstream repository path or set ANT_DESIGN_SOURCE.');
}

const sourceVersion = JSON.parse(readFileSync(resolve(sourceRoot, 'package.json'), 'utf8')).version;
const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: sourceRoot, encoding: 'utf8' }).trim();
if (sourceVersion !== config.antDesign.version || sourceCommit !== config.antDesign.commit) {
  throw new Error(`Expected ${config.antDesign.version} at ${config.antDesign.commit}, received ${sourceVersion} at ${sourceCommit}.`);
}

const components = {};
for (const [name, slug, docsPage] of config.components) {
  const markdownPath = resolve(sourceRoot, 'components', slug, 'index.en-US.md');
  const markdown = readFileSync(markdownPath, 'utf8');
  const officialExamples = [...markdown.matchAll(/<code\s+src="\.\/demo\/([^"_][^"]*\.tsx)"([^>]*)>([^<]+)<\/code>/g)]
    .filter((match) => !match[2].includes('debug'))
    .map((match) => ({ file: match[1], title: match[3], version: attribute(match[2], 'version') }));
  const api = extractApi(markdown);
  const proof = proofs.components[slug] ?? { examples: [], api: [], methods: [] };
  const sourceRecord = componentSources.components[name];
  const runtimeDemoPath = sourceRecord?.strategy === 'antd-runtime' ? sourceRecord.demoPath : undefined;
  const missingExamples = officialExamples
    .filter((example) => runtimeDemoPath
      ? !existsSync(resolve(repositoryRoot, runtimeDemoPath, example.file))
      : !proof.examples?.includes(example.file))
    .map((example) => example.file);
  const missingApi = sourceRecord?.strategy === 'antd-runtime'
    ? []
    : api.properties.filter((property) => !proof.api?.includes(property.key)).map((property) => property.key);
  const missingMethods = sourceRecord?.strategy === 'antd-runtime'
    ? []
    : api.methods.filter((method) => !proof.methods?.includes(method.name)).map((method) => method.name);
  components[name] = {
    slug,
    docsPage,
    source: `components/${slug}`,
    status: missingExamples.length + missingApi.length + missingMethods.length === 0 ? 'proven' : 'partial',
    officialExamples,
    api: api.properties,
    methods: api.methods,
    missing: { examples: missingExamples, api: missingApi, methods: missingMethods },
  };
}

const output = {
  schemaVersion: 1,
  generatedFrom: { version: sourceVersion, commit: sourceCommit },
  summary: {
    components: Object.keys(components).length,
    proven: Object.values(components).filter((component) => component.status === 'proven').length,
    officialExamples: Object.values(components).reduce((sum, component) => sum + component.officialExamples.length, 0),
    apiEntries: Object.values(components).reduce((sum, component) => sum + component.api.length, 0),
  },
  components,
};

writeFileSync(resolve(repositoryRoot, 'docs/parity.generated.json'), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Recorded ${output.summary.components} components, ${output.summary.officialExamples} examples, and ${output.summary.apiEntries} API entries.`);

function extractApi(markdown) {
  const apiStart = markdown.indexOf('\n## API');
  const semanticStart = markdown.indexOf('\n## Semantic DOM', apiStart);
  const apiMarkdown = markdown.slice(apiStart, semanticStart === -1 ? undefined : semanticStart);
  let section = 'root';
  const properties = [];
  const methods = [];
  for (const line of apiMarkdown.split('\n')) {
    const heading = line.match(/^###\s+(.+)/);
    if (heading) section = clean(heading[1]);
    if (!line.startsWith('|') || /^\|\s*[-:]+/.test(line)) continue;
    const cells = line.split(/(?<!\\)\|/).slice(1, -1).map((cell) => clean(cell));
    if (!cells[0] || ['Property', 'Name', 'Parameter'].includes(cells[0])) continue;
    const entry = {
      section,
      name: cells[0],
      key: `${section}.${cells[0]}`,
      description: cells[1] || '',
      type: cells[2] || '',
      default: cells[3] || '',
      version: cells[4] || '',
    };
    if (section.toLowerCase().includes('method')) methods.push(entry);
    else properties.push(entry);
  }
  return { properties, methods };
}

function clean(value) {
  return value
    .replaceAll('~~', '')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replaceAll('`', '')
    .replaceAll('\\|', '|')
    .replace(/[（），、：；。？！]/g, (character) => FULLWIDTH[character])
    .replace(/ {2,}/g, ' ')
    .trim();
}

function attribute(source, name) {
  return source.match(new RegExp(`${name}="([^"]+)"`))?.[1] ?? null;
}
