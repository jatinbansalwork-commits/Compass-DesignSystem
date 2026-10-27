import React from 'react';
import { PopupArrow } from './PopupArrow.web';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

jest.mock('@floating-ui/react', () => {
  const actual = jest.requireActual('@floating-ui/react');
  const mockReact = require('react');
  const MockFloatingArrow = mockReact.forwardRef(
    (props: { context?: { placement?: string } }, ref: unknown) =>
      mockReact.createElement('svg', {
        ref,
        role: 'presentation',
        'data-testid': 'popup-arrow',
        'data-placement': props.context?.placement,
      }),
  );
  return {
    ...actual,
    FloatingArrow: MockFloatingArrow,
  };
});

describe('<PopupArrow />', () => {
  it('renders a decorative arrow for the given placement context', () => {
    const context = { placement: 'top-start' };

    const { getByTestId } = renderWithTheme(
      <PopupArrow context={context} width={12} height={6} fillColor="#fff" />,
    );

    const arrow = getByTestId('popup-arrow');
    expect(arrow).toBeInTheDocument();
    expect(arrow.tagName).toBe('svg');
    expect(arrow).toHaveAttribute('data-placement', 'top-start');
    expect(arrow).not.toHaveAttribute('role', 'button');
  });
});
