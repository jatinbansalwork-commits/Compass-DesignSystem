import { TRUST_BADGE_AXES } from '../../index';
import type { StoryMeta } from '../types';

const meta: StoryMeta = {
  title: 'TrustBadge',
  description:
    'The "Klearnow Trusted Business" marker: the brand shield and its line. Style-only: no behaviour model behind it.',
  argTypes: {
    variant: { control: 'select', options: TRUST_BADGE_AXES.variant },
    label: { control: 'text' },
  },
  stories: {
    Basic: {
      args: { variant: 'default', label: 'Klearnow Trusted Business' },
    },
  },
};

export default meta;
