import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Splitter } from './splitter.js';

const stylesheet = readFileSync(join(process.cwd(), 'packages/ui/src/foundation/splitter/splitter.css'), 'utf8');

function panes() {
  return [<section aria-label="Navigation" key="navigation">Navigation</section>, <main key="content">Content</main>];
}

describe('Splitter', () => {
  it('uses the native separator contract and updates an uncontrolled horizontal value from keys', () => {
    const { getByRole } = render(<Splitter defaultSize={40} minSize={20} maxSize={80}>{panes()}</Splitter>);
    const separator = getByRole('separator', { name: 'Resize panes' });

    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
    expect(separator).toHaveAttribute('aria-valuenow', '40');
    expect(separator).toHaveAttribute('aria-valuemin', '20');
    expect(separator).toHaveAttribute('aria-valuemax', '80');
    expect(separator).toHaveAttribute('tabindex', '0');

    fireEvent.keyDown(separator, { key: 'ArrowRight' });
    expect(separator).toHaveAttribute('aria-valuenow', '41');
    fireEvent.keyDown(separator, { key: 'Home' });
    expect(separator).toHaveAttribute('aria-valuenow', '20');
    fireEvent.keyDown(separator, { key: 'End' });
    expect(separator).toHaveAttribute('aria-valuenow', '80');
  });

  it('uses vertical arrow keys and keeps a controlled value owned by its caller', () => {
    const onSizeChange = vi.fn();
    const { getByRole } = render(
      <Splitter size={35} minSize={10} maxSize={90} orientation="vertical" onSizeChange={onSizeChange}>{panes()}</Splitter>,
    );
    const separator = getByRole('separator');

    expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
    fireEvent.keyDown(separator, { key: 'ArrowDown' });
    fireEvent.keyDown(separator, { key: 'ArrowRight' });
    expect(separator).toHaveAttribute('aria-valuenow', '35');
    expect(onSizeChange).toHaveBeenCalledTimes(1);
    expect(onSizeChange).toHaveBeenLastCalledWith(36);
  });

  it('does not capture, resize, or expose a tab stop while disabled', () => {
    const onSizeChange = vi.fn();
    const { getByRole } = render(<Splitter defaultSize={50} disabled onSizeChange={onSizeChange}>{panes()}</Splitter>);
    const separator = getByRole('separator');
    const setPointerCapture = vi.fn();
    separator.setPointerCapture = setPointerCapture;

    fireEvent.keyDown(separator, { key: 'ArrowRight' });
    fireEvent.pointerDown(separator, { pointerId: 1, clientX: 80 });
    expect(separator).toHaveAttribute('tabindex', '-1');
    expect(separator).toHaveAttribute('aria-disabled', 'true');
    expect(separator).toHaveAttribute('aria-valuenow', '50');
    expect(onSizeChange).not.toHaveBeenCalled();
    expect(setPointerCapture).not.toHaveBeenCalled();
  });

  it('maps horizontal pointer position within the available pane space and releases capture when dragging ends', () => {
    const onSizeChange = vi.fn();
    const { container, getByRole } = render(<Splitter minSize={20} maxSize={80} onSizeChange={onSizeChange}>{panes()}</Splitter>);
    const root = container.firstElementChild as HTMLDivElement;
    const separator = getByRole('separator') as HTMLDivElement;
    const captured = new Set<number>();
    root.getBoundingClientRect = () => ({ x: 0, y: 0, width: 400, height: 200, top: 30, right: 400, bottom: 230, left: 0, toJSON: () => ({}) });
    separator.getBoundingClientRect = () => ({ x: 196, y: 30, width: 8, height: 200, top: 30, right: 204, bottom: 230, left: 196, toJSON: () => ({}) });
    separator.setPointerCapture = (pointerId) => { captured.add(pointerId); };
    separator.hasPointerCapture = (pointerId) => captured.has(pointerId);
    separator.releasePointerCapture = (pointerId) => { captured.delete(pointerId); };

    fireEvent.pointerDown(separator, { pointerId: 1, clientX: 200, clientY: 50 });
    fireEvent.pointerMove(separator, { pointerId: 1, clientX: 390, clientY: 50 });
    fireEvent.pointerUp(separator, { pointerId: 1, clientX: 398, clientY: 50 });

    expect(onSizeChange).toHaveBeenNthCalledWith(1, 50);
    expect(onSizeChange).toHaveBeenLastCalledWith(80);
    expect(captured.has(1)).toBe(false);
  });

  it('maps vertical pointer position within available pane space and cleans up a cancelled drag', () => {
    const onSizeChange = vi.fn();
    const { container, getByRole } = render(<Splitter orientation="vertical" onSizeChange={onSizeChange}>{panes()}</Splitter>);
    const root = container.firstElementChild as HTMLDivElement;
    const separator = getByRole('separator') as HTMLDivElement;
    const captured = new Set<number>();
    root.getBoundingClientRect = () => ({ x: 0, y: 0, width: 300, height: 300, top: 20, right: 300, bottom: 320, left: 0, toJSON: () => ({}) });
    separator.getBoundingClientRect = () => ({ x: 0, y: 166, width: 300, height: 8, top: 166, right: 300, bottom: 174, left: 0, toJSON: () => ({}) });
    separator.setPointerCapture = (pointerId) => { captured.add(pointerId); };
    separator.hasPointerCapture = (pointerId) => captured.has(pointerId);
    separator.releasePointerCapture = (pointerId) => { captured.delete(pointerId); };

    fireEvent.pointerDown(separator, { pointerId: 2, clientX: 30, clientY: 170 });
    fireEvent.pointerMove(separator, { pointerId: 2, clientX: 30, clientY: 296 });
    fireEvent.pointerCancel(separator, { pointerId: 2 });

    expect(onSizeChange).toHaveBeenNthCalledWith(1, 50);
    expect(onSizeChange).toHaveBeenLastCalledWith(93);
    expect(captured.has(2)).toBe(false);
  });

  it('does not jump when a drag starts on either side of the expanded hit target', () => {
    const onSizeChange = vi.fn();
    const { container, getByRole } = render(<Splitter onSizeChange={onSizeChange}>{panes()}</Splitter>);
    const root = container.firstElementChild as HTMLDivElement;
    const separator = getByRole('separator') as HTMLDivElement;
    const captured = new Set<number>();
    root.getBoundingClientRect = () => ({ x: 0, y: 0, width: 400, height: 200, top: 0, right: 400, bottom: 200, left: 0, toJSON: () => ({}) });
    separator.getBoundingClientRect = () => ({ x: 196, y: 0, width: 8, height: 200, top: 0, right: 204, bottom: 200, left: 196, toJSON: () => ({}) });
    separator.setPointerCapture = (pointerId) => { captured.add(pointerId); };
    separator.hasPointerCapture = (pointerId) => captured.has(pointerId);
    separator.releasePointerCapture = (pointerId) => { captured.delete(pointerId); };

    fireEvent.pointerDown(separator, { pointerId: 3, clientX: 190 });
    expect(onSizeChange).toHaveBeenLastCalledWith(50);
    fireEvent.pointerCancel(separator, { pointerId: 3 });
    fireEvent.pointerDown(separator, { pointerId: 4, clientX: 210 });
    expect(onSizeChange).toHaveBeenLastCalledWith(50);
  });

  it('normalizes non-finite sizes and a reversed range before exposing ARIA state', () => {
    const controlled = render(<Splitter size={Number.NaN} minSize={Number.NaN} maxSize={Number.POSITIVE_INFINITY}>{panes()}</Splitter>);
    expect(controlled.getByRole('separator')).toHaveAttribute('aria-valuenow', '50');
    expect(controlled.getByRole('separator')).toHaveAttribute('aria-valuemin', '0');
    expect(controlled.getByRole('separator')).toHaveAttribute('aria-valuemax', '100');
    controlled.unmount();

    const uncontrolled = render(<Splitter defaultSize={Number.NEGATIVE_INFINITY} minSize={80} maxSize={20}>{panes()}</Splitter>);
    expect(uncontrolled.getByRole('separator')).toHaveAttribute('aria-valuenow', '80');
    expect(uncontrolled.getByRole('separator')).toHaveAttribute('aria-valuemin', '80');
    expect(uncontrolled.getByRole('separator')).toHaveAttribute('aria-valuemax', '80');
  });

  it('rejects anything other than two pane children', () => {
    expect(() => render(<Splitter><div>Only pane</div></Splitter>)).toThrow('Splitter requires exactly two pane children.');
    expect(() => render(<Splitter><div>One</div><div>Two</div><div>Three</div></Splitter>)).toThrow('Splitter requires exactly two pane children.');
  });

  it('unwraps fragments before enforcing its two-pane contract', () => {
    const { getByRole } = render(<Splitter><><section>One</section><main>Two</main></></Splitter>);

    expect(getByRole('separator')).toBeInTheDocument();
  });

  it('renders a two-pane noninteractive skeleton with the requested geometry', () => {
    const { container } = render(<Splitter.Skeleton orientation="vertical" size={30} handleSize="lg" />);
    const skeleton = container.firstElementChild;

    expect(skeleton).toHaveClass('cb-splitter--skeleton', 'cb-splitter--vertical', 'cb-splitter--handle-lg');
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelectorAll('.cb-splitter__skeleton-pane')).toHaveLength(2);
    expect(container.querySelector('[role="separator"]')).toBeNull();
  });

  it('keeps pane proportions inside a fixed handle and provides tokenized hit and focus affordances', () => {
    expect(stylesheet).toContain('flex-grow: var(--cb-splitter-first-grow)');
    expect(stylesheet).toContain('flex-grow: var(--cb-splitter-second-grow)');
    expect(stylesheet).toContain('flex: 0 0 var(--cb-splitter-handle-size)');
    expect(stylesheet).toContain('inset-inline: calc(-1 * var(--cb-space-3))');
    expect(stylesheet).toContain('inset-block: calc(-1 * var(--cb-space-3))');
    expect(stylesheet).toContain('outline: var(--cb-focus-width) solid var(--cb-tone-brand)');
    expect(stylesheet).not.toMatch(/overflow\s*:/);
  });
});
