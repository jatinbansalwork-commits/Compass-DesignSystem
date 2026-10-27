import { compassTheme } from '../../tokens';
import { getFocusRingStyles } from './getFocusRingStyles';

describe('getFocusRingStyles', () => {
  it('should return correct styles when called with valid parameters', () => {
    const result = getFocusRingStyles({
      theme: {
        ...compassTheme,
        colors: compassTheme.colors.onLight,
        elevation: compassTheme.elevation.onLight,
        typography: compassTheme.typography.onDesktop,
      },
    });
    expect(result).toMatchObject({});
  });
});
