import type { KdesignProps } from '~/code/types/Kdesign';

export const defaultProps: KdesignProps = {
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
