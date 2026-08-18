import '@testing-library/jest-dom/vitest';

// jsdom implements neither matchMedia nor the reduced-motion query the library reads.
// Default to "no preference"; a spec overrides window.matchMedia to assert the reduced path.
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}
