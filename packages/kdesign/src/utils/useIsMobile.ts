import { useBreakpoint } from './useBreakpoint';
import { useTheme } from '~components/KdesignProvider';

const useIsMobile = (): boolean => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({
    breakpoints: theme.breakpoints,
  });
  return matchedDeviceType === 'mobile';
};

export { useIsMobile };
