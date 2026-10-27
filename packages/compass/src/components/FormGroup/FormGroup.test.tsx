import React from 'react';
import userEvent from '@testing-library/user-event';
import { InputGroup } from '~components/InputGroup';
import { InputRow } from '~components/InputGroup/InputRow';
import { TextInput } from '~components/Input/TextInput';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

/**
 * FormGroup is a documentation pattern; grouping semantics live on `InputGroup` + field inputs.
 */
describe('FormGroup (InputGroup + fields pattern)', () => {
  it('renders a group label and child inputs', () => {
    const { getByRole, getByText } = renderWithTheme(
      <InputGroup label="Contact details">
        <InputRow>
          <TextInput label="Email" name="email" />
        </InputRow>
      </InputGroup>,
    );

    expect(getByRole('group')).toBeInTheDocument();
    expect(getByText('Contact details')).toBeInTheDocument();
    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('shows required indicator on a field', () => {
    const { getByText } = renderWithTheme(
      <TextInput label="Email" name="email" necessityIndicator="required" />,
    );
    expect(getByText('*')).toBeInTheDocument();
  });

  it('renders help text when provided', () => {
    const { getByText } = renderWithTheme(
      <TextInput label="Email" name="email" helpText="Work email only" />,
    );
    expect(getByText('Work email only')).toBeInTheDocument();
  });

  it('associates error text with the input via aria-describedby', () => {
    const { getByRole, getByText } = renderWithTheme(
      <TextInput
        label="Email"
        name="email"
        helpText="Work email only"
        validationState="error"
        errorText="Invalid email"
      />,
    );

    const input = getByRole('textbox');
    const describedBy = input.getAttribute('aria-describedby') ?? '';
    expect(describedBy.length).toBeGreaterThan(0);
    expect(getByText('Invalid email')).toBeInTheDocument();
    expect(document.getElementById(describedBy.split(' ')[0])).toHaveTextContent(/Invalid email/);
  });

  it('disables child inputs when InputGroup isDisabled', () => {
    const { getByRole } = renderWithTheme(
      <InputGroup label="Login" isDisabled>
        <InputRow>
          <TextInput label="Password" name="password" />
        </InputRow>
      </InputGroup>,
    );

    expect(getByRole('textbox')).toHaveAttribute('aria-disabled', 'true');
  });

  it('allows typing when the group is enabled', async () => {
    const user = userEvent.setup();
    const { getByRole } = renderWithTheme(
      <InputGroup label="Login">
        <InputRow>
          <TextInput label="Email" name="email" placeholder="you@example.com" />
        </InputRow>
      </InputGroup>,
    );

    const input = getByRole('textbox');
    await user.type(input, 'a@b.com');
    expect(input).toHaveValue('a@b.com');
  });
});
