import { render, screen, waitFor } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useScheduleGridColor } from './use-schedule-grid-color.js';

const originalGetContext = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, 'getContext');

function Harness({ enabled }: { enabled: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const color = useScheduleGridColor(ref, enabled);
  return enabled ? <div ref={ref} data-testid="schedule" data-grid-color={color} style={{ color: '#112233' }} /> : <p>Empty</p>;
}

describe('useScheduleGridColor', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    if (originalGetContext) Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', originalGetContext);
  });

  it('starts observing when an empty schedule later receives items', async () => {
    vi.stubGlobal('matchMedia', () => ({ addEventListener() {}, removeEventListener() {} }));
    vi.stubGlobal('getComputedStyle', () => ({ getPropertyValue: () => '#112233' }));
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: () => ({
        fillStyle: '',
        fillRect() {},
        getImageData: () => ({ data: new Uint8ClampedArray([17, 34, 51, 255]) }),
      }),
    });
    const view = render(<Harness enabled={false} />);
    view.rerender(<Harness enabled />);
    await waitFor(() => expect(screen.getByTestId('schedule')).toHaveAttribute('data-grid-color', '#112233ff'));
  });
});
