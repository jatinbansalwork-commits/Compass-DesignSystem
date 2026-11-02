import React from 'react';
import { Text } from '~components/Typography';
import { throwCompassError } from '~utils/logger';
import type { TopNavKlearAgentButtonProps } from './types';

const TopNavKlearAgentButton = (_props: TopNavKlearAgentButtonProps): React.ReactElement => {
  throwCompassError({
    message: 'TopNavKlearAgentButton is not yet implemented for native',
    moduleName: 'TopNavKlearAgentButton',
  });

  return <Text>TopNavKlearAgentButton is not available for Native mobile apps.</Text>;
};

export { TopNavKlearAgentButton };
