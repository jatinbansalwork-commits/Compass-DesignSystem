import React, { useMemo } from 'react';
import { Button } from '~components/Button';
import { Popover } from '~components/Popover';
import { Checkbox } from '~components/Checkbox';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';

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
};

const TableExperienceColumnToggle = ({
  columns,
  visibleColumnKeys,
  onVisibleColumnKeysChange,
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

  return (
    <Popover content={content} title="Show columns" placement="bottom-end">
      <Button size="small" variant="secondary" testID="table-experience-columns">
        Columns
      </Button>
    </Popover>
  );
};

export { TableExperienceColumnToggle };
