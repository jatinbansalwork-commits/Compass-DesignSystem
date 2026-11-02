import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Table } from '../Table';
import { TableToolbar, TableToolbarActions, TableToolbarSearch } from '../TableToolbar';
import { TableExperienceExportButton } from './TableExperienceExportButton';
import { TableExperienceAdvancedFilters } from './TableExperienceAdvancedFilters';
import { TableExperienceColumnToggle } from './TableExperienceColumnToggle';
import { TableExperienceSelectionRoot } from './TableExperienceSelectionRoot';
import { TableExperienceKeyboardRoot } from './TableExperienceKeyboardRoot';
import { TableExperienceColumnReorder } from './TableExperienceColumnReorder';
import type { KdesignDataTableProps } from './types';
import type { TableNode } from '../types';

/**
 * Prime-style table shell on top of Kdesign {@link Table} — same filter/sort/pagination rules;
 * Phase 2 adds advanced filters, column toggle, multi-sort, and modifier selection via `experienceApi`.
 */
const KdesignDataTable = <Item,>({
  children,
  toolbarTitle,
  toolbarSelectedTitle,
  showGlobalSearch = true,
  searchPlaceholder = 'Search all columns',
  searchAccessibilityLabel = 'Search table',
  searchVariant = 'expanded',
  toolbarActionVariant = 'labeled',
  exportColumns,
  exportFileName = 'table-export',
  exportPreferSelection = true,
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
}: KdesignDataTableProps<Item>): React.ReactElement => {
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
    experienceStickyLeadingDataColumnCount: _experienceStickyLeadingDataColumnCount,
    experienceStickyLeadingColumnKeys: _experienceStickyLeadingColumnKeys,
    experienceStickyColumnCount: _experienceStickyColumnCount,
    experienceStickyColumnWidths: _experienceStickyColumnWidths,
    ...tablePropsForTable
  } = tableProps as typeof tableProps &
    Partial<NonNullable<KdesignDataTableProps<Item>['experienceApi']>>;
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

  const selectedIdsForExport = experienceApi?.experienceSelectedIds ?? [];
  const exportRows = useMemo((): TableNode<Item>[] => {
    if (exportPreferSelection && selectedIdsForExport.length > 0) {
      const idSet = new Set(selectedIdsForExport.map(String));
      return data.nodes.filter((node) => idSet.has(String(node.id)));
    }
    return data.nodes;
  }, [data.nodes, exportPreferSelection, selectedIdsForExport]);
  const exportLabel =
    exportPreferSelection && selectedIdsForExport.length > 0
      ? `Export (${selectedIdsForExport.length})`
      : 'Export';

  const features = experienceApi?.experienceFeatures;
  const rowIds = useMemo(() => data.nodes.map((node) => node.id), [data.nodes]);
  const iconOnlyActions = toolbarActionVariant === 'icon';

  const toolbar = (
    <TableToolbar title={toolbarTitle} selectedTitle={toolbarSelectedTitle}>
      {showGlobalSearch ? (
        <TableToolbarSearch
          placeholder={searchPlaceholder}
          accessibilityLabel={searchAccessibilityLabel}
          variant={searchVariant}
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
              iconOnly={iconOnlyActions}
            />
          ) : null}
          {features?.columnToggle && experienceApi ? (
            <TableExperienceColumnToggle
              columns={experienceApi.experienceFilterableColumns}
              visibleColumnKeys={experienceApi.experienceVisibleColumnKeys}
              onVisibleColumnKeysChange={experienceApi.setExperienceVisibleColumnKeys}
              iconOnly={iconOnlyActions}
            />
          ) : null}
          {features?.columnReorder && experienceApi ? (
            <TableExperienceColumnReorder
              columns={experienceApi.experienceFilterableColumns}
              columnOrder={experienceApi.experienceColumnOrder}
              defaultColumnOrder={experienceApi.experienceDefaultColumnOrder}
              onColumnOrderChange={experienceApi.setExperienceColumnOrder}
              iconOnly={iconOnlyActions}
            />
          ) : null}
          {exportColumns?.length ? (
            <TableExperienceExportButton
              rows={exportRows}
              columns={exportColumns}
              fileName={exportFileName}
              label={exportLabel}
              iconOnly={iconOnlyActions}
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

  const {
    stickyColumnCount: stickyColumnCountProp,
    stickyColumnWidths: stickyColumnWidthsProp,
    ...tablePropsRest
  } = tablePropsForTable;
  const stickyColumnCount =
    stickyColumnCountProp ?? experienceApi?.experienceStickyColumnCount;
  const stickyColumnWidths =
    stickyColumnWidthsProp ?? experienceApi?.experienceStickyColumnWidths;

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
      {...tablePropsRest}
      stickyColumnCount={stickyColumnCount}
      stickyColumnWidths={stickyColumnWidths}
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

export { KdesignDataTable };
