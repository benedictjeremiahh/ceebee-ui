import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Field } from './field.js';
import { TextInput } from './text-input.js';

describe('Field', () => {
  it('gives the label a control to point at', () => {
    render(
      <Field label="Email">
        <TextInput />
      </Field>,
    );
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('describes the control with both hint and error', () => {
    render(
      <Field label="Email" hint="Work address" error="Already taken">
        <TextInput />
      </Field>,
    );
    const input = screen.getByLabelText('Email');
    const described = (input.getAttribute('aria-describedby') ?? '').split(' ');
    expect(described).toHaveLength(2);
    expect(described.map((id) => document.getElementById(id)?.textContent)).toEqual([
      'Work address',
      'Already taken',
    ]);
  });

  it('marks the control invalid and announces the message', () => {
    render(
      <Field label="Email" error="Already taken">
        <TextInput />
      </Field>,
    );
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Already taken');
  });

  it('can be invalid without a message', () => {
    render(
      <Field label="Email" error>
        <TextInput />
      </Field>,
    );
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('keeps a hidden label available to screen readers', () => {
    render(
      <Field label="Search" labelHidden>
        <TextInput />
      </Field>,
    );
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });

  it('leaves a standalone input unwired rather than inventing ids', () => {
    render(<TextInput aria-label="Loose" />);
    expect(screen.getByLabelText('Loose')).not.toHaveAttribute('aria-describedby');
  });
});
