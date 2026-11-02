import React from 'react';
/* eslint-disable react/jsx-no-useless-fragment */
import type { InputRowProps } from './types';
import { Text } from '~components/Typography';
import { throwKdesignError } from '~utils/logger';

const InputRow = (_props: InputRowProps): React.ReactElement => {
  throwKdesignError({
    message: 'InputRow is not yet implemented for native',
    moduleName: 'InputRow',
  });

  return <Text>InputRow Component is not available for Native mobile apps.</Text>;
};

export { InputRow };
