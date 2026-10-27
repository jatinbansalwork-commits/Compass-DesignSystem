import React from 'react';
import userEvent from '@testing-library/user-event';
import { BottomDock } from './BottomDock.web';
import { Button } from '~components/Button';
import { MetaConstants } from '~utils/metaAttribute';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<BottomDock />', () => {
  it('renders children', () => {
    const { getByRole, getByText } = renderWithTheme(
      <BottomDock
        role="navigation"
        accessibilityLabel="Primary actions"
        metaName={MetaConstants.BottomNav}
      >
        <Button>Pay</Button>
      </BottomDock>,
    );

    expect(getByRole('navigation', { name: 'Primary actions' })).toBeInTheDocument();
    expect(getByText('Pay')).toBeVisible();
  });

  it('exposes keyboard-accessible actions inside the dock', async () => {
    const user = userEvent.setup();
    const onPay = jest.fn();

    renderWithTheme(
      <BottomDock
        role="navigation"
        accessibilityLabel="Checkout"
        metaName={MetaConstants.BottomNav}
      >
        <Button onClick={onPay}>Pay now</Button>
      </BottomDock>,
    );

    await user.tab();
    expect(document.activeElement).toHaveAccessibleName('Pay now');
    await user.keyboard('{Enter}');
    expect(onPay).toHaveBeenCalledTimes(1);
  });
});
