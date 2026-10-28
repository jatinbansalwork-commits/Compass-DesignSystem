import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Table } from '../Table';
import { TableToolbar, TableToolbarActions, TableToolbarSearch } from '../TableToolbar';
import { TableExperienceExportButton } from './TableExperienceExportButton';
import { TableExperienceAdvancedFilters } from './TableExperienceAdvancedFilters';
import { TableExperienceColumnToggle } from './TableExperienceColumnToggle';
import { TableExperienceSelectionRoot } from './TableExperienceSelectionRoot';
import { TableExperienceKeyboardRoot } from './TableExperienceKeyboardRoot';
import { TableExperienceColumnReorder } from './TableExperienceColumnReorder';
import type { CompassDataTableProps } from './types';
import type { TableNode } from '../types';

/**
 * Prime-style table shell on top of Compass {@link Table} — same filter/sort/pagination rules;
 * Phase 2 adds advanced filters, column toggle, multi-sort, and modifier selection via `experienceApi`.
 */
const CompassDataTable = <Item,>({
  children,
  toolbarTitle,
  toolbarSelectedTitle,
  showGlobalSearch = true,
  searchPlaceholder = 'Search all columns',
  searchAccessibilityLabel = 'Search table',
  exportColumns,
  exportFileName = 'table-export',
  toolbarActions,
  pagination,
  data,
  filterFunctions,
  experienceApi,
  onSortChange,
  selectionType,
  showHeaderFilterRow: showHeaderFilterRowProp,
  gridTemplateColumns: gridTemplateColumnsProp,
  ...tableProps
}: CompassDataTableProps<Item>): React.ReactElement => {
  const {
    experienceFeatures: _experienceFeatures,
    experienceSortOrder: _experienceSortOrder,
    experienceFilterableColumns: _experienceFilterableColumns,
    experienceFilterMatchModes: _experienceFilterMatchModes,
    experienceVisibleColumnKeys: _experienceVisibleColumnKeys,
    handleExperienceSortChange: _handleExperienceSortChange,
    applyAdvancedFilters: _applyAdvancedFilters,
    setExperienceVisibleColumnKeys: _setExperienceVisibleColumnKeys,
    setExperienceSelectedIds: _setExperienceSelectedIds,
    experienceSelectedIds: _experienceSelectedIds,
    experienceColumnOrder: _experienceColumnOrder,
    setExperienceColumnOrder: _setExperienceColumnOrder,
    experienceColumnWidths: _experienceColumnWidths,
    setExperienceColumnWidth: _setExperienceColumnWidth,
    experienceOrderedVisibleColumnKeys: _experienceOrderedVisibleColumnKeys,
    experienceGridTemplateColumns: _experienceGridTemplateColumns,
    ...tablePropsForTable
  } = tableProps as typeof tableProps &
    Partial<NonNullable<CompassDataTableProps<Item>['experienceApi']>>;
  const shiftKeyRef = useRef(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      shiftKeyRef.current = event.shiftKey;
    };
    const onKeyUp = (): void => {
      shiftKeyRef.current = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const exportRows = useMemo((): TableNode<Item>[] => data.nodes, [data.nodes]);

  const features = experienceApi?.experienceFeatures;
  const rowIds = useMemo(() => data.nodes.map((node) => node.id), [data.nodes]);

  const toolbar = (
    <TableToolbar title={toolbarTitle} selectedTitle={toolbarSelectedTitle}>
      {showGlobalSearch ? (
        <TableToolbarSearch
          placeholder={searchPlaceholder}
          accessibilityLabel={searchAccessibilityLabel}
        />
      ) : null}
      {(features?.advancedFilters ||
        features?.columnToggle ||
        features?.columnReorder ||
        exportColumns?.length ||
        toolbarActions) && (
        <TableToolbarActions>
        {features?.advancedFilters && experienceApi ? (
          <TableExperienceAdvancedFilters
            columns={experienceApi.experienceFilterableColumns}
            columnFilterValues={tablePropsForTable.columnFilterValues ?? {}}
            filterMatchModes={experienceApi.experienceFilterMatchModes}
            onApply={experienceApi.applyAdvancedFilters}
            onClear={() => {
              experienceApi.applyAdvancedFilters({ columnFilterValues: {}, filterMatchModes: {} });
            }}
          />
        ) : null}
        {features?.columnToggle && experienceApi ? (
          <TableExperienceColumnToggle
            columns={experienceApi.experienceFilterableColumns}
            visibleColumnKeys={experienceApi.experienceVisibleColumnKeys}
            onVisibleColumnKeysChange={experienceApi.setExperienceVisibleColumnKeys}
          />
        ) : null}
        {features?.columnReorder && experienceApi ? (
          <TableExperienceColumnReorder
            columns={experienceApi.experienceFilterableColumns}
            columnOrder={experienceApi.experienceColumnOrder}
            onColumnOrderChange={experienceApi.setExperienceColumnOrder}
          />
        ) : null}
        {exportColumns?.length ? (
          <TableExperienceExportButton
            rows={exportRows}
            columns={exportColumns}
            fileName={exportFileName}
          />
        ) : null}
        {toolbarActions}
        </TableToolbarActions>
      )}
    </TableToolbar>
  );

  const handleSortChange = useCallback<NonNullable<typeof onSortChange>>(
    (payload) => {
      experienceApi?.handleExperienceSortChange({
        sortKey: payload.sortKey ?? '',
        isSortReversed: payload.isSortReversed,
        shiftKey: shiftKeyRef.current,
      });
      onSortChange?.(payload);
    },
    [experienceApi, onSortChange],
  );

  const hideInlineFilters =
    features?.advancedFilters &&
    (features.hideInlineHeaderFiltersWhenAdvanced ?? true);

  const tableElement = (
    <Table
      data={data}
      filterFunctions={filterFunctions}
      toolbar={toolbar}
      pagination={pagination}
      selectionType={selectionType}
      selectedIds={experienceApi?.experienceSelectedIds}
      onSortChange={handleSortChange}
      showHeaderFilterRow={hideInlineFilters ? false : showHeaderFilterRowProp}
      gridTemplateColumns={
        experienceApi?.experienceGridTemplateColumns ?? gridTemplateColumnsProp
      }
      {...tablePropsForTable}
    >
      {children}
    </Table>
  );

  let wrapped = tableElement;

  if (features?.rowKeyboardNavigation && experienceApi) {
    wrapped = (
      <TableExperienceKeyboardRoot
        rowIds={rowIds}
        enabled
        selectionType={selectionType}
        selectedIds={experienceApi.experienceSelectedIds}
        onSelectedIdsChange={(ids) => {
          experienceApi.setExperienceSelectedIds(ids);
          tablePropsForTable.onSelectionChange?.({ selectedIds: ids, values: [] });
        }}
      >
        {wrapped}
      </TableExperienceKeyboardRoot>
    );
  }

  if (features?.metaKeySelection && experienceApi && selectionType === 'multiple') {
    wrapped = (
      <TableExperienceSelectionRoot
        rowIds={rowIds}
        selectedIds={experienceApi.experienceSelectedIds}
        onSelectedIdsChange={(ids) => {
          experienceApi.setExperienceSelectedIds(ids);
          tablePropsForTable.onSelectionChange?.({ selectedIds: ids, values: [] });
        }}
        enabled
      >
        {wrapped}
      </TableExperienceSelectionRoot>
    );
  }

  return wrapped;
};

export { CompassDataTable };
