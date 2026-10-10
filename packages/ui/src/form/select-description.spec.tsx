import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tooltip } from 'antd';
import { Select } from './select';

describe('Select with a supplementary tooltip', () => {
  it('retains the field description before and after the tooltip opens', async () => {
    render(<>
      <p id="selection-hint">Choose the assigned option.</p>
      <Tooltip title="Full option label" trigger={['hover', 'focus']}>
        <Select aria-label="Assignment" aria-describedby="selection-hint"
          options={[{ value: 'selected', label: 'Assigned option' }]} value="selected" />
      </Tooltip>
    </>);
    const input = screen.getByRole('combobox', { name: 'Assignment' });
    expect(input.getAttribute('aria-describedby')?.split(' ')).toContain('selection-hint');
    fireEvent.focus(input);
    await screen.findByRole('tooltip');
    expect(input.getAttribute('aria-describedby')?.split(' ')).toContain('selection-hint');
  });
});
