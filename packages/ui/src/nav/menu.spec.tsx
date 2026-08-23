import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Dropdown } from './menu.js';

describe('Dropdown sections', () => {
  it('labels action groups without turning labels into menu items', async () => {
    render(
      <Dropdown
        trigger={<button type="button">Open</button>}
        sections={[
          { label: 'Pages', items: [{ label: 'Finance' }] },
          { label: 'Preferences', items: [{ label: 'Dark mode' }] },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open' }));

    expect(await screen.findByText('Pages')).toBeVisible();
    expect(screen.getByText('Preferences')).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'Finance' })).toBeVisible();
    expect(screen.queryByRole('menuitem', { name: 'Pages' })).not.toBeInTheDocument();
    expect(document.querySelector('.cb-menu-positioner')).toBeInTheDocument();
  });
});
