import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Field } from '../field.js';
import { Mentions } from './mentions.js';

const stylesheet = readFileSync(join(process.cwd(), 'packages/ui/src/form/mentions/mentions.css'), 'utf8');
const options = [
  { value: 'ada', label: 'Ada Lovelace' },
  { value: 'grace', label: 'Grace Hopper' },
  { value: 'disabled', label: 'Disabled person', disabled: true },
];

describe('Mentions', () => {
  it('opens an anchored listbox for a trigger query and keeps focus in the textarea', async () => {
    const user = userEvent.setup();
    render(<Mentions options={options} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

    await user.click(textarea);
    await user.type(textarea, '@a');
    expect(screen.getByRole('listbox', { name: 'Mention suggestions' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Ada Lovelace' })).toHaveAttribute('tabindex', '-1');
    expect(document.activeElement).toBe(textarea);
    expect(textarea).toHaveAttribute('aria-autocomplete', 'list');
    expect(textarea).toHaveAttribute('aria-activedescendant');
  });

  it('moves suggestions from the textarea, inserts the stable value and separator, and reports text', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Mentions options={options} onValueChange={onValueChange} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;

    await user.click(textarea);
    await user.type(textarea, '@a');
    await user.keyboard('{ArrowDown}{ArrowUp}{Enter}');
    expect(onValueChange).toHaveBeenLastCalledWith('@ada ');
    expect(textarea).toHaveValue('@ada ');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('does not intercept Tab while suggestions are open or expose options as Tab stops', async () => {
    const user = userEvent.setup();
    render(<><Mentions options={options} /><button type="button">After mentions</button></>);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    await user.click(textarea);
    await user.type(textarea, '@a');
    expect(screen.getAllByRole('option').every((option) => option.getAttribute('tabindex') === '-1')).toBe(true);

    await user.keyboard('{Tab}');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'After mentions' }));
  });

  it('dismisses suggestions with Escape and otherwise leaves native textarea keys alone', () => {
    render(<Mentions options={options} defaultValue="Hello @a" />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    fireEvent.focus(textarea);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(textarea, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
    fireEvent.keyDown(textarea, { key: 'ArrowLeft' });
    expect(textarea).toHaveValue('Hello @a');
  });

  it('parses only a standalone trigger at the caret', async () => {
    const user = userEvent.setup();
    render(<Mentions options={options} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    await user.type(textarea, 'email@ada');
    expect(screen.queryByRole('listbox')).toBeNull();
    await user.clear(textarea);
    await user.type(textarea, 'email @ada');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('keeps controlled text with its caller and supports caller-owned search text', () => {
    const onValueChange = vi.fn();
    render(<Mentions options={[{ value: 'id-1', label: 'Ada Lovelace', searchText: 'ada' }]} value="@a" onValueChange={onValueChange} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    textarea.focus();
    textarea.setSelectionRange(2, 2);
    fireEvent.focus(textarea);
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith('@id-1 ');
    expect(textarea).toHaveValue('@a');
  });

  it('wires Field semantics and ignores disabled suggestions', async () => {
    const user = userEvent.setup();
    render(
      <Field label="Comment" hint="Use @ to mention" error="Required" required>
        <Mentions options={options} />
      </Field>,
    );
    const textarea = screen.getByRole('textbox', { name: 'Comment' }) as HTMLTextAreaElement;
    expect(textarea).toBeRequired();
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea.getAttribute('aria-describedby')).toContain('hint');
    await user.type(textarea, '@disabled');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('closes suggestions when disabled changes and never parses or inserts during IME composition', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<Mentions options={options} onValueChange={onValueChange} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    textarea.focus();
    fireEvent.change(textarea, { target: { value: '@a', selectionStart: 2 } });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    rerender(<Mentions options={options} onValueChange={onValueChange} disabled />);
    expect(screen.queryByRole('listbox')).toBeNull();

    rerender(<Mentions options={options} onValueChange={onValueChange} />);
    fireEvent.compositionStart(textarea);
    fireEvent.change(textarea, { target: { value: '@a', selectionStart: 2 } });
    fireEvent.keyDown(textarea, { key: 'Enter', isComposing: true });
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(onValueChange).toHaveBeenLastCalledWith('@a');
    fireEvent.compositionEnd(textarea, { currentTarget: { value: '@a', selectionStart: 2 } });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('validates the one-trigger and unique-value contract and renders a noninteractive skeleton with motion safeguards', () => {
    expect(() => render(<Mentions options={options} trigger="@@" />)).toThrow('exactly one character');
    expect(() => render(<Mentions options={[{ value: 'same', label: 'One' }, { value: 'same', label: 'Two' }]} />)).toThrow('unique values');
    const skeleton = render(<Mentions.Skeleton rows={4} />).container.firstElementChild!;
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    expect(skeleton.querySelector('textarea')).toBeNull();
    expect(stylesheet).toContain('cb-mentions--motionless');
    expect(stylesheet).toContain('@media (prefers-reduced-motion: reduce)');
    expect(stylesheet).not.toMatch(/#[0-9a-f]/i);
  });
});
