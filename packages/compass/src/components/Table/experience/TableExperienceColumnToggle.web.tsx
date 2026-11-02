import React, { useMemo } from 'react';
import { Button } from '~components/Button';
import { Popover } from '~components/Popover';
import { Checkbox } from '~components/Checkbox';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { IconButton } from '~components/Button/IconButton';
import { tableIcons } from '../tokens';
import { SettingsIcon } from '~components/Icons';
import { Tooltip } from '~components/Tooltip';

export type TableExperienceColumnToggleOption = {
  key: string;
  label: string;
  /** Initial / default width for experience grid layout (px). */
  defaultWidthPx?: number;
  minWidthPx?: number;
};

type TableExperienceColumnToggleProps = {
  columns: TableExperienceColumnToggleOption[];
  visibleColumnKeys: string[];
  onVisibleColumnKeysChange: (keys: string[]) => void;
  iconOnly?: boolean;
};

const TableExperienceColumnToggle = ({
  columns,
  visibleColumnKeys,
  onVisibleColumnKeysChange,
  iconOnly = false,
}: TableExperienceColumnToggleProps): React.ReactElement => {
  const visibleSet = useMemo(() => new Set(visibleColumnKeys), [visibleColumnKeys]);

  const content = (
    <BaseBox display="flex" flexDirection="column" gap="spacing.3" minWidth="200px">
      {columns.map((column) => {
        const isChecked = visibleSet.has(column.key);
        const isLastVisible = isChecked && visibleColumnKeys.length === 1;
        return (
          <Checkbox
            key={column.key}
            isChecked={isChecked}
            isDisabled={isLastVisible}
            onChange={() => {
              if (isChecked) {
                onVisibleColumnKeysChange(visibleColumnKeys.filter((key) => key !== column.key));
              } else {
                onVisibleColumnKeysChange([...visibleColumnKeys, column.key]);
              }
            }}
          >
            <Text as="span" size="small">
              {column.label}
            </Text>
          </Checkbox>
        );
      })}
    </BaseBox>
  );

  const trigger = iconOnly ? (
    <Tooltip content="Columns">
      <IconButton
        size={tableIcons.control}
        icon={SettingsIcon}
        accessibilityLabel="Columns"
        testID="table-experience-columns"
      />
    </Tooltip>
  ) : (
    <Button size="small" variant="secondary" testID="table-experience-columns">
      Columns
    </Button>
  );

  return (
    <Popover content={content} title="Show columns" placement="bottom-end">
      {trigger}
    </Popover>
  );
};

export { TableExperienceColumnToggle };
