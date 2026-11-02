import React from 'react';
import { Text } from '~components/Typography';
import { logger } from '~utils/logger';
import type { KdesignDataTableProps } from './types';

const KdesignDataTable = <Item,>(_props: KdesignDataTableProps<Item>): React.ReactElement => {
  if (__DEV__) {
    logger({
      type: 'warn',
      moduleName: 'KdesignDataTable',
      message: 'KdesignDataTable (Table experience) is web-only.',
    });
  }
  return <Text>KdesignDataTable is not available on React Native.</Text>;
};

export { KdesignDataTable };
