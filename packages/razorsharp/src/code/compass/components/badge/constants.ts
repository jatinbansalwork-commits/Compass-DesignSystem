import type { CompassProps } from '~/code/types/Compass';

export const defaultProps: CompassProps = {
  fontWeight: {
    value: 'regular',
    type: 'string',
  },
  contrast: {
    value: 'low',
    type: 'string',
  },
  size: {
    value: 'medium',
    type: 'string',
  },
  variant: {
    value: 'neutral',
    type: 'string',
  },
};
