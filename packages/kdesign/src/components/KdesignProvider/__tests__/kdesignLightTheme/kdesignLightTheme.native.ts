import { Easing } from 'react-native-reanimated';
import { kdesignTheme } from '~tokens/theme';
import type { Theme } from '~components/KdesignProvider';

const kdesignLightTheme: Theme = {
  name: 'kdesignTheme',
  colors: kdesignTheme.colors.onLight,
  border: kdesignTheme.border,
  spacing: kdesignTheme.spacing,
  breakpoints: kdesignTheme.breakpoints,
  elevation: kdesignTheme.elevation.onLight,
  typography: kdesignTheme.typography.onMobile,
  backdropBlur: kdesignTheme.backdropBlur,
  motion: {
    ...kdesignTheme.motion,
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

export default kdesignLightTheme;
