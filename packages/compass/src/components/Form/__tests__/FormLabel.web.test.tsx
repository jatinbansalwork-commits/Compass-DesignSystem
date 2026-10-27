import React from 'react';
import { screen } from '@testing-library/react';
import { FormLabel } from '../FormLabel';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<FormLabel />', () => {
  it('renders label text for users', () => {
    renderWithTheme(
      <FormLabel as="label" htmlFor="email">
        Email
      </FormLabel>,
    );
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('associates label with control via htmlFor', () => {
    renderWithTheme(
      <>
        <FormLabel as="label" htmlFor="email">
          Email
        </FormLabel>
        <input id="email" aria-label="Email input" />
      </>,
    );
    expect(screen.getByLabelText('Email input')).toBeInTheDocument();
  });
});
