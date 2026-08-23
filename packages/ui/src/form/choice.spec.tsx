import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox, RadioGroup, Switch } from './choice.js';
import { Field } from './field.js';
import { Select } from './select.js';

describe('Checkbox', () => {
  it('is reachable by its label text, and clicking the label toggles it', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Email me receipts" onCheckedChange={onCheckedChange} />);

    await userEvent.click(screen.getByText('Email me receipts'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('checkbox', { name: 'Email me receipts' })).toBeInTheDocument();
  });

  it('describes itself with its description line', () => {
    render(<Checkbox label="Email me receipts" description="One message per payment." />);
    const box = screen.getByRole('checkbox', { name: 'Email me receipts' });
    const describedBy = box.getAttribute('aria-describedby') ?? '';
    expect(document.getElementById(describedBy.split(' ')[0]!)).toHaveTextContent('One message per payment.');
  });
});

describe('RadioGroup', () => {
  it('exposes one radio per option, labelled', () => {
    render(
      <RadioGroup
        label="Billing period"
        options={[
          { value: 'monthly', label: 'Monthly' },
          { value: 'yearly', label: 'Yearly' },
        ]}
      />,
    );
    expect(screen.getByRole('radiogroup', { name: 'Billing period' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Monthly' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Yearly' })).toBeInTheDocument();
  });

  it("reports only the chosen value — Base UI's second argument does not leak through", async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        label="Billing period"
        defaultValue="monthly"
        onValueChange={onValueChange}
        options={[
          { value: 'monthly', label: 'Monthly' },
          { value: 'yearly', label: 'Yearly' },
        ]}
      />,
    );
    await userEvent.click(screen.getByRole('radio', { name: 'Yearly' }));
    expect(onValueChange).toHaveBeenCalledWith('yearly');
  });
});

describe('Switch', () => {
  it('is a switch to assistive technology, in both layouts', () => {
    const { rerender } = render(<Switch label="Reduce motion" />);
    expect(screen.getByRole('switch', { name: 'Reduce motion' })).toBeInTheDocument();
    rerender(<Switch label="Reduce motion" justified />);
    expect(screen.getByRole('switch', { name: 'Reduce motion' })).toBeInTheDocument();
  });
});

describe('controls inside a Field', () => {
  it('lets the Field name the Select and carry its error', () => {
    render(
      <Field label="Currency" error="Pick one">
        <Select items={[{ value: 'idr', label: 'Rupiah' }]} />
      </Field>,
    );
    const trigger = screen.getByLabelText('Currency');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    const describedBy = trigger.getAttribute('aria-describedby') ?? '';
    expect(document.getElementById(describedBy)).toHaveTextContent('Pick one');
  });
});

/* A variant may change how a control is drawn and nothing else (ADR 0014). What
   can be wrong here is that the segmented look removes the control it is
   drawing — a dot styled away is a dot nobody can focus or press. */
describe('RadioGroup segmented', () => {
  it('is the same radiogroup, still reporting the value it was given', async () => {
    const user = userEvent.setup({ delay: null });
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        variant="segmented"
        label="Kind"
        defaultValue="food"
        onValueChange={onValueChange}
        options={[
          { value: 'food', label: 'Food' },
          { value: 'activity', label: 'Activity' },
        ]}
      />,
    );

    expect(screen.getByRole('radiogroup', { name: 'Kind' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);

    await user.click(screen.getByRole('radio', { name: 'Activity' }));
    expect(onValueChange).toHaveBeenCalledWith('activity');
  });

  it('keeps every cell focusable rather than styling the control away', () => {
    render(
      <RadioGroup
        variant="segmented"
        label="Status"
        defaultValue="all"
        options={[
          { value: 'all', label: 'All' },
          { value: 'tried', label: 'Tried' },
        ]}
      />,
    );

    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toBeVisible();
      radio.focus();
      expect(radio).toHaveFocus();
    }
  });
});
