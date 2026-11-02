import type { IconComponent } from '~components/Icons';
import type { TestID } from '~utils/types';

type TopNavBrandedActionPillProps = {
  icon: IconComponent;
  label: string;
  onClick: () => void;
  accessibilityLabel?: string;
} & TestID;

export type { TopNavBrandedActionPillProps };
