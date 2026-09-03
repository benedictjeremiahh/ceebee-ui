import { execFileSync } from "node:child_process";
import { access, readFile, readdir } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, resolve } from "node:path";

const projectsDirectory = dirname(process.cwd());
const contractHeading = "## CeeBee UI consumer contract";
const inspectableMediaRule = "Inspectable screenshots and gallery media";
const forbiddenRuntime = /(?:from\s+|require\(|import\()\s*["'](antd(?:\/[^"']*)?|@base-ui\/[^"']+|embla-carousel[^"']*|@radix-ui\/[^"']+|@headlessui\/[^"']+|@mantine\/[^"']+)["']/g;
/* The inspectable media rule was a sentence in AGENTS.md that nothing enforced, and one product
   carried a 309-line hand-built viewer for two years underneath it. A product-local viewer looks
   the same every time: a portal or a fixed overlay holding a raw `<img>`, or a file that says what
   it is in its own name. */
const productViewerName = /(?:^|\/)[^/]*(?:lightbox|photo-?viewer|image-?viewer|gallery-?overlay)[^/]*$/i;
const portalImage = /createPortal/;
const rawImage = /<img[\s/>]/;
const forbiddenDependencyPrefixes = [
  "antd",
  "@base-ui/",
  "embla-carousel",
  "@radix-ui/",
  "@headlessui/",
  "@mantine/",
];
const webDependencies = ["next", "react", "vite", "astro", "@sveltejs/kit"];
const sourceExtensions = ["*.js", "*.jsx", "*.mjs", "*.ts", "*.tsx"];
const errors = [];
const consumers = [];
const seenGitDirectories = new Set();

const exists = async (path) => {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

/* Consumers used to be one checkout each beside this one. They are workspaces
   now, so a sibling may hold several applications under `apps/`, and scanning
   only the top level would validate nothing and report success — which is worse
   than failing. Both shapes are discovered, and neither is named here. */
const candidates = [];
for (const entry of await readdir(projectsDirectory, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name === "ceebee-ui" || entry.name.startsWith(".")) continue;
  const sibling = resolve(projectsDirectory, entry.name);
  if (await exists(resolve(sibling, "pnpm-workspace.yaml"))) {
    const appsDirectory = resolve(sibling, "apps");
    if (await exists(appsDirectory)) {
      for (const app of await readdir(appsDirectory, { withFileTypes: true })) {
        if (app.isDirectory()) candidates.push({ name: `${entry.name}/apps/${app.name}`, path: resolve(appsDirectory, app.name) });
      }
    }
    continue;
  }
  if (entry.name.startsWith("ceebee-")) candidates.push({ name: entry.name, path: sibling });
}

for (const entry of candidates) {
  const repository = entry.path;
  const packagePath = resolve(repository, "package.json");
  if (!(await exists(packagePath))) continue;

  const manifest = JSON.parse(await readFile(packagePath, "utf8"));
  const dependencies = { ...manifest.devDependencies, ...manifest.dependencies };
  if (!webDependencies.some((dependency) => dependencies[dependency])) continue;

  const gitDirectory = resolve(repository, execFileSync(
    "git",
    ["-C", repository, "rev-parse", "--git-common-dir"],
    { encoding: "utf8" },
  ).trim());
  /* One workspace is one git directory holding several consumers, so the
     de-duplication that stopped a worktree being counted twice must not now
     collapse them into one. */
  const identity = `${gitDirectory}::${entry.name}`;
  if (seenGitDirectories.has(identity)) continue;
  seenGitDirectories.add(identity);

  consumers.push(entry.name);
  if (!dependencies["@ceebee/ui"]) {
    errors.push(`${entry.name}: missing @ceebee/ui dependency`);
  }
  for (const dependency of Object.keys(dependencies)) {
    if (forbiddenDependencyPrefixes.some((prefix) => dependency.startsWith(prefix))) {
      errors.push(`${entry.name}: depend on ${dependency} through @ceebee/ui instead`);
    }
  }

  /* The contract may be stated once for a whole workspace rather than repeated
     in every application. Either place satisfies it; neither place fails it. */
  const agentsPaths = [resolve(repository, "AGENTS.md"), resolve(repository, "..", "..", "AGENTS.md")];
  const presentAgents = [];
  for (const candidate of agentsPaths) {
    if (await exists(candidate)) presentAgents.push(await readFile(candidate, "utf8"));
  }
  if (presentAgents.length === 0) {
    errors.push(`${entry.name}: missing AGENTS.md consumer contract`);
  } else {
    const agentInstructions = presentAgents.join("\n");
    if (!agentInstructions.includes(contractHeading)) {
      errors.push(`${entry.name}: AGENTS.md is missing the CeeBee UI consumer contract`);
    }
    if (!agentInstructions.includes(inspectableMediaRule)) {
      errors.push(`${entry.name}: AGENTS.md is missing the inspectable media preview rule`);
    }
  }

  const trackedFiles = execFileSync(
    "git",
    ["-C", repository, "ls-files", "--", ...sourceExtensions],
    { encoding: "utf8" },
  ).trim().split("\n").filter(Boolean);

  for (const relativePath of trackedFiles) {
    const source = await readFile(resolve(repository, relativePath), "utf8");
    for (const match of source.matchAll(forbiddenRuntime)) {
      errors.push(`${entry.name}/${relativePath}: import ${match[1]} through @ceebee/ui instead`);
    }
    if (productViewerName.test(relativePath)) {
      errors.push(`${entry.name}/${relativePath}: open inspectable media through Image or Image.PreviewGroup instead of a product-local viewer`);
    } else if (portalImage.test(source) && rawImage.test(source)) {
      errors.push(`${entry.name}/${relativePath}: a portal holding a raw <img> is a product-local media viewer; use Image or Image.PreviewGroup`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${consumers.length} CeeBee web consumers: ${consumers.sort().join(", ")}.`);
}
