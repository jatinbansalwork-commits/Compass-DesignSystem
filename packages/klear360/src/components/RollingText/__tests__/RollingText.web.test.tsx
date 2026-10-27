import React from 'react';
import { screen } from '@testing-library/react';
import { RollingText } from '../RollingText';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<RollingText />', () => {
  it('renders visible text content', () => {
    renderWithTheme(<RollingText texts={['42']} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});
