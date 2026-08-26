import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FloatButton } from './float-button.js';

const stylesheet = readFileSync(join(process.cwd(), 'packages/ui/src/form/float-button/float-button.css'), 'utf8');
const skin = readFileSync(join(process.cwd(), 'packages/ui/src/tokens/skin.css'), 'utf8');

describe('FloatButton', () => {
  it('keeps its required label as the native button accessible name', () => {
    render(
      <FloatButton
        {...({
          label: 'Create project',
          icon: <span>+</span>,
          'aria-label': 'Incorrect name',
          'aria-labelledby': 'external-name',
          style: { insetBlockEnd: '0' },
          className: 'unsafe-layout',
          role: 'link',
          color: 'red',
          children: 'Unsafe child',
          'data-tone': 'danger',
        } as unknown as import('./float-button.js').FloatButtonProps)}
      />,
    );

    const button = screen.getByRole('button', { name: 'Create project' });
    expect(button).toHaveAttribute('aria-label', 'Create project');
    expect(button).not.toHaveAttribute('aria-labelledby');
    expect(button).not.toHaveAttribute('style');
    expect(button).not.toHaveClass('unsafe-layout');
    expect(button).not.toHaveAttribute('role');
    expect(button).not.toHaveTextContent('Unsafe child');
    expect(button).toHaveAttribute('data-tone', 'brand');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).not.toHaveTextContent('Create project');
  });

  it('uses native click, disabled, and button type behaviour', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<FloatButton label="Save" icon={<span>Save</span>} type="submit" onClick={onClick} />);

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('type', 'submit');
    await user.click(button);
    expect(onClick).toHaveBeenCalledOnce();

    render(<FloatButton label="Disabled save" icon={<span>Save</span>} disabled onClick={onClick} />);
    const disabledButton = screen.getByRole('button', { name: 'Disabled save' });
    expect(disabledButton).toBeDisabled();
    await user.click(disabledButton);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('maps placement, tone, size, and visible label to constrained attributes', () => {
    render(<FloatButton label="Delete" visibleLabel tone="danger" size="lg" placement="bottom-start" />);

    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toHaveClass('cb-float-button', 'cb-float-button--bottom-start', 'cb-float-button--lg', 'cb-float-button--label-visible');
    expect(button).toHaveAttribute('data-tone', 'danger');
    expect(button).toHaveTextContent('Delete');
  });

  it('uses fixed viewport positioning, token offsets, the sticky rung, and no clipping', () => {
    expect(stylesheet).toContain('position: fixed');
    expect(stylesheet).toContain('z-index: var(--cb-z-sticky)');
    expect(stylesheet).toContain('inset-block-end: var(--cb-space-5)');
    expect(stylesheet).toContain('inset-inline-start: var(--cb-space-5)');
    expect(stylesheet).toContain('inset-inline-end: var(--cb-space-5)');
    expect(stylesheet).toContain('box-shadow: var(--cb-shadow-md)');
    expect(skin).toContain('--cb-shadow-md:');
    expect(stylesheet).not.toMatch(/overflow\s*:/);
    expect(stylesheet).not.toMatch(/clip\s*:/);
  });
});
