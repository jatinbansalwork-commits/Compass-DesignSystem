import type { KdesignHelperProps, KdesignProps } from '~/code/types/Kdesign';

export const defaultValues: KdesignProps = {
  labelPosition: { value: 'top', type: 'string' },
  showClearButton: { value: 'false', type: 'boolean' },
  numberOfLines: { value: '2', type: 'number' },
  otpLength: { value: '6', type: 'number' },
};

export const helpers: KdesignHelperProps = {
  value: 'instance',
  onChange: 'instance',
};
