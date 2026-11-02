import type { KdesignProps } from '~/code/types/Kdesign';

export const defaultValues: KdesignProps = {
  intent: {
    type: 'string',
    value: 'neutral',
  },
  contrast: {
    type: 'string',
    value: 'low',
  },
  size: {
    type: 'string',
    value: 'medium',
  },
};
