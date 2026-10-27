import React from 'react';
import type { ListViewProps } from './types';
import { Text } from '~components/Typography';
import { throwCompassError } from '~utils/logger';

const ListView = (_prop: ListViewProps): React.ReactElement => {
  throwCompassError({
    message: 'ListView is not yet implemented for native',
    moduleName: 'ListView',
  });

  return <Text>ListView is not available for Native mobile apps.</Text>;
};

export { ListView };
