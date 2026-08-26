import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const agentsDirectory = resolve(".codex/agents");
const allowedKeys = new Set([
  "name",
  "description",
  "model",
  "model_reasoning_effort",
  "sandbox_mode",
  "developer_instructions",
]);
const allowedModels = new Set(["gpt-5.6-luna", "gpt-5.6-terra", "gpt-5.6-sol"]);
const allowedEfforts = new Set(["low", "medium", "high", "xhigh", "max", "ultra"]);
const allowedSandboxModes = new Set(["read-only", "workspace-write"]);

const readScalar = (source, key) =>
  source.match(new RegExp(`^${key}\\s*=\\s*"([^"]+)"`, "m"))?.[1];

const files = (await readdir(agentsDirectory)).filter((file) => file.endsWith(".toml"));
const errors = [];

for (const file of files) {
  const source = await readFile(resolve(agentsDirectory, file), "utf8");
  const keys = [...source.matchAll(/^([a-z_]+)\s*=/gm)].map((match) => match[1]);

  for (const key of keys) {
    if (!allowedKeys.has(key)) errors.push(`${file}: unknown key ${key}`);
  }

  for (const key of ["name", "description", "model", "model_reasoning_effort", "sandbox_mode"]) {
    if (!readScalar(source, key)) errors.push(`${file}: missing ${key}`);
  }

  if (!source.match(/^developer_instructions\s*=\s*"""[\s\S]+"""\s*$/m)) {
    errors.push(`${file}: missing developer_instructions`);
  }

  const model = readScalar(source, "model");
  const effort = readScalar(source, "model_reasoning_effort");
  const sandboxMode = readScalar(source, "sandbox_mode");
  if (model && !allowedModels.has(model)) errors.push(`${file}: unsupported model ${model}`);
  if (effort && !allowedEfforts.has(effort)) errors.push(`${file}: invalid effort ${effort}`);
  if (sandboxMode && !allowedSandboxModes.has(sandboxMode)) {
    errors.push(`${file}: invalid sandbox mode ${sandboxMode}`);
  }
}

if (files.length !== 3) errors.push(`expected 3 custom agents, found ${files.length}`);

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${files.length} Ceebee delegation agents.`);
}

