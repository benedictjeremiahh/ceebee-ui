import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Slider } from './slider.js';
import { Field } from '../field.js';

const stylesheet = readFileSync(join(process.cwd(), 'packages/ui/src/form/slider/slider.css'), 'utf8');

describe('Slider', () => {
  it('uses Base UI range inputs with a stable accessible name, keyboard semantics, and commit callback', async () => {
    const onValueChange = vi.fn();
    const onValueCommitted = vi.fn();
    const user = userEvent.setup();
    render(<Slider label="Volume" defaultValue={20} step={5} onValueChange={onValueChange} onValueCommitted={onValueCommitted} />);

    const thumb = screen.getByRole('slider', { name: 'Volume' });
    expect(thumb).toHaveAttribute('aria-valuenow', '20');
    await user.click(thumb);
    await user.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenLastCalledWith(25);
    expect(onValueCommitted).toHaveBeenLastCalledWith(25);
  });

  it('keeps controlled values external and reports range values in ascending thumb order', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<Slider label="Price" value={20} onValueChange={onValueChange} />);
    const single = screen.getByRole('slider', { name: 'Price' });
    await user.click(single);
    await user.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenLastCalledWith(21);
    expect(single).toHaveAttribute('aria-valuenow', '20');

    rerender(<Slider range label="Price" defaultValue={[20, 80]} onValueChange={onValueChange} />);
    const thumbs = screen.getAllByRole('slider');
    const minimumThumb = thumbs[0]!;
    const maximumThumb = thumbs[1]!;
    expect(thumbs).toHaveLength(2);
    expect(minimumThumb).toHaveAccessibleName('Minimum Price');
    expect(maximumThumb).toHaveAccessibleName('Maximum Price');
    await user.click(minimumThumb);
    await user.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenLastCalledWith([21, 80]);
  });

  it('starts an uncontrolled range at its supplied bounds', () => {
    render(<Slider range label="Price" min={20} max={80} />);
    const thumbs = screen.getAllByRole('slider');
    expect(thumbs[0]!).toHaveAttribute('aria-valuenow', '20');
    expect(thumbs[1]!).toHaveAttribute('aria-valuenow', '80');
  });

  it('uses vertical keyboard geometry, aria value text, and enforced range spacing', async () => {
    const user = userEvent.setup();
    render(
      <Slider
        range
        label="Price"
        defaultValue={[20, 30]}
        minStepsBetweenValues={2}
        step={5}
        orientation="vertical"
        getAriaValueText={(value, index) => `${index === 0 ? 'Minimum' : 'Maximum'} ${value} dollars`}
      />,
    );
    const [minimum] = screen.getAllByRole('slider');
    expect(minimum).toHaveAttribute('aria-orientation', 'vertical');
    expect(minimum).toHaveAttribute('aria-valuetext', 'Minimum 20 dollars');
    await user.click(minimum!);
    await user.keyboard('{ArrowUp}{ArrowUp}{ArrowUp}');
    expect(minimum).toHaveAttribute('aria-valuenow', '20');
  });

  it('wires a Field label, description, and invalid state to the thumb inputs', async () => {
    const user = userEvent.setup();
    const { getByText, getAllByRole } = render(
      <Field label="Volume" hint="Quiet to loud" error="Choose a safe level">
        <Slider label="Volume" defaultValue={20} />
      </Field>,
    );
    const thumb = getAllByRole('slider')[0]!;
    expect(getByText('Volume')).toHaveAttribute('for', thumb.id);
    await user.click(getByText('Volume'));
    expect(document.activeElement).toBe(thumb);
    expect(thumb).toHaveAttribute('aria-invalid', 'true');
    expect(thumb.getAttribute('aria-describedby')).toContain('hint');
    expect(thumb.getAttribute('aria-describedby')).toContain('error');
  });

  it('serializes one or two values under its supplied form name', () => {
    const { container, rerender } = render(<form><Slider label="Volume" name="volume" defaultValue={25} /></form>);
    expect(new FormData(container.querySelector('form')!)).toEqual(expect.any(FormData));
    expect(new FormData(container.querySelector('form')!).getAll('volume')).toEqual(['25']);

    rerender(<form><Slider range label="Price" name="price" defaultValue={[20, 80]} /></form>);
    expect(new FormData(container.querySelector('form')!).getAll('price')).toEqual(['20', '80']);
  });

  it('delegates pointer dragging to Base UI', () => {
    const onValueChange = vi.fn();
    render(<Slider label="Volume" defaultValue={0} onValueChange={onValueChange} />);
    const control = document.querySelector('.cb-slider__control') as HTMLDivElement;
    vi.spyOn(control, 'getBoundingClientRect').mockReturnValue({
      x: 0, y: 0, width: 100, height: 40, top: 0, left: 0, right: 100, bottom: 40, toJSON: () => ({}),
    });
    Object.assign(control, {
      setPointerCapture: vi.fn(),
      releasePointerCapture: vi.fn(),
      hasPointerCapture: vi.fn(() => true),
    });
    fireEvent.pointerDown(control, { clientX: 50, clientY: 20, pointerId: 1, button: 0 });
    fireEvent.pointerMove(control, { clientX: 75, clientY: 20, pointerId: 1 });
    fireEvent.pointerUp(control, { clientX: 75, clientY: 20, pointerId: 1 });
    expect(onValueChange).toHaveBeenCalled();

  });

  it('keeps disabled thumbs out of native interaction', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Slider label="Volume" defaultValue={0} disabled onValueChange={onValueChange} />);
    const thumb = screen.getByRole('slider', { name: 'Volume' });
    expect(thumb).toBeDisabled();
    await user.click(thumb);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('rejects invalid bounds, unaligned values, and keeps its token-only motion fallback', () => {
    expect(() => render(<Slider label="Broken" min={10} max={10} />)).toThrow(RangeError);
    expect(() => render(<Slider range label="Broken" defaultValue={[80, 20]} />)).toThrow(RangeError);
    expect(() => render(<Slider range label="Impossible" min={0} max={10} step={5} minStepsBetweenValues={3} />)).toThrow('cannot fit');
    expect(() => render(<Slider label="Broken" min={0} step={5} defaultValue={3} />)).toThrow('align to step');
    expect(() => render(<Slider range label="Broken" min={0} step={0.25} defaultValue={[0.25, 0.6]} />)).toThrow('align to step');
    expect(() => render(<Slider label="Aligned" min={0.1} step={0.1} defaultValue={0.3} />)).not.toThrow();
    expect(stylesheet).toContain('touch-action: none');
    expect(stylesheet).toContain('var(--cb-slider-accent)');
    expect(stylesheet).toContain('@media (prefers-reduced-motion: reduce)');
    expect(stylesheet).toContain('transition: none');
    expect(stylesheet).not.toMatch(/#[0-9a-f]/i);
  });

  it('removes visual transitions when motion is disabled without changing Slider semantics', () => {
    const { getByRole } = render(<Slider label="Volume" defaultValue={20} motion={false} />);
    expect(getByRole('slider')).toHaveAttribute('aria-valuenow', '20');
    expect(document.querySelector('.cb-slider')).toHaveClass('cb-slider--motionless');
    expect(stylesheet).toContain('.cb-slider--motionless .cb-slider__thumb { transition: none; }');
  });

  it('renders the requested noninteractive Skeleton geometry', () => {
    const { container } = render(<Slider.Skeleton orientation="vertical" range size="lg" />);
    const skeleton = container.firstElementChild!;
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    expect(skeleton).toHaveClass('cb-slider--skeleton', 'cb-slider--vertical', 'cb-slider--range', 'cb-slider--lg');
    expect(skeleton.querySelectorAll('.cb-slider__thumb')).toHaveLength(2);
  });
});
