import type { KdesignProps } from '~/code/types/Kdesign';

export const defaultValues: KdesignProps = {
  variant: { value: 'primary', type: 'string' },
  size: { value: 'medium', type: 'string' },
  isFullWidth: { value: 'false', type: 'boolean' },
  iconPosition: { value: 'left', type: 'string' },
};
