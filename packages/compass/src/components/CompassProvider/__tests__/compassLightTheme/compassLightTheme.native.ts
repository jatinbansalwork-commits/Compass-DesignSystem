import { Easing } from 'react-native-reanimated';
import { compassTheme } from '~tokens/theme';
import type { Theme } from '~components/CompassProvider';

const compassLightTheme: Theme = {
  name: 'compassTheme',
  colors: compassTheme.colors.onLight,
  border: compassTheme.border,
  spacing: compassTheme.spacing,
  breakpoints: compassTheme.breakpoints,
  elevation: compassTheme.elevation.onLight,
  typography: compassTheme.typography.onMobile,
  backdropBlur: compassTheme.backdropBlur,
  motion: {
    ...compassTheme.motion,
    easing: {
      linear: Easing.bezier(0, 0, 0, 0),
      entrance: Easing.bezier(0, 0, 0.2, 1),
      exit: Easing.bezier(0.17, 0, 1, 1),
      standard: Easing.bezier(0.3, 0, 0.2, 1),
      emphasized: Easing.bezier(0.5, 0, 0, 1),
      overshoot: Easing.bezier(0.5, 0, 0.3, 1.5),
      shake: Easing.bezier(1, 0.5, 0, 0.5),
    },
  },
};

export default compassLightTheme;
