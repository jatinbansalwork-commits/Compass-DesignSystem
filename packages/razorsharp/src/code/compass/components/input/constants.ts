import type { CompassHelperProps, CompassProps } from '~/code/types/Compass';

export const defaultValues: CompassProps = {
  labelPosition: { value: 'top', type: 'string' },
  showClearButton: { value: 'false', type: 'boolean' },
  numberOfLines: { value: '2', type: 'number' },
  otpLength: { value: '6', type: 'number' },
};

export const helpers: CompassHelperProps = {
  value: 'instance',
  onChange: 'instance',
};
