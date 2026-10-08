import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { useRef } from 'react';
import type { GetRef } from 'antd';
import { describe, expect, it } from 'vitest';
import { InputNumber as AntInputNumber } from 'antd';
import { LabelsProvider } from '../lib/labels.js';
import { InputNumber, type InputNumberProps } from './input-number.js';

function GenericInputNumber() {
  const ref = useRef<GetRef<typeof InputNumber>>(null);
  const onChange: InputNumberProps<string>['onChange'] = (value) => {
    if (value !== null) value.toUpperCase();
  };

  return (
    <>
      <InputNumber<string> id="generic-string-number" ref={ref} stringMode defaultValue="1" onChange={onChange} />
      <button type="button" onClick={() => ref.current?.focus({ cursor: 'start' })}>Focus number</button>
    </>
  );
}

describe('InputNumber stepper labels', () => {
  it('preserves generic value props and forwards the public ref', () => {
    render(<GenericInputNumber />);

    fireEvent.click(screen.getByRole('button', { name: 'Focus number' }));
    expect(screen.getByRole('spinbutton')).toHaveFocus();
  });

  it("names the steppers from the library's own English labels", () => {
    render(<InputNumber />);
    expect(screen.getByRole('button', { name: 'Increase' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeInTheDocument();
  });

  it('replaces the literal the vendored component writes, which is what it exists for', () => {
    // Ant announces "Increase Value"; the library says "Increase". The difference is the proof that this
    // component changed the name rather than Ant happening to agree with it. Scoped to each render,
    // because both fields are in the document at once.
    const { container: bare } = render(<AntInputNumber />);
    expect(bare.querySelector('[aria-label="Increase Value"]')).not.toBeNull();

    const { container: wrapped } = render(<InputNumber />);
    expect(wrapped.querySelector('[aria-label="Increase Value"]')).toBeNull();
    expect(wrapped.querySelector('[aria-label="Increase"]')).not.toBeNull();
  });

  it('names the steppers in the product language', () => {
    render(
      <LabelsProvider labels={{ increase: 'Naikkan', decrease: 'Turunkan' }}>
        <InputNumber />
      </LabelsProvider>,
    );
    expect(screen.getByRole('button', { name: 'Naikkan' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Turunkan' })).toBeInTheDocument();
  });

  it('relabels when the product language changes', () => {
    const { rerender } = render(<InputNumber />);
    expect(screen.getByRole('button', { name: 'Increase' })).toBeInTheDocument();

    rerender(
      <LabelsProvider labels={{ increase: 'Naikkan', decrease: 'Turunkan' }}>
        <InputNumber />
      </LabelsProvider>,
    );
    expect(screen.getByRole('button', { name: 'Naikkan' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Turunkan' })).toBeInTheDocument();
  });

  it('relabels only one side when only one label is replaced', () => {
    render(
      <LabelsProvider labels={{ decrease: 'Turunkan' }}>
        <InputNumber />
      </LabelsProvider>,
    );
    expect(screen.getByRole('button', { name: 'Increase' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Turunkan' })).toBeInTheDocument();
  });

  it('keeps the stepper the only role=button, so the click target is unchanged', () => {
    const { container } = render(<InputNumber />);
    // Ant renders one role="button" per stepper. A nested button, or a second focusable element,
    // would double this and change what the accessibility tree offers.
    expect(container.querySelectorAll('[role="button"]')).toHaveLength(2);
    expect(container.querySelectorAll('button')).toHaveLength(0);
  });

  it('adds no element, so a consumer layout is untouched', () => {
    const { container: wrapped } = render(<InputNumber />);
    const { container: bare } = render(<AntInputNumber />);
    const shape = (c: HTMLElement) => ({
      roles: c.querySelectorAll('[role="button"]').length,
      inputs: c.querySelectorAll('input').length,
      classes: [...c.firstElementChild?.classList ?? []].filter((k) => !k.startsWith('css-')).length,
    });
    expect(shape(wrapped)).toEqual(shape(bare));
  });

  it('keeps the spinbutton and the id a consumer gave it', () => {
    render(<InputNumber id="jumlah-rotasi" aria-label="Jumlah rotasi" />);
    const spin = screen.getByRole('spinbutton', { name: 'Jumlah rotasi' });
    expect(spin).toHaveAttribute('id', 'jumlah-rotasi');
  });

  it('still steps the value when the up control is pressed', async () => {
    const { container } = render(<InputNumber defaultValue={1} />);
    const up = container.querySelector<HTMLElement>('.ant-input-number-action-up');
    expect(up).not.toBeNull();

    up?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    up?.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

    expect(await screen.findByRole('spinbutton')).toHaveValue('2');
  });

  it('stays out of the way when the steppers are not rendered', () => {
    // controls={false} renders no stepper at all. Nothing is invented for a field that has none.
    const { container } = render(<InputNumber controls={false} />);
    expect(container.querySelectorAll('[role="button"]')).toHaveLength(0);
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });
});
