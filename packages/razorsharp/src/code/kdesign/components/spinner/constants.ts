import type { KdesignProps } from '~/code/types/Kdesign';

export const defaultValues: KdesignProps = {
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
