import React from 'react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { AutoComplete } from '~components/Input/DropdownInputTriggers/AutoComplete';
import { ActionList, ActionListItem } from '~components/ActionList';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

const getActiveDescendantLabel = (trigger: HTMLElement): string | undefined => {
  const activeDescendantId = trigger.getAttribute('aria-activedescendant');
  if (!activeDescendantId) return undefined;
  return document.getElementById(activeDescendantId)?.textContent?.trim();
};

describe('<AutoComplete />', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders combobox input', () => {
    const { getByRole } = renderWithTheme(
      <Dropdown>
        <AutoComplete label="Fruits" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Apple" value="apple" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    expect(getByRole('combobox', { name: 'Fruits' })).toBeInTheDocument();
  });

  it('calls onInputValueChange when typing', async () => {
    const user = userEvent.setup();
    const onInputValueChange = jest.fn();

    const { getByRole } = renderWithTheme(
      <Dropdown>
        <AutoComplete label="Fruits" name="fruits" onInputValueChange={onInputValueChange} />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Apple" value="apple" />
            <ActionListItem title="Mango" value="mango" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const combobox = getByRole('combobox', { name: 'Fruits' });
    await user.click(combobox);
    await user.type(combobox, 'ap');
    expect(onInputValueChange).toHaveBeenCalled();
    expect(onInputValueChange.mock.calls.some((call) => call[0]?.value?.includes('ap'))).toBe(true);
  });

  it('shows filtered suggestions while typing', async () => {
    const user = userEvent.setup();

    const { getByRole, queryByRole } = renderWithTheme(
      <Dropdown>
        <AutoComplete label="Fruits" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Apple" value="apple" />
            <ActionListItem title="Mango" value="mango" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const combobox = getByRole('combobox', { name: 'Fruits' });
    await user.click(combobox);
    await user.type(combobox, 'man');
    await waitFor(() => expect(getByRole('option', { name: 'Mango' })).toBeVisible());
    expect(queryByRole('option', { name: 'Apple' })).not.toBeInTheDocument();
  });

  it('supports keyboard navigation and selection', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    const { getByRole } = renderWithTheme(
      <Dropdown>
        <AutoComplete label="Fruits" name="fruits" onChange={onChange} />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Apple" value="apple" />
            <ActionListItem title="Mango" value="mango" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const combobox = getByRole('combobox', { name: 'Fruits' });
    await user.click(combobox);
    await waitFor(() => expect(getByRole('listbox')).toBeVisible());
    // AutoComplete keeps the first filtered option active when the list opens.
    expect(getActiveDescendantLabel(combobox)).toBe('Apple');

    await user.keyboard('{ArrowDown}');
    expect(getActiveDescendantLabel(combobox)).toBe('Mango');
    await user.keyboard('{ArrowUp}');
    expect(getActiveDescendantLabel(combobox)).toBe('Apple');
    expect(combobox).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith({ name: 'fruits', values: ['apple'] });
  });

  it('closes listbox on Escape without selecting', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    const { getByRole, queryByRole } = renderWithTheme(
      <Dropdown>
        <AutoComplete label="Fruits" onChange={onChange} />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Apple" value="apple" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const combobox = getByRole('combobox', { name: 'Fruits' });
    await user.click(combobox);
    await waitFor(() => expect(getByRole('listbox')).toBeVisible());
    await user.keyboard('{Escape}');
    await waitFor(() => expect(queryByRole('listbox')).not.toBeInTheDocument());
    expect(onChange).not.toHaveBeenCalled();
  });

  it('respects isDisabled on the input', async () => {
    const user = userEvent.setup();
    const { getByRole, queryByRole } = renderWithTheme(
      <Dropdown>
        <AutoComplete label="Fruits" isDisabled />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Apple" value="apple" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>,
    );

    const combobox = getByRole('combobox', { name: 'Fruits' });
    expect(combobox).toHaveAttribute('aria-disabled', 'true');
    await user.click(combobox);
    expect(queryByRole('listbox')).not.toBeInTheDocument();
  });
});
