import React from 'react';
/* eslint-disable react/jsx-no-useless-fragment */
import type { InputGroupProps } from './types';
import { Text } from '~components/Typography';
import { throwCompassError } from '~utils/logger';

const InputGroup = (_props: InputGroupProps): React.ReactElement => {
  throwCompassError({
    message: 'InputGroup is not yet implemented for native',
    moduleName: 'InputGroup',
  });

  return <Text>InputGroup Component is not available for Native mobile apps.</Text>;
};

export { InputGroup };
