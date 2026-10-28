import React from 'react';
import { Button } from '~components/Button';
import { Popover } from '~components/Popover';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import type { TableExperienceColumnToggleOption } from './TableExperienceColumnToggle';
import { reorderColumnKeys } from './reorderColumnKeys';

type TableExperienceColumnReorderProps = {
  columns: TableExperienceColumnToggleOption[];
  columnOrder: string[];
  onColumnOrderChange: (order: string[]) => void;
};

const TableExperienceColumnReorder = ({
  columns,
  columnOrder,
  onColumnOrderChange,
}: TableExperienceColumnReorderProps): React.ReactElement => {
  const labelByKey = new Map(columns.map((column) => [column.key, column.label]));

  const content = (
    <BaseBox display="flex" flexDirection="column" gap="spacing.2" minWidth="220px">
      {columnOrder.map((key, index) => (
        <BaseBox
          key={key}
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          gap="spacing.2"
        >
          <Text as="span" size="small">
            {labelByKey.get(key) ?? key}
          </Text>
          <BaseBox display="flex" flexDirection="row" gap="spacing.1">
            <Button
              size="small"
              variant="tertiary"
              isDisabled={index === 0}
              testID={`table-experience-reorder-up-${key}`}
              onClick={() => onColumnOrderChange(reorderColumnKeys(columnOrder, index, index - 1))}
            >
              ↑
            </Button>
            <Button
              size="small"
              variant="tertiary"
              isDisabled={index === columnOrder.length - 1}
              testID={`table-experience-reorder-down-${key}`}
              onClick={() => onColumnOrderChange(reorderColumnKeys(columnOrder, index, index + 1))}
            >
              ↓
            </Button>
          </BaseBox>
        </BaseBox>
      ))}
    </BaseBox>
  );

  return (
    <Popover content={content} title="Reorder columns" placement="bottom-end">
      <Button size="small" variant="secondary" testID="table-experience-reorder">
        Reorder
      </Button>
    </Popover>
  );
};

export { TableExperienceColumnReorder };
