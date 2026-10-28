import React from 'react';
import { Text } from '~components/Typography';
import type { TableExperienceEmptyCopy, TableExperienceEmptyReason } from './types';

type TableExperienceEmptyProps = TableExperienceEmptyCopy & {
  reason: TableExperienceEmptyReason;
};

const TableExperienceEmpty = (_props: TableExperienceEmptyProps): React.ReactElement => {
  return <Text>TableExperienceEmpty is web-only.</Text>;
};

export { TableExperienceEmpty };
