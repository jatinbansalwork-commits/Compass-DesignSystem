import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CitedFieldRow } from '../';
import { CompassProvider } from '~components/CompassProvider';
import { compassTheme } from '~tokens/theme';

const renderWithCompass = (ui: React.ReactElement): ReturnType<typeof render> =>
  render(
    <CompassProvider themeTokens={compassTheme} colorScheme="light">
      {ui}
    </CompassProvider>,
  );

describe('CitedFieldRow', () => {
  it('renders without crashing with required props', () => {
    renderWithCompass(<CitedFieldRow label="HTS Code" value="8471.30.0100" />);
    expect(screen.getByText('HTS Code')).toBeInTheDocument();
  });

  it('displays the label and value correctly', () => {
    renderWithCompass(<CitedFieldRow label="MBOL" value="MEDUXYZ123456" />);
    expect(screen.getByText('MBOL')).toBeInTheDocument();
    expect(screen.getByText('MEDUXYZ123456')).toBeInTheDocument();
  });

  it('renders the citation source chip when source prop is provided', () => {
    renderWithCompass(
      <CitedFieldRow
        label="MBOL"
        value="MEDUXYZ123456"
        source={{ label: 'BOL p1', accessibilityLabel: 'View MBOL on BOL, page 1' }}
      />,
    );
    expect(screen.getByRole('button', { name: 'View MBOL on BOL, page 1' })).toBeInTheDocument();
  });

  it('does not render citation chip when source is not provided', () => {
    renderWithCompass(<CitedFieldRow label="Notes" value="Manual entry" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('citation chip is focusable and shows focus ring when focused', async () => {
    const user = userEvent.setup();
    renderWithCompass(
      <CitedFieldRow
        label="MBOL"
        value="MEDUXYZ123456"
        source={{ label: 'BOL p1' }}
      />,
    );
    const chip = screen.getByRole('button', { name: 'BOL p1' });
    await user.tab();
    expect(chip).toHaveFocus();
    const injectedStyles = Array.from(document.querySelectorAll('style'))
      .map((node) => node.textContent ?? '')
      .join('');
    expect(injectedStyles).toMatch(/focus-visible/i);
    expect(injectedStyles).toMatch(/box-shadow/i);
  });

  it('validation error state renders with correct aria attributes', () => {
    renderWithCompass(
      <CitedFieldRow
        label="MBOL"
        value="BAD"
        validationState="error"
        errorText="Invalid MBOL format."
      />,
    );
    expect(screen.getByText('Invalid MBOL format.')).toBeInTheDocument();
    const valueRegion = screen.getByText('BAD').closest('[aria-invalid]');
    expect(valueRegion).toHaveAttribute('aria-invalid', 'true');
    expect(valueRegion).toHaveAttribute('aria-describedby');
  });

  it('validation success state renders with correct aria attributes', () => {
    renderWithCompass(
      <CitedFieldRow
        label="MBOL"
        value="MEDUXYZ123456"
        validationState="success"
        successText="Format looks good."
      />,
    );
    expect(screen.getByText('Format looks good.')).toBeInTheDocument();
    const valueRegion = screen.getByText('MEDUXYZ123456').closest('[aria-describedby]');
    expect(valueRegion).toHaveAttribute('aria-describedby');
    expect(valueRegion).not.toHaveAttribute('aria-invalid');
  });

  it('Header variant renders correctly', () => {
    renderWithCompass(
      <>
        <CitedFieldRow.Header
          fieldColumnLabel="Field"
          valueColumnLabel="Value"
          sourceColumnLabel="Source"
        />
        <CitedFieldRow label="MBOL" value="MEDUXYZ123456" />
      </>,
    );
    expect(screen.getByText('Field')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByText('Source')).toBeInTheDocument();
  });
});
