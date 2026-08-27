---
"@ceebee/ui": patch
---

Fix `@ceebee/ui/client` failing to load outside a bundler.

The four locale re-exports used extensionless subpaths. The package they come from ships no
`exports` map, so those resolve only under a bundler's resolution — under plain Node ESM they throw
`ERR_MODULE_NOT_FOUND` and take the whole entry with them. That reaches anything importing the
client entry outside a bundler: a Vitest suite in the node environment, a script, or a Next app that
lists `@ceebee/ui` in `serverExternalPackages`.

They now point at the CommonJS files, which Node ESM loads through interop and a bundler resolves
just the same.

Also dropped `embla-carousel-react` from `peerDependencies`. Nothing has imported it since the
carousel source port was removed, so it was asking consumers to install an engine the package does
not use.
