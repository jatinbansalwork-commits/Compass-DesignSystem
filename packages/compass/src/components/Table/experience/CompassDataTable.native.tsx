import React from 'react';
import { Text } from '~components/Typography';
import { logger } from '~utils/logger';
import type { CompassDataTableProps } from './types';

const CompassDataTable = <Item,>(_props: CompassDataTableProps<Item>): React.ReactElement => {
  if (__DEV__) {
    logger({
      type: 'warn',
      moduleName: 'CompassDataTable',
      message: 'CompassDataTable (Table experience) is web-only.',
    });
  }
  return <Text>CompassDataTable is not available on React Native.</Text>;
};

export { CompassDataTable };
