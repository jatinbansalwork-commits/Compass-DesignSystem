import React from 'react';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card, CardBody } from '~components/Card';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

/**
 * SelectableCard is implemented as interactive `Card` (see CardInteractive stories).
 * There is no separate SelectableCard component export — these tests cover the selectable Card API.
 */
describe('SelectableCard (Card selection API)', () => {
  it('renders children', () => {
    const { getByText } = renderWithTheme(
      <Card accessibilityLabel="Plan card">
        <CardBody>Starter plan</CardBody>
      </Card>,
    );
    expect(getByText('Starter plan')).toBeInTheDocument();
  });

  it('calls onClick when unselected card is clicked', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    const { getByRole } = renderWithTheme(
      <Card onClick={onClick} accessibilityLabel="Plan card">
        <CardBody>Starter plan</CardBody>
      </Card>,
    );

    await user.click(getByRole('button', { name: 'Plan card' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('reflects selection with aria-pressed on the link overlay control', async () => {
    const user = userEvent.setup();

    const Example = (): React.ReactElement => {
      const [selected, setSelected] = React.useState(false);
      return (
        <Card
          onClick={() => setSelected((prev) => !prev)}
          isSelected={selected}
          accessibilityLabel="Plan card"
        >
          <CardBody>Starter plan</CardBody>
        </Card>
      );
    };

    const { getByRole } = renderWithTheme(<Example />);
    const control = getByRole('button', { name: 'Plan card' });
    expect(control).toHaveAttribute('aria-pressed', 'false');
    await user.click(control);
    expect(control).toHaveAttribute('aria-pressed', 'true');
  });

  it('toggles selection with Enter and Space', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    const { getByRole } = renderWithTheme(
      <Card onClick={onClick} accessibilityLabel="Plan card">
        <CardBody>Starter plan</CardBody>
      </Card>,
    );

    const control = getByRole('button', { name: 'Plan card' });
    await act(async () => {
      control.focus();
    });
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('does not call onClick when isDisabled', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    const { container, getByText } = renderWithTheme(
      <Card onClick={onClick} isDisabled accessibilityLabel="Plan card">
        <CardBody>Starter plan</CardBody>
      </Card>,
    );

    const cardRoot = container.querySelector('[data-compass-component="card"]');
    expect(cardRoot).toHaveAttribute('aria-disabled', 'true');
    await user.click(getByText('Starter plan'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
