import React from 'react';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import type { TableTitleDescriptionCellProps } from './types';

const TableTitleDescriptionCell = ({
  title,
  description,
}: TableTitleDescriptionCellProps): React.ReactElement => (
  <BaseBox>
    <Text weight="semibold">{title}</Text>
    {description ? <Text size="small">{description}</Text> : null}
  </BaseBox>
);

export { TableTitleDescriptionCell };
