import React from 'react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { DropdownButton } from '~components/Dropdown/DropdownButton';
import { SelectInput } from '~components/Input/DropdownInputTriggers/SelectInput';
import { ActionList, ActionListItem } from '~components/ActionList';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

const getActiveDescendantLabel = (trigger: HTMLElement): string | undefined => {
  const activeDescendantId = trigger.getAttribute('aria-activedescendant');
  if (!activeDescendantId) return undefined;
  return document.getElementById(activeDescendantId)?.textContent?.trim();
};

describe('<ActionList />', () => {
  it('renders list items with accessible names', async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(
      <Dropdown>
        <SelectInput label="Fruits" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Apple" value="apple" />
            <ActionListItem title="Mango" value="mango" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    await user.click(getByRole('combobox', { name: 'Fruits' }));
    await waitFor(() => expect(getByRole('listbox', { name: 'Fruits' })).toBeVisible());
    expect(getByRole('option', { name: 'Apple' })).toBeVisible();
    expect(getByRole('option', { name: 'Mango' })).toBeVisible();
  });

  it('exposes listbox semantics with SelectInput trigger', async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(
      <Dropdown>
        <SelectInput label="Fruits" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Apple" value="apple" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    await user.click(getByRole('combobox', { name: 'Fruits' }));
    await waitFor(() => expect(getByRole('listbox', { name: 'Fruits' })).toBeInTheDocument());
  });

  it('supports Arrow Down / Arrow Up focus movement in listbox', async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(
      <Dropdown>
        <SelectInput label="Fruits" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Apple" value="apple" />
            <ActionListItem title="Mango" value="mango" />
            <ActionListItem title="Banana" value="banana" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const combobox = getByRole('combobox', { name: 'Fruits' });
    await user.click(combobox);
    await waitFor(() => expect(getByRole('listbox')).toBeVisible());

    await user.keyboard('{ArrowDown}');
    expect(getActiveDescendantLabel(combobox)).toBe('Apple');
    await user.keyboard('{ArrowDown}');
    expect(getActiveDescendantLabel(combobox)).toBe('Mango');
    await user.keyboard('{ArrowUp}');
    expect(getActiveDescendantLabel(combobox)).toBe('Apple');
  });

  it('fires ActionListItem onClick when menu item is activated with Space', async () => {
    const user = userEvent.setup();
    const onProfileClick = jest.fn();

    const { getByRole } = renderWithTheme(
      <Dropdown>
        <DropdownButton>Account</DropdownButton>
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Profile" value="profile" onClick={onProfileClick} />
            <ActionListItem title="Settings" value="settings" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const trigger = getByRole('button', { name: 'Account' });
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(getByRole('menu')).toBeVisible());
    await user.keyboard('{ArrowDown}');
    expect(getActiveDescendantLabel(trigger)).toBe('Profile');
    await user.keyboard('[Space]');
    expect(onProfileClick).toHaveBeenCalledTimes(1);
  });

  it('does not activate disabled items', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    const { getByRole } = renderWithTheme(
      <Dropdown>
        <SelectInput label="Fruits" onChange={onChange} />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Apple" value="apple" isDisabled />
            <ActionListItem title="Mango" value="mango" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    await user.click(getByRole('combobox', { name: 'Fruits' }));
    await waitFor(() => expect(getByRole('listbox')).toBeVisible());
    expect(getByRole('option', { name: 'Apple' })).toHaveAttribute('aria-disabled', 'true');

    await user.click(getByRole('option', { name: 'Apple' }));
    expect(onChange).not.toHaveBeenCalled();
    await user.click(getByRole('option', { name: 'Mango' }));
    expect(onChange).toHaveBeenCalledWith({ name: undefined, values: ['mango'] });
  });
});
