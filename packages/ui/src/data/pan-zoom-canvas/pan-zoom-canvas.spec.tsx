import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MotionProvider } from '../../motion/motion-provider.js';
import { PanZoomCanvas } from './pan-zoom-canvas.js';

describe('PanZoomCanvas', () => {
  it('supports named keyboard pan, zoom, and reset controls', () => {
    render(
      <PanZoomCanvas
        label="Idea relationships"
        zoomInLabel="Zoom in"
        zoomOutLabel="Zoom out"
        resetLabel="Reset map"
        zoomStatusLabel="Map zoom"
      >
        <a href="/ideas/example">Example idea</a>
      </PanZoomCanvas>,
    );

    const viewport = screen.getByRole('region', { name: 'Idea relationships' });
    fireEvent.keyDown(viewport, { key: 'ArrowRight' });
    fireEvent.keyDown(viewport, { key: '+' });

    expect(viewport).toHaveAttribute('data-pan-x', '1');
    expect(screen.getByRole('status', { name: 'Map zoom' })).toHaveTextContent('125%');

    fireEvent.click(screen.getByRole('button', { name: 'Reset map' }));
    expect(viewport).toHaveAttribute('data-pan-x', '0');
    expect(screen.getByRole('status', { name: 'Map zoom' })).toHaveTextContent('100%');
  });

  it('keeps nodes keyboard reachable and exposes the gesture hint', () => {
    render(
      <PanZoomCanvas label="Idea relationships" hint="Drag to pan. Pinch or use the controls to zoom.">
        <button type="button">Open idea</button>
      </PanZoomCanvas>,
    );

    expect(screen.getByRole('button', { name: 'Open idea' })).toBeInTheDocument();
    expect(screen.getByText('Drag to pan. Pinch or use the controls to zoom.')).toBeInTheDocument();
  });

  it('preserves the final transform without transition when motion is disabled', () => {
    const { container } = render(
      <MotionProvider enabled={false}>
        <PanZoomCanvas label="Idea relationships">
          <span>Node</span>
        </PanZoomCanvas>
      </MotionProvider>,
    );

    expect(container.querySelector('.cb-pan-zoom-canvas')).toHaveAttribute('data-motion', 'false');
  });

  it('ships a named loading state', () => {
    render(<PanZoomCanvas.Skeleton label="Loading relationship map" />);
    expect(screen.getByRole('status', { name: 'Loading relationship map' })).toBeInTheDocument();
  });

  describe('fullscreen', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
      Reflect.deleteProperty(document, 'fullscreenEnabled');
      Reflect.deleteProperty(document, 'fullscreenElement');
      Reflect.deleteProperty(Element.prototype, 'requestFullscreen');
      Reflect.deleteProperty(Document.prototype, 'exitFullscreen');
    });

    function enableFullscreenApi() {
      const state: { element: Element | null } = { element: null };
      Object.defineProperty(document, 'fullscreenEnabled', { configurable: true, value: true });
      Object.defineProperty(document, 'fullscreenElement', { configurable: true, get: () => state.element });
      Object.defineProperty(Element.prototype, 'requestFullscreen', {
        configurable: true,
        value(this: Element) {
          state.element = this;
          document.dispatchEvent(new Event('fullscreenchange'));
          return Promise.resolve();
        },
      });
      Object.defineProperty(Document.prototype, 'exitFullscreen', {
        configurable: true,
        value() {
          state.element = null;
          document.dispatchEvent(new Event('fullscreenchange'));
          return Promise.resolve();
        },
      });
      return state;
    }

    /* A control that cannot do anything is worse than no control, so the browsers without the API —
       iOS Safari among them — are offered the canvas without it. */
    it('offers no control where the browser cannot go fullscreen', () => {
      Object.defineProperty(document, 'fullscreenEnabled', { configurable: true, value: false });
      render(<PanZoomCanvas label="Idea relationships" fullscreenLabel="Fullscreen"><span>Node</span></PanZoomCanvas>);

      expect(screen.queryByRole('button', { name: 'Fullscreen' })).not.toBeInTheDocument();
    });

    it('enters and leaves through the browser, and says which state it is in', () => {
      enableFullscreenApi();
      const { container } = render(
        <PanZoomCanvas label="Idea relationships" fullscreenLabel="Fullscreen" exitFullscreenLabel="Leave fullscreen">
          <span>Node</span>
        </PanZoomCanvas>,
      );

      const root = container.querySelector('.cb-pan-zoom-canvas')!;
      expect(root).toHaveAttribute('data-fullscreen', 'false');

      fireEvent.click(screen.getByRole('button', { name: 'Fullscreen' }));
      expect(root).toHaveAttribute('data-fullscreen', 'true');
      expect(screen.getByRole('button', { name: 'Leave fullscreen' })).toHaveAttribute('aria-pressed', 'true');

      fireEvent.click(screen.getByRole('button', { name: 'Leave fullscreen' }));
      expect(root).toHaveAttribute('data-fullscreen', 'false');
      expect(screen.getByRole('button', { name: 'Fullscreen' })).toHaveAttribute('aria-pressed', 'false');
    });

    /* Escape is the browser's, not ours: the component follows the event rather than tracking its
       own idea of whether it is open. */
    it('follows a dismissal it did not initiate', () => {
      const state = enableFullscreenApi();
      const { container } = render(<PanZoomCanvas label="Idea relationships" fullscreenLabel="Fullscreen"><span>Node</span></PanZoomCanvas>);

      fireEvent.click(screen.getByRole('button', { name: 'Fullscreen' }));
      state.element = null;
      fireEvent(document, new Event('fullscreenchange'));

      expect(container.querySelector('.cb-pan-zoom-canvas')).toHaveAttribute('data-fullscreen', 'false');
    });
  });
});
