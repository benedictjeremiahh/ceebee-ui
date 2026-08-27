/**
 * The whole release, in one command, with the one step a person has to do made
 * as small as possible.
 *
 * npm publishes this package with browser authentication. That means npm stops
 * mid-publish and prints a URL to open — and the release then sits there until
 * somebody notices. Worse, that URL is the kind of thing terminal tooling
 * redacts on its way past, so "just read it out" is not reliable either.
 *
 * So this watches npm's own output for the URL and opens it in the browser
 * itself. What is left for a person is: click Authorize. Everything on either
 * side of that — versioning, the release commit, the build, the publish, the
 * push with tags — happens without asking.
 *
 * Usage:  pnpm release
 *         pnpm release --dry     (everything except publish and push)
 */
import { spawn } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { platform } from 'node:process';

const DRY = process.argv.includes('--dry');

/* npm's web-auth line, in the two shapes it has been printed in. Matched
   loosely on the host, because the path has changed between npm versions. */
const AUTH_URL = /https:\/\/(?:www\.)?npmjs\.com\/[^\s'"]+/;

function run(command, args, { capture = false } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: capture ? ['inherit', 'pipe', 'pipe'] : 'inherit',
      shell: false,
    });

    let opened = false;
    let output = '';

    if (capture) {
      /* Tee: everything npm says still reaches the terminal, and the URL is
         picked out of it on the way past. */
      for (const stream of [child.stdout, child.stderr]) {
        stream.setEncoding('utf8');
        stream.on('data', (chunk) => {
          output += chunk;
          process.stdout.write(chunk);
          const found = chunk.match(AUTH_URL);
          if (found && !opened) {
            opened = true;
            openInBrowser(found[0]);
          }
        });
      }
    }

    child.on('error', reject);
    child.on('close', (code) => (code === 0
      ? resolve(output)
      : reject(new Error(`${command} ${args.join(' ')} exited ${code}`))));
  });
}

/* npm's browser authentication needs a terminal to wait in.
 *
 * Run without one — from a script, from CI, from an agent — npm prints the URL
 * and exits EOTP in the same breath, so the link is dead before anyone can open
 * it. Under a pty it prints the URL and waits, which is the behaviour this whole
 * script is built around.
 *
 * `script -q /dev/null <command>` is the BSD way to hand a child a pty; the
 * Linux one takes its arguments the other way round. Only used when there is no
 * terminal already, so a person running this by hand gets the plain command. */
function publishCommand() {
  const publish = ['pnpm', 'exec', 'changeset', 'publish'];
  if (process.stdout.isTTY) return [publish[0], publish.slice(1)];
  return platform === 'darwin'
    ? ['script', ['-q', '/dev/null', ...publish]]
    : ['script', ['-qfec', publish.join(' '), '/dev/null']];
}

function openInBrowser(url) {
  const opener = platform === 'darwin' ? 'open' : 'xdg-open';
  console.log(`\n  → opening ${url}\n    Click Authorize there; the publish carries on by itself.\n`);
  spawn(opener, [url], { stdio: 'ignore', detached: true }).unref();
}

async function stdout(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'inherit'] });
    let out = '';
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk) => { out += chunk; });
    child.on('error', reject);
    child.on('close', (code) => (code === 0 ? resolve(out) : reject(new Error(`${command} exited ${code}`))));
  });
}

const step = (message) => console.log(`\n▸ ${message}`);

/* A release built from a tree that does not match the commit is a release
   nobody can reproduce. */
const dirty = (await stdout('git', ['status', '--porcelain'])).trim();
if (dirty) {
  console.error('The working tree has changes. Commit or stash them first:\n');
  console.error(dirty);
  process.exit(1);
}

const pending = readdirSync(new URL('../.changeset/', import.meta.url))
  .filter((name) => name.endsWith('.md') && name !== 'README.md');

if (pending.length) {
  step(`Versioning (${pending.length} changeset${pending.length === 1 ? '' : 's'})`);
  await run('pnpm', ['exec', 'changeset', 'version']);
  const { version } = await import('../packages/ui/package.json', { with: { type: 'json' } })
    .then((module) => module.default);
  /* The docs changelog is generated from CHANGELOG.md, which only exists in its new
     shape after versioning — so regenerate it before the release commit is taken. */
  await run('node', ['docs/changelog.mjs']);
  await run('git', ['add', '-A']);
  await run('git', ['commit', '-m', `Release ${version}`]);
  console.log(`  committed Release ${version}`);
} else {
  step('No pending changesets — releasing what is already versioned');
}

step('Building');
await run('pnpm', ['--filter', '@ceebee/ui', 'build']);

if (DRY) {
  step('--dry: stopping before publish and push');
  process.exit(0);
}

step('Publishing to npm');
await run(...publishCommand(), { capture: true });

step('Pushing');
await run('git', ['push', '--follow-tags']);

console.log('\n✓ Released and pushed.\n');
