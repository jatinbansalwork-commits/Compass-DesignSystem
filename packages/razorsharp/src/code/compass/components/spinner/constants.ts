import type { CompassProps } from '~/code/types/Compass';

export const defaultValues: CompassProps = {
  size: {
    type: 'string',
    value: 'medium',
  },
  contrast: {
    type: 'string',
    value: 'low',
  },
  labelPosition: {
    type: 'string',
    value: 'right',
  },
  label: {
    type: 'string',
    value: '',
  },
};
