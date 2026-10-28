import React from 'react';
import { Text } from '~components/Typography';
import type { TableExperienceExportColumn } from './types';
import type { TableNode } from '../types';

type TableExperienceExportButtonProps<Item> = {
  rows: TableNode<Item>[];
  columns: TableExperienceExportColumn<Item>[];
};

const TableExperienceExportButton = <Item,>(
  _props: TableExperienceExportButtonProps<Item>,
): React.ReactElement => {
  return <Text>Export is web-only.</Text>;
};

export { TableExperienceExportButton };
