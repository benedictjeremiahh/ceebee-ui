import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { ptyCommand } from './release-flow.mjs';

test('wraps captured release commands in a BSD terminal on macOS', () => {
  assert.deepEqual(ptyCommand(['npm', 'login'], 'darwin'),
    ['script', ['-q', '/dev/null', 'npm', 'login']]);
});

test('wraps captured release commands in a Linux terminal', () => {
  assert.deepEqual(ptyCommand(['npm', 'login'], 'linux'),
    ['script', ['-qfec', 'npm login', '/dev/null']]);
});

test('keeps the child terminal interactive even when its parent captures output', {
  skip: process.platform !== 'darwin',
}, () => {
  const [command, args] = ptyCommand([process.execPath, '-p',
    'process.stdin.isTTY && process.stdout.isTTY && process.stderr.isTTY']);
  const result = spawnSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /true/);
});
