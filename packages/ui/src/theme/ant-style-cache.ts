import { createCache, extractStyle } from '@ant-design/cssinjs';

export type CeebeeAntStyleCache = ReturnType<typeof createCache>;

/** Creates the Ant CSS-in-JS cache shared by a framework adapter and CeeBee's Ant runtime. */
export function createCeebeeAntStyleCache(): CeebeeAntStyleCache {
  return createCache();
}

/** Extracts only rules not already emitted from a CeeBee-owned Ant style cache. */
export function extractCeebeeAntStyles(cache: CeebeeAntStyleCache): string | undefined {
  const css = extractStyle(cache, { plain: true, once: true });
  return css.includes('.data-ant-cssinjs-cache-path{content:"";}') ? undefined : css;
}
