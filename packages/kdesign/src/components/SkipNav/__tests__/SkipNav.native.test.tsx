import React from 'react';
import { SkipNavContent, SkipNavLink } from '../SkipNav';
import renderWithTheme from '~utils/testing/renderWithTheme';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<SkipNav />', () => {
  it('<SkipNavLink /> should throw error on native', () => {
    expect(() => renderWithTheme(<SkipNavLink />)).toThrow(
      '[Kdesign: SkipNav]: SkipNavLink is not available on React Native',
    );
  });

  it('<SkipNavContent /> should throw error on native', () => {
    expect(() => renderWithTheme(<SkipNavContent />)).toThrow(
      '[Kdesign: SkipNav]: SkipNavContent is not available on React Native',
    );
  });
});
