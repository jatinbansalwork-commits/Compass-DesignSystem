import React from 'react';
import userEvent from '@testing-library/user-event';
import { BaseHeader } from './BaseHeader';
import { BaseFooter } from './BaseFooter';
import { Text } from '~components/Typography';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('BaseHeaderFooter', () => {
  it('renders header, body, and footer content', () => {
    const { getByText } = renderWithTheme(
      <>
        <BaseHeader title="Payments" subtitle="Overview" />
        <Text>Body content</Text>
        <BaseFooter>
          <Text>Footer actions</Text>
        </BaseFooter>
      </>,
    );

    expect(getByText('Payments')).toBeInTheDocument();
    expect(getByText('Overview')).toBeVisible();
    expect(getByText('Body content')).toBeVisible();
    expect(getByText('Footer actions')).toBeVisible();
  });

  it('fires onCloseButtonClick from the header close control', async () => {
    const user = userEvent.setup();
    const onCloseButtonClick = jest.fn();

    const { getByRole } = renderWithTheme(
      <BaseHeader title="Edit" onCloseButtonClick={onCloseButtonClick} />,
    );

    await user.click(getByRole('button', { name: 'Close' }));
    expect(onCloseButtonClick).toHaveBeenCalledTimes(1);
  });

  it('fires onBackButtonClick when the back button is shown', async () => {
    const user = userEvent.setup();
    const onBackButtonClick = jest.fn();

    const { getByRole } = renderWithTheme(
      <BaseHeader title="Step 2" showBackButton onBackButtonClick={onBackButtonClick} />,
    );

    await user.click(getByRole('button', { name: 'Back' }));
    expect(onBackButtonClick).toHaveBeenCalledTimes(1);
  });
});
