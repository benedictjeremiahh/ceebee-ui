import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MotionProvider, useMotionSettings } from './motion-provider.js';

function Probe() {
  const { enabled, duration, spring } = useMotionSettings();
  return (
    <span data-testid="probe">
      {String(enabled)}|{duration('base')}|{JSON.stringify(spring('bouncy'))}
    </span>
  );
}

function mockReducedMotion(reduced: boolean) {
  vi.stubGlobal(
    'matchMedia',
    (query: string) =>
      ({
        matches: reduced && query.includes('reduced-motion'),
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }) as unknown as MediaQueryList,
  );
}

afterEach(() => vi.unstubAllGlobals());

describe('MotionProvider', () => {
  it('animates by default', () => {
    mockReducedMotion(false);
    render(
      <MotionProvider>
        <Probe />
      </MotionProvider>,
    );
    const [enabled, duration] = screen.getByTestId('probe').textContent!.split('|');
    expect(enabled).toBe('true');
    expect(Number(duration)).toBeGreaterThan(0);
  });

  it('collapses every duration and spring when the user asked for reduced motion', () => {
    mockReducedMotion(true);
    render(
      <MotionProvider>
        <Probe />
      </MotionProvider>,
    );
    const [enabled, duration, transition] = screen.getByTestId('probe').textContent!.split('|');
    expect(enabled).toBe('false');
    expect(Number(duration)).toBe(0);
    expect(JSON.parse(transition!)).toEqual({ duration: 0 });
  });

  it('honours an app-level off switch even when the system is happy to animate', () => {
    mockReducedMotion(false);
    render(
      <MotionProvider enabled={false}>
        <Probe />
      </MotionProvider>,
    );
    expect(screen.getByTestId('probe').textContent!.split('|')[0]).toBe('false');
  });

  it('scales durations rather than only switching them off', () => {
    mockReducedMotion(false);
    render(
      <MotionProvider scale={0.5}>
        <Probe />
      </MotionProvider>,
    );
    const duration = Number(screen.getByTestId('probe').textContent!.split('|')[1]);
    expect(duration).toBeCloseTo(0.11);
  });
});
