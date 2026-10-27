import React from 'react';
import userEvent from '@testing-library/user-event';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '~components/Modal';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

/**
 * Creation View is a pattern (Modal / BottomSheet + form content) — smoke-tested via Modal.
 */
describe('CreationView (Modal pattern)', () => {
  it('renders header, body, and footer slots', () => {
    const { getByRole, getByText } = renderWithTheme(
      <Modal isOpen onDismiss={() => {}} accessibilityLabel="Create payout">
        <ModalHeader title="Create payout" subtitle="Step 1 of 2" />
        <ModalBody>
          <Text>Form fields go here</Text>
        </ModalBody>
        <ModalFooter>
          <Button>Continue</Button>
        </ModalFooter>
      </Modal>,
    );

    expect(getByRole('dialog', { name: 'Create payout' })).toBeInTheDocument();
    expect(getByText('Create payout')).toBeInTheDocument();
    expect(getByText('Step 1 of 2')).toBeInTheDocument();
    expect(getByText('Form fields go here')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Continue' })).toBeInTheDocument();
  });

  it('calls onDismiss when the close control is activated', async () => {
    const user = userEvent.setup();
    const onDismiss = jest.fn();

    const { getByRole } = renderWithTheme(
      <Modal isOpen onDismiss={onDismiss} accessibilityLabel="Create item">
        <ModalHeader title="Create item" />
        <ModalBody>
          <Text>Body</Text>
        </ModalBody>
      </Modal>,
    );

    await user.click(getByRole('button', { name: 'Close' }));
    expect(onDismiss).toHaveBeenCalled();
  });
});
