import React from 'react';
import { screen } from '@testing-library/react';
import { OverlayContextReset } from '../OverlayContextReset';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<OverlayContextReset />', () => {
  it('renders children without crashing', () => {
    renderWithTheme(
      <OverlayContextReset>
        <span>Overlay content</span>
      </OverlayContextReset>,
    );
    expect(screen.getByText('Overlay content')).toBeInTheDocument();
  });
});
