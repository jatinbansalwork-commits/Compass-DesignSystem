import React, { useMemo } from 'react';
import { Button } from '~components/Button';
import { Popover } from '~components/Popover';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import type { TableExperienceColumnToggleOption } from './TableExperienceColumnToggle';
import { reorderColumnKeys } from './reorderColumnKeys';
import { IconButton } from '~components/Button/IconButton';
import { tableIcons } from '../tokens';
import { ArrowDownIcon, ArrowUpIcon, DragHandleIcon } from '~components/Icons';
import { Tooltip } from '~components/Tooltip';

type TableExperienceColumnReorderProps = {
  columns: TableExperienceColumnToggleOption[];
  columnOrder: string[];
  defaultColumnOrder: string[];
  onColumnOrderChange: (order: string[]) => void;
  iconOnly?: boolean;
};

const isSameColumnOrder = (a: string[], b: string[]): boolean =>
  a.length === b.length && a.every((key, index) => key === b[index]);

const TableExperienceColumnReorder = ({
  columns,
  columnOrder,
  defaultColumnOrder,
  onColumnOrderChange,
  iconOnly = false,
}: TableExperienceColumnReorderProps): React.ReactElement => {
  const labelByKey = useMemo(
    () => new Map(columns.map((column) => [column.key, column.label])),
    [columns],
  );

  const isDefaultOrder = useMemo(
    () => isSameColumnOrder(columnOrder, defaultColumnOrder),
    [columnOrder, defaultColumnOrder],
  );

  const titleTrailing = (
    <Button
      size="small"
      variant="tertiary"
      isDisabled={isDefaultOrder}
      testID="table-experience-reorder-reset"
      onClick={() => onColumnOrderChange([...defaultColumnOrder])}
    >
      Reset
    </Button>
  );

  const content = (
    <BaseBox display="flex" flexDirection="column" gap="spacing.1" minWidth="260px" maxHeight="320px" overflow="auto">
      {columnOrder.map((key, index) => (
        <BaseBox
          key={key}
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap="spacing.2"
          paddingY="spacing.1"
        >
          <DragHandleIcon size={tableIcons.control} color="feedback.icon.neutral.subtle" />
          <BaseBox flex={1} minWidth={0}>
            <Text as="span" size="small" weight="medium">
              {labelByKey.get(key) ?? key}
            </Text>
          </BaseBox>
          <BaseBox display="flex" flexDirection="row" gap="spacing.1" flexShrink={0}>
            <Tooltip content="Move up">
              <IconButton
                size="small"
                icon={ArrowUpIcon}
                accessibilityLabel={`Move ${labelByKey.get(key) ?? key} up`}
                isDisabled={index === 0}
                testID={`table-experience-reorder-up-${key}`}
                onClick={() => onColumnOrderChange(reorderColumnKeys(columnOrder, index, index - 1))}
              />
            </Tooltip>
            <Tooltip content="Move down">
              <IconButton
                size="small"
                icon={ArrowDownIcon}
                accessibilityLabel={`Move ${labelByKey.get(key) ?? key} down`}
                isDisabled={index === columnOrder.length - 1}
                testID={`table-experience-reorder-down-${key}`}
                onClick={() => onColumnOrderChange(reorderColumnKeys(columnOrder, index, index + 1))}
              />
            </Tooltip>
          </BaseBox>
        </BaseBox>
      ))}
    </BaseBox>
  );

  const trigger = iconOnly ? (
    <Tooltip content="Reorder columns">
      <IconButton
        size={tableIcons.control}
        icon={DragHandleIcon}
        accessibilityLabel="Reorder columns"
        testID="table-experience-reorder"
      />
    </Tooltip>
  ) : (
    <Button size="small" variant="secondary" testID="table-experience-reorder">
      Reorder
    </Button>
  );

  return (
    <Popover
      content={content}
      title="Reorder columns"
      titleTrailing={titleTrailing}
      placement="bottom-end"
    >
      {trigger}
    </Popover>
  );
};

export { TableExperienceColumnReorder };
