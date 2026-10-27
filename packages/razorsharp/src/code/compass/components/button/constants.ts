import type { CompassProps } from '~/code/types/Compass';

export const defaultValues: CompassProps = {
  variant: { value: 'primary', type: 'string' },
  size: { value: 'medium', type: 'string' },
  isFullWidth: { value: 'false', type: 'boolean' },
  iconPosition: { value: 'left', type: 'string' },
};
