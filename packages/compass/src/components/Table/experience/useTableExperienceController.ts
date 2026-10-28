import { useCallback, useMemo, useState } from 'react';
import type { Identifier, TableSortOrderEntry } from '../types';
import { applyInitialSort } from './applyInitialSort';
import { applyMultiSort } from './applyMultiSort';
import { createNoopSortFunctions } from './createNoopSortFunctions';
import type { TableExperienceFilterMatchMode } from './filterMatchMode';
import { toggleExperienceSortFromTableHeader } from './toggleExperienceSort';
import type {
  UseTableExperienceControllerOptions,
  UseTableExperienceControllerReturn,
} from './types';
import { wrapFilterFunctionsWithMatchMode } from './wrapFilterFunctionsWithMatchMode';
import { buildGridTemplateColumns } from './buildGridTemplateColumns';
import { orderedVisibleColumnKeys } from './reorderColumnKeys';

const defaultFeatures = {
  multiSort: true,
  advancedFilters: false,
  columnToggle: false,
  metaKeySelection: false,
  columnResize: false,
  columnReorder: false,
  rowKeyboardNavigation: false,
  hideInlineHeaderFiltersWhenAdvanced: true,
};

const useTableExperienceController = <Item>(
  options: UseTableExperienceControllerOptions<Item>,
): UseTableExperienceControllerReturn<Item> => {
  const {
    data,
    filterFunctions: rawFilterFunctions,
    filterConfig,
    sortFunctions,
    initialSort,
    defaultGlobalFilterValue = '',
    defaultColumnFilterValues = {},
    defaultSelectedIds = [],
    selectionType = 'none',
    features: featuresProp,
    filterFieldExtractors,
    filterableColumns = [],
    gridTrailingTemplateColumns = ['minmax(120px, 1fr)'],
  } = options;

  const features = { ...defaultFeatures, ...featuresProp };
  const useExperienceMultiSort = features.multiSort && Boolean(sortFunctions);

  const [globalFilterValue, setGlobalFilterValueState] = useState(defaultGlobalFilterValue);
  const [columnFilterValues, setColumnFilterValuesState] =
    useState<Record<string, string | string[]>>(defaultColumnFilterValues);
  const [selectedIds, setSelectedIds] = useState<Identifier[]>(defaultSelectedIds);
  const [sortOrder, setSortOrder] = useState<TableSortOrderEntry[]>(() =>
    initialSort ? [{ sortKey: initialSort.sortKey, direction: initialSort.direction }] : [],
  );
  const [filterMatchModes, setFilterMatchModes] = useState<
    Record<string, TableExperienceFilterMatchMode | undefined>
  >({});
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(() =>
    filterableColumns.map((column) => column.key),
  );
  const [columnOrder, setColumnOrder] = useState<string[]>(() =>
    filterableColumns.map((column) => column.key),
  );
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    filterableColumns.forEach((column) => {
      if (column.defaultWidthPx != null) {
        initial[column.key] = column.defaultWidthPx;
      }
    });
    return initial;
  });

  const setExperienceColumnWidth = useCallback((columnKey: string, widthPx: number): void => {
    setColumnWidths((current) => ({ ...current, [columnKey]: widthPx }));
  }, []);

  const experienceOrderedVisibleColumnKeys = useMemo(
    () => orderedVisibleColumnKeys(columnOrder, visibleColumnKeys),
    [columnOrder, visibleColumnKeys],
  );

  const experienceGridTemplateColumns = useMemo(() => {
    if (!features.columnResize && !features.columnReorder) {
      return undefined;
    }
    return buildGridTemplateColumns(
      experienceOrderedVisibleColumnKeys,
      columnWidths,
      filterableColumns,
      gridTrailingTemplateColumns,
    );
  }, [
    columnWidths,
    experienceOrderedVisibleColumnKeys,
    features.columnReorder,
    features.columnResize,
    filterableColumns,
    gridTrailingTemplateColumns,
  ]);

  const setGlobalFilterValue = useCallback((value: string): void => {
    setGlobalFilterValueState(value);
  }, []);

  const setColumnFilterValues = useCallback((values: Record<string, string | string[]>): void => {
    setColumnFilterValuesState(values);
  }, []);

  const clearFilters = useCallback((): void => {
    setGlobalFilterValueState('');
    setColumnFilterValuesState({});
    setFilterMatchModes({});
  }, []);

  const onSelectionChange = useCallback(
    ({ selectedIds: ids }: { selectedIds: Identifier[] }): void => {
      setSelectedIds(ids);
    },
    [],
  );

  const filterFunctions = useMemo(() => {
    if (!rawFilterFunctions) {
      return undefined;
    }
    if (!features.advancedFilters) {
      return rawFilterFunctions;
    }
    return wrapFilterFunctionsWithMatchMode(rawFilterFunctions, filterMatchModes, filterFieldExtractors);
  }, [rawFilterFunctions, features.advancedFilters, filterMatchModes, filterFieldExtractors]);

  const sortedNodes = useMemo(() => {
    let nodes = data.nodes;
    nodes = applyInitialSort(nodes, initialSort, sortFunctions);
    if (useExperienceMultiSort) {
      nodes = applyMultiSort(nodes, sortOrder, sortFunctions);
    }
    return nodes;
  }, [data.nodes, initialSort, sortFunctions, useExperienceMultiSort, sortOrder]);

  const tableSortFunctions = useMemo(
    () => (useExperienceMultiSort ? createNoopSortFunctions(sortFunctions) : sortFunctions),
    [useExperienceMultiSort, sortFunctions],
  );

  const handleExperienceSortChange = useCallback(
    ({
      sortKey,
      isSortReversed,
      shiftKey,
    }: {
      sortKey: string;
      isSortReversed: boolean;
      shiftKey?: boolean;
    }): void => {
      if (!useExperienceMultiSort || !sortKey) {
        return;
      }
      setSortOrder((current) =>
        toggleExperienceSortFromTableHeader(current, sortKey, isSortReversed, {
          shiftKey,
          removableSort: true,
        }),
      );
    },
    [useExperienceMultiSort],
  );

  const applyAdvancedFilters = useCallback(
    (payload: {
      columnFilterValues: Record<string, string | string[]>;
      filterMatchModes: Record<string, TableExperienceFilterMatchMode | undefined>;
    }): void => {
      setColumnFilterValuesState(payload.columnFilterValues);
      setFilterMatchModes(payload.filterMatchModes);
    },
    [],
  );

  const experienceProps = useMemo(
    () => ({
      data: { nodes: sortedNodes },
      filterFunctions,
      filterConfig,
      columnFilterValues,
      onColumnFilterValuesChange: setColumnFilterValues,
      globalFilterValue,
      onGlobalFilterValueChange: setGlobalFilterValue,
      sortFunctions: tableSortFunctions,
      selectionType,
      onSelectionChange,
      defaultSelectedIds,
      initialSort,
      experienceFeatures: features,
      experienceSortOrder: sortOrder,
      experienceFilterableColumns: filterableColumns,
      experienceFilterMatchModes: filterMatchModes,
      experienceVisibleColumnKeys: visibleColumnKeys,
      handleExperienceSortChange,
      applyAdvancedFilters,
      setExperienceVisibleColumnKeys: setVisibleColumnKeys,
      setExperienceSelectedIds: setSelectedIds,
      experienceSelectedIds: selectedIds,
      experienceColumnOrder: columnOrder,
      setExperienceColumnOrder: setColumnOrder,
      experienceColumnWidths: columnWidths,
      setExperienceColumnWidth,
      experienceOrderedVisibleColumnKeys,
      experienceGridTemplateColumns,
    }),
    [
      sortedNodes,
      filterFunctions,
      filterConfig,
      columnFilterValues,
      setColumnFilterValues,
      globalFilterValue,
      setGlobalFilterValue,
      tableSortFunctions,
      selectionType,
      onSelectionChange,
      defaultSelectedIds,
      initialSort,
      features,
      sortOrder,
      filterableColumns,
      filterMatchModes,
      visibleColumnKeys,
      handleExperienceSortChange,
      applyAdvancedFilters,
      selectedIds,
      columnOrder,
      columnWidths,
      setExperienceColumnWidth,
      experienceOrderedVisibleColumnKeys,
      experienceGridTemplateColumns,
    ],
  );

  return {
    ...experienceProps,
    experienceProps,
    selectedIds,
    multiSortOrder: sortOrder,
    setGlobalFilterValue,
    setColumnFilterValues,
    clearFilters,
    filterMatchModes,
    visibleColumnKeys,
  };
};

export { useTableExperienceController };
