import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
});
