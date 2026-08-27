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

// jsdom has no ResizeObserver, and the Coachmark watches its anchor with one.
if (!('ResizeObserver' in globalThis)) {
  class NoopResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = NoopResizeObserver as unknown as typeof ResizeObserver;
}

// Embla tracks which slides are in view with an IntersectionObserver, which jsdom lacks.
if (!('IntersectionObserver' in globalThis)) {
  class NoopIntersectionObserver {
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds: readonly number[] = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  globalThis.IntersectionObserver = NoopIntersectionObserver as unknown as typeof IntersectionObserver;
}

// jsdom implements pointer events as MouseEvent and exposes no PointerEvent constructor,
// which Base UI's controls call when they forward a click.
if (!('PointerEvent' in globalThis)) {
  class JsdomPointerEvent extends MouseEvent {
    readonly pointerId: number;
    readonly pointerType: string;
    readonly isPrimary: boolean;

    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
      this.pointerId = params.pointerId ?? 1;
      this.pointerType = params.pointerType ?? 'mouse';
      this.isPrimary = params.isPrimary ?? true;
    }
  }
  globalThis.PointerEvent = JsdomPointerEvent as unknown as typeof PointerEvent;
}

// jsdom also omits pointer capture, which draggable Base UI controls use after pointerdown.
if (!('setPointerCapture' in HTMLElement.prototype)) {
  const capturedPointers = new WeakMap<HTMLElement, Set<number>>();
  HTMLElement.prototype.setPointerCapture = function setPointerCapture(pointerId) {
    const pointers = capturedPointers.get(this) ?? new Set<number>();
    pointers.add(pointerId);
    capturedPointers.set(this, pointers);
  };
  HTMLElement.prototype.releasePointerCapture = function releasePointerCapture(pointerId) {
    capturedPointers.get(this)?.delete(pointerId);
  };
  HTMLElement.prototype.hasPointerCapture = function hasPointerCapture(pointerId) {
    return capturedPointers.get(this)?.has(pointerId) ?? false;
  };
}
