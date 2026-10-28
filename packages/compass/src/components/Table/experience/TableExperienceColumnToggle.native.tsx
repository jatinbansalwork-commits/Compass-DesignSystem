import React from 'react';
import { Text } from '~components/Typography';

const TableExperienceColumnToggle = (): React.ReactElement => {
  return <Text>Column toggle is web-only.</Text>;
};

export type TableExperienceColumnToggleOption = {
  key: string;
  label: string;
  defaultWidthPx?: number;
  minWidthPx?: number;
};

export { TableExperienceColumnToggle };
