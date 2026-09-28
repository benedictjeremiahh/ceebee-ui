import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";

const scriptPath = resolve("scripts/check-consumer-boundaries.mjs");
const contract = [
  "## CeeBee UI consumer contract",
  "Inspectable screenshots and gallery media",
].join("\n");

async function createConsumerFixture(t) {
  const root = await mkdtemp(join(tmpdir(), "ceebee-consumer-boundaries-"));
  t.after(() => rm(root, { recursive: true, force: true }));

  const uiDirectory = join(root, "ceebee-ui");
  const consumerDirectory = join(root, "ceebee-consumer");
  const sourceDirectory = join(consumerDirectory, "src");
  await mkdir(uiDirectory);
  await mkdir(sourceDirectory, { recursive: true });
  await writeFile(join(consumerDirectory, "package.json"), JSON.stringify({
    dependencies: { "@ceebee/ui": "1.0.0", react: "19.0.0" },
  }));
  await writeFile(join(consumerDirectory, "AGENTS.md"), contract);
  await writeFile(join(sourceDirectory, "deleted.spec.ts"), "export {};\n");
  await writeFile(join(sourceDirectory, "remaining.ts"), "export {};\n");

  execFileSync("git", ["init", "-q"], { cwd: consumerDirectory });
  execFileSync("git", ["add", "."], { cwd: consumerDirectory });
  execFileSync("git", [
    "-c", "user.name=Consumer Test",
    "-c", "user.email=consumer-test@example.invalid",
    "commit", "-qm", "Create consumer fixture",
  ], { cwd: consumerDirectory });
  await rm(join(sourceDirectory, "deleted.spec.ts"));

  return { uiDirectory, sourceDirectory };
}

function runConsumerCheck(cwd) {
  return spawnSync(process.execPath, [scriptPath], { cwd, encoding: "utf8" });
}

test("skips a tracked source file deleted in the consumer working tree", async (t) => {
  const { uiDirectory } = await createConsumerFixture(t);

  const result = runConsumerCheck(uiDirectory);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Validated 1 CeeBee web consumers/);
});

test("continues scanning remaining files after a tracked file was deleted", async (t) => {
  const { uiDirectory, sourceDirectory } = await createConsumerFixture(t);
  await writeFile(join(sourceDirectory, "remaining.ts"), 'import { Button } from "antd";\n');

  const result = runConsumerCheck(uiDirectory);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /ceebee-consumer\/src\/remaining\.ts: import antd/);
  assert.doesNotMatch(result.stderr, /ENOENT/);
});
