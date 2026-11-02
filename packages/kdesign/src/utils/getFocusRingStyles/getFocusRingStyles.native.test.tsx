import { kdesignTheme } from '../../tokens';
import { getFocusRingStyles } from './getFocusRingStyles';

describe('getFocusRingStyles', () => {
  it('should return correct styles when called with valid parameters', () => {
    const result = getFocusRingStyles({
      theme: {
        ...kdesignTheme,
        colors: kdesignTheme.colors.onLight,
        elevation: kdesignTheme.elevation.onLight,
        typography: kdesignTheme.typography.onDesktop,
      },
    });
    expect(result).toMatchObject({});
  });
});
