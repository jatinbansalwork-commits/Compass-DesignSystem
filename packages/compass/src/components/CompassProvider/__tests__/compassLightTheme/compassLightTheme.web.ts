import type { Theme } from '~components/CompassProvider';
import { compassTheme } from '~tokens/theme';

const compassLightTheme: Theme = {
  name: 'compassTheme',
  colors: compassTheme.colors.onLight,
  border: compassTheme.border,
  motion: compassTheme.motion,
  spacing: compassTheme.spacing,
  breakpoints: compassTheme.breakpoints,
  elevation: compassTheme.elevation.onLight,
  typography: compassTheme.typography.onMobile,
  backdropBlur: compassTheme.backdropBlur,
};

export default compassLightTheme;
