import React from 'react';
import userEvent from '@testing-library/user-event';
import { ListView } from './index';
import { List, ListItem, ListItemLink } from '~components/List';
import { Text } from '~components/Typography';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ListView />', () => {
  it('renders without crashing', () => {
    const { getByTestId } = renderWithTheme(
      <ListView testID="orders-list-view">
        <Text>Toolbar slot</Text>
      </ListView>,
    );
    expect(getByTestId('orders-list-view')).toBeInTheDocument();
  });

  it('renders list items with accessible text and list semantics', () => {
    const { getByRole, getByText } = renderWithTheme(
      <ListView>
        <List>
          <ListItem>Apple</ListItem>
          <ListItem>Mango</ListItem>
        </List>
      </ListView>,
    );

    expect(getByRole('list')).toBeInTheDocument();
    expect(getByText('Apple')).toBeInTheDocument();
    expect(getByText('Mango')).toBeInTheDocument();
  });

  it('fires item callback when a list link is clicked', async () => {
    const user = userEvent.setup();
    const onItemClick = jest.fn((event: React.SyntheticEvent) => event.preventDefault());

    const { getByRole } = renderWithTheme(
      <ListView>
        <List>
          <ListItem>
            <ListItemLink href="/orders/1" onClick={onItemClick}>
              Order 1
            </ListItemLink>
          </ListItem>
        </List>
      </ListView>,
    );

    await user.click(getByRole('link', { name: 'Order 1' }));
    expect(onItemClick).toHaveBeenCalledTimes(1);
  });

  it('renders empty state content when no items are provided', () => {
    const { getByText, queryByRole } = renderWithTheme(
      <ListView>
        <Text>No results found</Text>
      </ListView>,
    );

    expect(getByText('No results found')).toBeInTheDocument();
    expect(queryByRole('list')).not.toBeInTheDocument();
  });
});
