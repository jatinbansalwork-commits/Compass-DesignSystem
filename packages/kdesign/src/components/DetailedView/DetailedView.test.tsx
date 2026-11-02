import React from 'react';
import userEvent from '@testing-library/user-event';
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader } from '~components/Drawer';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

/**
 * Detailed View is a pattern built on Drawer (see DetailedView stories).
 */
describe('DetailedView (Drawer pattern)', () => {
  it('renders header, body, and footer slots', () => {
    const { getByRole, getByText } = renderWithTheme(
      <Drawer isOpen onDismiss={() => {}} accessibilityLabel="Payment details">
        <DrawerHeader title="Payment details" subtitle="rzp_123" />
        <DrawerBody>
          <Text>Line items</Text>
        </DrawerBody>
        <DrawerFooter>
          <Button>Export</Button>
        </DrawerFooter>
      </Drawer>,
    );

    expect(getByRole('dialog', { name: 'Payment details' })).toBeInTheDocument();
    expect(getByText('Payment details')).toBeInTheDocument();
    expect(getByText('Line items')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Export' })).toBeInTheDocument();
  });

  it('calls onDismiss when close is activated', async () => {
    const user = userEvent.setup();
    const onDismiss = jest.fn();

    const { getByRole } = renderWithTheme(
      <Drawer isOpen onDismiss={onDismiss} accessibilityLabel="Details">
        <DrawerHeader title="Details" />
        <DrawerBody>
          <Text>Body</Text>
        </DrawerBody>
      </Drawer>,
    );

    await user.click(getByRole('button', { name: 'Close' }));
    expect(onDismiss).toHaveBeenCalled();
  });
});
