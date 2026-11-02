import type { Theme } from '~components/KdesignProvider';
import { kdesignTheme } from '~tokens/theme';

const kdesignLightTheme: Theme = {
  name: 'kdesignTheme',
  colors: kdesignTheme.colors.onLight,
  border: kdesignTheme.border,
  motion: kdesignTheme.motion,
  spacing: kdesignTheme.spacing,
  breakpoints: kdesignTheme.breakpoints,
  elevation: kdesignTheme.elevation.onLight,
  typography: kdesignTheme.typography.onMobile,
  backdropBlur: kdesignTheme.backdropBlur,
};

export default kdesignLightTheme;
