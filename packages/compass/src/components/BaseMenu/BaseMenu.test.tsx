import React from 'react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { Menu, MenuItem, MenuOverlay } from '~components/Menu';
import { BaseMenuItem } from './BaseMenuItem/BaseMenuItem';
import { Button } from '~components/Button';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('BaseMenu', () => {
  it('renders BaseMenuItem with accessible title', () => {
    const { getByRole } = renderWithTheme(<BaseMenuItem title="Settings" />);
    expect(getByRole('menuitem', { name: 'Settings' })).toBeInTheDocument();
  });

  it('supports keyboard navigation and activation in Menu', async () => {
    const user = userEvent.setup();
    const onProfile = jest.fn();

    const { getByRole, queryByRole } = renderWithTheme(
      <Menu>
        <Button>Open menu</Button>
        <MenuOverlay>
          <MenuItem title="Profile" onClick={onProfile} />
          <MenuItem title="Billing" />
        </MenuOverlay>
      </Menu>,
    );

    await user.click(getByRole('button', { name: 'Open menu' }));
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    expect(getByRole('menuitem', { name: 'Profile' })).toBeInTheDocument();
    expect(getByRole('menuitem', { name: 'Billing' })).toBeInTheDocument();

    await user.click(getByRole('menuitem', { name: 'Profile' }));
    expect(onProfile).toHaveBeenCalledTimes(1);

    await user.click(getByRole('button', { name: 'Open menu' }));
    await waitFor(() => expect(getByRole('menu')).toBeInTheDocument());
    await user.keyboard('{Escape}');
    await waitFor(() => expect(queryByRole('menu')).not.toBeInTheDocument());
  });
});
