import React from 'react';
import { Text } from '~components/Typography';

type SideNavPinItemProps = {
  isPinned: boolean;
  onPinChange: (args: { isPinned: boolean }) => void;
  unpinnedTitle?: string;
  pinnedTitle?: string;
};

const SideNavPinItem = (_props: SideNavPinItemProps): React.ReactElement => {
  return <Text>SideNavPinItem is not available on native.</Text>;
};

export { SideNavPinItem };
export type { SideNavPinItemProps };
