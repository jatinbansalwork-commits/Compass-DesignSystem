import React, { useState } from 'react';
import { Button } from '~components/Button';
import { Popover } from '~components/Popover';
import { TextInput } from '~components/Input/TextInput';
import { SelectInput } from '~components/Input/DropdownInputTriggers';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import {
  FILTER_MATCH_MODE_LABELS,
  type TableExperienceFilterMatchMode,
} from './filterMatchMode';
import type { TableExperienceColumnToggleOption } from './TableExperienceColumnToggle.web';

type TableExperienceAdvancedFiltersProps = {
  columns: TableExperienceColumnToggleOption[];
  columnFilterValues: Record<string, string | string[]>;
  filterMatchModes: Record<string, TableExperienceFilterMatchMode | undefined>;
  onApply: (payload: {
    columnFilterValues: Record<string, string | string[]>;
    filterMatchModes: Record<string, TableExperienceFilterMatchMode | undefined>;
  }) => void;
  onClear: () => void;
};

const MATCH_MODES = Object.keys(FILTER_MATCH_MODE_LABELS) as TableExperienceFilterMatchMode[];

const TableExperienceAdvancedFilters = ({
  columns,
  columnFilterValues,
  filterMatchModes,
  onApply,
  onClear,
}: TableExperienceAdvancedFiltersProps): React.ReactElement => {
  const [draftValues, setDraftValues] = useState(columnFilterValues);
  const [draftModes, setDraftModes] = useState(filterMatchModes);

  const content = (
    <BaseBox display="flex" flexDirection="column" gap="spacing.4" minWidth="280px">
      {columns.map((column) => {
        const value = draftValues[column.key];
        const stringValue = typeof value === 'string' ? value : '';
        const mode = draftModes[column.key] ?? 'contains';
        return (
          <BaseBox key={column.key} display="flex" flexDirection="column" gap="spacing.2">
            <Text size="small" weight="semibold">
              {column.label}
            </Text>
            <Dropdown selectionType="single">
              <SelectInput
                size="small"
                value={mode}
                onChange={({ values }) =>
                  setDraftModes((prev) => ({
                    ...prev,
                    [column.key]: (values[0] as TableExperienceFilterMatchMode) ?? 'contains',
                  }))
                }
                accessibilityLabel={`Match mode for ${column.label}`}
              />
              <DropdownOverlay>
                <ActionList>
                  {MATCH_MODES.map((matchMode) => (
                    <ActionListItem
                      key={matchMode}
                      title={FILTER_MATCH_MODE_LABELS[matchMode]}
                      value={matchMode}
                    />
                  ))}
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
            <TextInput
              size="small"
              value={stringValue}
              onChange={({ value }) =>
                setDraftValues((prev) => ({ ...prev, [column.key]: value ?? '' }))
              }
              placeholder={`Filter ${column.label}`}
              accessibilityLabel={`Filter ${column.label}`}
            />
          </BaseBox>
        );
      })}
      <BaseBox display="flex" gap="spacing.2" justifyContent="flex-end">
        <Button
          size="small"
          variant="secondary"
          onClick={() => {
            setDraftValues({});
            setDraftModes({});
            onClear();
          }}
        >
          Clear
        </Button>
        <Button
          size="small"
          variant="primary"
          onClick={() => onApply({ columnFilterValues: draftValues, filterMatchModes: draftModes })}
        >
          Apply
        </Button>
      </BaseBox>
    </BaseBox>
  );

  return (
    <Popover content={content} placement="bottom-end" title="Advanced filters">
      <Button size="small" variant="secondary" testID="table-experience-advanced-filters">
        Filters
      </Button>
    </Popover>
  );
};

export { TableExperienceAdvancedFilters };
