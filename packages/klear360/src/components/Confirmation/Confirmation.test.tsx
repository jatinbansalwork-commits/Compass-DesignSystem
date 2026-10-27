import React from 'react';
import userEvent from '@testing-library/user-event';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '~components/Modal';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

/**
 * Confirmation is a pattern composed from Modal + actions (see Patterns/Confirmation stories).
 */
describe('Confirmation (Modal pattern)', () => {
  it('renders the confirmation message', () => {
    const { getByRole, getByText } = renderWithTheme(
      <Modal isOpen onDismiss={() => {}} accessibilityLabel="Confirm delete">
        <ModalHeader title="Delete item?" />
        <ModalBody>
          <Text>This action cannot be undone.</Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="tertiary">Cancel</Button>
          <Button color="negative">Delete</Button>
        </ModalFooter>
      </Modal>,
    );

    expect(getByRole('dialog', { name: 'Confirm delete' })).toBeInTheDocument();
    expect(getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('fires confirm and cancel callbacks', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    const { getByRole } = renderWithTheme(
      <Modal isOpen onDismiss={onCancel} accessibilityLabel="Confirm">
        <ModalBody>
          <Text>Proceed?</Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="tertiary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </ModalFooter>
      </Modal>,
    );

    await user.click(getByRole('button', { name: 'Cancel' }));
    await user.click(getByRole('button', { name: 'Confirm' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('shows loading on confirm and blocks interaction', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();

    const { getByRole } = renderWithTheme(
      <Modal isOpen onDismiss={() => {}} accessibilityLabel="Confirm">
        <ModalFooter>
          <Button isLoading onClick={onConfirm}>
            Confirm
          </Button>
        </ModalFooter>
      </Modal>,
    );

    const confirm = getByRole('button', { name: 'Confirm' });
    expect(confirm).toBeDisabled();
    await user.click(confirm);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('uses negative color for destructive confirm', () => {
    const { getByRole } = renderWithTheme(
      <Modal isOpen onDismiss={() => {}} accessibilityLabel="Confirm">
        <ModalFooter>
          <Button color="negative">Delete</Button>
        </ModalFooter>
      </Modal>,
    );

    expect(getByRole('button', { name: 'Delete' })).toHaveAttribute(
      'data-klear360-component',
      'button',
    );
  });
});
