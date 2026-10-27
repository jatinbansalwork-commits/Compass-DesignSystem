import { useBreakpoint } from './useBreakpoint';
import { useTheme } from '~components/CompassProvider';

const useIsMobile = (): boolean => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({
    breakpoints: theme.breakpoints,
  });
  return matchedDeviceType === 'mobile';
};

export { useIsMobile };
