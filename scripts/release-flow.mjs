/**
 * The parts of a release around the publish itself, kept out of release.mjs so that file stays the
 * sequence and this one the mechanics.
 *
 * - `toMain` — a release is always cut from `main`. Run from a feature branch, it merges that branch into
 *   `main` in whichever worktree has `main` checked out, the way every earlier release landed ("Merge: …"),
 *   and hands back that worktree so the release carries on there.
 * - `waitUntilPublished` — `changeset publish` returning is not the package being installable: with staged
 *   publishing npm holds the version until a person approves it on npmjs.com. This polls the registry until
 *   the version answers, opening the package page once if it has not appeared, so "done" means installable.
 */
import { spawn, spawnSync } from 'node:child_process';
import { platform } from 'node:process';

const git = (args, cwd) => {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`git ${args.join(' ')} failed:\n${result.stderr}`);
  return result.stdout.trim();
};

export function openInBrowser(url, why) {
  console.log(`\n  → opening ${url}\n    ${why}\n`);
  spawn(platform === 'darwin' ? 'open' : 'xdg-open', [url], { stdio: 'ignore', detached: true }).unref();
}

/** The worktree that has `main` checked out, or null when none does. */
function mainWorktree(cwd) {
  const blocks = git(['worktree', 'list', '--porcelain'], cwd).split('\n\n');
  for (const block of blocks) {
    const path = block.match(/^worktree (.+)$/m)?.[1];
    if (path && /^branch refs\/heads\/main$/m.test(block)) return path;
  }
  return null;
}

/**
 * Merges the current branch into `main` and returns the directory to release from. On `main` already, it
 * only fast-forwards from the remote.
 */
export function toMain(cwd) {
  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD'], cwd);
  git(['fetch', '--quiet', 'origin'], cwd);
  if (branch === 'main') {
    git(['merge', '--ff-only', '--quiet', 'origin/main'], cwd);
    return cwd;
  }
  const target = mainWorktree(cwd);
  if (!target) throw new Error(`No worktree has main checked out. Check it out somewhere, or run this from main.`);
  if (git(['status', '--porcelain'], target)) throw new Error(`The main worktree at ${target} has changes. Commit or stash them first.`);
  git(['merge', '--ff-only', '--quiet', 'origin/main'], target);
  const subject = git(['log', '-1', '--format=%s', branch], cwd);
  console.log(`\n▸ Merging ${branch} into main (${target})`);
  git(['merge', '--no-ff', '--quiet', '-m', `Merge: ${subject}`, branch], target);
  return target;
}

/**
 * Whether npm will accept a publish from this machine. A stale token in ~/.npmrc does not trigger browser
 * authentication — npm answers E401 and gives up — so this is checked before anything is merged or versioned.
 */
export function npmUser() {
  const result = spawnSync('npm', ['whoami', '--registry', 'https://registry.npmjs.org/'], { encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : null;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function published(name, version) {
  const result = spawnSync('npm', ['view', `${name}@${version}`, 'version'], { encoding: 'utf8' });
  return result.status === 0 && result.stdout.trim() === version;
}

/** Polls until `name@version` is installable. Opens the package page once if it is held for approval. */
export async function waitUntilPublished(name, version, { timeoutMs = 20 * 60_000 } = {}) {
  const started = Date.now();
  let prompted = false;
  while (Date.now() - started < timeoutMs) {
    if (published(name, version)) return true;
    if (!prompted && Date.now() - started > 30_000) {
      prompted = true;
      openInBrowser(`https://www.npmjs.com/package/${name}`,
        `${name}@${version} is not installable yet. If npm staged it, approve it there; this waits and carries on.`);
    }
    await sleep(5_000);
  }
  return false;
}
